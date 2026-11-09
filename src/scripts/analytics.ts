// Dynamic controls follow the static page's language, without changing consent behavior.
const analyticsLocale = document.documentElement.lang.toLowerCase();
const uiText = (ja: string, en: string, zh: string) => analyticsLocale.startsWith('en') ? en : analyticsLocale.startsWith('zh') ? zh : ja;
// Only explicit, non-content events are sent. No form values or selected text.
const ID = 'G-RJXC50ZSJL';
const KEY = 'ryu-analytics-consent-v1';
const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean };
let enabled = false;
const EXCLUDE_KEY = 'ryu-analytics-exclude-v1';
function excluded() { try { return localStorage.getItem(EXCLUDE_KEY) === 'true'; } catch { return false; } }
function preference() { try { return localStorage.getItem(KEY); } catch { return null; } }
function save(value: string) { try { localStorage.setItem(KEY, value); } catch {} }
export function track(name: string, params: Record<string,string|number> = {}) {
  if (enabled && !excluded() && location.hostname === 'ryu-koda.com') w.gtag?.('event', name, params);
}
function start() {
  if (excluded() || enabled || location.hostname !== 'ryu-koda.com' || !ID.startsWith('G-')) return;
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
  if(!excluded() && preference()==='granted') start();
  else if(!excluded() && preference()===null && location.hostname==='ryu-koda.com') panel.hidden=false;
  const exclusion = panel.querySelector<HTMLButtonElement>('[data-analytics-exclude]');
  if(exclusion) {
    exclusion.textContent = excluded() ? uiText("このブラウザの除外を解除する","Include this browser in analytics","取消排除此浏览器") : uiText("このブラウザを計測から除外する","Exclude this browser from analytics","将此浏览器排除在统计之外");
    exclusion.setAttribute('aria-pressed', String(excluded()));
    exclusion.addEventListener('click',()=>{
      try {
        localStorage.setItem(EXCLUDE_KEY, excluded() ? 'false' : 'true');
        enabled=false;
        w[`ga-disable-${ID}`]=true;
        location.reload();
      } catch {
        const status=panel.querySelector<HTMLElement>('[data-analytics-exclude-status]');
        if(status) status.textContent=uiText("設定を保存できませんでした。ブラウザのサイトデータ設定をご確認ください。","Could not save your preference. Check your browser’s site data settings.","无法保存设置，请检查浏览器的网站数据设置。");
      }
    });
  }
  const status=panel.querySelector<HTMLElement>('[data-analytics-exclude-status]');
  if(status) status.textContent=excluded() ? uiText("このブラウザはGA4・Cloudflare Web Analyticsの計測から除外中です。","This browser is excluded from GA4 and Cloudflare Web Analytics.","此浏览器已从 GA4 和 Cloudflare Web Analytics 统计中排除。") : uiText("このブラウザは除外されていません。","This browser is not excluded.","此浏览器尚未被排除。");
  document.querySelector('[data-analytics-settings]')?.addEventListener('click',()=>{panel.hidden=false;panel.querySelector<HTMLButtonElement>('button')?.focus();});
  panel.querySelector('[data-analytics-close]')?.addEventListener('click',()=>{panel.hidden=true;});
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
    const button=document.createElement('button');button.type='button';button.className='code-copy';button.textContent=uiText("コードをコピー","Copy code","复制代码");
    pre.before(button);
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code.textContent||'');button.textContent=uiText("コピーしました","Copied","已复制");track('code_copy',{code_block:index+1});}catch{button.textContent=uiText("コピーできませんでした。コードを選択してコピーしてください。","Could not copy. Select the code and copy it manually.","无法复制，请选中代码后手动复制。");}});
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
