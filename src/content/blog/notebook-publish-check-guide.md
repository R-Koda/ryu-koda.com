---
title: "Notebook Publish Checkの使い方。図を残して、公開前のログを整理する"
description: "Notebook Publish Checkをpipで導入。Notebookを実行せず、絶対パスや巨大な出力を点検し、必要な図を残して別コピーへ保存する手順を紹介します。"
heroImage: "../../../public/articles/notebook-publish-check-guide/cover.webp"
pubDate: 2026-10-29T09:00:00+09:00
tags: ["Python", "つくったもの", "機械学習"]
---

Notebookを見せたいとき、図は残したいけれど、長い実行ログは外したいことがあります。Notebook Publish Checkは、セルごとの点検結果と出力を見ながら、公開するコピーを整理する道具です。元ファイルを書き換えず、コードも実行しません。

## 図を残し、ログのあるセルだけを選ぶ

公開デモのセル3で「Remove all outputs and execution count from this cell」を選びます。セル2は選ばず、上部の「Download selected copy (.ipynb)」を押すと別コピーを保存できます。画像は表示確認用の小さな合成画像で、ログの認証情報らしい文字列も偽物です。

公開デモは合成データの出力例です。自分のファイルをアップロードする画面ではありません。

[公開デモを開く](/articles/python-tools/notebook-demo.html)

## Step 1：Pythonを確認する

ここからはmacOSのターミナルで、合成サンプルを動かします。Python 3.10以上とインターネット接続が必要です。まず、次のコマンドを1つ実行します。

```sh
python3 --version
```

「Python 3.14.0」などと表示され、3.10以上なら次へ進めます。見つからない、または古い場合は、Python公式サイトから対応するPythonを入れてターミナルを開き直します。表示される細かいバージョンは環境によって違います。

[Python](https://www.python.org/downloads/)

## Step 2：サンプルをダウンロードして、そのフォルダーへ移動する

下のZIPをダウンロードし、Finderの「ダウンロード」でダブルクリックして展開します。pipはコマンドを入れるために使い、ZIPは練習用ファイルを手元に置くために使います。

[練習用ファイルを含むZIP](https://github.com/R-Koda/notebook-publish-check/archive/refs/heads/main.zip)

ダウンロード先と展開後の名前が標準のままなら、次を実行します。別の場所に保存した場合は、そのフォルダーのパスに置き換えてください。

```sh
cd ~/Downloads/notebook-publish-check-main
```

何も表示されなければ移動完了です。続けて、入力ファイルがあるか確認します。

```sh
ls examples
```

一覧に「publication-demo.ipynb」があれば準備できています。「No such file or directory」が出たら、ZIPの展開先とフォルダー名を確認して、この手順に戻ります。

## Step 3：専用の環境を作り、pipでインストールする

いま移動したフォルダーで、専用の仮想環境を作ります。

```sh
python3 -m venv .venv
```

何も表示されず入力待ちに戻れば作成完了です。次に、その環境を有効にします。

```sh
source .venv/bin/activate
```

通常は行の先頭に「(.venv)」が付きます。このターミナルを開いたまま、次を実行します。

```sh
python -m pip install notebook-publish-check==0.1.0
```

初回は「Successfully installed」が表示されます。この記事は0.1.0で検証したため、同じ版を指定しています。次のコマンドで、使い方が表示されることを確認します。

```sh
nbpublish --help
```

[PyPI](https://pypi.org/project/notebook-publish-check/) · [GitHub](https://github.com/R-Koda/notebook-publish-check)

下のブロックは入力するコマンドです。説明文や実行結果を一緒に貼り付けないでください。

## Step 4：サンプルを入力してレポートを作る

同じターミナルで次を1回実行します。長い行ですが、途中で分けずにコピーできます。

```sh
nbpublish examples/publication-demo.ipynb --output reports/review.html --json reports/findings.json
```

合成サンプルでは7件の点検項目が出て、終了コードは1です。これはレポート生成失敗ではなく、確認すべき項目があるという意味です。reports/review.htmlを開き、不要な出力を選んで別コピーを保存します。

実行結果の抜粋です。これは入力するコマンドではありません。

```text
7 findings. Private local report: reports/review.html. Original unchanged.
```

## Step 5：HTMLを開き、結果を確かめる

macOSでは次のコマンドで、生成したHTMLを標準ブラウザで開けます。Finderから同じファイルをダブルクリックしても開けます。

```sh
open reports/review.html
```

以下は、この記事と同じ合成サンプルの公開デモをChromeで実際に操作して撮影した画面です。画像をクリックすると原寸で確認できます。

[![Notebook Publish Checkの初期集計と保存ボタン](/articles/python-tools/screenshots/notebook-summary.png)](/articles/python-tools/screenshots/notebook-summary.png)

① 最初に右側の「4 cells · 7 findings」を確認します。この時点では「0 cells: outputs removed」と表示され、削除対象はまだ選ばれていません。

次は、図を残してログだけを外します。下の②・③の順に操作すると、reviewed-copy.ipynbという別ファイルが保存されます。

[![セル3の出力削除チェックを入れた状態](/articles/python-tools/screenshots/notebook-cell3-selected.png)](/articles/python-tools/screenshots/notebook-cell3-selected.png)

② Cell 3まで下へ進み、画像のチェック欄を選びます。Cell 2は選びません。チェックするとセル3のログ表示が消えますが、元ファイルは変更されません。

[![1セル選択後の件数とDownload selected copyボタン](/articles/python-tools/screenshots/notebook-download-selection.png)](/articles/python-tools/screenshots/notebook-download-selection.png)

③ 上へ戻り、「1 cells: outputs removed」を確認して緑色のボタンを押します。上の7 findingsは元Notebookの点検結果です。保存したコピーの指摘件数は、次のStep 6で調べ直します。

## Step 6：保存したコピーをもう一度点検する

保存先が標準の「ダウンロード」で、ファイル名を変えていない場合は次を実行します。保存場所や名前が異なる場合は入力パスを置き換えます。

```sh
nbpublish ~/Downloads/reviewed-copy.ipynb --output reports/rechecked.html --json reports/rechecked.json
```

このサンプルはソースコードにも偽の認証情報らしい文字列があるため、出力を消しただけでは指摘が残ります。生成されたreports/rechecked.htmlを開き、セル2の画像が残り、セル3のログが消えたことと、残る指摘の場所を確認します。元のexamples/publication-demo.ipynbは変更されません。

```sh
open reports/rechecked.html
```

## つまずいたときと、次に自分のデータを使うとき

「command not found」が出たらStep 2のフォルダーへ戻り、Step 3の仮想環境を有効にします。入力ファイルが見つからない場合は、Step 2の一覧をもう一度確認します。出力先がすでにある場合は、出力ファイル名を変えて再実行してください。

自分のデータでは、Step 4の入力パスを置き換えます。最初にREADMEの入力形式と制約を確認し、元ファイルのコピーで試してください。今回の基本手順は、Step 6で保存したコピーを再点検したところまでです。

## Windows・Linuxで試す場合

上の実行確認はmacOSで行いました。WindowsではPythonの起動にpy -3、一覧表示にdirを使い、PowerShellで仮想環境を有効にするコマンドは下記です。ダウンロード先の実際のパスに移動してから実行します。組織の実行ポリシーで止まる場合は、その設定を変更せず管理者に確認してください。

```sh
py -3 -m venv .venv
```

```sh
.venv\Scripts\Activate.ps1
```

pipと各ツールのコマンドは共通です。HTMLはエクスプローラーから開けます。Linuxでは上記のmacOS用コマンドを使い、HTMLを開くときだけopenの代わりにxdg-openを使うか、ファイルマネージャーから開いてください。Windows・Linux上での実機確認は行っていません。

## できることと、確認が必要なこと

点検用HTMLには元Notebookの内容が含まれます。自分のファイルで作ったレポートは、そのまま公開しないでください。出力を消してもソースコードや添付ファイルは残ります。保存したコピーを再点検し、必要ならコードも修正します。

検出は限られた認証情報パターン、絶対パス、出力サイズなどに基づきます。すべての秘密情報や個人情報を見つける保証はなく、画像のOCRも行いません。nbformat 4、20 MB以下のNotebookが対象です。

記事の件数と出力は、Codexによる合成サンプルの実行確認に基づきます。実データでの有効性や、実利用者による検証実績を示すものではありません。

## ソースと更新を追う

[README・使い方](https://github.com/R-Koda/notebook-publish-check#readme) · [不具合の報告](https://github.com/R-Koda/notebook-publish-check/issues) · [GitHubプロフィール](https://github.com/R-Koda)

[3つのツールの紹介に戻る](/blog/python-tools-splittrace-eventscore-notebook/) · [RSSで更新を受け取る](/subscribe/)
