# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## 本番公開（Cloudflare Pages）

- 本番: https://ryu-koda.com
- Pages プロジェクト: `ryu-koda`
- 配信元: https://ryu-koda.pages.dev
- ソース管理: GitHub の `main`

Cloudflare にログイン済みの環境で `npm run deploy` を実行します。
`dist/` のみをアップロードし、ソースや下書きは公開しません。
現在は直接アップロード方式で、GitHub push による自動公開は行いません。
旧 `/sitemap.xml` は `/sitemap-index.xml` へ転送します。
旧 `/youtube/` は `/work/#youtube` へ301転送します。

## SEOと公開前チェック

`npm run build && python3 scripts/check-seo.py` でタイトル、説明文、canonical、OG URL、JSON-LD、内部リンク、目次リンク、サイトマップを検査します。GitHubでもpush/PR時に実行します。

- `src/lib/seo.mjs`: サンプル・準備中ページのnoindexとサイトマップ除外を一元管理。SNS・日記・お問い合わせの公開内容が揃ったら対象から外します。
- 本番正規URLは `https://ryu-koda.com/`。Cloudflareのシングルリダイレクトでwwwを301転送します（パス・クエリを維持）。
- PagesのプレビューURLはX-Robots-Tagでnoindex、本番はインデックス可能です。
- Google Search Consoleは個人アカウントでDNS所有権確認済み。確認用TXTを削除しないでください。
- 記事の公開日をSEO目的だけで変更しないこと。更新日は内容を実際に見直した日を記録します。
- 既存記事の価格・製品仕様・実体験・根拠の全面再検証は別途必要です。構造化データの追加だけで内容の正確性を保証しません。
- 被リンクや紹介は実際の価値に基づいて獲得し、自動投稿やリンク購入は行いません。

参考: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ja

## Contact form

The static `/contact/` form posts to the same-origin `/api/contact` Cloudflare Worker.
Worker source/configuration: `workers/contact/`. Deploy with
`npx wrangler deploy --config workers/contact/wrangler.jsonc`.
Configure `CONTACT_TO` and `TURNSTILE_SECRET` as Worker secrets (never commit them).
The recipient must be a verified Cloudflare Email Routing destination; the sending domain must have Email Routing enabled.
The Turnstile public sitekey in the form is restricted to ryu-koda.com, action `contact`.
Server checks origin, field lengths, consent, Turnstile hostname/action, and an IP rate limit.
No submission bodies are logged or stored by the application. Notification mail is retained in the owner's Gmail.
Run `node --test tests/*.test.mjs` for validation and failure-path tests; these do not send real mail.
Deploy the Worker before publishing the form. Workers and Pages have separate deploy commands.
