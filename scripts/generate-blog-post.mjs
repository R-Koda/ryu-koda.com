#!/usr/bin/env node

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, existsSync, readdirSync, appendFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const anthropic = new Anthropic();
const CONTENT_DIR = join(__dirname, "../src/content/blog");

// --- Step 1: Fetch trending topics from multiple sources ---

async function fetchHackerNewsTopics() {
  try {
    const res = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const ids = (await res.json()).slice(0, 30);
    const stories = await Promise.all(
      ids.map(async (id) => {
        const r = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        return r.json();
      })
    );
    return stories
      .filter((s) => s && s.title && s.score > 100)
      .map((s) => `[HN] ${s.title} (score: ${s.score})`)
      .slice(0, 15);
  } catch (e) {
    console.error("HackerNews fetch failed:", e.message);
    return [];
  }
}

async function fetchRedditTopics() {
  try {
    const subreddits = ["technology", "gadgets", "programming"];
    const allTopics = [];
    for (const sub of subreddits) {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`,
        { headers: { "User-Agent": "TechBlogBot/1.0" } }
      );
      const data = await res.json();
      const posts = data?.data?.children || [];
      for (const p of posts) {
        if (p.data.score > 500) {
          allTopics.push(
            `[Reddit/${sub}] ${p.data.title} (score: ${p.data.score})`
          );
        }
      }
    }
    return allTopics.slice(0, 15);
  } catch (e) {
    console.error("Reddit fetch failed:", e.message);
    return [];
  }
}

async function fetchGoogleTrendsJP() {
  try {
    const res = await fetch(
      "https://trends.google.co.jp/trending/rss?geo=JP"
    );
    const xml = await res.text();
    const titles = [...xml.matchAll(/<title>([^<]+)<\/title>/g)]
      .map((m) => m[1])
      .filter((t) => t !== "Daily Search Trends")
      .slice(0, 10);
    return titles.map((t) => `[GoogleTrends JP] ${t}`);
  } catch (e) {
    console.error("Google Trends fetch failed:", e.message);
    return [];
  }
}

// --- Step 2: Get existing post titles to avoid duplicates ---

function getExistingTitles() {
  try {
    const files = readdirSync(CONTENT_DIR);
    const titles = [];
    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
      const content = readFileSync(join(CONTENT_DIR, file), "utf-8");
      const match = content.match(/title:\s*['"](.+?)['"]/);
      if (match) titles.push(match[1]);
    }
    return titles;
  } catch {
    return [];
  }
}

// --- Step 3: Use Claude to pick topic & generate article ---

async function selectTopic(trends, existingTitles) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `あなたは人気テックブログの編集者です。以下のトレンドトピックから、日本の一般読者（エンジニアだけでなく、テクノロジーに興味がある一般の人）が最も興味を持ちそうなトピックを1つ選んでください。

## 選定基準
- 便利なツール、新しいサービス、素晴らしい技術に関するポジティブな内容
- 「使ってみたい」「試してみたい」と思わせるもの
- 一般の人でも理解できる内容にできるもの
- 実生活やビジネスに役立つもの
- 日本市場で特に関心が高そうなもの

## 除外するテーマ
- スキャンダル、事件、訴訟、逮捕などネガティブなニュース
- 批判や問題提起が中心のトピック
- 政治的・社会問題的なテーマ

## 現在のトレンド
${trends.join("\n")}

## 既存記事（重複を避ける）
${existingTitles.join("\n") || "なし"}

以下のJSON形式のみで回答してください（他のテキストは不要）:
{
  "topic": "選んだトピックの簡潔な説明",
  "angle": "記事の切り口・読者に提供する価値",
  "title": "【】付きの魅力的な日本語タイトル（40文字以内）",
  "tags": ["タグ1", "タグ2", "タグ3"],
  "slug": "english-slug-for-url"
}`,
      },
    ],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse topic selection");
  return JSON.parse(jsonMatch[0]);
}

async function generateArticle(topicInfo) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `以下のテーマで、日本語のテックブログ記事を書いてください。

## テーマ
- トピック: ${topicInfo.topic}
- 切り口: ${topicInfo.angle}
- タイトル: ${topicInfo.title}

## 要件
- 対象読者: テクノロジーに興味がある一般の人（専門家でなくてもOK）
- 文字数: 2000〜3500文字程度
- トーン: フレンドリーだが信頼感がある。「です・ます」調
- 専門用語は初出時に簡単な説明を添える
- 具体的な事例やデータを含める
- 読者の日常生活やビジネスにどう関係するかを明確にする
- 見出し（## / ###）を適切に使って読みやすくする
- 最後に「まとめ」セクションを入れる

## 重要
- Markdownのフロントマター(---)は含めないでください
- 本文のみ出力してください
- コードブロックが必要な場合のみ使用してください`,
      },
    ],
  });

  return response.content[0].text;
}

// --- Step 4: Create markdown file ---

function createBlogPost(topicInfo, articleBody) {
  const today = new Date().toISOString().split("T")[0];
  const escapedTitle = topicInfo.title.replace(/'/g, "''");
  const escapedAngle = topicInfo.angle.replace(/'/g, "''");
  const frontmatter = `---
title: '${escapedTitle}'
description: '${escapedAngle}'
pubDate: ${today}
tags: [${topicInfo.tags.map((t) => `'${t}'`).join(", ")}]
---`;

  const content = `${frontmatter}\n\n${articleBody}\n`;
  const filename = `${topicInfo.slug}.md`;
  const filepath = join(CONTENT_DIR, filename);

  if (existsSync(filepath)) {
    throw new Error(`File already exists: ${filename}`);
  }

  writeFileSync(filepath, content, "utf-8");
  console.log(`Created: ${filepath}`);
  return { filepath, filename };
}

// --- Main ---

async function main() {
  console.log("=== Auto Blog Generator ===\n");

  console.log("Fetching trends...");
  const [hn, reddit, googleJP] = await Promise.all([
    fetchHackerNewsTopics(),
    fetchRedditTopics(),
    fetchGoogleTrendsJP(),
  ]);

  const allTrends = [...hn, ...reddit, ...googleJP];
  console.log(`Found ${allTrends.length} trending topics\n`);

  if (allTrends.length === 0) {
    console.error("No trends found. Exiting.");
    process.exit(1);
  }

  const existingTitles = getExistingTitles();
  console.log(`Existing posts: ${existingTitles.length}\n`);

  console.log("Selecting topic with Claude...");
  const topicInfo = await selectTopic(allTrends, existingTitles);
  console.log(`Selected: ${topicInfo.title}\n`);

  console.log("Generating article...");
  const articleBody = await generateArticle(topicInfo);
  console.log(`Generated ${articleBody.length} characters\n`);

  const { filename } = createBlogPost(topicInfo, articleBody);

  // Output for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `filename=${filename}\ntitle=${topicInfo.title}\nslug=${topicInfo.slug}\n`
    );
  }

  console.log("\nDone!");
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
