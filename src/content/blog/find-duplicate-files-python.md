---
seoTitle: "Pythonで重複ファイルを探す方法｜削除しないサンプル付き"
title: "名前が違っても、中身は同じ？ 重複ファイルを消さずに探してみた。"
description: "Pythonで中身が同じファイルを探す方法。Macでの準備、コマンド、結果の読み方を一つずつ解説。削除しないコードと練習用ファイル付きです。"
pubDate: 2026-07-23T09:00:00+09:00
heroImage: "../../../public/articles/find-duplicate-files-python/cover-sketch.webp"
tags: ["自動化", "Python", "ファイル整理"]
---

<p>「report.txt」と「report-copy.txt」。名前を見るだけでは、中身まで同じかどうかはわかりません。</p><p>ひとつずつ開いて比べるのは面倒です。かといって、コピーらしい名前だからと消すのも落ち着かない。</p><p>今回は、<strong>ファイルを消さずに、中身が同じものを一覧にする</strong>小さな道具を試しました。名前が違う同じファイルと、名前が同じ別のファイルを混ぜて、見分けられるか確かめます。</p>
<p class="note">実生活のフォルダを整理した体験談ではなく、この記事用の4ファイルで行った実験です。編集エージェントがMac／Python 3.14でコードを実行し、検出結果と元ファイルが変わっていないことを確認しています。</p>


## ファイル名より、中身を比べたい。

<p>用意したのは、次のフォルダです。ZIPに入っているので、同じ条件で試せます。</p><pre><code>sample/
├── a/
│   └── report.txt         中身：same data
├── b/
│   ├── report-copy.txt    中身：same data
│   └── report.txt         中身：other data
└── note.txt               中身：unique</code></pre><p>aのreport.txtとbのreport-copy.txtが同じ中身です。一方、名前が同じ2つのreport.txtは、中身が違います。</p><p>各ファイルを読み、ファイルの大きさとSHA-256というハッシュ値で候補をまとめ、候補同士をバイト単位でも比較します。ハッシュ値は内容から計算する値です。今回は、候補を探す手がかりとして使っています。</p>


## 試してみると、名前が違う2つが見つかった。

<p>実行結果では、同じ中身の2つだけが、ひとつのグループになりました。同名で中身の違うファイルは混ざりませんでした。</p><pre><code>{
  "duplicate_groups": [
    ["sample/a/report.txt", "sample/b/report-copy.txt"]
  ],
  "errors": []
}</code></pre><p>これは練習用フォルダで得られる結果です。保存場所によってパスの先頭部分は変わります。<a href="/articles/find-duplicate-files-python/duplicate-results.json">実行時の生ログ</a>も残しています。</p>
<h2 id="walkthrough">ここから、一緒に操作してみます。</h2><nav class="step-nav" aria-label="操作手順の案内"><a href="#download">ダウンロード</a><a href="#terminal">作業場所へ移動</a><a href="#runtime">実行環境の確認</a><a href="#run">実行する</a><a href="#check">結果を見る</a><a href="#retry">困ったとき</a></nav><p>以下は<strong>Mac向け</strong>の手順です。「入力するコマンド」の枠だけをコピーし、1つ実行するたびにEnterを押します。「結果」の枠は入力しません。行頭の<code>%</code>や<code>$</code>は入力待ちの記号なので、記事のコマンドには含めていません。</p>
<h3 id="download">1．練習用ファイルをダウンロードする</h3><p><a class="button" href="/articles/find-duplicate-files-python/duplicate-kit.zip" download>練習用ZIPをダウンロード</a></p><ol><li>リンクを押して保存します。通常はFinderの「ダウンロード」に入ります。</li><li>ZIPをダブルクリックして展開します。ブラウザがすでに展開している場合は、そのフォルダを使います。</li><li>フォルダを開き、<code>find_duplicates.py</code>と<code>sample</code>が見えるところまで進みます。この2つが同じ場所にあれば準備できています。</li></ol><p>フォルダ名が「duplicate-kit 2」のようになっても問題ありません。次の手順では、実際のフォルダをドラッグして指定します。</p>
<h3 id="terminal">2．ターミナルを開き、作業する場所へ移動する</h3><ol><li>⌘＋スペースを押し、「ターミナル」と入力してEnterを押します。</li><li>開いた画面に <code>cd </code> と入力します。<strong>cdのあとに半角スペースを1つ</strong>入れ、まだEnterは押しません。</li><li>Finderから、先ほどの<code>find_duplicates.py</code>が入った<strong>フォルダそのもの</strong>をターミナルへドラッグします。</li><li>フォルダの場所が入力されたらEnterを押します。</li></ol><p>画面上は、たとえば <code>cd /Users/自分の名前/Downloads/duplicate-kit</code> のようになります。これは例なので、そのままコピーしません。移動が成功しても、通常はメッセージが出ません。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>pwd</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>/Users/自分の名前/Downloads/duplicate-kit</code></pre><p class="checkpoint">いまいる場所が表示されます。名前や保存先は自分の環境のもので大丈夫です。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>ls -1</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>find_duplicates.py
sample</code></pre><p class="checkpoint">find_duplicates.pyとsampleの両方が見えたら次へ。見えなければ手順2でフォルダを選び直してください。順番や他のファイルの有無は問いません。</p></div>
<h3 id="runtime">3．Pythonが使えるか確認する</h3><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>python3 --version</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>Python 3.14.7</code></pre><p class="checkpoint">Python 3で始まる表示を確認します。今回は3.14.7で検証しました。追加ライブラリのインストールは不要です。</p></div><details><summary>command not foundが出る／Pythonが入っていない場合</summary><ol><li><a href="https://www.python.org/downloads/macos/">Python公式のmacOS向けページ</a>から、対応する安定版のmacOS installerをダウンロードします。</li><li>.pkgを開き、案内に沿ってインストールします。</li><li>ターミナルを開き直し、手順2のフォルダ移動をしてから<code>python3 --version</code>を再実行します。</li></ol><p>導入方法は<a href="https://docs.python.org/3/using/mac.html">公式手順</a>に基づきます。今回、新規インストールのUI操作自体は検証していません。</p></details>
<h3 id="run">4．練習用フォルダを調べる</h3><p>最後の<code>sample</code>が調べるフォルダです。プログラムは、その下にあるaやbのフォルダも調べます。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>python3 find_duplicates.py sample</code></pre><p class="result-label">配布ZIPを展開して実行した結果</p><pre class="result"><code>{
  &quot;duplicate_groups&quot;: [
    [
      &quot;sample/a/report.txt&quot;,
      &quot;sample/b/report-copy.txt&quot;
    ]
  ],
  &quot;errors&quot;: []
}</code></pre><p class="checkpoint">この2つが同じ角括弧の中に出れば、同じ中身のグループが見つかりました。errorsが空なので、今回の対象で読み取りエラーはありません。</p></div>
<h3 id="check">5．検出した中身を、自分でも見てみる</h3><p><code>cat</code>はテキストの中身を表示するコマンドです。ここでは練習用のテキストファイルだけに使います。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>cat sample/a/report.txt</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>same data</code></pre><p class="checkpoint">1つ目の中身です。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>cat sample/b/report-copy.txt</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>same data</code></pre><p class="checkpoint">2つ目も同じ内容です。名前が違っても、同じグループになった理由が確認できます。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>cat sample/b/report.txt</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>other data</code></pre><p class="checkpoint">同じreport.txtという名前でも、中身が違うので検出グループに入りません。</p></div>
<p class="summary"><strong>ここまでで練習は完了です。</strong>同じ中身の2ファイルだけが見つかり、catで内容を確認できれば成功です。</p><h3 id="own-files">6．自分のフォルダを指定する（応用）</h3><p>Finderで新しいフォルダを作り、確認したいファイルを⌘C → 新しいフォルダ内で⌘Vでコピーします。最初は数個のファイルで試します。</p><ol><li>ターミナルに<code>python3 find_duplicates.py </code>と入力します。最後に半角スペースを入れます。</li><li>Finderから、調べたいフォルダをドラッグします。</li><li>パスが入ったらEnterを押します。</li></ol><p>画面上は、たとえば次のようになります。下のパスをそのまま使わず、自分のフォルダに置き換えてください。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>python3 find_duplicates.py &quot;/Users/自分の名前/Documents/確認用フォルダ&quot;</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>{
  &quot;duplicate_groups&quot;: [],
  &quot;errors&quot;: []
}</code></pre><p class="checkpoint">これは重複がなかった場合の例です。見つかれば、手順4と同じ形でファイルの場所が並びます。走査中は表示がなく、終わったところで結果が出ます。大きいフォルダは時間がかかります。</p></div>
<h3 id="save">7．結果を残したい場合（任意）</h3><p>調べたいフォルダでうまく動くことを確認したら、結果をファイルにも保存できます。まずsampleで試してみます。</p><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>python3 find_duplicates.py sample &gt; duplicate-report.json</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>（画面には何も表示されません）</code></pre><p class="checkpoint">> は画面表示の代わりにファイルへ保存する指定です。同じ名前のレポートがあると上書きするので、残したい場合は別名にしてください。元の検査対象ファイルは変わりません。</p></div><div class="command-pair"><p class="command-label">入力するコマンド</p><pre class="command"><code>cat duplicate-report.json</code></pre><p class="result-label">表示される結果の例</p><pre class="result"><code>{
  &quot;duplicate_groups&quot;: [
    [
      &quot;sample/a/report.txt&quot;,
      &quot;sample/b/report-copy.txt&quot;
    ]
  ],
  &quot;errors&quot;: []
}</code></pre><p class="checkpoint">手順4と同じ内容が出れば保存できています。レポートは調べる対象フォルダの外に保存します。</p></div>
<h3 id="retry">止まったとき・結果が違うとき</h3><ul><li><code>can't open file ...find_duplicates.py</code>：手順2へ戻り、<code>ls -1</code>にプログラム名があるか確認します。</li><li><code>対象フォルダがありません</code>：指定したフォルダを探せていません。手順6のドラッグで指定し直します。</li><li><code>duplicate_groups: []</code>、<code>errors: []</code>：対象にしたファイル内で重複が見つからなかったという意味です。対象の範囲は次の節も確認してください。</li><li><code>errors</code>に項目がある：そのファイルを確認できていません。表示されたパスやアクセス権を確認します。すべて調べ終えた結果とは扱いません。</li></ul><p>結果に出たからといって、不要なコピーとは限りません。このコードは削除・移動をせず、確認用の一覧だけを出します。</p><h3>配布コードの中身も見たい方へ</h3><details><summary>実行したコードを見る</summary><pre><code>import os, sys, hashlib, json, filecmp
from pathlib import Path
from collections import defaultdict
root = Path(sys.argv[1] if len(sys.argv)&gt;1 else &#x27;sample&#x27;)
if not root.is_dir():
    raise SystemExit(&#x27;対象フォルダがありません&#x27;)
groups = defaultdict(list)
errors = []
for folder, dirs, files in os.walk(root, followlinks=False):
    dirs[:] = sorted(d for d in dirs if not d.startswith(&#x27;.&#x27;) and not (Path(folder)/d).is_symlink())
    for name in sorted(files):
        p = Path(folder)/name
        if name.startswith(&#x27;.&#x27;) or p.is_symlink() or not p.is_file():
            continue
        try:
            h = hashlib.sha256()
            with p.open(&#x27;rb&#x27;) as f:
                for chunk in iter(lambda: f.read(1024*1024), b&#x27;&#x27;):
                    h.update(chunk)
            groups[(p.stat().st_size,h.hexdigest())].append(p)
        except OSError as e:
            errors.append({&#x27;file&#x27;:str(p),&#x27;error&#x27;:str(e)})
result=[]
for candidates in groups.values():
    if len(candidates)&lt;2: continue
    first=candidates[0]
    try:
        if all(filecmp.cmp(first,p,shallow=False) for p in candidates[1:]):
            result.append([str(p) for p in candidates])
    except OSError as e:
        errors.append({&#x27;file&#x27;:str(first),&#x27;error&#x27;:str(e)})
print(json.dumps({&#x27;duplicate_groups&#x27;:result,&#x27;errors&#x27;:errors},ensure_ascii=False,indent=2))
</code></pre></details>

## 同じ写真に見える、とは少し違う。

<p>このコードが見つけるのは、ファイルの中身がバイト単位で同じものです。同じ写真をJPEGで保存し直した場合や、画像のメタデータだけ変わった場合は、同じものとして出ないことがあります。</p><p>似た写真を探す機能はありません。また、大きなファイルを全部読むので、対象が多いと時間がかかります。まずは小さい確認用フォルダから試すのがよさそうです。</p><p>隠しファイル・隠しフォルダとシンボリックリンクは対象外です。読み取れないファイルはerrorsに出ます。実行中に対象ファイルを編集すると結果が安定しないため、使っていないフォルダで確認します。</p>


## 消す前に、わかるようにする。

<p>今回つくったのは、片づけを全部やってくれる道具ではありません。同じかどうかを、開いて確認する手間を減らすものです。</p><p>どれを残すか考える前に、まず何が重なっているかを知る。それだけでも、次にすることを決めやすくなると思います。</p><p>ファイル名も整えたくなったら、<a href="https://ryu-koda.com/blog/mac-finder-batch-rename/">MacのFinderで名前をまとめて変えた記事</a>へ。小さな面倒を、ひとつずつ減らしていきたいです。</p><p>参照：<a href="https://docs.python.org/3/library/hashlib.html">Python公式のhashlib解説</a>。検出結果は配布サンプルで実行して確認しました。</p>


Notebookや機械学習のデータも点検したい方へ。[分割・評価・公開を助けるPythonツール3つの紹介](/blog/python-tools-splittrace-eventscore-notebook/)では、ブラウザで見られる合成デモとGitHubをまとめています。
