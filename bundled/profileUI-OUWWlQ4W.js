import{A as e,C as t,D as n,E as r,G as i,J as a,L as o,M as s,N as c,O as l,P as u,Q as d,S as f,U as p,W as m,X as h,Y as g,Z as _,_ as v,at as y,b,ct as x,ft as S,it as C,k as w,m as T,q as E,v as ee,w as te,x as ne,y as D}from"./storage-Kes4hygm.js";import{a as O,i as k,s as A}from"./auth-B64_PGjL.js";import{U as j,c as M,i as N,l as P,n as re,o as F,r as I,s as L,t as R,u as z}from"./index-C9eNCKIV.js";import{playCosmeticOpenAnimation as B}from"./cosmeticOpenAnimation-eFXypsNm.js";import{notifyUnlockTutorial as V}from"./tutorialUnlocks-CMfUQjBe.js";var H=null;function U(){H!=null&&(clearInterval(H),H=null)}function W(e){if(!e)return;U();let t=()=>{e.textContent=`Resets in: ${ne(te())}`};t(),H=setInterval(t,1e3)}function G(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var K={common:`rarity-common`,uncommon:`rarity-uncommon`,rare:`rarity-rare`,epic:`rarity-epic`,legendary:`rarity-legendary`};function q(e){if(e===`pieceSkin`)return`Piece skins`;if(e===`frame`)return`Frames`;let t=L(e);return t.endsWith(`s`)?t:`${t}s`}function J(e){let t=E(e);return t?g(t):``}var Y={pvp:`<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  </svg>`};function ie(e){let t=o(e);return`
    <div class="profile-hero-stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:t.pvpWins},{key:`adventure`,label:`Floors cleared`,value:t.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:t.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${G(e.label)}</span>
          <span class="profile-stat-card__icon">${Y[e.key]}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function ae(e,t,{username:n}){let r=J(t),i=n||`Player`,a=i.charAt(0).toUpperCase()||`?`;return`
    <div class="profile-hero-card">
      <div class="profile-showcase profile-hero-card__showcase">
        <div class="profile-showcase__banner" id="profile-banner-preview" style="background:${N(e.equipped.banner)}"></div>
        <div class="profile-showcase__hero profile-hero-card__hero">
          <div class="profile-avatar-stack ${M(e.equipped.frame)}" id="profile-avatar-stack">
            <div class="profile-avatar-inner" id="profile-avatar-preview" aria-hidden="true">${P(e.equipped.avatar)||`<span class="profile-avatar-fallback">${G(a)}</span>`}</div>
          </div>
          <div class="profile-hero-card__info">
            <div class="profile-hero-card__name-row">
              <h2 id="profile-hero-username" class="profile-hero-card__username">${G(i)}</h2>
              ${r?`<span class="profile-hero-card__title-badge">${r}</span>`:``}
            </div>
          </div>
        </div>
      </div>
      ${ie(t)}
    </div>`}function X(e,t,{logEl:n,onGemsChange:r,onOpened:i,cosmeticsUnlocked:a=!0}={}){if(t){if(t.innerHTML=``,!a){t.innerHTML=`<p class="vault-locked-msg muted">${S}</p>`;return}for(let o of h){let s=I[o.id]||I.style_crate,c=e.gems>=o.cost,l=document.createElement(`article`);l.className=`chest-card chest-card--${s.visual} cosmetic-box-card cosmetic-box-card--${o.id}${c?``:` chest-card--locked`}`,l.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${F(o.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${s.label}</span>
        <h3 class="chest-card__name">${o.name}</h3>
        <p class="chest-card__tagline">${j(o.weights)}</p>
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
      </button>`;let u=l.querySelector(`.btn-open-cosmetic`);u.disabled=!c,u.addEventListener(`click`,async()=>{if(u.disabled)return;let c=x(e,o.id);if(!c.success){n&&(n.textContent=c.message);return}T(e),r?.(),u.disabled=!0,await B({boxId:o.id,boxLabel:s.label,pulls:c.pulls});let l=c.pulls.map(e=>`${e.name}${e.duplicate?` (duplicate)`:``}`).join(`, `);n&&(n.textContent=`Opened ${o.name}: ${l}${c.bonusGems?` · +${c.bonusGems} gems from duplicates`:``}`),i?.(c),V(`cosmetic-box-opened`,{boxId:o.id,pulls:c.pulls}),X(e,t,{logEl:n,onGemsChange:r,onOpened:i,cosmeticsUnlocked:a})}),t.appendChild(l)}}}function Z(t,i,{onTitleChanged:a}={}){if(!i)return;i.innerHTML=``;let o=[...r].sort((e,r)=>{let i=e=>w(t,e)?0:s(t,e)?2:1,a=i(e.id)-i(r.id);if(a!==0)return a;let o=n(t,r.id)-n(t,e.id);return o===0?e.title.localeCompare(r.title):o});for(let n of o){let r=l(n.id),o=c(t,n.id),d=s(t,n.id),f=w(t,n.id),p=!o&&!d,h=document.createElement(`article`);h.className=[`profile-achievement-card`,p?`profile-achievement-card--locked`:``,o?`profile-achievement-card--complete`:``,d?`profile-achievement-card--claimed`:``,f?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let g=u(t,n.id),_=n.target?Math.min(100,Math.round((t.achievements?.progress?.[n.id]||0)/n.target*100)):0,v=d?`Unlocked`:f?`Claim Title`:o?`Complete`:`In progress`;if(h.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${G(n.title)}</h4>
        ${r?`<span class="profile-achievement-card__reward mage-title-tag mage-title-tag--glow-${r.glow} ${m[r.rarity]||``}">[${G(r.display)}]</span>`:``}
      </div>
      <p class="profile-achievement-card__desc">${G(n.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${_}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${_}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${G(g)}</p>
      <span class="profile-achievement-card__status">${v}</span>`,f){let r=document.createElement(`button`);r.type=`button`,r.className=`btn-primary profile-achievement-card__claim`,r.textContent=`Claim Title`,r.addEventListener(`click`,()=>{e(t,n.id).success&&(T(t),Z(t,i,{onTitleChanged:a}),a?.())}),h.appendChild(r)}i.appendChild(h)}}function Q(e,n,{onCurrencyChange:r}={}){if(!n)return;n.innerHTML=``;let i=[...f(e)].sort((t,n)=>{let r=e=>e.canClaim?0:e.claimed?2:1,i=r(t)-r(n);return i===0?D(e,n.templateId)-D(e,t.templateId):i});for(let{template:a,templateId:o,complete:s,claimed:c,canClaim:l}of i){if(!a)continue;let i=!s&&!c,u=document.createElement(`article`);u.className=[`profile-achievement-card`,`daily-quest-card`,i?`profile-achievement-card--locked`:``,s?`profile-achievement-card--complete`:``,c?`profile-achievement-card--claimed`:``,l?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let d=ee(e,o),f=a.target?Math.min(100,Math.round(t(e,o)/a.target*100)):0,p=b(o),m=a.reward.currency===`stars`?`daily-quest-card__reward--stars`:`daily-quest-card__reward--gems`,h=c?`Claimed`:l?`Claim reward`:s?`Complete`:`In progress`;if(u.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${G(a.title)}</h4>
        <span class="daily-quest-card__reward ${m}">${G(p)}</span>
      </div>
      <p class="profile-achievement-card__desc">${G(a.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${f}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${f}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${G(d)}</p>
      <span class="profile-achievement-card__status">${h}</span>`,l){let t=document.createElement(`button`);t.type=`button`,t.className=`btn-primary profile-achievement-card__claim`,t.textContent=a.reward.currency===`stars`?`Claim stars`:`Claim gems`,t.addEventListener(`click`,()=>{v(e,o).success&&(T(e),Q(e,n,{onCurrencyChange:r}),r?.())}),u.appendChild(t)}n.appendChild(u)}}function $(e,t,{onTitleChanged:n,onCurrencyChange:r}={}){if(!t)return;U(),t.innerHTML=`
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
    </section>`;let i=e=>{t.querySelectorAll(`.quests-section-tab`).forEach(t=>{let n=t.dataset.questsSection===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)});let n=t.querySelector(`#quests-section-daily`),r=t.querySelector(`#quests-section-title`);n&&(n.classList.toggle(`hidden`,e!==`daily`),n.hidden=e!==`daily`),r&&(r.classList.toggle(`hidden`,e!==`title`),r.hidden=e!==`title`)};for(let e of t.querySelectorAll(`.quests-section-tab`))e.addEventListener(`click`,()=>i(e.dataset.questsSection));W(t.querySelector(`#daily-quests-reset-countdown`)),Q(e,t.querySelector(`#daily-quests-grid`),{onCurrencyChange:r}),Z(e,t.querySelector(`#quests-grid`),{onTitleChanged:n})}var oe=$;function se(e,t,{onGemsChange:n,onTitleChanged:r}={}){if(!t)return;let o=y(e),s=O(),c=A()&&!!s;t.innerHTML=`
    <section class="panel game-panel profile-panel">
      ${ae(o,e,{username:``})}
      <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
        <button type="button" class="profile-section-tab active" role="tab" data-profile-section="cosmetics">Cosmetics</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="titles">Titles</button>
      </div>
      <div id="profile-section-cosmetics" class="profile-section-panel">
        <div class="profile-cosmetic-filters" role="tablist" aria-label="Cosmetic category">
          ${d.map(e=>`<button type="button" class="profile-filter-btn" role="tab" data-cos-filter="${e}">${q(e)}</button>`).join(``)}
        </div>
        <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
      </div>
      <div id="profile-section-titles" class="profile-section-panel hidden" hidden>
        <p class="muted profile-titles-hint">Unlock titles by completing quests, then tap to equip.</p>
        <div id="profile-title-grid" class="profile-title-grid"></div>
      </div>
    </section>
  `;let l=t.querySelector(`#profile-cosmetic-grid`),u=`avatar`,f=``,h=()=>{let n=y(e);t.querySelector(`#profile-banner-preview`).style.background=N(n.equipped.banner);let i=t.querySelector(`#profile-avatar-preview`),a=(f||`P`).charAt(0).toUpperCase();i&&(i.innerHTML=P(n.equipped.avatar)||`<span class="profile-avatar-fallback">${G(a)}</span>`);let o=t.querySelector(`#profile-avatar-stack`);o&&(o.className=`profile-avatar-stack ${M(n.equipped.frame)}`);let s=t.querySelector(`#profile-hero-username`);s&&(s.textContent=f||`Player`);let c=t.querySelector(`.profile-hero-card__title-badge`),l=J(e);if(l)if(c)c.innerHTML=l;else{let e=t.querySelector(`.profile-hero-card__name-row`);if(e){let t=document.createElement(`span`);t.className=`profile-hero-card__title-badge`,t.innerHTML=l,e.appendChild(t)}}else c&&c.remove();r?.()},g=()=>{let t=e.cosmetics?.owned?.[u]||[];l.innerHTML=``;for(let n of t){let t=_[n];if(!t)continue;let r=e.cosmetics.equipped[u]===n,i=document.createElement(`button`);i.type=`button`,i.className=`profile-cosmetic-card ${K[t.rarity]||``} ${r?`profile-cosmetic-card--equipped`:``}`;let a=z(n,t.type);i.innerHTML=`
        <span class="profile-cosmetic-card__rarity">${t.rarity}</span>
        <div class="profile-cosmetic-card__art">${a}</div>
        <strong class="profile-cosmetic-card__name">${t.name}</strong>
        <span class="profile-cosmetic-card__action">${r?`Equipped`:`Equip`}</span>`,i.addEventListener(`click`,()=>{r||C(e,u,n).success&&(T(e),g(),h(),V(`cosmetic-equipped`,{type:u,id:n}))}),l.appendChild(i)}t.length||(l.innerHTML=`<p class="muted">Open cosmetic boxes in the Shop to unlock items.</p>`)};for(let e of t.querySelectorAll(`.profile-filter-btn`))e.addEventListener(`click`,()=>{u=e.dataset.cosFilter,t.querySelectorAll(`.profile-filter-btn`).forEach(t=>t.classList.toggle(`active`,t===e)),g()});t.querySelector(`.profile-filter-btn`)?.classList.add(`active`),g();let v=()=>{let n=t.querySelector(`#profile-title-grid`);if(!n)return;n.innerHTML=``;let o=E(e);for(let t of p){let s=a(e,t.id),c=o===t.id,l=document.createElement(`button`);l.type=`button`,l.disabled=!s,l.className=[`profile-title-card`,m[t.rarity]||``,`profile-title-card--glow-${t.glow}`,s?``:`profile-title-card--locked`,c?`profile-title-card--equipped`:``].filter(Boolean).join(` `),l.innerHTML=`
        <span class="profile-title-card__tag mage-title-tag mage-title-tag--glow-${t.glow} ${m[t.rarity]||``}">[${G(t.display)}]</span>
        <span class="profile-title-card__rarity">${t.rarity}</span>
        <span class="profile-title-card__action">${c?`Equipped`:s?`Equip`:`Locked`}</span>`,l.addEventListener(`click`,()=>{s&&i(e,c?null:t.id).success&&(T(e),v(),h(),r?.())}),n.appendChild(l)}},b=e=>{t.querySelectorAll(`.profile-section-tab`).forEach(t=>{t.classList.toggle(`active`,t.dataset.profileSection===e)});let n=t.querySelector(`#profile-section-cosmetics`);n&&(n.classList.toggle(`hidden`,e!==`cosmetics`),n.hidden=e!==`cosmetics`);let r=t.querySelector(`#profile-section-titles`);r&&(r.classList.toggle(`hidden`,e!==`titles`),r.hidden=e!==`titles`),e===`titles`&&v()};for(let e of t.querySelectorAll(`.profile-section-tab`))e.addEventListener(`click`,()=>b(e.dataset.profileSection));v(),c&&(async()=>{try{f=(await k(s.id))?.username||s.user_metadata?.display_name||``,h()}catch(e){console.warn(`Could not load profile username`,e)}})()}export{R as headerProfileAvatarHtml,oe as renderAchievementsTab,X as renderCosmeticBoxes,se as renderProfileTab,$ as renderQuestsTab,re as resolveDisplayUsername};