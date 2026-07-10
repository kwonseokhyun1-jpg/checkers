import{a as e,d as t,r as n}from"./index-CX0rTM6x.js";import{n as r,t as i}from"./scrollLock-3m9pTZ22.js";var a=e=>new Promise(t=>setTimeout(t,e));function o(e,t){let n=t===`gold`?[`#ffd87a`,`#ff9de2`,`#fff8e7`]:t===`silver`?[`#a5f3fc`,`#c4b5fd`,`#eef2f8`]:[`#d8b4fe`,`#f0abfc`,`#e9d5ff`];for(let t=0;t<26;t++){let r=document.createElement(`span`);r.className=`chest-open-particle cosmetic-open-particle`;let i=t/26*Math.PI*2+Math.random()*.4,a=45+Math.random()*130;r.style.setProperty(`--px`,`${Math.cos(i)*a}px`),r.style.setProperty(`--py`,`${Math.sin(i)*a-40}px`),r.style.background=n[t%n.length],r.style.animationDelay=`${Math.random()*.25}s`,e.appendChild(r)}}function s({boxId:s,boxLabel:c,pulls:l}){return new Promise(u=>{let d=(n[s]||n.style_crate).visual,f=document.createElement(`div`);f.className=`chest-open-overlay cosmetic-open-overlay chest-open-overlay--${d} cosmetic-open-overlay--${s}`,f.setAttribute(`role`,`dialog`),f.setAttribute(`aria-modal`,`true`),f.setAttribute(`aria-label`,`Opening cosmetic box`),f.innerHTML=`
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${c}</p>
        <div class="chest-open-glow cosmetic-open-glow" aria-hidden="true"></div>
        <div class="chest-open-stage-wrap">
          <div class="chest-open-stage" data-phase="idle">
            ${e(s)}
          </div>
          <div class="chest-open-particles" aria-hidden="true"></div>
        </div>
        <p class="chest-open-status">Opening…</p>
        <div class="chest-open-cards cosmetic-open-reveals" hidden>
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid cosmetic-open-reveals__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect">Done</button>
      </div>
    `,document.body.appendChild(f),document.body.classList.add(`chest-open-active`,`cosmetic-open-active`),i();let p=f.querySelector(`.chest-open-stage`),m=f.querySelector(`.chest-open-status`),h=f.querySelector(`.chest-open-glow`),g=f.querySelector(`.chest-open-particles`),_=f.querySelector(`.chest-open-cards`),v=f.querySelector(`.chest-open-cards__grid`),y=f.querySelector(`.chest-open-collect`);y.addEventListener(`click`,()=>{f.classList.add(`chest-open-overlay--out`),document.body.classList.remove(`chest-open-active`,`cosmetic-open-active`),r(),setTimeout(()=>{f.remove(),u()},350)}),requestAnimationFrame(()=>{f.classList.add(`chest-open-overlay--in`)}),(async()=>{await a(350),p.dataset.phase=`rumble`,m&&(m.textContent=`Opening…`),await a(900),p.dataset.phase=`open`,f.classList.add(`chest-open-overlay--burst`),h?.classList.add(`chest-open-glow--on`),o(g,d),m&&(m.textContent=`Opened!`),await a(750),m&&(m.textContent=``),_.hidden=!1,_.classList.add(`chest-open-cards--in`),p.classList.add(`chest-open-stage--dim`),l.forEach((e,n)=>{let r=t(e);r.classList.add(`cosmetic-reveal-card--deal`),r.style.animationDelay=`${n*.14}s`,v.appendChild(r)}),await a(400+l.length*160),y.disabled=!1,y.focus()})()})}export{s as playCosmeticOpenAnimation};