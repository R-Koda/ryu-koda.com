/** Static translations: no visitor text is ever sent to a translation service.
 * Normal builds use the checked-in dictionary only; --refresh explicitly fills it.
 * Source code, URLs, IDs, vendor creatives, images and script contents are preserved.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse, parseFragment, serialize } from 'parse5';
import { shouldIndex } from '../src/lib/seo.mjs';
const origin = 'https://ryu-koda.com';
const locales = ['en','zh-cn'];
const langTag = {ja:'ja',en:'en','zh-cn':'zh-CN'};
const labels = {ja:'日本語',en:'English','zh-cn':'简体中文'};
const refresh = process.argv.includes('--refresh');
const jp = /[\u3040-\u30ff\u3400-\u9fff]/;
const attr = (n,k) => n.attrs?.find(a=>a.name===k)?.value;
function set(n,k,v){n.attrs??=[]; const a=n.attrs.find(a=>a.name===k); if(a)a.value=v;else n.attrs.push({name:k,value:v});}
function* walk(n){yield n;for(const c of n.childNodes??[])yield* walk(c);}
const find=(n,test)=>[...walk(n)].find(test);
function append(n,html,first=false){const nodes=parseFragment(html).childNodes;for(const c of nodes)c.parentNode=n;n.childNodes=first?[...nodes,...n.childNodes]:[...n.childNodes,...nodes];}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const localized=(p,l)=>l==='ja'?p:`/${l}${p}`;
async function files(dir){let out=[];for(const f of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())out.push(...await files(p));else if(f.name==='index.html')out.push(p);}return out;}
const paths=(await files('dist')).map(f=>'/'+f.replace(/^dist\//,'').replace(/index.html$/,'')).filter(p=>shouldIndex(p)&& (['/','/about/','/blog/'].includes(p)||p.startsWith('/blog/')||p.startsWith('/playground/'))).sort();
const available=new Set(paths);
const docs=new Map(await Promise.all(paths.map(async p=>[p,parse(await fs.readFile('dist'+p+'index.html','utf8'))])));
// Original typography splits the greeting into separate letters. Translate as a phrase instead.
const greeting='なんかやってます。';
for(const doc of docs.values()){
 const button=find(doc,n=>attr(n,'class')==='greeting-play');
 if(button){button.childNodes=[];append(button,greeting);}
}
const skipped=new Set(['script','style','pre','code','svg','math']);
function blocked(n){for(let p=n.parentNode;p;p=p.parentNode)if(skipped.has(p.tagName)||attr(p,'translate')==='no'||attr(p,'class')?.split(' ').includes('affiliate-product'))return true;return false;}
const attributes=new Set(['alt','title','aria-label','placeholder']);
function segments(doc){const out=[];for(const n of walk(doc)){
 if(blocked(n))continue;
 if(n.nodeName==='#text'&&jp.test(n.value))out.push({text:n.value.trim(),write:v=>{const lead=n.value.match(/^\s*/)[0],trail=n.value.match(/\s*$/)[0];n.value=lead+v+trail;}});
 for(const a of n.attrs??[])if((attributes.has(a.name)||(n.tagName==='meta'&&a.name==='content'&&['description','title','og:title','og:description','twitter:title','twitter:description','og:site_name','og:image:alt','twitter:image:alt'].includes(attr(n,'name')??attr(n,'property'))))&&jp.test(a.value))out.push({text:a.value.trim(),write:v=>{a.value=v;}});
 }return out.filter(x=>x.text);}
let cache={en:{},'zh-cn':{}};try{cache=JSON.parse(await fs.readFile('translations/catalog.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const overrides=JSON.parse(await fs.readFile('translations/overrides.json','utf8'));
const required=[...new Set([...docs.values()].flatMap(d=>segments(d).map(s=>s.text)))];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function translate(text,locale){
 const u=new URL('https://translate.googleapis.com/translate_a/single');
 for(const [k,v]of Object.entries({client:'gtx',sl:'ja',tl:locale==='zh-cn'?'zh-CN':'en',dt:'t',q:text}))u.searchParams.set(k,v);
 for(let attempt=0;attempt<4;attempt++){try{const r=await fetch(u,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`Translation HTTP ${r.status}`);const data=await r.json();const s=data[0]?.map(x=>x[0]??'').join('');if(!s)throw Error('Empty translation');return s;}catch(e){if(attempt===3)throw e;await sleep(1500*(attempt+1));}}
}
for(const locale of locales){
 const missing=required.filter(t=>!overrides[locale]?.[t]&&!cache[locale][t]);
 console.log(`${locale}: ${required.length} strings, ${missing.length} missing`);
 if(missing.length&&!refresh)throw Error('Translation cache incomplete. Review public source changes and explicitly run npm run i18n:refresh. Nothing has been published.');
 // Numbered separators are checked before accepting batches; failed boundaries fall back to individual strings.
 const batches=[];let batch=[],size=0;for(const s of missing){if(size+s.length>1800&&batch.length){batches.push(batch);batch=[];size=0;}batch.push(s);size+=s.length+20;}if(batch.length)batches.push(batch);
 for(let bi=0;bi<batches.length;bi++){
  const b=batches[bi];const input=b.map((s,i)=>`[${100000+i}]\n${s}`).join('\n\n');
  const result=await translate(input,locale);const parts=[...result.matchAll(/\[\s*(\d{6})\s*\]\s*([\s\S]*?)(?=\[\s*\d{6}\s*\]|$)/g)];
  if(parts.length===b.length&&parts.every((p,i)=>+p[1]===100000+i&&p[2].trim())) b.forEach((s,i)=>cache[locale][s]=parts[i][2].trim());
  else for(const s of b)cache[locale][s]=await translate(s,locale);
  await fs.writeFile('translations/catalog.json',JSON.stringify(cache,null,2)+'\n');
  if(bi%10===0||bi===batches.length-1)console.log(`${locale}: translated ${bi+1}/${batches.length} batches`);
  await sleep(120);
 }
}
const dict=l=>({...cache[l],...overrides[l]});
const rewriteUrl=(s,l)=>{
 if(!s.startsWith('/')&&!s.startsWith(origin+'/'))return s;
 const u=new URL(s,origin);if(u.origin!==origin||!available.has(u.pathname))return s;
 const p=localized(u.pathname,l)+u.search+u.hash;return s.startsWith(origin)?origin+p:p;
};
function schemaTranslate(value,l,key=''){
 if(Array.isArray(value))return value.map(v=>schemaTranslate(v,l,key));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,schemaTranslate(v,l,k)]));
 if(typeof value!=='string')return value;
 if(key==='inLanguage')return langTag[l];
 if(['url','@id','item'].includes(key))return rewriteUrl(value,l);
 return dict(l)[value]??value;
}
for(const p of paths){
 const original=docs.get(p);
 // All variants include all reciprocal alternates; self canonical remains language-specific.
 for(const l of ['ja',...locales]){
  const doc=parse(serialize(original));
  const head=find(doc,n=>n.tagName==='head'), body=find(doc,n=>n.tagName==='body');
  // Remove existing language links when cloning the already processed Japanese page.
  head.childNodes=head.childNodes.filter(n=>!(n.tagName==='link'&&attr(n,'hreflang')));
  for(const alt of ['ja',...locales])append(head,`<link rel="alternate" hreflang="${langTag[alt]}" href="${origin}${localized(p,alt)}">`);
  append(head,`<link rel="alternate" hreflang="x-default" href="${origin}${p}">`);
  const oldSwitch=find(doc,n=>attr(n,'class')==='language-switch');if(oldSwitch)oldSwitch.parentNode.childNodes=oldSwitch.parentNode.childNodes.filter(n=>n!==oldSwitch);
  const oldSuggest=find(doc,n=>attr(n,'id')==='language-suggestion');if(oldSuggest)oldSuggest.parentNode.childNodes=oldSuggest.parentNode.childNodes.filter(n=>n!==oldSuggest);
  if(l!=='ja'){
   const d=dict(l);for(const s of segments(doc))s.write(d[s.text]??s.text);
   set(find(doc,n=>n.tagName==='html'),'lang',langTag[l]);
   for(const n of walk(doc)){
    if(n.tagName==='a'&&attr(n,'href')){const before=attr(n,'href');set(n,'href',rewriteUrl(before,l));if(before.startsWith('/')&&before.endsWith('/')&&!available.has(before))set(n,'hreflang','ja');}
    if(attr(n,'data-share-url'))set(n,'data-share-url',origin+localized(p,l));
    if(attr(n,'data-share-title'))set(n,'data-share-title',d[attr(n,'data-share-title')]??attr(n,'data-share-title'));
    if(n.tagName==='input'&&attr(n,'class')==='manual-link')set(n,'value',origin+localized(p,l));
    if(n.tagName==='a'&&(attr(n,'href')??'').startsWith('https://twitter.com/intent/tweet?')){const u=new URL(attr(n,'href'));u.searchParams.set('url',origin+localized(p,l));const title=u.searchParams.get('text');u.searchParams.set('text',d[title]??title);set(n,'href',u.href);}
    if(n.tagName==='time'&&attr(n,'datetime')){n.childNodes=[];append(n,new Intl.DateTimeFormat(langTag[l],{dateStyle:'medium',timeZone:'Asia/Tokyo'}).format(new Date(attr(n,'datetime'))));}
    if(n.tagName==='link'&&attr(n,'rel')==='canonical')set(n,'href',origin+localized(p,l));
    if(n.tagName==='meta'&&['og:url','twitter:url'].includes(attr(n,'property')))set(n,'content',origin+localized(p,l));
    if(n.tagName==='meta'&&attr(n,'property')==='og:locale')set(n,'content',l==='en'?'en_US':'zh_CN');
    if(n.tagName==='script'&&attr(n,'type')==='application/ld+json')n.childNodes[0].value=JSON.stringify(schemaTranslate(JSON.parse(n.childNodes[0].value),l)).replaceAll('<','\\u003c');
   }
   const main=find(doc,n=>n.tagName==='main');
   const notice=l==='en'?'Machine-translated from Japanese. Screenshots, sample files, demos and shop listings may remain in Japanese. Prices and availability refer to Japan and the dates stated in the original.':'本页由日语原文机器翻译。截图、示例文件、演示及商店信息可能仍为日语。价格和供货情况以日本市场及原文标注日期为准。';
   append(main,`<aside class="translation-note" lang="${langTag[l]}">${notice} <a href="${p}" hreflang="ja">${l==='en'?'Read the Japanese original':'阅读日语原文'}</a></aside>`,true);
  }
  const nav=find(doc,n=>n.tagName==='nav'&&attr(n,'class')?.includes('top-nav'));
  append(nav,`<details class="language-switch" translate="no"><summary aria-label="${l==='ja'?'表示言語':l==='en'?'Language':'显示语言'}">${labels[l]} <span aria-hidden="true">⌄</span></summary><div>${['ja',...locales].map(a=>`<a href="${localized(p,a)}" lang="${langTag[a]}" hreflang="${langTag[a]}" data-language="${a}" ${a===l?'aria-current="true"':''}>${labels[a]}</a>`).join('')}</div></details>`);
  append(body,`<aside id="language-suggestion" hidden></aside>`);
  // Rebuild the animated greeting as individual letters after translation.
  const button=find(doc,n=>attr(n,'class')==='greeting-play');
  if(button){const text=l==='ja'?greeting:dict(l)[greeting];button.childNodes=[];append(button,[...text].map(c=>`<i aria-hidden="true">${c===' '?'&nbsp;':escape(c)}</i>`).join(''));}
  const dest='dist'+localized(p,l);await fs.mkdir(dest,{recursive:true});await fs.writeFile(dest+'index.html',serialize(doc));
 }
}
// One ordinary sitemap entry per localized page; language annotations live in HTML.
const sitemapFile='dist/sitemap-0.xml';let sitemap=await fs.readFile(sitemapFile,'utf8');
const entries=paths.flatMap(p=>locales.map(l=>`<url><loc>${origin}${localized(p,l)}</loc></url>`)).join('');
sitemap=sitemap.replace('</urlset>',entries+'</urlset>');await fs.writeFile(sitemapFile,sitemap);
await fs.writeFile('dist/translation-manifest.json',JSON.stringify({locales:['ja',...locales],paths,method:'Static machine translation; Japanese original is authoritative.'},null,2)+'\n');
console.log(`Generated ${paths.length*2} translated pages (${paths.filter(p=>/^\/blog\/[^/]+\/$/.test(p)).length} articles per language).`);
