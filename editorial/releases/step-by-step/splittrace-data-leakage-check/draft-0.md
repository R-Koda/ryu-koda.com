---
title: "SplitTraceの使い方。学習・テストの混入を、派生元から点検する"
description: "SplitTraceをpipで導入し、同じ元データに由来するサンプルの混入を点検。合成デモ、実行コマンド、FAILとUNKNOWNの読み方、GitHubを紹介します。"
pubDate: 2026-11-09T16:20:00+09:00
tags: ["Python", "つくったもの", "機械学習"]
---

ファイル名が違えば、別のデータとして扱ってよいでしょうか。波形の同じ区間から画像を作り、その画像を加工した場合、見た目が変わっても元データは共通です。学習用とテスト用に分ける前後で、その関係を確かめるためにSplitTraceを作りました。

## 派生元までたどると、つながりが見える

同梱サンプルでは、学習側のaがimage-01を経由し、テスト側のbと同じepoch-01につながります。SplitTraceは画像や波形を読むのではなく、宣言した親IDの関係をたどり、問題の経路を示します。

公開デモは合成データの出力例です。自分のファイルをアップロードする画面ではありません。

[公開デモを開く](/articles/python-tools/splittrace-demo.html)

## Step 1：Pythonを確認する

ここからはmacOSのターミナルで、合成サンプルを動かします。Python 3.10以上とインターネット接続が必要です。まず、次のコマンドを1つ実行します。



```sh
python3 --version
```

「Python 3.14.0」などと表示され、3.10以上なら次へ進めます。見つからない、または古い場合は、Python公式サイトから対応するPythonを入れてターミナルを開き直します。表示される細かいバージョンは環境によって違います。

[Python](https://www.python.org/downloads/)

## Step 2：サンプルをダウンロードして、そのフォルダーへ移動する

下のZIPをダウンロードし、Finderの「ダウンロード」でダブルクリックして展開します。pipはコマンドを入れるために使い、ZIPは練習用ファイルを手元に置くために使います。

[練習用ファイルを含むZIP](https://github.com/R-Koda/splittrace/archive/refs/heads/main.zip)

ダウンロード先と展開後の名前が標準のままなら、次を実行します。別の場所に保存した場合は、そのフォルダーのパスに置き換えてください。



```sh
cd ~/Downloads/splittrace-main
```

何も表示されなければ移動完了です。続けて、入力ファイルがあるか確認します。



```sh
ls examples
```

一覧に「derived-samples.json、derived-assignments.json」があれば準備できています。「No such file or directory」が出たら、ZIPの展開先とフォルダー名を確認して、この手順に戻ります。

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
python -m pip install splittrace==0.1.0
```

初回は「Successfully installed」が表示されます。この記事は0.1.0で検証したため、同じ版を指定しています。次のコマンドで、使い方が表示されることを確認します。



```sh
splittrace --help
```

[PyPI](https://pypi.org/project/splittrace/) · [GitHub](https://github.com/R-Koda/splittrace)

## Step 4：サンプルを入力してレポートを作る

同じターミナルで次を1回実行します。長い行ですが、途中で分けずにコピーできます。



```sh
splittrace examples/derived-samples.json examples/derived-assignments.json --policy cross_subject --lineage-complete --output pypi-audit.json --html pypi-audit.html
```

意図的に混入を入れたサンプルなので、結果はFAIL、終了コードは1になります。これは想定した検出結果です。pypi-audit.htmlをブラウザで開くと、aとbがepoch-01でつながる経路を確認できます。

## Step 5：HTMLを開き、結果を確かめる

macOSでは次のコマンドで、生成したHTMLを標準ブラウザで開けます。Finderから同じファイルをダブルクリックしても開けます。



```sh
open pypi-audit.html
```

レポートのFAILと、a・bがepoch-01を共有する経路を探します。a → image-01 → epoch-01、b → epoch-01という入力の関係を、レポートと照合できれば完了です。UNKNOWNは情報不足で判定できない検査で、PASSとは別です。

## つまずいたときと、次に自分のデータを使うとき

「command not found」が出たらStep 2のフォルダーへ戻り、Step 3の仮想環境を有効にします。入力ファイルが見つからない場合は、Step 2の一覧をもう一度確認します。出力先がすでにある場合は、出力ファイル名を変えて再実行してください。

自分のデータでは、Step 4の入力パスを置き換えます。最初にREADMEの入力形式と制約を確認し、元ファイルのコピーで試してください。今回の基本手順は、Step 5で結果を確認できたところまでです。

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

UNKNOWNは必要な情報が不足した検査です。FAILが出ても、ほかの検査がすべて完了したとは限りません。`--lineage-complete`は、親子関係を漏れなく記載したと自分で確認できる場合にだけ使います。自動的に関係を補う指定ではありません。

入力は既存の分割とメタデータです。分割の自動修正や、画像からの派生元推定は行いません。小さなmanifest向けの初期版で、大規模な本番処理のための実装ではありません。

記事の件数と出力は、Codexによる合成サンプルの実行確認に基づきます。実データでの有効性や、実利用者による検証実績を示すものではありません。

## ソースと更新を追う

[README・使い方](https://github.com/R-Koda/splittrace#readme) · [不具合の報告](https://github.com/R-Koda/splittrace/issues) · [GitHubプロフィール](https://github.com/R-Koda)

[3つのツールの紹介に戻る](/blog/python-tools-splittrace-eventscore-notebook/) · [RSSで更新を受け取る](/subscribe/)
