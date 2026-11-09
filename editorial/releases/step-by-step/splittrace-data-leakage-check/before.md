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

## pipでインストールする

Python 3.10以上を使います。macOS・Linuxでは、作業用フォルダーで次の順に実行します。

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install splittrace
splittrace --help
```

Windowsでは「py -3 -m venv .venv」で環境を作り、PowerShellで「.venv\Scripts\Activate.ps1」を実行して有効にします。以降のpipコマンドは共通です。

最後に使い方が表示されれば、インストールしたコマンドを呼び出せています。コマンドが見つからなければ、同じターミナルで仮想環境を有効にしたか確認します。

[PyPI](https://pypi.org/project/splittrace/) · [GitHub](https://github.com/R-Koda/splittrace)

## 合成サンプルを手元で動かす

pipではサンプルファイルは作業フォルダーに配置されません。GitHubの「Code → Download ZIP」でソースを取得して展開し、そのフォルダーをターミナルの作業場所にしてから、次のコマンドを実行します。

```sh
splittrace examples/derived-samples.json examples/derived-assignments.json --policy cross_subject --lineage-complete --output pypi-audit.json --html pypi-audit.html
```

意図的に混入を入れたサンプルなので、結果はFAIL、終了コードは1になります。これは想定した検出結果です。pypi-audit.htmlをブラウザで開くと、aとbがepoch-01でつながる経路を確認できます。

出力先に同名ファイルがある場合は、別のファイル名を指定してください。自分のデータを試す前に、この合成サンプルで結果の読み方を確認します。

## できることと、確認が必要なこと

UNKNOWNは必要な情報が不足した検査です。FAILが出ても、ほかの検査がすべて完了したとは限りません。`--lineage-complete`は、親子関係を漏れなく記載したと自分で確認できる場合にだけ使います。自動的に関係を補う指定ではありません。

入力は既存の分割とメタデータです。分割の自動修正や、画像からの派生元推定は行いません。小さなmanifest向けの初期版で、大規模な本番処理のための実装ではありません。

記事の件数と出力は、Codexによる合成サンプルの実行確認に基づきます。実データでの有効性や、実利用者による検証実績を示すものではありません。

## ソースと更新を追う

[README・使い方](https://github.com/R-Koda/splittrace#readme) · [不具合の報告](https://github.com/R-Koda/splittrace/issues) · [GitHubプロフィール](https://github.com/R-Koda)

[3つのツールの紹介に戻る](/blog/python-tools-splittrace-eventscore-notebook/) · [RSSで更新を受け取る](/subscribe/)
