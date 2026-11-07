// Only explicit, non-content events are sent. No form values or selected text.
const ID = 'G-RJXC50ZSJL';
const KEY = 'ryu-analytics-consent-v1';
const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
let enabled = false;
function preference() { try { return localStorage.getItem(KEY); } catch { return null; } }
function save(value: string) { try { localStorage.setItem(KEY, value); } catch {} }
export function track(name: string, params: Record<string,string|number> = {}) {
  if (enabled && location.hostname === 'ryu-koda.com') w.gtag?.('event', name, params);
}
function start() {
  if (enabled || location.hostname !== 'ryu-koda.com' || !ID.startsWith('G-')) return;
  enabled = true;
  w[`ga-disable-${ID}`] = false;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer!.push(arguments); };
  w.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  w.gtag('js',new Date());
  let referrer = '';
  try { referrer = new URL(document.referrer).origin + '/'; } catch {}
  w.gtag('config',ID,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:location.origin+location.pathname,page_referrer:referrer});
  track('page_view',{page_location:location.origin+location.pathname,page_title:document.title,page_referrer:referrer});
  const script=document.createElement('script'); script.async=true;
  script.src='https://www.googletagmanager.com/gtag/js?id='+ID;
  document.head.append(script);
}
function boot() {
  const panel=document.querySelector<HTMLElement>('[data-analytics-panel]');
  if(!panel) return;
  if(preference()==='granted') start();
  else if(preference()===null && location.hostname==='ryu-koda.com') panel.hidden=false;
  document.querySelector('[data-analytics-settings]')?.addEventListener('click',()=>{panel.hidden=false;panel.querySelector<HTMLButtonElement>('button')?.focus();});
  panel.querySelector('[data-analytics-accept]')?.addEventListener('click',()=>{save('granted');start();panel.hidden=true;});
  panel.querySelector('[data-analytics-reject]')?.addEventListener('click',()=>{
    save('denied');enabled=false;w[`ga-disable-${ID}`]=true;
    for(const item of document.cookie.split(';')) {
      const name=item.trim().split('=')[0];
      if(name==='_ga'||name.startsWith('_ga_')) for(const domain of ['', ';domain=ryu-koda.com',';domain=.ryu-koda.com']) document.cookie=`${name}=;max-age=0;path=/${domain}`;
    }
    panel.hidden=true; if(w.gtag) location.reload();
  });
  document.addEventListener('click',event=>{
    const a=(event.target as Element).closest<HTMLAnchorElement>('a[href]');
    if(!a) return;
    const url=new URL(a.href,location.href);
    if(url.origin!==location.origin) return;
    if(a.closest('.related-posts')) track('related_article_click',{target_path:url.pathname});
    if(url.pathname==='/subscribe/') track('rss_guide_click');
    if(url.pathname==='/rss.xml') track('rss_feed_click');
  });
  document.querySelectorAll<HTMLElement>('.prose pre, [data-experiment] pre').forEach((pre,index)=>{
    const code=pre.querySelector('code');if(!code)return;
    const button=document.createElement('button');button.type='button';button.className='code-copy';button.textContent='コードをコピー';
    pre.before(button);
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.textContent||'');button.textContent='コピーしました';track('code_copy',{code_block:index+1});}catch{button.textContent='コピーできませんでした。コードを選択してコピーしてください。';}});
  });
  document.querySelectorAll<HTMLElement>('[data-experiment]').forEach(root=>{
    let sent=false;
    const used=()=>{if(sent||!enabled)return;sent=true;track('experiment_start',{experiment:root.dataset.experiment!});};
    root.addEventListener('pointerdown',e=>{if((e.target as Element).closest('.stage, .controls'))used();});
    root.addEventListener('keydown',e=>{if(['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))used();});
    root.addEventListener('change',used);
  });
  const article=document.querySelector<HTMLElement>('.prose');
  if(article && location.pathname.startsWith('/blog/')){
    const seen=new Set<number>();let pending=false;
    const measure=()=>{pending=false;if(!enabled)return;const box=article.getBoundingClientRect();if(box.height<=0)return;const percent=Math.max(0,Math.min(100,(innerHeight-box.top)/box.height*100));for(const depth of [25,50,75,90])if(percent>=depth&&!seen.has(depth)){seen.add(depth);track('article_progress',{percent_scrolled:depth});}};
    addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(measure);}},{passive:true});
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
