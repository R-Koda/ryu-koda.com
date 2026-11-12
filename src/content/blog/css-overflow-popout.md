---
title: "角丸カードのアイコンが切れる。overflow: hiddenを分けたら、外に出せた。"
seoTitle: "overflow: hiddenで子要素が切れるときの対処｜角丸を残してはみ出すCSS"
description: "角丸カードのアイコンが切れる原因と直し方を、動くデモで比較。z-indexで直らない理由、内側の箱だけ切り抜くHTML・CSS、保存して試せる完成コードを紹介します。"
pubDate: 2026-08-27T09:00:00+09:00
heroImage: "../../../public/articles/css-overflow-popout/cover.webp"
tags: ["Web制作", "CSS", "実践"]
---

<p>カードの端から、顔がひょこっと出てくる。そんな小さな仕掛けを入れたいのに、顔の上半分だけが見えない。角丸はきれいになったけれど、そこまで切らなくても……。</p>
<p class="summary"><strong>直すポイントは、箱を2つに分けること。</strong><br>角丸に沿って切り抜くのは「中身の箱」。飛び出す飾りは、その外側に置きます。この記事では、同じ形のカードで修正前・修正後を比べ、手元で動くHTMLも用意しました。</p>
<p>対象は、HTMLとCSSで角丸カードを作っていて、ホバー時のアイコンや装飾が途中で切れる人。JavaScriptやライブラリは使いません。</p>
<nav class="step-nav" aria-label="この記事の目次"><a href="#demo">動かして比べる</a> → <a href="#fix">直し方</a> → <a href="#try">手元で試す</a> → <a href="#trouble">まだ切れるとき</a></nav>
<figure><img src="/articles/css-overflow-popout/comparison.webp" loading="lazy" decoding="async" width="1512" height="580" alt="Chromeでの比較。左はz-indexを999999にしても顔が切れ、右は中身だけ切り抜くことで顔全体が見える"><figcaption>説明用サンプルの実画面。左は顔の上部が切れ、右は角丸を保ったまま外に出ています。</figcaption></figure><h2 id="demo">まず、切れるところを見てみる</h2>
<p>今回の説明用に、顔が上へ44px動くサンプルを作りました。最初は飛び出した状態にしています。チェックを外してカーソルを合わせると、動きも比べられます。</p>
<iframe class="overflow-comparison" src="/articles/css-overflow-popout/demo.html" title="overflow hiddenによる切り抜きの修正前後を比べる操作可能なデモ" loading="lazy"></iframe>
<p><a href="/articles/css-overflow-popout/demo.html" target="_blank" rel="noopener">デモを大きく開く</a></p>
<p>「修正前のz-indexを999999にする」にもチェックを入れてみてください。重なり順を大きくしても、顔は途中で切れたままです。</p>
<h2>z-indexを上げても直らないのは、なぜ？</h2>
<p><code>z-index</code>は、要素の重なり順を調整するもの。一方、<code>overflow: hidden</code>は、箱からはみ出した内容を隠す指定です。今回のカードでは、前に出す順番を変えても、切り抜かれる範囲は変わりません。</p>
<p>このサンプルは、<code>position: relative</code>を付けたカードの中に、<code>position: absolute</code>の顔を配置しています。カードを基準に顔が動くので、そのカードに指定した切り抜きの影響を受けます。</p>
<p>仕様上も、<code>hidden</code>ははみ出した内容をクリップする指定です。細かい動作は<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow">MDNのoverflowリファレンス</a>で確認できます。</p>
<h2 id="fix">直すのは、切り抜く箱と顔の置き場所</h2>
<p class="note">ここからのコードは変更箇所です。最初から作る場合は、下の<a href="#try">完成版HTML</a>を保存すると、サイズや色の指定も含めて動かせます。</p><h3>1．外側の箱からoverflow: hiddenを外す</h3>
<p>カード全体の指定を、次のように変えます。<code>position: relative</code>は顔の配置の基準なので残します。</p><pre><code>.card {
  position: relative;
  overflow: visible; /* 外にはみ出すことを許可 */
}</code></pre>
<p>ただし、これだけだと中身の画像や背景も角からはみ出すことがあります。そこで、中身専用の箱を作ります。</p>
<h3>2．中身だけを、新しい箱で包む</h3>
<p>背景・画像・本文を<code>card-face</code>でまとめます。顔の<code>mascot</code>は、その箱の<strong>中ではなく、隣</strong>です。この位置がいちばん大事です。</p><pre><code>&lt;div class=&quot;card&quot;&gt;
  &lt;div class=&quot;card-face&quot;&gt;
    &lt;div class=&quot;banner&quot; aria-hidden=&quot;true&quot;&gt;&lt;/div&gt;
    &lt;div class=&quot;copy&quot;&gt;カードの本文&lt;/div&gt;
  &lt;/div&gt;
  &lt;span class=&quot;mascot&quot; aria-hidden=&quot;true&quot;&gt;•ᴗ•&lt;/span&gt;
&lt;/div&gt;</code></pre><pre><code>.card-face {
  border-radius: 24px;
  overflow: hidden; /* 角丸に沿って切り抜くのは中身だけ */
}</code></pre>
<p>これで「中身の角は丸い」「顔は外に出られる」を同時に満たせます。<code>mascot</code>を<code>card-face</code>の中に戻すと、また顔が切れます。</p>
<h3>3．顔に、動く距離を指定する</h3><pre><code>.mascot {
  position: absolute;
  right: 24px;
  top: 12px;
  z-index: 1;
  pointer-events: none;
  transition: transform .35s ease;
}
.card:hover .mascot,
.card:focus-within .mascot {
  transform: translateY(-44px) rotate(-8deg);
}
@media (prefers-reduced-motion: reduce) {
  .mascot { transition: none; }
}</code></pre>
<p><code>translateY(-44px)</code>で上へ44px、<code>rotate(-8deg)</code>で少し傾けています。<code>pointer-events: none</code>は、飾りがカーソル操作を遮らないための指定。クリックさせたいボタン自体には付けません。</p>
<p><code>:focus-within</code>も指定すると、カード内のリンクをTabキーで選んだときにも顔が出ます。動きを減らす設定をしている環境では、アニメーションせず表示位置が切り替わります。</p>
<h2 id="try">ダウンロードして、自分のブラウザで動かす</h2>
<p>断片をつなぐのが面倒なときは、完成版を使ってください。必要なHTMLとCSSを1ファイルにまとめています。外部画像やパッケージのインストールは不要です。</p>
<p><a class="button" href="/articles/css-overflow-popout/example.html" download>完成版HTMLを保存する</a> <a href="/articles/css-overflow-popout/example.zip" download>ZIPで保存する</a></p>
<ol><li><strong>ファイルを保存する。</strong>ZIPの場合は展開し、中の<code>example.html</code>を開きます。</li><li><strong>ブラウザで開く。</strong>ファイルをダブルクリックします。エディターが開く場合は、右クリックの「このアプリケーションで開く」などからブラウザを選びます。</li><li><strong>カードにカーソルを合わせる。</strong>顔が上に出て、縞模様の上の角が丸いままなら成功です。キーボードではTabキーで「結果を見る」を選んでも動きます。</li><li><strong>数字を変えてみる。</strong>VS Codeなどのコードエディターで<code>example.html</code>を開き、<code>-44px</code>を<code>-60px</code>に変更し、保存。ブラウザを再読み込みすると、さらに16px上に出ます。</li></ol>
<p>スマホなどカーソルのない環境では、この記事の比較デモのチェックボックスを使ってください。配布する最小HTMLはホバーとキーボードフォーカスの例です。</p>
<details><summary>完成版のコードをすべて見る</summary><pre><code>&lt;!doctype html&gt;
&lt;html lang=&quot;ja&quot;&gt;
&lt;meta charset=&quot;utf-8&quot;&gt;
&lt;meta name=&quot;viewport&quot; content=&quot;width=device-width,initial-scale=1&quot;&gt;
&lt;title&gt;角丸と飛び出す飾りを両立する&lt;/title&gt;
&lt;style&gt;
* { box-sizing: border-box; }
body { margin: 0; padding: 80px 24px; font-family: sans-serif; color: #293b36; }
.card { position: relative; max-width: 320px; margin: auto; overflow: visible; }
.card-face { border-radius: 24px; overflow: hidden; background: #f7f4eb; }
.banner { height: 100px; background: repeating-linear-gradient(135deg,#e0eee7 0 18px,#c6dfd1 18px 36px); }
.copy { padding: 24px; }
.copy h1 { font-size: 22px; }
.mascot { position: absolute; right: 24px; top: 12px; z-index: 1; width: 64px; height: 64px; display: grid; place-items: center; border: 2px solid #293b36; border-radius: 50%; background: #ffe49c; font-size: 28px; pointer-events: none; transition: transform .35s ease; }
.card:hover .mascot, .card:focus-within .mascot { transform: translateY(-44px) rotate(-8deg); }
a { color: #23644e; }
a:focus-visible { outline: 3px solid #23644e; outline-offset: 4px; }
@media (prefers-reduced-motion: reduce) { .mascot { transition: none; } }
&lt;/style&gt;
&lt;div class=&quot;card&quot;&gt;
  &lt;div class=&quot;card-face&quot;&gt;
    &lt;div class=&quot;banner&quot; aria-hidden=&quot;true&quot;&gt;&lt;/div&gt;
    &lt;div class=&quot;copy&quot;&gt;
      &lt;h1&gt;小さな実験&lt;/h1&gt;
      &lt;p&gt;カードにカーソルを合わせるか、リンクを選択すると顔が飛び出します。&lt;/p&gt;
      &lt;a href=&quot;#result&quot;&gt;結果を見る&lt;/a&gt;
    &lt;/div&gt;
  &lt;/div&gt;
  &lt;!-- 切り抜く箱の外側に、飾りを置く --&gt;
  &lt;span class=&quot;mascot&quot; aria-hidden=&quot;true&quot;&gt;•ᴗ•&lt;/span&gt;
&lt;/div&gt;
&lt;p id=&quot;result&quot;&gt;上の角丸を保ったまま、顔が外に出れば成功です。&lt;/p&gt;
&lt;/html&gt;</code></pre></details>
<h2 id="trouble">まだ切れるときは、もう1つ外側を見る</h2>
<p>Chromeなら、カードの本文を右クリックして「検証」を開きます。飾りの顔はクリックを通す指定なので、本文からたどるのが確実です。「Elements」で親の要素を順番に選び、「Computed」で<code>overflow</code>を検索すると、どの箱が切り抜いているかを追えます。「Styles」で該当する指定を一時的にオフにして、顔全体が見えるか確認します。変更は再読み込みで戻るので、原因が分かったら元のCSSを編集してください。</p><p>顔の置き場所を直しても、ページ全体の別の箱が切り抜いていることがあります。やみくもに<code>z-index</code>を増やす前に、次を確認します。</p>
<ul><li><strong>顔がcard-faceの中に残っていないか。</strong>閉じタグの位置まで確認します。</li><li><strong>さらに外側にoverflow: hiddenやclipがないか。</strong>カード一覧の親なども対象です。必要な指定まで一括削除せず、切り抜きが必要な中身にだけ付ける構造を検討します。</li><li><strong>clip-pathやmaskで切り抜いていないか。</strong>overflowとは別の指定なので、同じ修正だけで直るとは限りません。</li><li><strong>全部見えるけれど、隣のカードの裏に入る場合。</strong>これは切り抜きではなく重なり順の問題かもしれません。外側のカード同士の重なりも確認します。</li></ul>
<p class="note">飛び出せるようになっても、周囲の余白は自動では増えません。上の見出しや隣のボタンに重ならないよう、カード上部の余白も確保してください。</p>
<h2>角丸と遊び心、どちらも残せる</h2>
<p>今回変えたのは、動きの派手さではなく、箱の役割でした。外側は位置を決める。内側は角丸に切り抜く。顔は、その外で動く。</p>
<p>自分のカードに取り入れるなら、まずは顔ひとつで試すと分かりやすいです。うまく出せたら、距離や傾きを少しずつ変えて、自分のサイトに合う動きにしてみてください。</p>
<p>もう少し遊びたいときは、<a href="https://ryu-koda.com/blog/css-popout-drawer/">引き出しから飛び出す演出の作り方</a>へ。<a href="https://ryu-koda.com/playground/">Webの実験室</a>には、動かして試せる別の仕掛けも置いています。</p>
<p><small>検証：2026年11月8日、Chromeで比較デモと完成版HTMLの動作を確認。390px幅で本文の横はみ出しとチェックボックス操作も確認しました。Safari・Firefox・スマートフォン実機では未検証です。</small></p><details><summary>仕様を確認した資料</summary><ul><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/z-index">MDN：z-index</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-within">MDN：:focus-within</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion">MDN：prefers-reduced-motion</a></li></ul></details><p class="source">この記事は説明用サンプルで検証しています。実際のサイトで起きた個人的な失敗談を再現したものではありません。アフィリエイトリンクはありません。</p>
<style>.overflow-comparison{display:block;width:100%;height:600px;border:1px solid #dce4de;border-radius:12px}@media(max-width:600px){.overflow-comparison{height:1080px}}</style>
