// Coming-soon page: language + theme toggles and headline animation; festive effects come from js/festive.js.
// All copy comes from config/locales.json. No backend or tracking.
(async function(){
 const $=s=>document.querySelector(s),root=document.documentElement;
 const store={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
 const setToggle=(sel,key,val)=>{const box=$(sel),btns=[...box.querySelectorAll('button')];btns.forEach((b,i)=>{const on=b.dataset[key]===val;b.setAttribute('aria-checked',String(on));if(on)box.style.setProperty('--i',i)})};
 const reveal=()=>window.HCFestive?HCFestive.open(()=>document.body.classList.add('ready')):document.body.classList.add('ready');

 // Theme first so it works even if the locale file fails to load
 const media=matchMedia('(prefers-color-scheme: dark)');const stored=store.get('hc-theme');let themeChoice=['light','dark','auto'].includes(stored)?stored:'auto';
 const applyTheme=()=>{root.dataset.theme=themeChoice==='auto'?(media.matches?'dark':'light'):themeChoice;setToggle('#themeToggle','themeValue',themeChoice)};
 $('#themeToggle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;themeChoice=b.dataset.themeValue;store.set('hc-theme',themeChoice);applyTheme()});media.addEventListener?.('change',applyTheme);applyTheme();
 $('#year').textContent=new Date().getFullYear();

 let messages;
 try{const r=await fetch('./config/locales.json',{cache:'no-cache'});if(!r.ok)throw Error('Locale fetch failed');messages=await r.json()}catch(e){console.error('Could not load locale config. Serve with a local HTTP server (not file://).',e);reveal();return}
 // Kannada by default; English only if the visitor chose it before
 let language=store.get('hc-language')==='en'?'en':'kn';

 // Headline is split into words so each one can rise in with its own gold shimmer
 const splitTitle=()=>{const h=$('.soon-title'),words=h.textContent.trim().split(/\s+/);h.setAttribute('aria-label',h.textContent.trim());h.innerHTML='';words.forEach((w,i)=>{const s=document.createElement('span');s.className='w';s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i);s.textContent=w;h.append(s,' ')})};
 const applyLanguage=()=>{const dict=messages[language];root.lang=language;document.title=dict.soonPageTitle;const meta=$('meta[name="description"]');if(meta)meta.content=dict.soonPageDescription;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(dict[k]!==undefined)el.textContent=dict[k]});document.querySelectorAll('[data-i18n-alt]').forEach(el=>{const k=el.dataset.i18nAlt;if(dict[k]!==undefined)el.alt=dict[k]});document.querySelectorAll('[data-i18n-aria]').forEach(el=>{const k=el.dataset.i18nAria;if(dict[k]!==undefined){el.setAttribute('aria-label',dict[k]);if(el.tagName==='BUTTON')el.title=dict[k]}});setToggle('#langToggle','lang',language);splitTitle()};
 $('#langToggle').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;language=b.dataset.lang;store.set('hc-language',language);applyLanguage()});

 applyLanguage();reveal();
})();
