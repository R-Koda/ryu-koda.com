---
title: "EventScore Explorerの使い方。時系列の見逃し・誤検出を、スコアの中身から見る"
description: "EventScore Explorerをpipで導入し、正解と予測の区間をCSVから可視化。許容時間で判定が変わる合成デモと、実行方法・評価ルールを紹介します。"
pubDate: 2026-11-09T16:20:00+09:00
tags: ["Python", "つくったもの", "機械学習"]
---

評価スコアが上がったとき、予測がよくなったのか、評価ルールが変わったのか。数字だけでは見えにくい部分があります。EventScore Explorerは、時系列イベントの対応関係を見ながら、スコアの理由を確かめる道具です。

## 予測を変えず、許容時間だけを変える

公開デモの「Endpoint tolerance (seconds)」を0から0.5へ変えてみてください。正解4件・予測5件に対し、対応数は2件から3件、誤検出は3件から2件、見逃しは2件から1件になります。予測は同じでも、許容する区間の隙間が変わると判定が変わります。

[公開デモを開く](/articles/python-tools/eventscore-demo.html)

## pipでインストールする

Python 3.10以上を使います。macOS・Linuxでは、作業用フォルダーで次の順に実行します。

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install eventscore-explorer
eventscore --help
```

Windowsでは「py -3 -m venv .venv」で環境を作り、PowerShellで「.venv\Scripts\Activate.ps1」を実行して有効にします。以降のpipコマンドは共通です。

最後に使い方が表示されれば、インストールしたコマンドを呼び出せています。コマンドが見つからなければ、同じターミナルで仮想環境を有効にしたか確認します。

[PyPI](https://pypi.org/project/eventscore-explorer/) · [GitHub](https://github.com/R-Koda/eventscore-explorer)

## 合成サンプルを手元で動かす

pipではサンプルファイルは作業フォルダーに配置されません。GitHubの「Code → Download ZIP」でソースを取得して展開し、そのフォルダーをターミナルの作業場所にしてから、次のコマンドを実行します。

```sh
eventscore examples/truth.csv examples/predictions.csv --tolerances 0,0.5,1,2 --output reports/events.html --json reports/events.json
```

Report: reports/events.htmlと表示されれば生成完了です。このHTMLをブラウザで開き、許容時間を切り替えます。JSONには各設定での対応関係と件数が残ります。

出力先に同名ファイルがある場合は、別のファイル名を指定してください。自分のデータを試す前に、この合成サンプルで結果の読み方を確認します。

## できることと、確認が必要なこと

1つの正解には1つの予測だけを対応づけ、対応数が最大になる組み合わせを選びます。0秒では端点が触れるだけの区間は一致しません。許容時間は開始時刻だけではなく区間間の隙間に適用し、ラベルや記録が異なるイベントは結びません。

複数の候補があると、対応数が同じでも組み合わせや開始時刻の差は変わり得ます。特定の疾患の標準評価や、誤報回数／時間の算出は行いません。初期版の入力上限は各CSVで2,000イベントです。

記事の件数と出力は、Codexによる合成サンプルの実行確認に基づきます。実データでの有効性や、実利用者による検証実績を示すものではありません。

## ソースと更新を追う

[README・使い方](https://github.com/R-Koda/eventscore-explorer#readme) · [不具合の報告](https://github.com/R-Koda/eventscore-explorer/issues) · [GitHubプロフィール](https://github.com/R-Koda)

[3つのツールの紹介に戻る](/blog/python-tools-splittrace-eventscore-notebook/) · [RSSで更新を受け取る](/subscribe/)
