import{H as e,U as t,_ as n,b as r,v as i,y as a}from"./index-DriG9Qjm.js";import{n as o,t as s}from"./scrollLock-3m9pTZ22.js";var c=e=>new Promise(t=>setTimeout(t,e));function l(e,t){let n=t===`gold`?[`#f0d060`,`#e8c547`,`#fff8e7`]:t===`silver`?[`#d4dce8`,`#a8b8d8`,`#eef2f8`]:[`#cd7f32`,`#e8a55a`,`#ffcc80`];for(let t=0;t<24;t++){let r=document.createElement(`span`);r.className=`chest-open-particle`;let i=t/24*Math.PI*2+Math.random()*.4,a=40+Math.random()*120;r.style.setProperty(`--px`,`${Math.cos(i)*a}px`),r.style.setProperty(`--py`,`${Math.sin(i)*a-40}px`),r.style.background=n[t%n.length],r.style.animationDelay=`${Math.random()*.25}s`,e.appendChild(r)}}function u({tier:u,tierLabel:d,pulls:f}){return new Promise(p=>{e[u]||e.bronze;let m=document.createElement(`div`);m.className=`chest-open-overlay chest-open-overlay--${u}`,m.setAttribute(`role`,`dialog`),m.setAttribute(`aria-modal`,`true`),m.setAttribute(`aria-label`,`Opening chest`),m.innerHTML=`
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${d}</p>
        <div class="chest-open-glow" aria-hidden="true"></div>
        <div class="chest-open-stage-wrap">
          <div class="chest-open-stage" data-phase="idle">
            ${t(u)}
          </div>
          <div class="chest-open-particles" aria-hidden="true"></div>
        </div>
        <p class="chest-open-status">Opening…</p>
        <div class="chest-open-cards" hidden>
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect" disabled>Done</button>
      </div>
    `,document.body.appendChild(m),document.body.classList.add(`chest-open-active`),s();let h=m.querySelector(`.chest-open-stage`),g=m.querySelector(`.chest-open-status`),_=m.querySelector(`.chest-open-glow`),v=m.querySelector(`.chest-open-particles`),y=m.querySelector(`.chest-open-cards`),b=m.querySelector(`.chest-open-cards__grid`),x=m.querySelector(`.chest-open-collect`);x.addEventListener(`click`,()=>{m.classList.add(`chest-open-overlay--out`),document.body.classList.remove(`chest-open-active`),o(),setTimeout(()=>{m.remove(),p()},350)}),requestAnimationFrame(()=>{m.classList.add(`chest-open-overlay--in`)}),(async()=>{await c(350),h.dataset.phase=`rumble`,g&&(g.textContent=`Opening…`),await c(900),h.dataset.phase=`open`,m.classList.add(`chest-open-overlay--burst`),_?.classList.add(`chest-open-glow--on`),l(v,u),g&&(g.textContent=`Opened!`),await c(750),g&&(g.textContent=``),y.hidden=!1,y.classList.add(`chest-open-cards--in`),h.classList.add(`chest-open-stage--dim`),f.forEach((e,t)=>{let i=r(e,{button:!0,deal:!0,gallery:!0,onClick:()=>a(e)});if(i.style.animationDelay=`${t*.14}s`,e.duplicate){i.classList.add(`spell-card--duplicate-pull`);let t=document.createElement(`span`);t.className=`chest-pull-dup-badge`,t.textContent=e.starRefund?`Duplicate · +${e.starRefund} ★`:`Duplicate · +${e.gemRefund} ◆`,i.appendChild(t)}b.appendChild(i),n(i,e.rarity)}),i(b),await c(400+f.length*140),x.disabled=!1,x.focus()})()})}export{u as playChestOpenAnimation};