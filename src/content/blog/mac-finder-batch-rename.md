---
title: "ファイル名、一個ずつ変えるのだるいな……。Macでまとめて変えてみた"
description: "MacのFinderでファイル名を一括変更。画像3枚を実際に操作したスクリーンショットと、練習用ファイル、再現手順を紹介します。"
pubDate: 2026-11-04T22:00:00+09:00
tags: ["Mac", "ファイル整理", "小さな工夫"]
---

<p class="voice">ファイルを選んで、名前を直して、次のファイルへ。これ、何回もやるのはだるいな……。</p>


<p>同じ部分を変えたいだけなら、まとめてできそう。調べてみると、MacのFinderにそのまま使える名称変更の機能がありました。追加のアプリは要らないらしい。</p>


<p>ということで、今回は画像を3枚用意して試してみます。<strong>「IMG_」を「desk_」に変えて、後ろの番号は残す</strong>。まずは、それだけやってみることにしました。</p>


<p class="proof">検証：2026年11月4日・macOS 26.5のFinder。記事用のサンプル画像3枚で実際に操作しました。ふだん使っている写真は変更していません。</p>




## まずは3枚。名前だけ変わればOK


<p>用意したのは、こんなファイルです。中身は練習用のサンプル画像で、机を撮影した写真ではありません。今回は名前の変わり方だけを見ます。</p>

<figure><a href="/articles/mac-finder-batch-rename/finder-before-detail.jpg" target="_blank"><img src="/articles/mac-finder-batch-rename/finder-before-detail.jpg" alt="FinderにIMG_001.jpg、IMG_002.jpg、IMG_003.jpgが並ぶ変更前の画面" loading="lazy"></a><figcaption>変更前。3枚とも「IMG_」で始まっています。実際のFinder画面から一覧部分を切り出しました。</figcaption></figure>


<p><code>IMG_001.jpg</code> が <code>desk_001.jpg</code> になれば成功。画像を開き直したり、番号を付け直したりはせずに済ませたいところです。</p>




## 3枚まとめて選ぶと、いつもの名称変更が少し違う


<p>Finderで3枚を選択し、画面上部の「ファイル」から「名称変更…」を開きます。すると、ファイル名をその場で打ち直すのではなく、まとめて変更するための小さな画面が出てきました。</p>


<p>今回は「テキストを置き換える」を使います。検索文字列には <code>IMG_</code>、置換文字列には <code>desk_</code> を入力しました。</p>

<figure><a href="/articles/mac-finder-batch-rename/finder-settings-detail.jpg" target="_blank"><img src="/articles/mac-finder-batch-rename/finder-settings-detail.jpg" alt="検索文字列IMG_、置換文字列desk_、例desk_001.jpgと表示されたFinderの名称変更画面" loading="lazy"></a><figcaption>入力したのはこの2か所。左下の「例」が desk_001.jpg になりました。</figcaption></figure>


<p>ここで確認できたのは、<strong>変更後の例が1件表示される</strong>こと。3件すべての一覧が出るわけではありません。今回のように共通部分だけを変えるなら分かりやすいですが、名前がバラバラなファイルで試すときは、実行後も一通り見たいところです。</p>




## 押してみた。ちゃんと番号が残っている


<p>「名称変更」を押して、Finderへ戻ります。結果はこちら。</p>

<figure><a href="/articles/mac-finder-batch-rename/finder-after-detail.jpg" target="_blank"><img src="/articles/mac-finder-batch-rename/finder-after-detail.jpg" alt="desk_001.jpg、desk_002.jpg、desk_003.jpgへ変わったFinderの実画面" loading="lazy"></a><figcaption>変更後。「IMG_」だけが「desk_」に変わり、001〜003と拡張子は残っています。</figcaption></figure>


<p>3枚とも狙いどおり。ファイルの中身も変更前後で照合したところ一致していました。今回は、画像を書き換えずに名前だけを変えられています。</p>


<p>試した範囲では「3枚に同じ変更を入れる」操作を一度にできました。何百枚も試したわけではないので、大量のファイルでの結果や、何分短縮できるかまでは分かりません。</p>




## 凝った整理ルールを作らなくても、これだけで使えそう


<p>今回よかったのは、特別な命名ルールを覚えなくても「この文字を、こっちの文字へ」で済んだことです。逆に、写真の内容を見て「キーボード」「マウス」と名前を考えてくれるわけではありません。</p>


<p>同じ部分を繰り返し直したいときには、これで十分な場面がありそう。まずはコピーした数枚で試して、置き換えたい部分がちゃんと共通しているか確認するのがよさそうです。</p>


<p>ファイル整理、全部きれいにしようとすると腰が重くなるので。今日は同じ名前を3回打ち直さずに済んだ、くらいで。</p>


<p><a href="/articles/mac-finder-batch-rename/rename-practice.zip">同じ名前の練習用画像3枚をダウンロード</a>。展開したコピーで試せます。</p>


<p class="source">参考：<a href="https://support.apple.com/ja-jp/guide/mac-help/mchlp1144/27/mac/27">Apple「Macでファイル、フォルダ、およびディスクの名前を変更する」</a>。本文の画面・結果は今回の実機操作に基づきます。</p>



## 同じことを試すときの手順だけ、もう一度


<ol><li>練習用ZIPをダウンロードして展開します。自分の写真で試す場合はコピーを用意します。</li><li>Finderで対象フォルダーを開き、今回の3枚だけを選択。全選択はそのフォルダーに対象しかないときに使います。</li><li>「ファイル」→「名称変更…」→「テキストを置き換える」。</li><li>検索文字列 <code>IMG_</code>、置換文字列 <code>desk_</code> を入力。</li><li>例が <code>desk_001.jpg</code> になることを確認して「名称変更」。</li><li>3枚とも <code>desk_001.jpg</code>〜<code>desk_003.jpg</code> になり、拡張子が残っているか確認。画像を開けることも確認します。</li></ol>


<p><strong>名前が変わらない場合：</strong><code>IMG_</code> と <code>IMG-</code> は別の文字列です。検索欄は実際の名前と合わせてください。ほかの資料やコードから参照しているファイルは、名前を変えると参照先も直す必要があるため、まず独立したコピーで試します。</p>
