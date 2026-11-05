"""Check access-growth changes without claiming search or traffic results."""
from pathlib import Path
from html.parser import HTMLParser
import json
from urllib.parse import urlparse, parse_qs
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__();self.images=[];self.share=[];self.canonical=None;self.feed(path.read_text())
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='img':self.images.append(a)
  if tag=='a' and 'twitter.com/intent/tweet' in a.get('href',''):self.share.append(a['href'])
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a['href']
manifest=json.loads(Path('src/data/article-thumbnails.json').read_text())
for slug in manifest:
 p=Page(Path(f'dist/blog/{slug}/index.html'))
 assert len(p.share)==1, f'{slug}: share button missing or duplicated'
 assert parse_qs(urlparse(p.share[0]).query)['url']==[p.canonical], f'{slug}: share URL not canonical'
for path in ['dist/index.html','dist/blog/index.html']:
 p=Page(Path(path));images=[i for i in p.images if '/article-thumbnails/' in i.get('src','')]
 assert images,f'{path}: no responsive thumbnails'
 for img in images:
  assert '360w' in img.get('srcset','') and '640w' in img['srcset']
  assert img.get('width') and img.get('height') and img.get('loading')=='lazy'
for data in manifest.values():
 for variant in data['variants']:
  p=Path('dist'+variant['src']);assert p.stat().st_size==variant['bytes']
print(json.dumps({'articles':len(manifest),'original_image_bytes':sum(v['originalBytes'] for v in manifest.values()),'360px_image_bytes':sum(v['variants'][0]['bytes'] for v in manifest.values()),'640px_image_bytes':sum(v['variants'][1]['bytes'] for v in manifest.values()),'traffic_change':'not measured'},ensure_ascii=False))
