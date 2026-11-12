---
seoTitle: "画像をWebPに変換・軽量化する方法｜Node.jsとsharpで実践"
title: "ブログの画像、そのまま載せていい？ サムネ3枚を軽くしてみた。"
description: "ブログの画像3枚をWebPへ変換し、合計7.19MBから約0.21MBに。Macでの準備からコマンドと結果の確認まで、練習用画像とコード付きで解説します。"
pubDate: 2026-09-10T09:00:00+09:00
heroImage: "../../../public/articles/resize-blog-images-webp/cover-sketch.webp"
tags: ["Web制作", "画像軽量化", "実践"]
---

<p>サムネイルをつけたら、記事を選ぶのが少し楽しくなりました。でも、画像ができたところで、もうひとつ気になることがあります。</p><p>このファイル、そのままサイトに載せて大丈夫なんだろう。</p><p>そこで今回は、りゅうのらぼのサムネイル原稿3枚を使って、幅を整え、WebPに変換してみました。<strong>合計7.19MBが、約0.21MBに。</strong>見た目も並べて確認できるようにしています。</p>
<p class="note">2026年11月5日の編集工程で実行した検証です。対象はAI生成のペン画PNG3枚。写真全般の比較ではありません。Mac／Node.js v26.5.0／sharp 0.34.5で実行。本番サムネイルの1200×630への切り抜きとは異なり、この比較では縦横比を保って1200×632にしています。実際のページの読み込み時間は測っていません。</p>


## まず、画像の重さを見てみる。

<p>今回のPNGは、1枚あたり約2.3〜2.5MBでした。3枚で約7.19MB。記事の入口に使う画像なので、原稿のサイズのまま届ける必要があるかを考えます。</p><p>今回試すのは、横幅を最大1200pxにし、WebPの品質設定を85にする方法です。これは今回選んだ条件で、どの画像にも最適という意味ではありません。</p>


## 変換してみたら、こうなった。

<ul><li>a-place-for-curiosity.png：2,344,974 → 69,466 bytes</li><li>joy-of-choosing-gadgets.png：2,298,834 → 52,122 bytes</li><li>making-everyday-interesting.png：2,543,487 → 87,014 bytes</li></ul><p>合計のファイルサイズは約97.1%減りました。幅の縮小と、WebPへの非可逆圧縮をまとめて行った結果です。</p>
<figure><img src="/articles/resize-blog-images-webp/input/making-everyday-interesting.png" loading="lazy" alt="変換前のペン画PNG"><figcaption>変換前。実際に変換に使ったPNGです。</figcaption></figure>
<figure><img src="/articles/resize-blog-images-webp/output/making-everyday-interesting.png.webp" loading="lazy" alt="幅1200px、品質設定85で変換したWebP"><figcaption>変換後。上と同じ表示幅で比較できます。細い線や紙の質感は、拡大して見比べると判断しやすくなります。</figcaption></figure>
<p>容量が減ると気持ちはいいですが、細かい線が大事な画像でもあります。どこまでなら許容できるかは、実際に表示する大きさで決めたいところです。</p>
<h2 id="walkthrough">ここから、一緒に操作してみます。</h2><nav class="step-nav" aria-label="操作手順の案内"><a href="#download">ダウンロード</a><a href="#terminal">作業場所へ移動</a><a href="#runtime">実行環境の確認</a><a href="#run">実行する</a><a href="#check">結果を見る</a><a href="#retry">困ったとき</a></nav><p>以下は<strong>Mac向け</strong>の手順です。「入力するコマンド」の枠だけをコピーし、1つ実行するたびにEnterを押します。「結果」の枠は入力しません。行頭の<code>%</code>や<code>$</code>は入力待ちの記号なので、記事のコマンドには含めていません。</p>
<h3 id="download">1．練習用ファイルをダウンロードする</h3><p><a class="button" href="/articles/resize-blog-images-webp/image-kit.zip" download>練習用ZIPをダウンロード</a></p><ol><li>リンクを押して保存します。通常はFinderの「ダウンロード」に入ります。</li><li>ZIPをダブルクリックして展開します。ブラウザがすでに展開している場合は、そのフォルダを使います。</li><li>フォルダを開き、<code>resize.mjs</code>と<code>input</code>が見えるところまで進みます。この2つが同じ場所にあれば準備できています。</li></ol><p>フォルダ名が「image-kit 2」のようになっても問題ありません。次の手順では、実際のフォルダをドラッグして指定します。</p>
<h3 id="terminal">2．ターミナルを開き、作業する場所へ移動する</h3><ol><li>⌘＋スペースを押し、「ターミナル」と入力してEnterを押します。</li><li>開いた画面に <code>cd </code> と入力します。<strong>cdのあとに半角スペースを1つ</strong>入れ、まだEnterは押しません。</li><li>Finderから、先ほどの<code>resize.mjs</code>が入った<strong>フォルダそのもの</strong>をターミナルへドラッグします。</li><li>フォルダの場所が入力されたらEnterを押します。</li></ol><p>画面上は、たとえば <code>cd /Users/自分の名前/Downloads/image-kit</code> のようになります。これは例なので、そのままコピーしません。移動が成功しても、通常はメッセージが出ません。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>pwd</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>/Users/自分の名前/Downloads/image-kit</code></pre><p class="checkpoint">いまいる場所が表示されます。名前や保存先は自分の環境のもので大丈夫です。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>ls -1</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>input
resize.mjs</code></pre><p class="checkpoint">resize.mjsとinputの両方が見えたら次へ。見えなければ手順2でフォルダを選び直してください。順番や他のファイルの有無は問いません。</p></div>
<h3 id="runtime">3．画像を変換するためのNode.jsを確認する</h3><p>Node.jsは、このJavaScriptのプログラムを動かすためのソフトです。npmは、プログラムが使う部品を追加する道具です。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>node --version</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>v26.5.0</code></pre><p class="checkpoint">vで始まるバージョンが出れば、Node.jsを呼び出せています。これは確認環境の表示で、同じ末尾の数字である必要はありません。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>npm --version</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>11.17.0</code></pre><p class="checkpoint">npmも数字が出れば呼び出せています。今回の実行環境はNode.js 26.5.0です。</p></div>
<details><summary>command not foundが出る／Node.jsが入っていない場合</summary><ol><li><a href="https://nodejs.org/en/download">Node.js公式ダウンロードページ</a>を開き、LTS・macOS用のInstaller（.pkg）を選びます。Macに対応する版を選んでください。</li><li>ダウンロードした.pkgを開き、表示される案内を確認してインストールします。</li><li>ターミナルを終了して開き直し、手順2のフォルダ移動からやり直します。</li><li><code>node --version</code>と<code>npm --version</code>を再実行します。両方の数字が出てから先へ進みます。</li></ol><p>インストーラーの操作は公式案内に基づく説明です。今回、新規インストールのUI操作自体は検証していません。</p></details>
<h3 id="install">4．作業フォルダに、画像変換の部品を追加する</h3><p>まず、設定ファイルを作ります。<code>-y</code>は、項目を一つずつ入力せず初期設定を使う指定です。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>npm init -y</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>Wrote to .../package.json:
{
  &quot;name&quot;: &quot;image-kit&quot;,
  ...
}</code></pre><p class="checkpoint">package.jsonを書いたという表示が出たら成功です。これは出力の抜粋で、...やフォルダ名は環境によって変わります。</p></div><p>次に、画像を変換するsharpを追加します。ここではインターネット接続が必要です。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>npm install sharp@0.34.5</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>added ... packages ...</code></pre><p class="checkpoint">addedなどの表示が出て入力待ちに戻ったら、次のコマンドで確認します。件数や所要時間、fundingなどの案内は変わります。赤いエラーで止まった場合は先へ進みません。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>npm ls sharp</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>image-kit@1.0.0 .../image-kit
└── sharp@0.34.5</code></pre><p class="checkpoint">sharp@0.34.5が見えれば導入できています。ここまででnode_modules、package.json、package-lock.jsonが増えます。</p></div>
<h3 id="run">5．画像を変換する</h3><p><code>input</code>が元画像の場所、<code>output</code>が新しい画像の保存先です。inputは残したまま、outputに別ファイルを作ります。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>node resize.mjs input output</code></pre><p class="result-label">今回の練習画像での実行結果</p><pre class="result"><code>[
  {
    &quot;file&quot;: &quot;a-place-for-curiosity.png&quot;,
    &quot;before&quot;: 2344974,
    &quot;after&quot;: 69466,
    &quot;width&quot;: 1200,
    &quot;height&quot;: 632
  },
  {
    &quot;file&quot;: &quot;joy-of-choosing-gadgets.png&quot;,
    &quot;before&quot;: 2298834,
    &quot;after&quot;: 52122,
    &quot;width&quot;: 1200,
    &quot;height&quot;: 632
  },
  {
    &quot;file&quot;: &quot;making-everyday-interesting.png&quot;,
    &quot;before&quot;: 2543487,
    &quot;after&quot;: 87014,
    &quot;width&quot;: 1200,
    &quot;height&quot;: 632
  }
]</code></pre><p class="checkpoint">3件の結果が出れば成功です。beforeは変換前、afterは変換後のバイト数。widthとheightは変換後のピクセル数です。OSなどによって容量が多少変わる場合はありますが、3枚の出力と寸法も確認してください。</p></div>
<h3 id="check">6．できたファイルを開く</h3><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>ls -1 output</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>a-place-for-curiosity.png.webp
joy-of-choosing-gadgets.png.webp
making-everyday-interesting.png.webp</code></pre><p class="checkpoint">3つのファイルが見えれば、保存先も確認できました。.png.webpは、このスクリプトが元のファイル名を残して付けた名前です。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>open output</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>（ターミナルには通常、何も表示されません）</code></pre><p class="checkpoint">Finderでoutputフォルダが開きます。画像を選んでスペースキーを押すとクイックルックで確認できます。元画像のinputも開き、線や色を見比べてください。</p></div>
<p class="summary"><strong>ここまでで練習は完了です。</strong>3枚のWebPができ、Finderで開ければ成功。次の手順は、自分の画像でも試したい方だけ進んでください。</p><h3 id="own-files">7．自分の画像で試す（応用）</h3><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>mkdir my-input</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>（何も表示されません）</code></pre><p class="checkpoint">自分の画像を入れるフォルダができました。同名のフォルダがすでにある場合は、そのフォルダを使うか別名にします。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>open my-input</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>（Finderでmy-inputが開きます）</code></pre><p class="checkpoint">Finderで元のPNGまたはJPEGを選んで⌘C、my-input内で⌘Vを押してコピーします。元画像は別に残してください。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>node resize.mjs my-input my-output</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>[
  { &quot;file&quot;: &quot;自分の画像.png&quot;, &quot;before&quot;: ..., &quot;after&quot;: ..., &quot;width&quot;: ..., &quot;height&quot;: ... }
]</code></pre><p class="checkpoint">これは構造だけの表示例です。fileが自分の画像名になり、my-outputにWebPができれば成功です。</p></div><p>今回のコードは直下の静止画PNG・JPEGが対象です。HEICやアニメーション、サブフォルダ内の画像は対象外です。画像の外部送信処理はありません。</p>
<h3 id="retry">止まったときは、ここを確認する</h3><ul><li><code>Cannot find module ...resize.mjs</code>：作業場所が違う可能性があります。手順2の<code>ls -1</code>でファイルを確認します。</li><li><code>Cannot find package 'sharp'</code>：手順4の<code>npm install sharp@0.34.5</code>を、resize.mjsのある場所で実行します。</li><li><code>ENOENT ... input</code>：入力フォルダの名前が違います。<code>ls -1</code>で名前を確認します。</li><li><code>[]</code>だけが出る：対象のPNG/JPEGがない可能性があります。<code>ls -1 input</code>で中身を確認します。</li><li><code>EEXIST</code>：前回の出力が残っています。上書きしない仕様なので、次のように出力先を変えます。</li></ul><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>node resize.mjs input output-2</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>[
  { &quot;file&quot;: &quot;a-place-for-curiosity.png&quot;, ... },
  ...
]</code></pre><p class="checkpoint">output-2に新しく保存できれば再実行成功です。output-2も存在する場合は、output-3など未使用の名前にします。これは結果の抜粋です。</p></div><p>途中で失敗した出力先には空ファイルが残る場合があります。入力画像は変更されないので、新しい出力先でやり直します。</p><h3>配布コードの中身も見たい方へ</h3><details><summary>実行したコードを見る</summary><pre><code>import fs from &#x27;node:fs/promises&#x27;;
import path from &#x27;node:path&#x27;;
import sharp from &#x27;sharp&#x27;;
const input = process.argv[2] ?? &#x27;input&#x27;;
const output = process.argv[3] ?? &#x27;output&#x27;;
if (path.resolve(input) === path.resolve(output)) throw Error(&#x27;入力と出力は別のフォルダにしてください&#x27;);
await fs.mkdir(output, {recursive:true});
const results=[];
for (const entry of await fs.readdir(input, {withFileTypes:true})) {
  if (!entry.isFile() || !/\.(png|jpe?g)$/i.test(entry.name)) continue;
  const source=path.join(input,entry.name);
  const target=path.join(output,entry.name+&#x27;.webp&#x27;);
  // wx prevents overwriting an existing output file.
  const handle=await fs.open(target,&#x27;wx&#x27;);
  try {
    const buffer=await sharp(source).rotate().resize({width:1200,withoutEnlargement:true}).webp({quality:85}).toBuffer();
    await handle.writeFile(buffer);
    const meta=await sharp(buffer).metadata();
    results.push({file:entry.name,before:(await fs.stat(source)).size,after:buffer.length,width:meta.width,height:meta.height});
  } finally {await handle.close();}
}
console.log(JSON.stringify(results,null,2));
</code></pre></details>

## 次の画像からは、載せる前にひと手間。

<p>毎回むずかしい最適化をするより、まず表示する大きさを考えて、容量と見た目を確認する。このひと手間なら、記事を書く流れにも入れられそうです。</p><p>WebPに変換しただけでサイトが必ず速くなるわけではありません。今回は、配信する画像ファイルそのものを小さくできた、というところまでの記録です。</p><p>画像をつくるところも含めて気になったら、<a href="https://ryu-koda.com/blog/making-everyday-interesting/">つくる楽しさについての記事</a>へ。調べたことを、実際に使える形にする話を増やしていきます。</p>
<p>参照：<a href="https://sharp.pixelplumbing.com/api-resize/">sharpのリサイズ仕様</a>、<a href="https://sharp.pixelplumbing.com/api-output/">WebP出力の仕様</a>。APIの条件を確認し、上記の容量は手元で測定しました。</p>


## 公開した記事を、検索から見つけてもらうには

画像を軽くしたあとは、記事がGoogleに登録されているかも確認してみます。[個人ブログで実施したSEO対策の記録](/blog/blog-seo-practice/)では、Search Consoleの画面を見ながら、タイトルや内部リンク、計測を整える手順を紹介しています。
