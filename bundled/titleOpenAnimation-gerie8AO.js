import{a as e}from"./mageTitles-DcAwBwLH.js";import{n as t,t as n}from"./scrollLock-3m9pTZ22.js";var r=e=>new Promise(t=>setTimeout(t,e));function i(t){let n=document.createElement(`article`);return n.className=[`title-reveal-card`,e[t.rarity]||``,`title-reveal-card--glow-${t.glow}`,t.duplicate?`title-reveal-card--duplicate`:``].filter(Boolean).join(` `),n.innerHTML=`
    <div class="title-reveal-card__frame">
      <span class="title-reveal-card__rarity">${t.rarity}</span>
      <span class="title-reveal-card__tag mage-title-tag mage-title-tag--glow-${t.glow} ${e[t.rarity]||``}">[${t.display}]</span>
      <strong class="title-reveal-card__name">${t.name}</strong>
      <span class="title-reveal-card__type">Mage Title</span>
      ${t.duplicate?`<span class="title-reveal-card__dup">Duplicate · +${t.starRefund||0} ★ refunded</span>`:`<span class="title-reveal-card__new">Unlocked!</span>`}
    </div>`,n}function a({boxLabel:e,pulls:a}){return new Promise(o=>{let s=document.createElement(`div`);s.className=`chest-open-overlay title-open-overlay chest-open-overlay--gold`,s.setAttribute(`role`,`dialog`),s.setAttribute(`aria-modal`,`true`),s.setAttribute(`aria-label`,`Opening title box`),s.innerHTML=`
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
    `,document.body.appendChild(s),document.body.classList.add(`chest-open-active`,`title-open-active`),n();let c=s.querySelector(`.chest-open-status`),l=s.querySelector(`.chest-open-cards__grid`),u=s.querySelector(`.chest-open-collect`);u.addEventListener(`click`,()=>{s.classList.add(`chest-open-overlay--out`),document.body.classList.remove(`chest-open-active`,`title-open-active`),t(),setTimeout(()=>{s.remove(),o()},350)}),requestAnimationFrame(()=>{s.classList.add(`chest-open-overlay--in`)}),(async()=>{await r(500),c&&(c.textContent=``),a.forEach((e,t)=>{let n=i(e);n.classList.add(`title-reveal-card--deal`),n.style.animationDelay=`${t*.14}s`,l.appendChild(n)}),await r(400+a.length*200),u.disabled=!1,u.focus()})()})}export{a as playTitleOpenAnimation};