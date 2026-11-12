---
seoTitle: "Macでファイル名を一括変更する方法｜Finderの操作手順"
title: "Macのファイル名、一個ずつ変えるのだるいな……。Finderで一括変更してみた"
description: "MacのFinderでファイル名を一括変更。画像3枚を実際に操作したスクリーンショットと、練習用ファイル、再現手順を紹介します。"
heroImage: "../../../public/articles/mac-finder-batch-rename/cover-sketch-v2.webp"
updatedDate: 2026-11-05
pubDate: 2026-07-30T09:00:00+09:00
tags: ["Mac", "ファイル整理", "小さな工夫"]
---

<p class="voice">ファイルを選んで、名前を直して、次のファイルへ。これ、何回もやるのはだるいな……。</p>


<p>同じ部分を変えたいだけなら、まとめてできそう。調べてみると、MacのFinderにそのまま使える名称変更の機能がありました。追加のアプリは要らないらしい。</p>


<p>ということで、今回は画像を3枚用意して試してみます。<strong>「IMG_」を「desk_」に変えて、後ろの番号は残す</strong>。まずは、それだけやってみることにしました。</p>


<p class="proof">検証：2026年11月4日・macOS 26.5のFinder。記事用のサンプル画像3枚で実際に操作しました。ふだん使っている写真は変更していません。</p>




## 1．練習用の3枚を、Finderで開く

[練習用ZIPをダウンロード](/articles/mac-finder-batch-rename/rename-practice.zip)します。この記事はMacのFinderで進めます。ターミナルや追加アプリは使いません。

**操作：** ダウンロードした `rename-practice.zip` をダブルクリックし、展開されたフォルダーを開きます。ブラウザが自動で展開した場合は、そのフォルダーを開くだけで大丈夫です。

**確認：** `IMG_001.jpg`、`IMG_002.jpg`、`IMG_003.jpg` の3枚が見えれば準備完了。ZIPの中を眺めるだけではなく、展開したファイルを操作します。

自分の写真で試すのは、この3枚で成功してから。まずコピーを別のフォルダーへ置き、元の写真は残しておきます。


<p>用意したのは、こんなファイルです。中身は練習用のサンプル画像で、机を撮影した写真ではありません。今回は名前の変わり方だけを見ます。</p>

<figure><a href="/articles/mac-finder-batch-rename/finder-before-detail.jpg" target="_blank"><img width="930" height="180" decoding="async" src="/articles/mac-finder-batch-rename/finder-before-detail.jpg" alt="FinderにIMG_001.jpg、IMG_002.jpg、IMG_003.jpgが並ぶ変更前の画面" loading="lazy"></a><figcaption>変更前。3枚とも「IMG_」で始まっています。実際のFinder画面から一覧部分を切り出しました。</figcaption></figure>


<p><code>IMG_001.jpg</code> が <code>desk_001.jpg</code> になれば成功。画像を開き直したり、番号を付け直したりはせずに済ませたいところです。</p>




## 2．3枚を選んで、置き換える文字を入力する


<p>1枚目をクリックし、Commandキーを押しながら残りの2枚をクリックします。3枚とも選択色になったら、画面上部の「ファイル」から「名称変更…」を開きます。すると、ファイル名をその場で打ち直すのではなく、まとめて変更するための小さな画面が出てきました。</p>


<p>今回は「テキストを置き換える」を使います。検索文字列には <code>IMG_</code>、置換文字列には <code>desk_</code> を入力しました。</p>

<figure><a href="/articles/mac-finder-batch-rename/finder-settings-detail.jpg" target="_blank"><img width="489" height="132" decoding="async" src="/articles/mac-finder-batch-rename/finder-settings-detail.jpg" alt="検索文字列IMG_、置換文字列desk_、例desk_001.jpgと表示されたFinderの名称変更画面" loading="lazy"></a><figcaption>入力したのはこの2か所。左下の「例」が desk_001.jpg になりました。</figcaption></figure>


<p>ここで確認できたのは、<strong>変更後の例が1件表示される</strong>こと。3件すべての一覧が出るわけではありません。今回のように共通部分だけを変えるなら分かりやすいですが、名前がバラバラなファイルで試すときは、実行後も一通り見たいところです。</p>




## 3．変更を実行して、名前と中身を確認する


<p>「名称変更」を押して、Finderへ戻ります。結果はこちら。</p>

<figure><a href="/articles/mac-finder-batch-rename/finder-after-detail.jpg" target="_blank"><img width="930" height="180" decoding="async" src="/articles/mac-finder-batch-rename/finder-after-detail.jpg" alt="desk_001.jpg、desk_002.jpg、desk_003.jpgへ変わったFinderの実画面" loading="lazy"></a><figcaption>変更後。「IMG_」だけが「desk_」に変わり、001〜003と拡張子は残っています。</figcaption></figure>


<p>3枚とも狙いどおり。ファイルの中身も変更前後で照合したところ一致していました。今回は、画像を書き換えずに名前だけを変えられています。</p>


<p>試した範囲では「3枚に同じ変更を入れる」操作を一度にできました。何百枚も試したわけではないので、大量のファイルでの結果や、何分短縮できるかまでは分かりません。</p>




## 自分のファイルに使う前に、できることを整理する


<p>今回よかったのは、特別な命名ルールを覚えなくても「この文字を、こっちの文字へ」で済んだことです。逆に、写真の内容を見て「キーボード」「マウス」と名前を考えてくれるわけではありません。</p>


<p>同じ部分を繰り返し直したいときには、これで十分な場面がありそう。まずはコピーした数枚で試して、置き換えたい部分がちゃんと共通しているか確認するのがよさそうです。</p>


<p>ファイル整理、全部きれいにしようとすると腰が重くなるので。今日は同じ名前を3回打ち直さずに済んだ、くらいで。</p>


<p><a href="/articles/mac-finder-batch-rename/rename-practice.zip">同じ名前の練習用画像3枚をダウンロード</a>。展開したコピーで試せます。</p>


<p class="source">参考：<a href="https://support.apple.com/ja-jp/guide/mac-help/mchlp1144/27/mac/27">Apple「Macでファイル、フォルダ、およびディスクの名前を変更する」</a>。本文の画面・結果は今回の実機操作に基づきます。</p>



## うまくいかないときは、ここへ戻る

- **1枚しか変えられない：** 名称変更画面を閉じ、3枚が選択されているか確認します。Command＋Aは、そのフォルダーに対象の3枚しかないときだけ使います。
- **例が変わらない：** `IMG_` と `IMG-` は別です。半角のアンダースコアまで合わせます。すでに `desk_` に変えたファイルには、同じ置換は起きません。
- **拡張子が見えない：** Finderの表示設定で隠れている場合があります。拡張子を手入力で追加するのではなく、ファイルを選んで「ファイル」→「情報を見る」の「名前と拡張子」で確認します。
- **写真が開けない：** そのまま次の作業へ進まず、練習用ZIPを別の場所へ展開してやり直します。まずは元のファイルが開けるか切り分けます。

**完成の目印：** 3枚が `desk_001.jpg`〜`desk_003.jpg` になり、ダブルクリックして画像が開けばOKです。この記事の検証では中身も照合しましたが、読者の練習では名前と表示をまず確かめてください。

ほかの資料やコードから参照しているファイルは、名前を変えると参照先の修正も必要です。自分のファイルへ広げるときは、独立したコピーで同じ操作を試します。

同じファイルが何枚もあるのも気になったら、[重複ファイルを削除せずに探す手順](/blog/find-duplicate-files-python/)も置いています。
