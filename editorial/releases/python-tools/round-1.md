---
title: "データを分ける・評価する・公開する。Pythonの小さな確認ツールを3つ作りました"
seoTitle: "SplitTrace・EventScore・Notebook Publish Check｜Pythonの確認ツール3選"
description: "データ分割の混入をたどるSplitTrace、時系列イベントの評価を説明するEventScore Explorer、Notebookの公開前点検を助けるNotebook Publish Check。合成デモとGitHub、試し方を紹介します。"
pubDate: 2026-11-09T12:00:00+09:00
tags: ["Python", "機械学習", "つくったもの", "自動化"]
---

学習用とテスト用のデータは、本当に分かれている？ 評価スコアが変わったのは、どの予測の判定が変わったから？ Notebookを公開するとき、残したい図と消したいログを分けられる？

そんな確認を助けるPythonツールを3つ、GitHubで公開しました。**分割を点検するSplitTrace、評価の中身を見るEventScore Explorer、公開前に見直すNotebook Publish Check**です。どれもMITライセンスの初期版。まずは合成データのデモから、用途が合うか確かめてみてください。

## 今の困りごとから選ぶ

- **学習・評価データの混入を調べたい** → [SplitTraceのGitHub](https://github.com/R-Koda/splittrace)
- **見逃し・誤検出とスコアの関係を知りたい** → [EventScore ExplorerのGitHub](https://github.com/R-Koda/eventscore-explorer)
- **Notebookの出力を選んで整理したい** → [Notebook Publish CheckのGitHub](https://github.com/R-Koda/notebook-publish-check)

この記事のデモはすべて合成データです。患者データや実際の認証情報は使っていません。ブラウザで開ける出力例なので、最初の確認にPythonの準備は不要です。自分のファイルをアップロードする画面ではありません。

## SplitTrace：違うファイルでも、元データが同じかもしれない

たとえば、ある波形の区間から画像を作り、さらに加工したサンプルを用意するとします。ファイル名が違っていても、同じ元データの派生物が学習側とテスト側に分かれていれば、評価を読み違える原因になります。

SplitTraceは、サンプルID・親ID・被験者ID・区間などのメタデータを読み、既存の分割を点検します。派生元をたどって、問題を起こした経路を示すのが中心の機能です。

同梱サンプルでは、次の2つの経路が同じ元サンプルにつながります。

```text
学習側 a → image-01 → epoch-01
テスト側 b → epoch-01
```

[SplitTraceの出力例を開く](/articles/python-tools/splittrace-demo.html)

大切なのは、情報が足りない項目を「問題なし」にしないこと。親子関係や必要なメタデータが不足していれば、検査範囲に限界があることを示します。波形や画像から派生関係を自動推定するツールではなく、入力した関係と方針に基づく点検です。

[SplitTraceのREADME・実行手順へ](https://github.com/R-Koda/splittrace#readme)

## EventScore Explorer：スコアの前に、どれが当たったかを見る

時系列の検出では、正解イベントの少し後に予測が出ることがあります。それを正解として数えるかどうかで、スコアが変わります。

EventScore Explorerは、正解と予測の区間をCSVで受け取り、対応関係・見逃し・誤検出をHTMLにまとめます。許容時間を切り替えると、対応するイベントとスコアを見比べられます。

[EventScore Explorerの合成デモを開く](/articles/python-tools/eventscore-demo.html)

デモ上部の「Endpoint tolerance (seconds)」を0から0.5に変えてみてください。

同梱デモは、正解4件・予測5件。許容時間0秒では対応2件、誤検出3件、見逃し2件です。0.5秒に変えると、対応3件、誤検出2件、見逃し1件になります。予測自体を変えずに、評価のルールで結果が変わる例です。

ここでは、1つの正解に1つの予測だけを対応づけ、対応数が最大になる組み合わせを探します。許容時間は区間同士の隙間に適用します。0秒では端が触れるだけの区間は重なりと数えません。被験者や疾患ごとの標準評価を実装したものではなく、明示したルールを確認するための道具です。

[EventScore ExplorerのREADME・CSV形式へ](https://github.com/R-Koda/eventscore-explorer#readme)

## Notebook Publish Check：図を残して、不要な出力だけを外す

Notebookには、コード以外にも実行結果やメタデータが保存されます。図は残したいけれど、長いログやローカルのファイルパスは公開前に確認したい。そんなときの点検画面を作りました。

Notebook Publish Checkはコードを実行せずにNotebookを読み、認証情報らしい文字列・絶対パス・大きな出力などをセル単位で表示します。残す図を確認しながら、削除するセル出力やメタデータを選び、別のNotebookとして保存できます。

[Notebook Publish Checkの合成デモを開く](/articles/python-tools/notebook-demo.html)

デモでは、セル3の「Remove all outputs and execution count from this cell」にチェックを入れます。セル2は選ばずに残し、上部の「Download selected copy (.ipynb)」で別のコピーを保存する流れです。セル2の画像は表示確認用の小さな合成画像です。セル4には、意図的に偽のパスワード文字列をコードとして置いてあります。**出力を消しても、ソースコード内の文字列は残る**ことを確認するためです。

点検用HTMLには元Notebookの内容が含まれます。自分のNotebookで作ったレポートは、そのまま公開しないでください。検出は限られたパターンに基づくもので、画像内の文字を読むOCRや、あらゆる個人情報の検出は行いません。

[Notebook Publish CheckのREADME・使い方へ](https://github.com/R-Koda/notebook-publish-check#readme)

## まずはデモ、次に手元のサンプルで

3つともPython 3.10以上で動きます。実行部分はPython標準ライブラリだけで構成しています。PyPIにはまだ公開していないため、同名パッケージを探すのではなく、この記事のGitHubリンクから入手してください。

GitHubのREADMEには、入手方法・コマンド・サンプル形式をまとめています。まず同梱の合成データで出力を確認し、それから自分の小さなデータで試す順番がおすすめです。

## 使える範囲を確かめながら育てる

3つとも初期版で、実利用者による検証はこれからです。公開時点では合成サンプルと自動テストで確認しています。大規模データや実際の研究・業務での有効性が実証された、という意味ではありません。

用途に合いそうなものがあれば、各GitHubのREADMEから試してみてください。使いづらかった点や再現できる不具合は、個人情報を含まない小さな例とともにIssueへ。開発の続きを追いたい方は、[GitHubプロフィール](https://github.com/R-Koda)からフォローできます。

Pythonで小さな道具を動かすところから始めたい方には、[ファイルを削除せず、重複だけを探す記事](/blog/find-duplicate-files-python/)も用意しています。記事の更新は[RSS](/rss.xml)でも購読できます。
