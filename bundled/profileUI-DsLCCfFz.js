import{$ as e,A as t,C as n,D as r,E as i,G as a,L as o,M as s,N as c,O as l,P as u,Q as d,S as f,U as p,W as m,_ as h,b as g,k as _,m as v,nt as y,ot as b,v as x,w as S,x as ee,y as C}from"./storage-CfeHlrhG.js";import{a as w,c as T,d as E,l as D,o as O,t as k,u as A}from"./mageTitles-BPvsmJqw.js";import{a as j,c as te,o as ne}from"./auth-gLIZKPc6.js";import{W as re,c as M,i as N,l as P,n as F,o as I,r as L,s as R,t as z,u as B}from"./index-CGBw9q6N.js";import{playCosmeticOpenAnimation as V}from"./cosmeticOpenAnimation-_b-CZj9J.js";import{notifyUnlockTutorial as H}from"./tutorialUnlocks-B98SXIXA.js";var U=null;function W(){U!=null&&(clearInterval(U),U=null)}function G(e){if(!e)return;W();let t=()=>{e.textContent=`Resets in: ${ee(S())}`};t(),U=setInterval(t,1e3)}function K(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var q={common:`rarity-common`,uncommon:`rarity-uncommon`,rare:`rarity-rare`,epic:`rarity-epic`,legendary:`rarity-legendary`};function J(e){if(e===`pieceSkin`)return`Piece skins`;if(e===`frame`)return`Frames`;let t=R(e);return t.endsWith(`s`)?t:`${t}s`}function Y(e){let t=T(e);return t?E(t):``}var ie={pvp:`<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 10h20v6c0 6-4 10-10 10S14 22 14 16v-6z" fill="#e8c547"/>
    <path d="M10 10h4v4c0 3-2 6-4 6V10zM34 10h4v10c-2 0-4-3-4-6v-4z" fill="#e8c547"/>
    <rect x="18" y="26" width="12" height="4" rx="1" fill="#c9942a"/>
    <rect x="16" y="30" width="16" height="4" rx="1" fill="#a67c1a"/>
    <rect x="20" y="34" width="8" height="6" rx="1" fill="#8b6914"/>
  </svg>`,adventure:`<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 12l12 4 8-4 12 4v28l-12-4-8 4-12-4V12z" fill="#d4a574" stroke="#8b6914" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M20 12v28M28 8v28" stroke="#8b6914" stroke-width="1.5"/>
    <circle cx="24" cy="22" r="3" fill="#e85d5d"/>
    <path d="M24 25v6" stroke="#e85d5d" stroke-width="2" stroke-linecap="round"/>
  </svg>`,spells:`<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10 38l22-22 4 4-22 22-4-4z" fill="#8b6914"/>
    <path d="M32 14l4-4 2 2-4 4-2-2z" fill="#e8c547"/>
    <path d="M36 8l3-1 1 3-3 1-1-3z" fill="#5ce1e6"/>
    <path d="M38 14l2 2M40 10l-2 2" stroke="#e8c547" stroke-width="2" stroke-linecap="round"/>
    <circle cx="12" cy="36" r="2" fill="#9f7aea"/>
  </svg>`};function ae(e){let t=o(e);return`
    <div class="profile-hero-stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:t.pvpWins},{key:`adventure`,label:`Floors cleared`,value:t.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:t.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${K(e.label)}</span>
          <span class="profile-stat-card__icon">${ie[e.key]}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function oe(e,t,{username:n}){let r=Y(t),i=n||`Player`,a=i.charAt(0).toUpperCase()||`?`;return`
    <div class="profile-hero-card">
      <div class="profile-showcase profile-hero-card__showcase">
        <div class="profile-showcase__banner" id="profile-banner-preview" style="background:${N(e.equipped.banner)}"></div>
        <div class="profile-showcase__hero profile-hero-card__hero">
          <div class="profile-avatar-stack ${M(e.equipped.frame)}" id="profile-avatar-stack">
            <div class="profile-avatar-inner" id="profile-avatar-preview" aria-hidden="true">${P(e.equipped.avatar)||`<span class="profile-avatar-fallback">${K(a)}</span>`}</div>
          </div>
          <div class="profile-hero-card__info">
            <div class="profile-hero-card__name-row">
              <h2 id="profile-hero-username" class="profile-hero-card__username">${K(i)}</h2>
              ${r?`<span class="profile-hero-card__title-badge">${r}</span>`:``}
            </div>
          </div>
        </div>
      </div>
      ${ae(t)}
    </div>`}function X(e,t,{logEl:n,onGemsChange:r,onOpened:i,cosmeticsUnlocked:a=!0}={}){if(t){if(t.innerHTML=``,!a){t.innerHTML=`<p class="vault-locked-msg muted">${b}</p>`;return}for(let o of p){let s=L[o.id]||L.style_crate,c=e.gems>=o.cost,l=document.createElement(`article`);l.className=`chest-card chest-card--${s.visual} cosmetic-box-card cosmetic-box-card--${o.id}${c?``:` chest-card--locked`}`,l.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${I(o.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${s.label}</span>
        <h3 class="chest-card__name">${o.name}</h3>
        <p class="chest-card__tagline">${re(o.weights)}</p>
        <ul class="chest-card__stats">
          <li><strong>${o.pulls}</strong> cosmetics</li>
          <li>Avatars · frames · banners · skins</li>
        </ul>
        <p class="chest-card__cost">
          <span class="chest-card__gem" aria-hidden="true">◆</span>
          <span>${o.cost}</span>
        </p>
      </div>
      <button type="button" class="btn-primary btn-open-cosmetic chest-card__btn" data-box="${o.id}">
        ${c?`Open`:`Need more gems`}
      </button>`;let u=l.querySelector(`.btn-open-cosmetic`);u.disabled=!c,u.addEventListener(`click`,async()=>{if(u.disabled)return;let c=y(e,o.id);if(!c.success){n&&(n.textContent=c.message);return}v(e),r?.(),u.disabled=!0,await V({boxId:o.id,boxLabel:s.label,pulls:c.pulls});let l=c.pulls.map(e=>`${e.name}${e.duplicate?` (duplicate)`:``}`).join(`, `);n&&(n.textContent=`Opened ${o.name}: ${l}${c.bonusGems?` · +${c.bonusGems} gems from duplicates`:``}`),i?.(c),H(`cosmetic-box-opened`,{boxId:o.id,pulls:c.pulls}),X(e,t,{logEl:n,onGemsChange:r,onOpened:i,cosmeticsUnlocked:a})}),t.appendChild(l)}}}function Z(e,n,{onTitleChanged:a}={}){if(!n)return;n.innerHTML=``;let o=[...i].sort((t,n)=>{let i=t=>_(e,t)?0:s(e,t)?2:1,a=i(t.id)-i(n.id);if(a!==0)return a;let o=r(e,n.id)-r(e,t.id);return o===0?t.title.localeCompare(n.title):o});for(let r of o){let i=l(r.id),o=c(e,r.id),d=s(e,r.id),f=_(e,r.id),p=!o&&!d,m=document.createElement(`article`);m.className=[`profile-achievement-card`,p?`profile-achievement-card--locked`:``,o?`profile-achievement-card--complete`:``,d?`profile-achievement-card--claimed`:``,f?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let h=u(e,r.id),g=r.target?Math.min(100,Math.round((e.achievements?.progress?.[r.id]||0)/r.target*100)):0,y=d?`Unlocked`:f?`Claim Title`:o?`Complete`:`In progress`;if(m.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(r.title)}</h4>
        ${i?`<span class="profile-achievement-card__reward ${A(i)}">[${K(i.display)}]</span>`:``}
      </div>
      <p class="profile-achievement-card__desc">${K(r.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${g}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${g}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${K(h)}</p>
      <span class="profile-achievement-card__status">${y}</span>`,f){let i=document.createElement(`button`);i.type=`button`,i.className=`btn-primary profile-achievement-card__claim`,i.textContent=`Claim Title`,i.addEventListener(`click`,()=>{t(e,r.id).success&&(v(e),Z(e,n,{onTitleChanged:a}),a?.())}),m.appendChild(i)}n.appendChild(m)}}function Q(e,t,{onCurrencyChange:r}={}){if(!t)return;t.innerHTML=``;let i=[...f(e)].sort((t,n)=>{let r=e=>e.canClaim?0:e.claimed?2:1,i=r(t)-r(n);return i===0?C(e,n.templateId)-C(e,t.templateId):i});for(let{template:a,templateId:o,complete:s,claimed:c,canClaim:l}of i){if(!a)continue;let i=!s&&!c,u=document.createElement(`article`);u.className=[`profile-achievement-card`,`daily-quest-card`,i?`profile-achievement-card--locked`:``,s?`profile-achievement-card--complete`:``,c?`profile-achievement-card--claimed`:``,l?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let d=x(e,o),f=a.target?Math.min(100,Math.round(n(e,o)/a.target*100)):0,p=g(o),m=a.reward.currency===`stars`?`daily-quest-card__reward--stars`:`daily-quest-card__reward--gems`,_=c?`Claimed`:l?`Claim reward`:s?`Complete`:`In progress`;if(u.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(a.title)}</h4>
        <span class="daily-quest-card__reward ${m}">${K(p)}</span>
      </div>
      <p class="profile-achievement-card__desc">${K(a.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${f}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${f}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${K(d)}</p>
      <span class="profile-achievement-card__status">${_}</span>`,l){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary profile-achievement-card__claim`,n.textContent=a.reward.currency===`stars`?`Claim stars`:`Claim gems`,n.addEventListener(`click`,()=>{h(e,o).success&&(v(e),Q(e,t,{onCurrencyChange:r}),r?.())}),u.appendChild(n)}t.appendChild(u)}}function $(e,t,{onTitleChanged:n,onCurrencyChange:r}={}){if(!t)return;W(),t.innerHTML=`
    <section class="panel game-panel quests-panel">
      <header class="panel-head panel-head--compact">
        <h2 class="panel-head__title">Quests</h2>
        <p class="panel-head__desc">Complete daily quests for gems and stars, or title quests for mage titles.</p>
      </header>
      <div class="quests-section-tabs" role="tablist" aria-label="Quest categories">
        <button type="button" class="quests-section-tab active" role="tab" aria-selected="true" data-quests-section="daily">Daily quests</button>
        <button type="button" class="quests-section-tab" role="tab" aria-selected="false" data-quests-section="title">Title quests</button>
      </div>
      <div id="quests-section-daily" class="quests-section-panel">
        <p id="daily-quests-reset-countdown" class="daily-quests-section__reset muted" aria-live="polite">Resets in: --:--:--</p>
        <div id="daily-quests-grid" class="profile-achievement-grid daily-quests-grid"></div>
      </div>
      <div id="quests-section-title" class="quests-section-panel hidden" hidden>
        <div id="quests-grid" class="profile-achievement-grid"></div>
      </div>
    </section>`;let i=e=>{t.querySelectorAll(`.quests-section-tab`).forEach(t=>{let n=t.dataset.questsSection===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)});let n=t.querySelector(`#quests-section-daily`),r=t.querySelector(`#quests-section-title`);n&&(n.classList.toggle(`hidden`,e!==`daily`),n.hidden=e!==`daily`),r&&(r.classList.toggle(`hidden`,e!==`title`),r.hidden=e!==`title`)};for(let e of t.querySelectorAll(`.quests-section-tab`))e.addEventListener(`click`,()=>i(e.dataset.questsSection));G(t.querySelector(`#daily-quests-reset-countdown`)),Q(e,t.querySelector(`#daily-quests-grid`),{onCurrencyChange:r}),Z(e,t.querySelector(`#quests-grid`),{onTitleChanged:n})}var se=$;function ce(t,n,{onGemsChange:r,onTitleChanged:i}={}){if(!n)return;let o=e(t),s=ne(),c=te()&&!!s;n.innerHTML=`
    <section class="panel game-panel profile-panel">
      ${oe(o,t,{username:``})}
      <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
        <button type="button" class="profile-section-tab active" role="tab" data-profile-section="cosmetics">Cosmetics</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="titles">Titles</button>
      </div>
      <div id="profile-section-cosmetics" class="profile-section-panel">
        <div class="profile-cosmetic-filters" role="tablist" aria-label="Cosmetic category">
          ${a.map(e=>`<button type="button" class="profile-filter-btn" role="tab" data-cos-filter="${e}">${J(e)}</button>`).join(``)}
        </div>
        <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
      </div>
      <div id="profile-section-titles" class="profile-section-panel hidden" hidden>
        <p class="muted profile-titles-hint">Unlock titles by completing quests, then tap to equip.</p>
        <div id="profile-title-grid" class="profile-title-grid"></div>
      </div>
    </section>
  `;let l=n.querySelector(`#profile-cosmetic-grid`),u=`avatar`,f=``,p=()=>{let r=e(t);n.querySelector(`#profile-banner-preview`).style.background=N(r.equipped.banner);let a=n.querySelector(`#profile-avatar-preview`),o=(f||`P`).charAt(0).toUpperCase();a&&(a.innerHTML=P(r.equipped.avatar)||`<span class="profile-avatar-fallback">${K(o)}</span>`);let s=n.querySelector(`#profile-avatar-stack`);s&&(s.className=`profile-avatar-stack ${M(r.equipped.frame)}`);let c=n.querySelector(`#profile-hero-username`);c&&(c.textContent=f||`Player`);let l=n.querySelector(`.profile-hero-card__title-badge`),u=Y(t);if(u)if(l)l.innerHTML=u;else{let e=n.querySelector(`.profile-hero-card__name-row`);if(e){let t=document.createElement(`span`);t.className=`profile-hero-card__title-badge`,t.innerHTML=u,e.appendChild(t)}}else l&&l.remove();i?.()},h=()=>{let e=t.cosmetics?.owned?.[u]||[];l.innerHTML=``;for(let n of e){let e=m[n];if(!e)continue;let r=t.cosmetics.equipped[u]===n,i=document.createElement(`button`);i.type=`button`,i.className=`profile-cosmetic-card ${q[e.rarity]||``} ${r?`profile-cosmetic-card--equipped`:``}`;let a=B(n,e.type);i.innerHTML=`
        <span class="profile-cosmetic-card__rarity">${e.rarity}</span>
        <div class="profile-cosmetic-card__art">${a}</div>
        <strong class="profile-cosmetic-card__name">${e.name}</strong>
        <span class="profile-cosmetic-card__action">${r?`Equipped`:`Equip`}</span>`,i.addEventListener(`click`,()=>{r||d(t,u,n).success&&(v(t),h(),p(),H(`cosmetic-equipped`,{type:u,id:n}))}),l.appendChild(i)}e.length||(l.innerHTML=`<p class="muted">Open cosmetic boxes in the Shop to unlock items.</p>`)};for(let e of n.querySelectorAll(`.profile-filter-btn`))e.addEventListener(`click`,()=>{u=e.dataset.cosFilter,n.querySelectorAll(`.profile-filter-btn`).forEach(t=>t.classList.toggle(`active`,t===e)),h()});n.querySelector(`.profile-filter-btn`)?.classList.add(`active`),h();let g=()=>{let e=n.querySelector(`#profile-title-grid`);if(!e)return;e.innerHTML=``;let r=T(t);for(let n of k){let a=D(t,n.id),o=r===n.id,s=document.createElement(`button`);s.type=`button`,s.disabled=!a,s.className=[`profile-title-card`,w[n.rarity]||``,`profile-title-card--glow-${n.glow}`,a?``:`profile-title-card--locked`,o?`profile-title-card--equipped`:``].filter(Boolean).join(` `),s.innerHTML=`
        <span class="profile-title-card__tag ${A(n)}">[${K(n.display)}]</span>
        <span class="profile-title-card__rarity">${n.rarity}</span>
        <span class="profile-title-card__action">${o?`Equipped`:a?`Equip`:`Locked`}</span>`,s.addEventListener(`click`,()=>{a&&O(t,o?null:n.id).success&&(v(t),g(),p(),i?.())}),e.appendChild(s)}},_=e=>{n.querySelectorAll(`.profile-section-tab`).forEach(t=>{t.classList.toggle(`active`,t.dataset.profileSection===e)});let t=n.querySelector(`#profile-section-cosmetics`);t&&(t.classList.toggle(`hidden`,e!==`cosmetics`),t.hidden=e!==`cosmetics`);let r=n.querySelector(`#profile-section-titles`);r&&(r.classList.toggle(`hidden`,e!==`titles`),r.hidden=e!==`titles`),e===`titles`&&g()};for(let e of n.querySelectorAll(`.profile-section-tab`))e.addEventListener(`click`,()=>_(e.dataset.profileSection));g(),c&&(async()=>{try{f=(await j(s.id))?.username||s.user_metadata?.display_name||``,p()}catch(e){console.warn(`Could not load profile username`,e)}})()}export{z as headerProfileAvatarHtml,se as renderAchievementsTab,X as renderCosmeticBoxes,ce as renderProfileTab,$ as renderQuestsTab,F as resolveDisplayUsername};