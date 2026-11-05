---
title: '【完全ガイド】Claude Codeに30個以上のツールを入れて「やりたいことを言うだけ」で全自動化した方法'
description: 'Claude Codeに30以上のMCPサーバーとプラグインを追加し、やりたいことを伝えるだけで最適なツールが自動で選ばれる仕組みを作りました。設定ファイルも全て公開しています。'
pubDate: 2025-03-13
tags: ['ClaudeCode', 'MCP', 'AI', '開発環境', '自動化']
---

## TL;DR

Claude Code に **30以上のMCPサーバーとプラグイン**を統合し、「タスクを伝えるだけで最適なツールが自動選択される」**Auto-Dispatcher** を構築しました。さらに、新しいツールの発見から導入までを半自動化する **Self-Updating** の仕組みも実装。Claude Code をただのAIコーディングツールから、**自律型の開発プラットフォーム**へと進化させた全設定を公開します。

---

## この記事で構築するもの

```
あなた: 「このPRをレビューして」
Claude: → 自動で /pr-review を選択・実行（6種の専門エージェントが並列レビュー）

あなた: 「新機能を設計して実装まで」
Claude: → /deep-project → /deep-plan → /deep-implement を順に実行

あなた: 「一晩かけてリファクタリングして」
Claude: → /ralph-loop で自律的に繰り返し実行
```

**手動でプラグインを指定する必要は一切ありません。**

---

## 全体アーキテクチャ

```
~/.claude/
├── CLAUDE.md                  # グローバル指示 + Auto-Routing 宣言
├── TOOLS.md                   # Single Source of Truth（全ツール定義）
├── settings.json              # 権限・hooks・マーケットプレース
├── skills/
│   ├── auto.md                # Auto-Dispatcher（タスク→ツール選択）
│   └── discover.md            # 新ツール発見スキル
└── hooks/
    ├── session-start.sh       # セッション開始時のツール状態表示
    ├── check-updates.sh       # 7日ごとの更新リマインド
    ├── cmux-notify.sh         # タスク完了通知
    ├── cmux-notify-permission.sh  # 承認待ち通知
    └── github-mcp.sh          # GitHub MCP ラッパー
```

設計思想は **3つの原則** に基づいています：

1. **Single Source of Truth** — ツール定義は `TOOLS.md` のみで管理
2. **Zero-Config Routing** — タスクを伝えるだけで最適なツールが選ばれる
3. **Self-Updating** — 新ツールの発見・導入・反映が半自動

---

## 1. MCP サーバー：30超の外部ツール統合

### なぜ MCP なのか

Claude Code は単体でも強力ですが、MCP（Model Context Protocol）を通じて外部ツールと接続すると、**できることの次元が変わります**。ファイル操作やWeb検索だけでなく、GitHub操作、DB問い合わせ、ブラウザ自動操作、ドキュメント変換まで、あらゆる開発タスクを Claude の中で完結できるようになります。

### インストール済みMCPサーバー一覧

#### Tier 1: 設定不要ですぐ使えるもの

```bash
# ブラウザ自動操作（E2Eテスト、スクレイピング）
claude mcp add playwright -s user -- npx -y @playwright/mcp@latest

# 最新ドキュメント自動注入（React, Next.js 等の最新API）
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp

# 複雑な推論の補助
claude mcp add sequential-thinking -s user -- npx -y @modelcontextprotocol/server-sequential-thinking

# PDF/pptx → マークダウン変換
claude mcp add markitdown -s user -- npx -y @microsoft/markitdown-mcp

# YouTube 字幕取得・要約
claude mcp add youtube -s user -- npx -y @nicekid1/youtube-mcp

# Knowledge Graph ベースの長期記憶
claude mcp add memory -s user -- npx -y @modelcontextprotocol/server-memory

# その他: fetch, puppeteer, sqlite, filesystem, docker
```

#### Tier 2: OAuth / SSE 認証（APIキー不要）

```bash
# GitHub API（PR, Issue, CI/CD）— OAuth で認証、キー管理不要
claude mcp add github-sse -s user --transport sse https://api.github.com/mcp

# Sentry エラー監視
claude mcp add sentry-sse -s user --transport sse https://mcp.sentry.dev/sse
```

#### Tier 3: AWS 系

```bash
claude mcp add aws-docs -s user -- uvx awslabs.aws-documentation-mcp-server
claude mcp add aws-cdk -s user -- uvx awslabs.cdk-mcp-server
claude mcp add aws-cost -s user -- uvx awslabs.cost-analysis-mcp-server
claude mcp add aws-bedrock -s user -- uvx awslabs.bedrock-mcp-server
```

#### Tier 4: サービス連携（APIキー要）

```bash
# Figma, Slack, Notion, Linear, Brave Search, Firecrawl,
# Google Drive, PostgreSQL, Firebase
```

### 実際の使い方

MCP サーバーは **明示的に呼び出す必要がありません**。自然言語で依頼するだけです：

```
「Reactの useOptimistic の最新の使い方を教えて」
→ context7 が自動で最新ドキュメントを注入

「このURLのスクリーンショットを撮って、UIの問題を指摘して」
→ playwright が自動でブラウザ操作

「今月のAWSコストを確認して」
→ aws-cost が自動でコスト分析
```

---

## 2. プラグイン：開発ワークフローの自動化

### 公式マーケットプレースから

```bash
/plugin install ralph-wiggum@claude-plugins-official    # 自律ループ実行
/plugin install code-review@claude-plugins-official      # コードレビュー
/plugin install pr-review-toolkit@claude-plugins-official # PR 多角的レビュー
/plugin install superpowers@claude-plugins-official       # 構造的開発フレームワーク
```

### コミュニティマーケットプレースから

```bash
/plugin install claude-mem@thedotmack        # セッション間記憶
/plugin install ccpm@ccpm                    # PRD→Issue→コード管理
/plugin install session-logger@claude-session-logger  # セッションログ
/plugin install claude-dev-toolkit@claude-dev-toolkit  # 開発補助

# Deep Trilogy（アイデア→設計→実装の3段階）
/plugin install deep-project@deep-project
/plugin install deep-plan@deep-plan
/plugin install deep-implement@deep-implement

# 500+ サービス連携
/plugin install connect-apps@composio
```

### 各プラグインの威力

#### Ralph Wiggum Loop — 寝ている間にコードが書かれる

```
/ralph-loop "全テストファイルをVitestに移行して" --max-iterations 20
```

Claude が自律的にタスクを繰り返し実行。終了条件に達するか、最大イテレーションに到達するまで止まりません。**一晩放置して朝にはリファクタリング完了**、という使い方ができます。

#### Deep Trilogy — 曖昧なアイデアから本番コードまで

```
/deep-project @requirements.md
  → 要件を個別コンポーネントに分解

/deep-plan @planning/01-auth/spec.md
  → 各コンポーネントの実装計画を策定（リサーチ・インタビュー・マルチLLMレビュー付き）

/deep-implement @planning/sections/
  → TDD + コードレビュー付きで実装
```

「認証機能を追加したい」のような曖昧な要件から、テスト済みの本番コードまで一気通貫で到達できます。

#### pr-review-toolkit — 6人の専門レビュアー

```
/pr-review
```

1つのコマンドで **6種の専門エージェントが並列でレビュー** を実行：

| エージェント | 観点 |
|---|---|
| Comment Analyzer | ドキュメントとコードの整合性 |
| PR Test Analyzer | テストカバレッジのギャップ |
| Silent Failure Hunter | 隠れたエラーハンドリングの問題 |
| Type Design Analyzer | 型設計の品質 |
| Code Reviewer | プロジェクトガイドラインへの準拠 |
| Code Simplifier | コードの簡潔化提案 |

---

## 3. Auto-Dispatcher：これが本体

ここまでのMCPとプラグインは「武器」です。Auto-Dispatcher は、その武器を **状況に応じて自動で選ぶAI** です。

### 仕組み

```
CLAUDE.md（毎セッション自動読込）
  └→ 「ツール選択は TOOLS.md を参照せよ」

auto.md（/auto スキル）
  └→ 「TOOLS.md を読み、タスクに最適なツールを選択・実行せよ」

TOOLS.md（Single Source of Truth）
  └→ 全ツールの一覧・呼び出し方・用途を定義
```

### なぜ Single Source of Truth が重要か

従来のアプローチでは、ルーティングルールにツール名をハードコードします。ツールを追加するたびに、ルーティングルールも書き換える必要がありました。

**この設計では、TOOLS.md を更新するだけで全てに反映されます：**

```
TOOLS.md にツール追加
  ↓ auto.md が毎回 TOOLS.md を読む
  ↓ CLAUDE.md が TOOLS.md を参照するよう指示
  ↓ 自動的にルーティング対象に含まれる
```

ルーティングロジックを一切変更する必要がありません。

### 実際の動作例

```
あなた: 「このAPIのレスポンスが遅い。原因を調べて直して」

Claude の思考:
  1. TOOLS.md を確認
  2. デバッグ → 体系的デバッグアプローチ
  3. パフォーマンス分析 → コードレビュー系プラグインも有用
  4. テスト → TDD Guard が自動監視
  → code-review + TDD Guard の組み合わせで対応

あなた: 「Figmaのデザインを元にReactコンポーネントを作って」

Claude の思考:
  1. TOOLS.md を確認
  2. Figma → figma MCP
  3. React の最新API → context7 MCP
  4. 実装 → deep-implement が適切
  → figma MCP + context7 MCP + deep-implement の組み合わせ
```

---

## 4. Self-Updating：ツールが勝手に進化する

### 7日ごとの自動リマインド

```bash
# ~/.claude/hooks/check-updates.sh
# SessionStart 時に実行。7日経過で通知。

「前回のツール更新チェックから7日経過しています。
 /discover で新しいプラグインやMCPサーバーを検索できます。」
```

### /discover — 新ツール発見スキル

```
/discover
```

以下のソースから自動検索し、**未導入のツールだけを提案**します：

- `anthropics/claude-plugins-official`（公式）
- `anthropics/claude-code/plugins`（公式）
- `ComposioHQ/awesome-claude-plugins`（キュレーション）
- `modelcontextprotocol` org（公式MCP）
- npm レジストリ
- Web 検索（最新トレンド）

提案フォーマット：

| 名前 | 種別 | 用途 | おすすめ度 |
|---|---|---|---|
| xxx | MCP | ○○ができる | 高 |
| yyy | プラグイン | △△を自動化 | 中 |

選んだものだけインストールされ、TOOLS.md が自動更新 → Auto-Dispatcher に即反映。

### 更新の全体フロー

```
セッション開始
  ↓
check-updates.sh: 「7日経過。/discover で確認できます」
  ↓
/discover: ソースから新ツール検索 → TOOLS.md と差分比較
  ↓
ユーザーが選択 → インストール → TOOLS.md 更新
  ↓
次回から Auto-Dispatcher が新ツールも選択肢に含める
```

**ツールのエコシステムが自律的に進化し続けます。**

---

## 5. 通知システム：cmux 連携

バックグラウンドで Claude Code を動かしているとき、重要なイベントを見逃しません。

```bash
# タスク完了時
cmux notify --title "Claude Code" --body "タスクが完了しました" --level info

# 承認待ち時
cmux notify --title "Claude Code" --body "承認を待っています" --level warning
```

| イベント | 通知レベル | タイミング |
|---|---|---|
| タスク完了 (`Stop`) | info | Claude が応答を終えたとき |
| 承認待ち (`PermissionRequest`) | warning | 権限が必要な操作の実行前 |

Ralph Loop で一晩放置しているときでも、完了や問題発生時に通知が飛んできます。

---

## 6. セキュリティ：権限管理

全てを自動化しつつも、危険な操作はブロックしています。

```json
{
  "permissions": {
    "allow": [
      "Bash(git status*)", "Bash(git log*)", "Bash(git diff*)",
      "Bash(git add*)", "Bash(git commit*)", "Bash(gh *)",
      "Read", "Write", "Edit", "Glob", "Grep",
      "WebFetch", "WebSearch"
    ],
    "deny": [
      "Bash(rm -rf /)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)"
    ]
  }
}
```

日常的な操作は自動許可し、破壊的な操作は明示的にブロック。自動化と安全性のバランスを取っています。

---

## 7. GitHub MCP のトークン管理

GitHub MCP サーバーのトークンを平文で保存せず、`gh auth token` を実行時に動的取得するラッパースクリプトを使用しています：

```bash
#!/bin/bash
# ~/.claude/hooks/github-mcp.sh
export GITHUB_PERSONAL_ACCESS_TOKEN="$(gh auth token)"
exec npx -y @modelcontextprotocol/server-github "$@"
```

トークンのローテーションにも自動対応し、セキュリティリスクを最小化しています。

---

## まとめ：何が変わったか

| Before | After |
|---|---|
| プラグインを手動で指定 | タスクを伝えるだけで自動選択 |
| ツール追加のたびにルール書き換え | TOOLS.md に追記するだけで全反映 |
| 新ツールを自分で探す | 7日ごとに /discover が提案 |
| タスク完了を待って画面を見る | cmux 通知で離席OK |
| トークンを平文管理 | 実行時に動的取得 |

Claude Code はもはや「AIに質問するツール」ではなく、**30以上の専門ツールを使い分ける自律型の開発チーム**です。

タスクを伝えるだけ。あとは Claude が考えて、最適なツールを選び、実行する。

---

## 再現手順

この記事の全設定を再現するためのファイル一覧：

| ファイル | 内容 |
|---|---|
| `~/.claude/settings.json` | 権限、hooks、マーケットプレース |
| `~/.claude.json` | MCP サーバー設定 |
| `~/.claude/CLAUDE.md` | グローバル指示 + Auto-Routing |
| `~/.claude/TOOLS.md` | 全ツール定義（SSoT） |
| `~/.claude/skills/auto.md` | Auto-Dispatcher ルール |
| `~/.claude/skills/discover.md` | 新ツール発見スキル |
| `~/.claude/hooks/*.sh` | 各種フックスクリプト |

全ファイルの内容は GitHub リポジトリで公開予定です。

---

*この記事自体も Claude Code で書かれています。*
