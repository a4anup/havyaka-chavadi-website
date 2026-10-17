// Festive layer shared by the coming-soon page and the main site (styles in css/festive.css).
// Builds the toran, diya sparks and mandala, opens the logo doors, the 3D logo tilt and the copy-email button.
// Pages call HCFestive.open(onReveal) once their content is ready to be shown.
(function(){
 const root=document.documentElement,calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

 // Mango-leaf toran with marigolds; rebuilt to fit the width
 const torans=document.querySelectorAll('.toran'),buildToran=()=>torans.forEach(t=>{const n=Math.max(9,Math.round((t.clientWidth||innerWidth)/30));let h='';for(let i=0;i<n;i++){const k=n>1?i/(n-1):0,drop=Math.sin(k*Math.PI)*10;h+=`<span class="${i%3===1?'marigold':'leaf'}" style="--y:${drop.toFixed(1)}px;--d:${(i*.13).toFixed(2)}s"></span>`}t.innerHTML=h});
 if(torans.length){buildToran();let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(buildToran,200)})}

 // Diya sparks drifting upward
 if(!calm)document.querySelectorAll('.embers').forEach(box=>{const n=innerWidth<640?12:Number(box.dataset.count||22);let h='';for(let i=0;i<n;i++){const s=(2+Math.random()*4).toFixed(1);h+=`<span style="left:${(Math.random()*100).toFixed(1)}%;width:${s}px;height:${s}px;--dur:${(9+Math.random()*10).toFixed(1)}s;--delay:-${(Math.random()*18).toFixed(1)}s;--x:${(Math.random()*80-40).toFixed(0)}px"></span>`}box.innerHTML=h});

 // Mandala: three rings of petals
 const ns='http://www.w3.org/2000/svg',ring=(g,n,d,extra)=>{if(!g)return;for(let i=0;i<n;i++){const p=document.createElementNS(ns,'path');p.setAttribute('d',d);p.setAttribute('pathLength','1');p.setAttribute('transform',`rotate(${i*360/n})`);p.style.setProperty('--d',(i/n).toFixed(2));g.appendChild(p)}if(extra)g.insertAdjacentHTML('beforeend',extra)};
 // Each ring gets its own <svg> layer so its slow turn runs on the GPU
 const mandalas=[...document.querySelectorAll('svg.mandala')].map(svg=>{const m=document.createElement('span');m.className=svg.getAttribute('class');m.setAttribute('aria-hidden','true');m.innerHTML=['m-outer','m-mid','m-inner'].map(c=>`<svg class="${c}" viewBox="-100 -100 200 200"><g></g></svg>`).join('');svg.replaceWith(m);return m});
 mandalas.forEach(m=>{ring(m.querySelector('.m-outer g'),32,'M0-97Q5-88 0-79Q-5-88 0-97Z','<circle r="99" pathLength="1"/><circle r="76" pathLength="1" class="dots"/>');ring(m.querySelector('.m-mid g'),16,'M0-74C13-62 10-48 0-42C-10-48-13-62 0-74Z','<circle r="40" pathLength="1"/>');ring(m.querySelector('.m-inner g'),12,'M0-40Q9-33 0-24Q-9-33 0-40Z')});

 // Logo tilts toward the pointer on devices with a mouse
 const tilts=document.querySelectorAll('.tilt');
 if(tilts.length&&!calm&&matchMedia('(hover:hover)').matches){addEventListener('pointermove',e=>tilts.forEach(t=>{const r=t.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const x=(e.clientX-(r.left+r.width/2))/innerWidth,y=(e.clientY-(r.top+r.height/2))/innerHeight;t.style.transform=`rotateX(${(-y*14).toFixed(2)}deg) rotateY(${(x*18).toFixed(2)}deg)`}),{passive:true});document.addEventListener('pointerleave',()=>tilts.forEach(t=>t.style.transform=''))}

 // Copy-email buttons: copies data-copy and briefly shows the translated toast next to it
 document.querySelectorAll('.copy-btn[data-copy]').forEach(btn=>{const toast=btn.parentElement.querySelector('.copy-toast');let tt;
  if(!(navigator.clipboard&&window.isSecureContext)){btn.hidden=true;return}
  btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy)}catch(e){return}btn.classList.add('done');if(toast){const msg=toast.textContent;toast.textContent='';requestAnimationFrame(()=>{toast.textContent=msg;toast.classList.add('show')})}clearTimeout(tt);tt=setTimeout(()=>{btn.classList.remove('done');toast?.classList.remove('show')},2000)})});

 // Reveal: mandalas start drawing, page callbacks run, then the logo doors swing open.
 // Safety net: if a page never calls open() (e.g. its text failed to load), it runs by itself.
 let state=0;const waiting=[];
 window.HCFestive={open(onReveal){if(onReveal){if(state)onReveal();else waiting.push(onReveal)}if(state)return;state=1;
  mandalas.forEach(m=>m.classList.add('go'));waiting.splice(0).forEach(f=>f());
  document.querySelectorAll('.logo-doors').forEach(d=>{if(calm){d.remove();return}setTimeout(()=>d.classList.add('open'),Number(d.dataset.delay||700));setTimeout(()=>d.remove(),Number(d.dataset.delay||700)+1700)})}};
 setTimeout(()=>HCFestive.open(),3000);
})();
