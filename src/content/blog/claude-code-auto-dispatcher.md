---
seoTitle: "Claude CodeのMCP設定方法｜追加・設定場所の確認・削除"
title: 'Claude CodeのMCP設定、どこに入った？ 追加・確認・削除を1つずつ試す'
description: 'Claude CodeのMCP設定を練習用フォルダーへ追加し、.mcp.jsonの中身と承認待ち表示を確認して削除する手順。実行結果付きで解説します。'
pubDate: 2026-05-28T09:00:00+09:00
heroImage: "../../../public/articles/claude-code-auto-dispatcher/cover-sketch-v2.webp"
updatedDate: 2026-11-05
tags: ['ClaudeCode', 'MCP', '開発環境']
---

ツールを追加するコマンドは見つかった。でも、それを実行すると、どこの設定が変わるんだろう。あとで戻せるのかな。

連携を増やす前に、そこを一度見ておきたくなりました。今回は、**練習用のフォルダーへMCPの設定を1件追加し、中身を見て、最後に削除する**ところまで試します。

MCPは、Claude Codeと外部のツールをつなぐための仕組みです。ただし、設定を書き込めたことと、実際にそのツールが使えることは別。今回はその境目も確認します。

<p class="note">2026年11月5日改稿。以前の「30個以上のツールで全自動化」という記事を、実行確認できた設定操作の解説へ改めました。検証はClaude Code 2.1.283、macOS、隔離した設定ディレクトリで実施。外部サービスへの認証や、資料取得の成功を検証した記事ではありません。</p>

## 1．ターミナルを開き、Claude Codeが使えるか確認する

この記事は、Claude Codeをインストール済みのMacが対象です。まだの場合は[公式セットアップ案内](https://code.claude.com/docs/en/setup)で導入を済ませてから戻ってください。

Command＋Spaceで「ターミナル」を検索して開きます。以下は1つの枠ずつ貼り付け、Returnキーで実行します。先頭に `$` を付ける必要はありません。

```sh
claude --version
```

検証時の結果：

```text
2.1.283 (Claude Code)
```

バージョンが出れば先へ進めます。`command not found` なら、MCPを追加する段階にはまだ到達していません。インストール後にターミナルを開き直し、公式案内の導入確認へ戻ります。表示や仕様はバージョンによって変わります。

## 2．普段のプロジェクトと分けて、練習場所を作る

仕事のフォルダーへいきなり追加せず、Macの一時フォルダーに練習場所を作ります。

```sh
mcp_practice_dir=$(mktemp -d /tmp/mcp-practice.XXXXXX)
cd "$mcp_practice_dir"
pwd
```

結果の例は次のとおり。末尾の文字は実行ごとに変わります。この出力例は入力するコマンドではありません。

```text
/tmp/mcp-practice.aB3xY9
```

**確認：** 表示が `/tmp/mcp-practice.` で始まる専用フォルダーならOK。エラーになった場合は追加操作へ進みません。この練習場所は一時用なので、長期保存する設定の置き場所にはしません。

## 3．プロジェクト用の設定を1件追加する

例に使うのは、ライブラリの資料を扱うContext7のHTTPエンドポイントです。今回は接続先の登録までで、認証情報を入力する操作は含めません。

```sh
claude mcp add --transport http --scope project context7 https://mcp.context7.com/mcp
```

検証時は次のメッセージが出ました。パス部分は自分の練習フォルダーに置き換わります。

```text
Added HTTP MCP server context7 with URL: https://mcp.context7.com/mcp to project config
File modified: …/project/.mcp.json
```

次に、保存された内容を見ます。

```sh
cat .mcp.json
```

検証時の内容：

```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

**確認：** `context7`、`http`、登録したURLの3つが入っていれば、書き込みは成功です。今回の `--scope project` は、このフォルダーの `.mcp.json` を対象にしています。省略して同じ場所へ入るとは考えず、練習では毎回指定します。

## 4．「追加できた」と「接続できた」を分けて読む

```sh
claude mcp get context7
```

検証時の結果はこうでした。

```text
context7:
  Scope: Project config (shared via .mcp.json)
  Status: ⏸ Pending approval (run `claude` to approve)
  Type: http
  URL: https://mcp.context7.com/mcp
```

**ここで分かったこと：** プロジェクト設定として登録されています。一方、状態は承認待ち。この表示を「資料を取得できた」と読み替えてはいけません。

設定ファイルに名前がある、Claude Codeで承認されている、サービスへ接続できる、目的の資料を取得できる。この4つは、それぞれ確かめることが違います。今回は最初の段階を実際に確認しました。

実際の利用へ進む場合は、[Context7の公式導入手順](https://context7.com/docs/clients/claude-code)で認証方法を確認してください。現在の案内にはOAuthやAPIキーの設定が含まれます。この記事の登録コマンドだけで、認証まで完了するわけではありません。

## 5．練習で追加した設定を削除する

同じターミナル、同じフォルダーのまま実行します。

```sh
claude mcp remove --scope project context7
```

検証時の結果：

```text
Removed MCP server context7 from project config
File modified: …/project/.mcp.json
```

続けて、ファイルを確認します。

```sh
cat .mcp.json
```

**確認：** `mcpServers` の中から `context7` がなくなっていれば、今回の練習は完了です。他のスコープに同名の設定がある環境では、その設定まで削除する操作ではありません。

## 表示が違ったら、まず現在地と保存先を見る

- **`.mcp.json` が見つからない：** `pwd` で練習場所にいるか確認し、追加コマンドに `--scope project` があったか見直します。
- **すでに登録済みと出る：** 普段の設定を消して続けず、手順2から新しい練習フォルダーを作ります。管理された環境では管理者設定が優先される場合もあります。
- **承認待ちと出る：** 今回の検証と同じ段階です。接続失敗と決めつけず、登録内容と承認状態を分けて確認します。
- **実際の利用時に認証エラーが出る：** 追加コマンドの繰り返しでは解決しない場合があります。サービス側の認証手順を確認します。

設定の場所が見え、戻し方も分かる。それだけでも、次の連携を試すときの見通しはよくなります。まずはこの1件が、どこへ入り、どう消えたかを確かめるところから。

MCPのスコープと状態表示は[Claude Code公式ドキュメント](https://code.claude.com/docs/en/mcp)を参照しています。コマンドの出力は本記事の検証結果です。
