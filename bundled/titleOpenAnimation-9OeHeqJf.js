import{a as e,u as t}from"./mageTitles-BPvsmJqw.js";import{W as n}from"./index-CrKVIFxm.js";import{n as r,t as i}from"./scrollLock-3m9pTZ22.js";var a=e=>new Promise(t=>setTimeout(t,e));function o(e){let t=[`#ffd87a`,`#ff9de2`,`#fff8e7`,`#fbbf24`];for(let n=0;n<26;n++){let r=document.createElement(`span`);r.className=`chest-open-particle title-open-particle`;let i=n/26*Math.PI*2+Math.random()*.4,a=45+Math.random()*130;r.style.setProperty(`--px`,`${Math.cos(i)*a}px`),r.style.setProperty(`--py`,`${Math.sin(i)*a-40}px`),r.style.background=t[n%t.length],r.style.animationDelay=`${Math.random()*.25}s`,e.appendChild(r)}}function s(n){let r=document.createElement(`article`);return r.className=[`title-reveal-card`,e[n.rarity]||``,`title-reveal-card--glow-${n.glow}`,n.duplicate?`title-reveal-card--duplicate`:``].filter(Boolean).join(` `),r.innerHTML=`
    <div class="title-reveal-card__frame">
      <span class="title-reveal-card__rarity">${n.rarity}</span>
      <span class="title-reveal-card__tag ${t(n)}">[${n.display}]</span>
      <strong class="title-reveal-card__name">${n.name}</strong>
      <span class="title-reveal-card__type">Mage Title</span>
      ${n.duplicate?`<span class="title-reveal-card__dup">Duplicate · +${n.starRefund||0} ★ refunded</span>`:`<span class="title-reveal-card__new">Unlocked!</span>`}
    </div>`,r}function c({boxLabel:e,pulls:t}){return new Promise(c=>{let l=t[0],u=document.createElement(`div`);u.className=`chest-open-overlay title-open-overlay chest-open-overlay--gold`,u.setAttribute(`role`,`dialog`),u.setAttribute(`aria-modal`,`true`),u.setAttribute(`aria-label`,`Opening title box`),u.innerHTML=`
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${e}</p>
        <div class="chest-open-glow title-open-glow" aria-hidden="true"></div>
        <div class="chest-open-stage-wrap">
          <div class="chest-open-stage" data-phase="idle">
            ${n(l?.display||l?.name||``)}
          </div>
          <div class="chest-open-particles" aria-hidden="true"></div>
        </div>
        <p class="chest-open-status">Opening…</p>
        <div class="chest-open-cards title-open-reveals" hidden>
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid title-open-reveals__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect" disabled>Done</button>
      </div>
    `,document.body.appendChild(u),document.body.classList.add(`chest-open-active`,`title-open-active`),i();let d=u.querySelector(`.chest-open-stage`),f=u.querySelector(`.chest-open-status`),p=u.querySelector(`.chest-open-glow`),m=u.querySelector(`.chest-open-particles`),h=u.querySelector(`.chest-open-cards`),g=u.querySelector(`.chest-open-cards__grid`),_=u.querySelector(`.chest-open-collect`);_.addEventListener(`click`,()=>{u.classList.add(`chest-open-overlay--out`),document.body.classList.remove(`chest-open-active`,`title-open-active`),r(),setTimeout(()=>{u.remove(),c()},350)}),requestAnimationFrame(()=>{u.classList.add(`chest-open-overlay--in`)}),(async()=>{await a(350),d.dataset.phase=`rumble`,f&&(f.textContent=`Opening…`),await a(900),d.dataset.phase=`open`,u.classList.add(`chest-open-overlay--burst`),p?.classList.add(`chest-open-glow--on`),o(m),f&&(f.textContent=l?`Unlocked ${l.name}!`:`Opened!`),await a(750),f&&(f.textContent=``),h.hidden=!1,h.classList.add(`chest-open-cards--in`),d.classList.add(`chest-open-stage--dim`),t.forEach((e,t)=>{let n=s(e);n.classList.add(`title-reveal-card--deal`),n.style.animationDelay=`${t*.14}s`,g.appendChild(n)}),await a(400+t.length*200),_.disabled=!1,_.focus()})()})}export{c as playTitleOpenAnimation};