// Release checks for the current review-pending state; not a prediction of approval.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { sampleSlugs } from '../src/lib/seo.mjs';
const root='dist';const read=p=>fs.readFileSync(`${root}/${p}`,'utf8');
assert.equal(read('ads.txt').trim(),'google.com, pub-9235096476290205, DIRECT, f08c47fec0942fa0');
assert(!/^Disallow:\s*\/\s*$/m.test(read('robots.txt')),'Do not block the site crawler');
for(const slug of sampleSlugs)assert(!fs.existsSync(`${root}/blog/${slug}/index.html`),'Starter article still published: '+slug);
for(const page of ['index.html','about/index.html','contact/index.html','privacy/index.html','advertising/index.html','blog/index.html']){
 const html=read(page);assert(html.includes('ca-pub-9235096476290205'),'Missing verification meta: '+page);
 assert(!html.includes('pagead/js/adsbygoogle.js'),'Advertising must remain disabled during review: '+page);
 assert(html.includes('/privacy/') && html.includes('/contact/'),'Missing policy/contact links: '+page);
}
for(const locale of ['', 'en/', 'zh-cn/']){
 const html=read(`${locale}blog/index.html`);assert(html.includes('article-thumbnails/'),'Missing article thumbnails');
 for(const slug of sampleSlugs)assert(!html.includes(`/blog/${slug}/`),'Starter linked in index');
}
for(const page of ['sns/index.html','diary/index.html'])assert(/name="robots"[^>]*content="noindex/.test(read(page)),'Unfinished page is indexable');
assert(read('_redirects').includes('/work/#media'),'Legacy redirect incorrect');
assert(read('work/index.html').includes('id="media"'),'Redirect target missing');
const privacy=read('privacy/index.html');for(const link of ['https://www.google.com/settings/ads','https://www.aboutads.info/choices/','https://policies.google.com/technologies/ads'])assert(privacy.includes(link),'Advertising privacy resource missing');
console.log('PASS: review-pending checks: ads.txt, verification meta, crawler access, policy/contact links, starter exclusion, noindex placeholders, thumbnails, redirect target, ad scripts disabled.');
