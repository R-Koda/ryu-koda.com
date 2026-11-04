"""Check built HTML, local links, JSON-LD and sitemap consistency before publishing."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

root = Path('dist')
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.meta={}; self.canonical=[]; self.links=[]; self.ids=set(); self.h1=0; self.titles=[]; self.jsonld=[]; self.mode=None; self.buffer=''; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='meta': self.meta[a.get('name',a.get('property'))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a['href'])
        if tag in ('a','link','img','script'):
            value=a.get('href') or a.get('src')
            if value: self.links.append(value)
        if tag=='title' or (tag=='script' and a.get('type')=='application/ld+json'): self.mode=tag; self.buffer=''
    def handle_data(self, data):
        if self.mode: self.buffer+=data
    def handle_endtag(self, tag):
        if self.mode==tag:
            (self.titles if tag=='title' else self.jsonld).append(self.buffer); self.mode=None
pages={p:Page(p.read_text()) for p in root.rglob('*.html') if p!=root/'youtube/index.html'}
errors=[]; titles=set()
for p, page in pages.items():
    def check(ok,msg):
        if not ok: errors.append(f'{p}: {msg}')
    check(page.h1==1 or 'noindex' in page.meta.get('robots',''), 'expected one h1')
    check(len(page.titles)==1 and bool(page.titles[0]), 'title missing/duplicate')
    check(bool(page.meta.get('description')), 'description missing')
    check(len(page.canonical)==1 and page.canonical[0].startswith('https://ryu-koda.com/'), 'canonical invalid')
    check(bool(page.canonical) and page.meta.get('og:url')==page.canonical[0], 'OG URL differs from canonical')
    check('robots' in page.meta, 'robots missing')
    if page.titles:
        check(page.titles[0] not in titles,'duplicate title'); titles.add(page.titles[0])
    for key in ('og:image', 'twitter:image'):
        image_url=page.meta.get(key)
        if image_url and urlsplit(image_url).netloc=='ryu-koda.com':
            check((root/unquote(urlsplit(image_url).path.lstrip('/'))).is_file(), f'missing social image: {image_url}')
    for data in page.jsonld:
        schema=json.loads(data)
        if isinstance(schema,dict) and schema.get('@type')=='BlogPosting':
            image_url=schema.get('image')
            check(bool(image_url), 'article structured-data image missing')
            if isinstance(image_url,str) and urlsplit(image_url).netloc=='ryu-koda.com':
                check((root/unquote(urlsplit(image_url).path.lstrip('/'))).is_file(), 'article structured-data image file missing')
    for link in page.links:
        u=urlsplit(link)
        if u.scheme or u.netloc: continue
        target=root/unquote(u.path.lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path)
        if not u.path: target=p
        if target.is_dir(): target=target/'index.html'
        check(target.exists(),f'broken local link: {link}')
        if u.fragment and target in pages: check(unquote(u.fragment) in pages[target].ids,f'broken anchor: {link}')
for node in ET.parse(root/'sitemap-0.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
    path=root/urlsplit(node.text).path.lstrip('/')/'index.html'
    if path not in pages or 'noindex' in pages[path].meta.get('robots',''): errors.append(f'invalid sitemap entry: {node.text}')
assert not errors, '\n'.join(errors)
print(f'SEO checks passed: {len(pages)} pages; metadata, headings, JSON-LD, local links, anchors, sitemap.')
