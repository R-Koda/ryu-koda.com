(() => {
  const key = 'ryu-language-v1';
  const labels = {ja:'日本語', en:'English', 'zh-cn':'简体中文'};
  const current = document.documentElement.lang.toLowerCase() === 'zh-cn' ? 'zh-cn' : document.documentElement.lang.startsWith('en') ? 'en' : 'ja';
  const links = [...document.querySelectorAll('.language-switch a[data-language]')];
  const save = language => {try {localStorage.setItem(key,language);} catch {}};
  links.forEach(link => link.addEventListener('click', () => save(link.dataset.language)));
  document.addEventListener('keydown', event => {
    if(event.key==='Escape') document.querySelectorAll('.language-switch[open]').forEach(el=>{el.removeAttribute('open');el.querySelector('summary').focus();});
  });
  document.addEventListener('click',event=>document.querySelectorAll('.language-switch[open]').forEach(el=>{if(!el.contains(event.target))el.removeAttribute('open');}));
  let preferred; try {preferred=localStorage.getItem(key);}catch{}
  // Explicit language URLs always win. Never redirect based on IP or browser language.
  if(!preferred) {
    const first = (navigator.languages?.[0] || navigator.language || 'ja').toLowerCase();
    preferred = first.startsWith('zh') ? 'zh-cn' : first.startsWith('en') ? 'en' : 'ja';
  }
  const target = links.find(a=>a.dataset.language===preferred);
  const box = document.querySelector('#language-suggestion');
  if(current === 'ja' && preferred !== current && target && box) {
    box.hidden=false;
    const a=document.createElement('a');a.href=target.getAttribute('href');a.lang=preferred==='zh-cn'?'zh-CN':preferred;
    a.textContent=preferred==='en'?'Read this page in English':'用简体中文阅读本页';a.addEventListener('click',()=>save(preferred));
    const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label',preferred==='en'?'Keep Japanese':'继续使用日语');close.addEventListener('click',()=>{save('ja');box.hidden=true;});
    box.append(a,close);
  }
})();
