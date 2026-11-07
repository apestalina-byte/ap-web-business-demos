"""Dependency-free checks for the shipped static site."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.links=[];self.images=[];self.h1=0;self.lang=None;self.title=False;self.description=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='html':self.lang=a.get('lang')
        if tag=='h1':self.h1+=1
        if tag=='title':self.title=True
        if tag=='meta' and a.get('name')=='description':self.description=bool(a.get('content'))
        if tag=='img' and 'src' in a:self.images.append(a)
        for k in ['href','src']:
            if k in a:self.links.append(a[k])
files=[ROOT/'index.html',*sorted((ROOT/'examples').glob('*/index.html'))]
parsers={}
for p in files:
    page=Page();page.feed(p.read_text());parsers[p]=page
    assert page.h1==1,(p,'exactly one h1')
    assert page.lang=='ru' and page.title and page.description,(p,'metadata')
    assert len(page.ids)==len(set(page.ids)),(p,'duplicate IDs')
    for im in page.images:
        assert im.get('alt') and im.get('width') and im.get('height'),(p,'image attributes')
for p,page in parsers.items():
    for link in page.links:
        assert link.strip(),(p,'empty link')
        u=urlparse(link)
        if u.scheme:
            assert u.scheme=='https',(p,link)
            assert u.netloc in {'t.me','apestalina-byte.github.io'},(p,link)
            continue
        target=(p.parent/unquote(u.path)).resolve() if u.path else p
        assert target.exists(),(p,'missing',str(target))
        if u.fragment:
            assert target in parsers and u.fragment in parsers[target].ids,(p,'missing anchor',link)
for p in (ROOT/'assets').glob('*.js'):
    text=p.read_text()
    assert not any(v in text for v in ['fetch(', 'XMLHttpRequest', 'alingua.site','localStorage','sessionStorage']),p
print(json.dumps({'pages':len(files),'links_checked':sum(len(v.links) for v in parsers.values()),'images_checked':sum(len(v.images) for v in parsers.values()),'result':'passed'},ensure_ascii=False))
