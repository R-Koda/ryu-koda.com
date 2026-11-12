---
seoTitle: "HTML・CSSでホバーアニメーションを作る｜飛び出す引き出し"
title: "HTMLとCSSで、引き出しから自分が飛び出す仕掛けを作ってみた"
description: "アバターが飛び出す引き出しをHTMLとCSSで作る方法。動くサンプル、全コード、導入手順と調整方法を紹介します。"
heroImage: "../../../public/articles/css-popout-drawer/cover-sketch-v2.webp"
updatedDate: 2026-11-05
pubDate: 2026-07-23T09:00:00+09:00
tags: ["Web制作", "CSS", "つくったもの"]
---

<p class="voice">白い背景は好き。でも、ちょっとおとなしいな……。</p>


<p>「りゅうのらぼ」のホームを作るとき、そんなところから見た目を調整していきました。きれいに並んでいるだけより、おもちゃ箱みたいに、触ると何か起きる場所にしたい。</p>


<p>そこで引き出し型のリンクに、アバターが出てくる仕掛けを入れています。今回は公開中のページを実際に操作しながら、どう見えるか確かめてみました。</p>




## 閉じているときは、普通に読める入口に


<p>普段はこんな見た目です。プロフィール、おしごと、ブログ、SNS、日記。どこへ行くかは、何もしなくても読めます。</p>

<figure><a href="/articles/css-popout-drawer/drawer-before-detail.jpg" target="_blank"><img width="380" height="585" decoding="async" src="/articles/css-popout-drawer/drawer-before-detail.jpg" alt="アバターが隠れている通常時の5つの引き出し" loading="lazy"></a><figcaption>通常時の実画面。動く部分だけでなく、行き先のラベルも残しています。</figcaption></figure>


<p>引き出しは、ページへ移動するためのリンクです。飛び出す演出が分からなくても、押したら目的のページへ行ける。その土台に、少しだけ遊びを足しています。</p>




## 触れると、箱がずれて顔が出る


<p>「ブログ」の引き出しにフォーカスを移してみると、枠が少しずれ、その上からアバターと紙が出てきました。</p>

<figure><a href="/articles/css-popout-drawer/drawer-blog-detail.jpg" target="_blank"><img width="380" height="585" decoding="async" src="/articles/css-popout-drawer/drawer-blog-detail.jpg" alt="ブログの引き出しからGitHubの顔画像を使ったアバターと紙が出た状態" loading="lazy"></a><figcaption>今回はキーボードのTabキーで操作して撮影。青い枠はフォーカスの表示です。カーソルを重ねる場合も同じ表示切り替えを使っています。</figcaption></figure>


<p>顔はGitHubのプロフィール画像。体と腕は別の小さなパーツです。全部を一枚の絵にして動かすのではなく、顔・体・小物を組み合わせています。</p>


<p>最初に引き出しが動いて、その少しあとに顔が出る。ぴったり同時に動くよりも、ひょこっと反応した感じにしたかった部分です。</p>




## 中身を見てみると、意外と地味な仕組み


<p>立体の箱を用意しているわけではありません。実装を確認すると、引き出しの位置を左へ9px、下へ3pxずらし、影の位置も変えています。</p>


<p>アバターは、普段は下へ隠しておいて、反応すると上へ移動させる仕組み。出てくるときの動き方を少し弾むように調整しています。</p>


<p>コードの量を見せるより、まずは画面で「何が違うか」を見たほうが伝わりそうだったので、今回の写真は同じページの通常時と反応した状態にしました。</p>




## 別の引き出しも見てみた


<p>続いて「おしごと」へフォーカスを戻すと、紙の代わりにパソコンが出てきます。</p>

<figure><a href="/articles/css-popout-drawer/drawer-work.jpg" target="_blank"><img width="1280" height="720" decoding="async" src="/articles/css-popout-drawer/drawer-work.jpg" alt="おしごとの引き出しにフォーカスを当てたホームの実画面" loading="lazy"></a><figcaption>おしごとの実画面。アバターの横にパソコンが現れます。こちらもキーボード操作で確認しました。</figcaption></figure>


<p>実装上は、プロフィールでは手を振り、日記では鉛筆が書くように動く、といった違いも付けています。今回写真にしたのは、おしごととブログの2種類です。</p>




## 動けばいい、というわけでもなさそう


<p>画面を確認していて、アバターは引き出しの上側へ出るので、ひとつ上の引き出しに重なることも分かります。遊びを足した分だけ、文字の読みやすさも見ておきたいところです。</p>


<p>また、スマートフォンにはマウスのカーソルがありません。動きを見せることだけを前提にせず、普段からラベルを読めるようにしています。今回の検証はPC上のキーボード操作で、スマートフォンでのタップ操作を実機検証した記録ではありません。</p>


<p>ちょっとした仕掛けですが、「ここ、触ると何か出るんだ」と気付いてもらえると楽しそう。そんな寄り道を、少しずつ増やしていければと思います。</p>


<p><a href="https://ryu-koda.com/">実際の「らぼのひきだし」を開く</a></p>


<p class="source">確認日：2026年11月4日。スクリーンショットは公開サイトを実際に操作して撮影。仕組みは<a href="https://github.com/R-Koda/ryu-koda.com/blob/f147a64/src/pages/index.astro">ホームのコード</a>と<a href="https://github.com/R-Koda/ryu-koda.com/blob/f147a64/src/components/DrawerAvatar.astro">アバターのコード</a>で照合しました。</p>



## 同じものを作るなら、まずこの1ファイルで試してみる


<p>ここからは自分のサイトに入れてみたい方向けです。まずは本番の仕掛けを小さくしたサンプルを作りました。必要なのはテキストエディタとブラウザだけ。Node.jsやライブラリのインストールは不要です。</p>


<p><a href="/articles/css-popout-drawer/demo/index.html" target="_blank">動くサンプルを開く</a> ／ <a href="/articles/css-popout-drawer/drawer-demo.zip" download>HTMLをZIPでダウンロード</a></p>


<p>本番は「押すと移動するリンク」ですが、このサンプルはスマートフォンでも動きを試せるように、「押すと開く引き出し」と「中にあるリンク」に分けています。顔は配布しやすい絵文字です。</p>


## ダウンロードから、最初の動作確認まで

ここではMacで進めます。まず上のZIPをダウンロードしてダブルクリック。展開された `index.html` を右クリックし、「このアプリケーションで開く」からSafariやChromeを選びます。

**表示の目印：** 「引き出しを、ひとつ作ってみる。」と黄色い箱が出れば、ファイルを開けています。ネット上へアップロードする必要はありません。

1. **箱にカーソルを重ねる →** 絵文字の顔が出ます。
2. **箱をクリックする →** 中に「記事の置き場所へ進む」というリンクが現れます。
3. **そのリンクを押す →** ページ内の「記事の置き場所」へ移動します。短い画面では移動量が小さいこともあります。URLの末尾が `#destination` になれば行き先を確認できます。
4. **箱をもう一度押す →** 中のリンクが隠れます。カーソルやキーボードのフォーカスが箱に残っている間、顔は出たままです。

キーボードでも、Tabキーで箱に枠が付き、Enterで中のリンクが開閉するか確かめてください。ブラウザやOS側のTab移動設定によっては、先にキーボードナビゲーションの有効化が必要です。




<figure><img width="1280" height="720" decoding="async" src="/articles/css-popout-drawer/drawer-demo-open.jpg" alt="配布用HTMLを実際にブラウザで開き、引き出しを開いた画面"><figcaption>配布コードそのものをブラウザで実行。クリックで開き、Enterで閉じることを確認しました。</figcaption></figure>



## そのまま動くHTML・CSS


<p>ZIPに入っているHTMLと同じ全コードです。先に上の手順で動かしてから、気になる部分を読めば大丈夫です。</p>





```html
<!doctype html>
<html lang="ja">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>飛び出す引き出し・最小サンプル</title>
<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 32px 20px; color: #303d48; background: #fff;
  font-family: system-ui, sans-serif; line-height: 1.8; }
main { max-width: 540px; margin: auto; }
h1 { font-size: 26px; }
.cabinet { padding: 85px 24px 24px; background: #eee9df;
  border: 2px solid #303d48; border-radius: 16px; }
.drawer { --color: #fff0b8; position: relative; }
.drawer summary { position: relative; padding: 24px; list-style: none;
  border: 2px solid #303d48; border-radius: 8px; background: var(--color);
  box-shadow: 0 5px 0 #303d48; cursor: pointer;
  transition: transform .2s, box-shadow .2s; }
.drawer summary::-webkit-details-marker { display: none; }
.drawer summary::after { content: '▰'; float: right; }
.drawer summary:focus-visible { outline: 3px solid #315f91; outline-offset: 5px; }
/* 上側は空ける。隠すのはキャラクター用の窓だけ。 */
.window { position: absolute; right: 18px; top: -72px; width: 84px;
  height: 72px; overflow: hidden; pointer-events: none; }
.avatar { display: block; font-size: 54px; text-align: center;
  transform: translateY(80px); opacity: 0;
  transition: transform .5s .1s cubic-bezier(.2,1.5,.4,1), opacity .2s; }
.drawer:is(:hover, :focus-within, [open]) summary {
  transform: translate(-6px, 2px); box-shadow: 6px 7px 0 #303d48; }
.drawer:is(:hover, :focus-within, [open]) .avatar {
  transform: translateY(0); opacity: 1; }
.contents { margin-top: 18px; padding: 16px; background: #fff;
  border-radius: 8px; }
a { color: #245b89; }
#destination { margin-top: 36px; padding: 20px; background: #eef5ef; }
@media (prefers-reduced-motion: reduce) {
  .drawer summary, .avatar { transition: none; }
}
</style>
<main>
  <h1>引き出しを、ひとつ作ってみる。</h1>
  <p>カーソルを重ねると顔が出ます。クリック・タップ・Enterで開閉できます。</p>
  <div class="cabinet">
    <details class="drawer">
      <summary>
        <span class="window" aria-hidden="true"><span class="avatar">🙂</span></span>
        ブログのひきだし
      </summary>
      <div class="contents"><a href="#destination">記事の置き場所へ進む →</a></div>
    </details>
  </div>
  <section id="destination"><h2>記事の置き場所</h2><p>ここまで移動できれば、リンクも動いています。</p></section>
</main>
</html>
```





## 自分のサイト用に変えるのは、まず3か所


<p>編集にはVS Codeなどのコードエディタを使います。<code>index.html</code> をエディタへドラッグし、Command＋Fで下の文字を探して置き換え、Command＋Sで保存。ブラウザへ戻ってCommand＋Rで再読み込みします。以下の変更は1か所ずつ行います。</p>

<ul><li><strong>名前：</strong><code>ブログのひきだし</code> を表示したい言葉へ。</li><li><strong>行き先：</strong><code>href="#destination"</code> を自分のブログURLへ。確認用の <code>section id="destination"</code> は、その後削除して構いません。</li><li><strong>色：</strong><code>--color: #fff0b8</code> を好みの色へ。文字とのコントラストも確認してください。</li></ul>


<p><strong>確認：</strong>名前を変えたら箱の文字、色を変えたら箱の背景、URLを変えたら中のリンクの行き先を確認します。文字が変わらない場合は、編集したファイルとブラウザで開いたファイルの場所を見比べてください。ファイル名が <code>index.html.txt</code> になっていたら、HTMLとして保存し直します。</p>

<p>ここまでできたら完成です。以下は追加のアレンジ。自分のアバターにしたいときは、HTMLと同じフォルダーへ <code>avatar.png</code> を置き、絵文字の <code>span</code> を次の画像に置き換えます。</p>





```html
<img class="avatar" src="avatar.png" alt="" width="64" height="64">
```



<p>CSSには <code>.avatar { width: 64px; height: 64px; object-fit: cover; margin: 4px auto; }</code> を追加します。画像は装飾なので、この例では空のaltにしています。名前やリンク先は画像の外に文字で残します。</p>




## なぜ動く？ ここだけ分かれば調整できる


<p><code>translateY(80px)</code> で顔を窓の下へ隠し、反応したら <code>translateY(0)</code> へ戻しています。<code>transition</code> は、その移動を一瞬ではなく時間をかけて見せる設定です。</p>


<p><code>:hover</code> はカーソル、<code>:focus-within</code> はキーボード操作、<code>[open]</code> は開いた状態への対応。<code>details</code> と <code>summary</code> の標準機能を使うため、開閉用のJavaScriptはありません。</p>


<p>動きを減らす設定では <code>transition: none</code> にしています。開閉できることはそのままで、移動アニメーションを省きます。</p>




## 表示がおかしいときに見るところ


<ul><li><strong>顔が出ない：</strong>引き出しや外側の箱に <code>overflow: hidden</code> を付けていないか確認。隠すのは <code>.window</code> の中だけです。</li><li><strong>画像だけ出ない：</strong><code>avatar.png</code> の名前・拡張子・保存場所が合っているか確認。</li><li><strong>リンク先へ進めない：</strong>このサンプルは一度開いてから、中のリンクを押します。summaryは移動ボタンではありません。</li><li><strong>別の引き出しの文字に重なる：</strong>複数並べる場合は上に顔が出る分の余白を取ります。まず <code>margin-top: 85px</code> を目安に調整してください。</li></ul>


<p><strong>完成の確認：</strong>顔が出る／クリックやEnterで開閉する／中のリンクで移動する。この3つを自分の環境でも確認できたら、最初のひとつは完成です。</p>

開閉に使った要素の仕様は、[MDNのdetails要素の解説](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Elements/details)でも確認できます。


<p class="note">角丸を付けたら、飛び出す飾りまで切れてしまった場合は、<a href="/blog/css-overflow-popout/">overflow: hiddenを分けて角丸と飛び出しを両立する方法</a>も試してみてください。修正前後の比較デモと完成HTMLがあります。</p>
