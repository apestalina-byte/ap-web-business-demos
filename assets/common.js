(()=>{
  'use strict';
  const nav=document.querySelector('[data-nav]');
  const toggle=document.querySelector('[data-menu-toggle]');
  if(nav&&toggle){
    const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Открыть меню')};
    toggle.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }
  const reveals=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver'in window&& !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target)}}),{threshold:0.1});
    reveals.forEach(el=>observer.observe(el));
  }else reveals.forEach(el=>el.classList.add('in-view'));
  window.apweb = {
    async copyBrief(text,status){
      // clipboard and external navigation require a direct user gesture; open first to avoid popup blocks.
      window.open('https://t.me/artem10p','_blank','noopener,noreferrer');
      try{
        await navigator.clipboard.writeText(text);
        status.textContent='Текст скопирован. Вставьте его в Telegram и отправьте самостоятельно.';
      }catch(e){
        const box=document.createElement('textarea');box.value=text;box.setAttribute('readonly','');box.style.cssText='position:fixed;top:10px;left:10px;z-index:2000;width:240px;height:100px;opacity:.01';document.body.append(box);box.select();
        let ok=false;try{ok=document.execCommand('copy')}catch(_){}box.remove();
        status.textContent=ok?'Текст скопирован. Вставьте его в Telegram.':'Автокопирование недоступно. Откройте Telegram @artem10p и отправьте описание самостоятельно.';
      }
    }
  };
})();
