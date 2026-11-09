import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {parse,serialize} from 'parse5';
const {paths}=JSON.parse(await fs.readFile('dist/translation-manifest.json','utf8'));
const origin='https://ryu-koda.com';
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
function* walk(n){yield n;for(const c of n.childNodes??[])yield* walk(c);}
const select=(d,test)=>[...walk(d)].filter(test);
const text=n=>(n.value??'')+(n.childNodes??[]).map(text).join('');
const local=(p,l)=>l==='ja'?p:`/${l}${p}`;
let count=0;
for(const p of paths){
 const source=parse(await fs.readFile('dist'+p+'index.html','utf8'));
 const originals=select(source,n=>n.tagName==='pre').map(serialize);
 const inlineCode=select(source,n=>n.tagName==='code').map(text).sort();
 const external=select(source,n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')??'')&&!attr(n,'href').startsWith(origin)&&!attr(n,'href').startsWith('https://twitter.com/intent/tweet?')).map(n=>attr(n,'href')).sort();
 const media=select(source,n=>['img','video','iframe','source'].includes(n.tagName)).map(n=>attr(n,'src')).filter(Boolean).sort();
 const sections=select(source,n=>/^h[1-6]$/.test(n.tagName)).length;
 for(const l of ['ja','en','zh-cn']){
  const d=parse(await fs.readFile('dist'+local(p,l)+'index.html','utf8'));
  const lang=attr(select(d,n=>n.tagName==='html')[0],'lang');assert.equal(lang,l==='zh-cn'?'zh-CN':l,p);
  assert.equal(attr(select(d,n=>n.tagName==='link'&&attr(n,'rel')==='canonical')[0],'href'),origin+local(p,l));
  const alts=select(d,n=>n.tagName==='link'&&attr(n,'hreflang'));
  assert.equal(alts.length,4);
  for(const a of ['ja','en','zh-cn'])assert(alts.some(n=>attr(n,'hreflang')===(a==='zh-cn'?'zh-CN':a)&&attr(n,'href')===origin+local(p,a)),p);
  assert.deepEqual(select(d,n=>n.tagName==='pre').map(serialize),originals,`${p} ${l}: code changed`);
  assert.deepEqual(select(d,n=>n.tagName==='code').map(text).sort(),inlineCode,`${p} ${l}: inline code changed`);
  assert(!/\{\{\d+\}\}/.test(text(d)),`${p} ${l}: unresolved translation placeholder`);
  assert.deepEqual(select(d,n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')??'')&&!attr(n,'href').startsWith(origin)&&!attr(n,'href').startsWith('https://twitter.com/intent/tweet?')).map(n=>attr(n,'href')).sort(),external,`${p}: external or affiliate URL changed`);
  assert.deepEqual(select(d,n=>['img','video','iframe','source'].includes(n.tagName)).map(n=>attr(n,'src')).filter(Boolean).sort(),media);
  assert.equal(select(d,n=>/^h[1-6]$/.test(n.tagName)).length,sections);
  assert.equal(select(d,n=>attr(n,'class')==='language-switch').length,1);
  const switches=select(d,n=>n.tagName==='a'&&attr(n,'data-language'));assert.equal(switches.length,3);for(const s of switches)assert.equal(attr(s,'href'),local(p,attr(s,'data-language')));
  if(l!=='ja'){
   assert.equal(select(d,n=>attr(n,'class')==='translation-note').length,1);
   const h1=select(d,n=>n.tagName==='h1')[0];assert(!/[\u3040-\u30ff]/.test(text(h1)),`${p}: untranslated heading ${text(h1)}`);
   if(l==='en')assert(!/[\u3040-\u30ff\u4e00-\u9fff]/.test(text(h1)),`${p}: untranslated English heading`);
  }
  count++;
 }
}
console.log(`Passed: ${count} pages; reciprocal language links, canonical URLs, code, media, section counts and external/affiliate links.`);
