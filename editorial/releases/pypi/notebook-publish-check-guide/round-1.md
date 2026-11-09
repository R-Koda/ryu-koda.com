---
title: "Notebook Publish Checkの使い方。図を残して、公開前のログを整理する"
description: "Notebook Publish Checkをpipで導入。Notebookを実行せず、絶対パスや巨大な出力を点検し、必要な図を残して別コピーへ保存する手順を紹介します。"
pubDate: 2026-11-09T16:20:00+09:00
tags: ["Python", "つくったもの", "機械学習"]
---

Notebookを見せたいとき、図は残したいけれど、長い実行ログは外したいことがあります。Notebook Publish Checkは、セルごとの点検結果と出力を見ながら、公開するコピーを整理する道具です。元ファイルを書き換えず、コードも実行しません。

## 図を残し、ログのあるセルだけを選ぶ

公開デモのセル3で「Remove all outputs and execution count from this cell」を選びます。セル2は選ばず、上部の「Download selected copy (.ipynb)」を押すと別コピーを保存できます。画像は表示確認用の小さな合成画像で、ログの認証情報らしい文字列も偽物です。

[公開デモを開く](/articles/python-tools/notebook-demo.html)

## pipでインストールする

Python 3.10以上を使います。macOS・Linuxでは、作業用フォルダーで次の順に実行します。

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install notebook-publish-check
nbpublish --help
```

Windowsでは「py -3 -m venv .venv」で環境を作り、PowerShellで「.venv\Scripts\Activate.ps1」を実行して有効にします。以降のpipコマンドは共通です。

最後に使い方が表示されれば、インストールしたコマンドを呼び出せています。コマンドが見つからなければ、同じターミナルで仮想環境を有効にしたか確認します。

[PyPI](https://pypi.org/project/notebook-publish-check/) · [GitHub](https://github.com/R-Koda/notebook-publish-check)

## 合成サンプルを手元で動かす

pipではサンプルファイルは作業フォルダーに配置されません。GitHubの「Code → Download ZIP」でソースを取得して展開し、そのフォルダーをターミナルの作業場所にしてから、次のコマンドを実行します。

```sh
nbpublish examples/publication-demo.ipynb --output reports/review.html --json reports/findings.json
```

合成サンプルでは7件の点検項目が出て、終了コードは1です。これはレポート生成失敗ではなく、確認すべき項目があるという意味です。reports/review.htmlを開き、不要な出力を選んで別コピーを保存します。

出力先に同名ファイルがある場合は、別のファイル名を指定してください。自分のデータを試す前に、この合成サンプルで結果の読み方を確認します。

## できることと、確認が必要なこと

点検用HTMLには元Notebookの内容が含まれます。自分のファイルで作ったレポートは、そのまま公開しないでください。出力を消してもソースコードや添付ファイルは残ります。保存したコピーを再点検し、必要ならコードも修正します。

検出は限られた認証情報パターン、絶対パス、出力サイズなどに基づきます。すべての秘密情報や個人情報を見つける保証はなく、画像のOCRも行いません。nbformat 4、20 MB以下のNotebookが対象です。

記事の件数と出力は、Codexによる合成サンプルの実行確認に基づきます。実データでの有効性や、実利用者による検証実績を示すものではありません。

## ソースと更新を追う

[README・使い方](https://github.com/R-Koda/notebook-publish-check#readme) · [不具合の報告](https://github.com/R-Koda/notebook-publish-check/issues) · [GitHubプロフィール](https://github.com/R-Koda)

[3つのツールの紹介に戻る](/blog/python-tools-splittrace-eventscore-notebook/) · [RSSで更新を受け取る](/subscribe/)
