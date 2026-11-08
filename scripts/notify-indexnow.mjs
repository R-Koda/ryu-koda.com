// Explicit post-deploy notification; never sends on build or page view.
import {readFile} from 'node:fs/promises';
import {shouldIndex} from '../src/lib/seo.mjs';
const origin='https://ryu-koda.com';
const args=process.argv.slice(2);const send=args.includes('--send');
const paths=args.filter(x=>x!=='--send');
if(!paths.length) throw new Error('Provide newly published or materially changed page paths. Add --send only after deployment.');
const urls=[...new Set(paths.map(path=>{
 if(!path.startsWith('/')||path.startsWith('//'))throw new Error('Only site-relative paths are accepted');
 const url=new URL(path,origin);
 if(url.origin!==origin||url.search||url.hash||!shouldIndex(url.pathname))throw new Error('Only canonical indexable paths without query/fragment are accepted');
 return url.href;
}))];
if(urls.length>100)throw new Error('Notify at most 100 changed URLs per run.');
console.log(JSON.stringify({mode:send?'send':'dry-run',urls},null,2));
if(!send)process.exit(0);
const key=(await readFile('public/indexnow-key.txt','utf8')).trim();
if(!/^[a-zA-Z0-9-]{8,128}$/.test(key))throw new Error('Invalid ownership key');
const keyLocation=origin+'/indexnow-key.txt';
const request=async(url,options={})=>fetch(url,{...options,signal:AbortSignal.timeout(30000)});
const verification=await request(keyLocation);
if(!verification.ok||(await verification.text()).trim()!==key)throw new Error('Published ownership file does not match; deploy first.');
for(const url of urls){
 const response=await request(url);
 if(!response.ok||response.url!==url)throw new Error('Page missing or redirects: '+url);
 const html=await response.text();
 if(/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html))throw new Error('Page is noindex: '+url);
 if(!html.includes('rel="canonical" href="'+url+'"'))throw new Error('Canonical mismatch: '+url);
}
const response=await request('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({host:'ryu-koda.com',key,keyLocation,urlList:urls})});
console.log(JSON.stringify({status:response.status,received:[200,202].includes(response.status),meaning:response.status===202?'Received; ownership validation pending. Not proof of indexing.':'Receipt is not proof of indexing or ranking.',urls}));
if(![200,202].includes(response.status))throw new Error('IndexNow rejected the notification: '+response.status);
