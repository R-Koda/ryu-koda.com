---
title: "EventScore Explorerの使い方。時系列の見逃し・誤検出を、スコアの中身から見る"
description: "EventScore Explorerをpipで導入し、正解と予測の区間をCSVから可視化。許容時間で判定が変わる合成デモと、実行方法・評価ルールを紹介します。"
heroImage: "../../../public/articles/eventscore-explorer-event-evaluation/cover.webp"
pubDate: 2026-11-09T16:20:00+09:00
tags: ["Python", "つくったもの", "機械学習"]
---

評価スコアが上がったとき、予測がよくなったのか、評価ルールが変わったのか。数字だけでは見えにくい部分があります。EventScore Explorerは、時系列イベントの対応関係を見ながら、スコアの理由を確かめる道具です。

## 予測を変えず、許容時間だけを変える

公開デモの「Endpoint tolerance (seconds)」を0から0.5へ変えてみてください。正解4件・予測5件に対し、対応数は2件から3件、誤検出は3件から2件、見逃しは2件から1件になります。予測は同じでも、許容する区間の隙間が変わると判定が変わります。

公開デモは合成データの出力例です。自分のファイルをアップロードする画面ではありません。

[公開デモを開く](/articles/python-tools/eventscore-demo.html)

## Step 1：Pythonを確認する

ここからはmacOSのターミナルで、合成サンプルを動かします。Python 3.10以上とインターネット接続が必要です。まず、次のコマンドを1つ実行します。

```sh
python3 --version
```

「Python 3.14.0」などと表示され、3.10以上なら次へ進めます。見つからない、または古い場合は、Python公式サイトから対応するPythonを入れてターミナルを開き直します。表示される細かいバージョンは環境によって違います。

[Python](https://www.python.org/downloads/)

## Step 2：サンプルをダウンロードして、そのフォルダーへ移動する

下のZIPをダウンロードし、Finderの「ダウンロード」でダブルクリックして展開します。pipはコマンドを入れるために使い、ZIPは練習用ファイルを手元に置くために使います。

[練習用ファイルを含むZIP](https://github.com/R-Koda/eventscore-explorer/archive/refs/heads/main.zip)

ダウンロード先と展開後の名前が標準のままなら、次を実行します。別の場所に保存した場合は、そのフォルダーのパスに置き換えてください。

```sh
cd ~/Downloads/eventscore-explorer-main
```

何も表示されなければ移動完了です。続けて、入力ファイルがあるか確認します。

```sh
ls examples
```

一覧に「truth.csv、predictions.csv」があれば準備できています。「No such file or directory」が出たら、ZIPの展開先とフォルダー名を確認して、この手順に戻ります。

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
python -m pip install eventscore-explorer==0.1.0
```

初回は「Successfully installed」が表示されます。この記事は0.1.0で検証したため、同じ版を指定しています。次のコマンドで、使い方が表示されることを確認します。

```sh
eventscore --help
```

[PyPI](https://pypi.org/project/eventscore-explorer/) · [GitHub](https://github.com/R-Koda/eventscore-explorer)

下のブロックは入力するコマンドです。説明文や実行結果を一緒に貼り付けないでください。

## Step 4：サンプルを入力してレポートを作る

同じターミナルで次を1回実行します。長い行ですが、途中で分けずにコピーできます。

```sh
eventscore examples/truth.csv examples/predictions.csv --tolerances 0,0.5,1,2 --output reports/events.html --json reports/events.json
```

Report: reports/events.htmlと表示されれば生成完了です。このHTMLをブラウザで開き、許容時間を切り替えます。JSONには各設定での対応関係と件数が残ります。

実行結果の抜粋です。これは入力するコマンドではありません。

```text
Report: reports/events.html
```

## Step 5：HTMLを開き、結果を確かめる

macOSでは次のコマンドで、生成したHTMLを標準ブラウザで開けます。Finderから同じファイルをダブルクリックしても開けます。

```sh
open reports/events.html
```

以下は、この記事と同じ合成サンプルの公開デモをChromeで実際に操作して撮影した画面です。画像をクリックすると原寸で確認できます。

[![許容時間0秒で対応2件・誤検出3件・見逃し2件](/articles/python-tools/screenshots/eventscore-tolerance-0.png)](/articles/python-tools/screenshots/eventscore-tolerance-0.png)

① 上部の選択欄が0になっていることを確認します。その下のMatched・False alarms・Missedを左から読むと、2・3・2です。

[![許容時間を0.5秒に変えた後の対応3件・誤検出2件・見逃し1件](/articles/python-tools/screenshots/eventscore-tolerance-05.png)](/articles/python-tools/screenshots/eventscore-tolerance-05.png)

② 同じ選択欄を0.5へ変えます。ページを開き直さずに、件数が3・2・1へ変わります。この前後を比べられれば操作はできています。

件数が変わるのは、T2の終了35秒とP2の開始35.5秒の隙間が、この変更で許容されるためです。予測データそのものは変わっていません。

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

1つの正解には1つの予測だけを対応づけ、対応数が最大になる組み合わせを選びます。0秒では端点が触れるだけの区間は一致しません。許容時間は開始時刻だけではなく区間間の隙間に適用し、ラベルや記録が異なるイベントは結びません。

複数の候補があると、対応数が同じでも組み合わせや開始時刻の差は変わり得ます。特定の疾患の標準評価や、誤報回数／時間の算出は行いません。初期版の入力上限は各CSVで2,000イベントです。

記事の件数と出力は、Codexによる合成サンプルの実行確認に基づきます。実データでの有効性や、実利用者による検証実績を示すものではありません。

## ソースと更新を追う

[README・使い方](https://github.com/R-Koda/eventscore-explorer#readme) · [不具合の報告](https://github.com/R-Koda/eventscore-explorer/issues) · [GitHubプロフィール](https://github.com/R-Koda)

[3つのツールの紹介に戻る](/blog/python-tools-splittrace-eventscore-notebook/) · [RSSで更新を受け取る](/subscribe/)
