// All user-facing copy comes from config/locales.json. No backend or tracking.
(async function(){
 const $=s=>document.querySelector(s);let messages;
 try{const r=await fetch('./config/locales.json',{cache:'no-cache'});if(!r.ok)throw Error('Locale fetch failed');messages=await r.json()}catch(e){console.error('Could not load locale config. Serve with a local HTTP server (not file://).',e);return}
 const savedLang=localStorage.getItem('hc-language');let language=savedLang==='kn'?'kn':'en';
 const applyLanguage=()=>{const dict=messages[language];document.documentElement.lang=language;document.title=dict.siteTitle;const meta=$('meta[name="description"]');if(meta)meta.content=dict.siteDescription;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(dict[k]!==undefined)el.textContent=dict[k]});document.querySelectorAll('[data-i18n-aria]').forEach(el=>{const k=el.dataset.i18nAria;if(dict[k]!==undefined){el.setAttribute('aria-label',dict[k]);if(el.tagName==='BUTTON')el.title=dict[k]}});setToggle('#langToggle','lang',language);$('#menuBtn').setAttribute('aria-label',dict.menuOpen)};
 const setToggle=(sel,key,val)=>{const box=$(sel),btns=[...box.querySelectorAll('button')];btns.forEach((b,i)=>{const on=b.dataset[key]===val;b.setAttribute('aria-checked',String(on));if(on)box.style.setProperty('--i',i)})};
 $('#langToggle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;language=b.dataset.lang;localStorage.setItem('hc-language',language);applyLanguage()});
 const media=matchMedia('(prefers-color-scheme: dark)');const stored=localStorage.getItem('hc-theme');let themeChoice=['light','dark','auto'].includes(stored)?stored:'auto';
 const applyTheme=()=>{document.documentElement.dataset.theme=themeChoice==='auto'?(media.matches?'dark':'light'):themeChoice;setToggle('#themeToggle','themeValue',themeChoice)};$('#themeToggle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;themeChoice=b.dataset.themeValue;localStorage.setItem('hc-theme',themeChoice);applyTheme()});media.addEventListener?.('change',applyTheme);applyTheme();
 const setMenu=open=>{$('#nav').classList.toggle('open',open);const b=$('#menuBtn');b.setAttribute('aria-expanded',String(open));b.textContent=open?'✕':'☰';b.setAttribute('aria-label',messages[language][open?'menuClose':'menuOpen'])};
 $('#menuBtn').addEventListener('click',()=>setMenu(!$('#nav').classList.contains('open')));document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
 // Phones: show the sticky app bar only while no other store buttons are on screen
 const bar=$('#appBar');if(bar&&'IntersectionObserver' in window){const seen=new Set(),io=new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));bar.classList.toggle('show',!seen.size)});document.querySelectorAll('main .store-row').forEach(r=>io.observe(r))}
 // Store links + QR codes both come from config/app-links.json; QR is drawn as crisp SVG with high error correction so the centre logo doesn't break it
 const drawQR=(el,url)=>{const q=qrcode(0,'H');q.addData(url);q.make();const n=q.getModuleCount();let d='';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(q.isDark(y,x))d+=`M${x} ${y}h1v1h-1z`;el.innerHTML=`<svg viewBox="-1 -1 ${n+2} ${n+2}" shape-rendering="crispEdges" aria-hidden="true"><path fill="#071E38" d="${d}"/></svg>`};
 fetch('./config/app-links.json',{cache:'no-cache'}).then(r=>r.ok?r.json():{}).then(links=>{document.querySelectorAll('.store-badge').forEach(a=>{if(links[a.dataset.store])a.href=links[a.dataset.store]});let shown=0;document.querySelectorAll('.qr-card').forEach(c=>{const url=links[c.dataset.store];c.hidden=!(url&&window.qrcode);if(!c.hidden){drawQR(c.querySelector('.qr-svg'),url);shown++}});$('#qrRow').hidden=!shown}).catch(()=>{});
 // Scroll reveal: sections fade up once as they enter the viewport
 const reveal=document.querySelectorAll('[data-reveal]');if('IntersectionObserver' in window){const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -40px 0px'});reveal.forEach(el=>ro.observe(el))}else reveal.forEach(el=>el.classList.add('in'));
 const header=$('.header'),onScroll=()=>header.classList.toggle('scrolled',scrollY>8);addEventListener('scroll',onScroll,{passive:true});onScroll();
 // Feature cards: soft gold spotlight follows the pointer
 if(matchMedia('(hover:hover)').matches)document.querySelectorAll('.feature-card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));
 $('#year').textContent=new Date().getFullYear();applyLanguage();
 // Opening doors, mandala and other festive effects (js/festive.js) start once the text is in place
 window.HCFestive?.open();
})();
