import{a as e,u as t}from"./mageTitles-BPvsmJqw.js";import{n,t as r}from"./scrollLock-3m9pTZ22.js";var i=e=>new Promise(t=>setTimeout(t,e));function a(n){let r=document.createElement(`article`);return r.className=[`title-reveal-card`,e[n.rarity]||``,`title-reveal-card--glow-${n.glow}`,n.duplicate?`title-reveal-card--duplicate`:``].filter(Boolean).join(` `),r.innerHTML=`
    <div class="title-reveal-card__frame">
      <span class="title-reveal-card__rarity">${n.rarity}</span>
      <span class="title-reveal-card__tag ${t(n)}">[${n.display}]</span>
      <strong class="title-reveal-card__name">${n.name}</strong>
      <span class="title-reveal-card__type">Mage Title</span>
      ${n.duplicate?`<span class="title-reveal-card__dup">Duplicate · +${n.starRefund||0} ★ refunded</span>`:`<span class="title-reveal-card__new">Unlocked!</span>`}
    </div>`,r}function o({boxLabel:e,pulls:t}){return new Promise(o=>{let s=document.createElement(`div`);s.className=`chest-open-overlay title-open-overlay chest-open-overlay--gold`,s.setAttribute(`role`,`dialog`),s.setAttribute(`aria-modal`,`true`),s.setAttribute(`aria-label`,`Opening title box`),s.innerHTML=`
      <div class="chest-open-backdrop"></div>
      <div class="chest-open-scene">
        <p class="chest-open-label">${e}</p>
        <div class="chest-open-glow title-open-glow chest-open-glow--on" aria-hidden="true"></div>
        <p class="chest-open-status">Revealing title…</p>
        <div class="chest-open-cards title-open-reveals">
          <p class="chest-open-cards__title">You got</p>
          <div class="chest-open-cards__grid title-open-reveals__grid"></div>
        </div>
        <button type="button" class="btn-primary chest-open-collect">Done</button>
      </div>
    `,document.body.appendChild(s),document.body.classList.add(`chest-open-active`,`title-open-active`),r();let c=s.querySelector(`.chest-open-status`),l=s.querySelector(`.chest-open-cards__grid`),u=s.querySelector(`.chest-open-collect`);u.addEventListener(`click`,()=>{s.classList.add(`chest-open-overlay--out`),document.body.classList.remove(`chest-open-active`,`title-open-active`),n(),setTimeout(()=>{s.remove(),o()},350)}),requestAnimationFrame(()=>{s.classList.add(`chest-open-overlay--in`)}),(async()=>{await i(500),c&&(c.textContent=``),t.forEach((e,t)=>{let n=a(e);n.classList.add(`title-reveal-card--deal`),n.style.animationDelay=`${t*.14}s`,l.appendChild(n)}),await i(400+t.length*200),u.disabled=!1,u.focus()})()})}export{o as playTitleOpenAnimation};