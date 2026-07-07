import{$ as e,A as t,C as n,D as r,E as i,G as a,J as o,L as s,M as c,N as l,O as u,P as d,Q as f,S as p,U as m,W as h,X as g,Y as _,_ as v,b as y,ct as b,et as x,ft as S,gt as C,it as w,k as T,lt as E,m as D,q as O,v as ee,w as k,x as A,y as j}from"./storage-B1-xSlsj.js";import{a as te,c as M,o as N}from"./auth-CAClyXnN.js";import{U as P,c as F,i as I,l as L,n as ne,o as re,r as R,s as ie,t as z,u as B}from"./index-C2B1OlqG.js";import{playCosmeticOpenAnimation as V}from"./cosmeticOpenAnimation-D6fU8mjZ.js";import{notifyUnlockTutorial as H}from"./tutorialUnlocks-_6Mshh6V.js";var U=null;function W(){U!=null&&(clearInterval(U),U=null)}function G(e){if(!e)return;W();let t=()=>{e.textContent=`Resets in: ${A(k())}`};t(),U=setInterval(t,1e3)}function K(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var q={common:`rarity-common`,uncommon:`rarity-uncommon`,rare:`rarity-rare`,epic:`rarity-epic`,legendary:`rarity-legendary`},J={common:0,uncommon:1,rare:2,epic:3,legendary:4},ae={others:`Exclude others`,unowned:`Exclude unowned`,owned:`Exclude owned`,starters:`Exclude starters`};function oe({type:e,excludeOptions:t,profile:n}){let r=n.cosmetics?.owned||{};return f.filter(n=>{if(t.others&&n.type!==e)return!1;let i=r[n.type]?.includes(n.id)??!1;return!(t.unowned&&!i||t.owned&&i||t.starters&&w.has(n.id))}).sort((e,t)=>{let n=+!r[e.type]?.includes(e.id),i=+!r[t.type]?.includes(t.id);return n===i?(J[e.rarity]??9)-(J[t.rarity]??9)||e.name.localeCompare(t.name):n-i})}function se(e){if(e===`pieceSkin`)return`Piece skins`;if(e===`frame`)return`Frames`;let t=ie(e);return t.endsWith(`s`)?t:`${t}s`}function Y(e){let t=O(e);return t?_(t):``}var ce={pvp:`<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  </svg>`};function le(e){let t=s(e);return`
    <div class="profile-hero-stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:t.pvpWins},{key:`adventure`,label:`Floors cleared`,value:t.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:t.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${K(e.label)}</span>
          <span class="profile-stat-card__icon">${ce[e.key]}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function ue(e,t,{username:n}){let r=Y(t),i=n||`Player`,a=i.charAt(0).toUpperCase()||`?`;return`
    <div class="profile-hero-card">
      <div class="profile-showcase profile-hero-card__showcase">
        <div class="profile-showcase__banner" id="profile-banner-preview" style="background:${I(e.equipped.banner)}"></div>
        <div class="profile-showcase__hero profile-hero-card__hero">
          <div class="profile-avatar-stack ${F(e.equipped.frame)}" id="profile-avatar-stack">
            <div class="profile-avatar-inner" id="profile-avatar-preview" aria-hidden="true">${L(e.equipped.avatar)||`<span class="profile-avatar-fallback">${K(a)}</span>`}</div>
          </div>
          <div class="profile-hero-card__info">
            <div class="profile-hero-card__name-row">
              <h2 id="profile-hero-username" class="profile-hero-card__username">${K(i)}</h2>
              ${r?`<span class="profile-hero-card__title-badge">${r}</span>`:``}
            </div>
          </div>
        </div>
      </div>
      ${le(t)}
    </div>`}function X(e,t,{logEl:n,onGemsChange:r,onOpened:i,cosmeticsUnlocked:a=!0}={}){if(t){if(t.innerHTML=``,!a){t.innerHTML=`<p class="vault-locked-msg muted">${C}</p>`;return}for(let o of g){let s=R[o.id]||R.style_crate,c=e.gems>=o.cost,l=document.createElement(`article`);l.className=`chest-card chest-card--${s.visual} cosmetic-box-card cosmetic-box-card--${o.id}${c?``:` chest-card--locked`}`,l.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${re(o.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${s.label}</span>
        <h3 class="chest-card__name">${o.name}</h3>
        <p class="chest-card__tagline">${P(o.weights)}</p>
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
      </button>`;let u=l.querySelector(`.btn-open-cosmetic`);u.disabled=!c,u.addEventListener(`click`,async()=>{if(u.disabled)return;let c=S(e,o.id);if(!c.success){n&&(n.textContent=c.message);return}D(e),r?.(),u.disabled=!0,await V({boxId:o.id,boxLabel:s.label,pulls:c.pulls});let l=c.pulls.map(e=>`${e.name}${e.duplicate?` (duplicate)`:``}`).join(`, `);n&&(n.textContent=`Opened ${o.name}: ${l}${c.bonusGems?` · +${c.bonusGems} gems from duplicates`:``}`),i?.(c),H(`cosmetic-box-opened`,{boxId:o.id,pulls:c.pulls}),X(e,t,{logEl:n,onGemsChange:r,onOpened:i,cosmeticsUnlocked:a})}),t.appendChild(l)}}}function Z(e,n,{onTitleChanged:a}={}){if(!n)return;n.innerHTML=``;let o=[...i].sort((t,n)=>{let i=t=>T(e,t)?0:c(e,t)?2:1,a=i(t.id)-i(n.id);if(a!==0)return a;let o=r(e,n.id)-r(e,t.id);return o===0?t.title.localeCompare(n.title):o});for(let r of o){let i=u(r.id),o=l(e,r.id),s=c(e,r.id),f=T(e,r.id),p=!o&&!s,m=document.createElement(`article`);m.className=[`profile-achievement-card`,p?`profile-achievement-card--locked`:``,o?`profile-achievement-card--complete`:``,s?`profile-achievement-card--claimed`:``,f?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let g=d(e,r.id),_=r.target?Math.min(100,Math.round((e.achievements?.progress?.[r.id]||0)/r.target*100)):0,v=s?`Unlocked`:f?`Claim Title`:o?`Complete`:`In progress`;if(m.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(r.title)}</h4>
        ${i?`<span class="profile-achievement-card__reward mage-title-tag mage-title-tag--glow-${i.glow} ${h[i.rarity]||``}">[${K(i.display)}]</span>`:``}
      </div>
      <p class="profile-achievement-card__desc">${K(r.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${_}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${_}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${K(g)}</p>
      <span class="profile-achievement-card__status">${v}</span>`,f){let i=document.createElement(`button`);i.type=`button`,i.className=`btn-primary profile-achievement-card__claim`,i.textContent=`Claim Title`,i.addEventListener(`click`,()=>{t(e,r.id).success&&(D(e),Z(e,n,{onTitleChanged:a}),a?.())}),m.appendChild(i)}n.appendChild(m)}}function Q(e,t,{onCurrencyChange:r}={}){if(!t)return;t.innerHTML=``;let i=[...p(e)].sort((t,n)=>{let r=e=>e.canClaim?0:e.claimed?2:1,i=r(t)-r(n);return i===0?j(e,n.templateId)-j(e,t.templateId):i});for(let{template:a,templateId:o,complete:s,claimed:c,canClaim:l}of i){if(!a)continue;let i=!s&&!c,u=document.createElement(`article`);u.className=[`profile-achievement-card`,`daily-quest-card`,i?`profile-achievement-card--locked`:``,s?`profile-achievement-card--complete`:``,c?`profile-achievement-card--claimed`:``,l?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let d=ee(e,o),f=a.target?Math.min(100,Math.round(n(e,o)/a.target*100)):0,p=y(o),m=a.reward.currency===`stars`?`daily-quest-card__reward--stars`:`daily-quest-card__reward--gems`,h=c?`Claimed`:l?`Claim reward`:s?`Complete`:`In progress`;if(u.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(a.title)}</h4>
        <span class="daily-quest-card__reward ${m}">${K(p)}</span>
      </div>
      <p class="profile-achievement-card__desc">${K(a.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${f}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${f}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${K(d)}</p>
      <span class="profile-achievement-card__status">${h}</span>`,l){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary profile-achievement-card__claim`,n.textContent=a.reward.currency===`stars`?`Claim stars`:`Claim gems`,n.addEventListener(`click`,()=>{v(e,o).success&&(D(e),Q(e,t,{onCurrencyChange:r}),r?.())}),u.appendChild(n)}t.appendChild(u)}}function $(e,t,{onTitleChanged:n,onCurrencyChange:r}={}){if(!t)return;W(),t.innerHTML=`
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
    </section>`;let i=e=>{t.querySelectorAll(`.quests-section-tab`).forEach(t=>{let n=t.dataset.questsSection===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)});let n=t.querySelector(`#quests-section-daily`),r=t.querySelector(`#quests-section-title`);n&&(n.classList.toggle(`hidden`,e!==`daily`),n.hidden=e!==`daily`),r&&(r.classList.toggle(`hidden`,e!==`title`),r.hidden=e!==`title`)};for(let e of t.querySelectorAll(`.quests-section-tab`))e.addEventListener(`click`,()=>i(e.dataset.questsSection));G(t.querySelector(`#daily-quests-reset-countdown`)),Q(e,t.querySelector(`#daily-quests-grid`),{onCurrencyChange:r}),Z(e,t.querySelector(`#quests-grid`),{onTitleChanged:n})}var de=$;function fe(t,n,{onGemsChange:r,onTitleChanged:i}={}){if(!n)return;let s=E(t),c=N(),l=M()&&!!c;n.innerHTML=`
    <section class="panel game-panel profile-panel">
      ${ue(s,t,{username:``})}
      <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
        <button type="button" class="profile-section-tab active" role="tab" data-profile-section="cosmetics">Cosmetics</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="titles">Titles</button>
      </div>
      <div id="profile-section-cosmetics" class="profile-section-panel">
        <div class="profile-cosmetic-toolbar">
          <div class="profile-cosmetic-filters" role="tablist" aria-label="Cosmetic category">
            ${e.map(e=>`<button type="button" class="profile-filter-btn" role="tab" data-cos-filter="${e}">${se(e)}</button>`).join(``)}
          </div>
          <div class="profile-exclude-menu">
            <button
              type="button"
              class="profile-exclude-menu__btn"
              id="profile-exclude-menu-btn"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-controls="profile-exclude-menu-panel"
            >Exclude options</button>
            <div id="profile-exclude-menu-panel" class="profile-exclude-menu__panel hidden" role="menu" hidden>
              ${Object.entries(ae).map(([e,t])=>`
                <label class="profile-exclude-menu__option" role="menuitemcheckbox">
                  <input type="checkbox" data-exclude-option="${e}" ${x[e]?`checked`:``} />
                  <span>${t}</span>
                </label>`).join(``)}
            </div>
          </div>
        </div>
        <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
      </div>
      <div id="profile-section-titles" class="profile-section-panel hidden" hidden>
        <p class="muted profile-titles-hint">Unlock titles by completing quests, then tap to equip.</p>
        <div id="profile-title-grid" class="profile-title-grid"></div>
      </div>
    </section>
  `;let u=n.querySelector(`#profile-cosmetic-grid`),d=`avatar`,f=``,p={...x},g=n.querySelector(`#profile-exclude-menu-btn`),_=n.querySelector(`#profile-exclude-menu-panel`),v=e=>{!g||!_||(g.setAttribute(`aria-expanded`,e?`true`:`false`),_.classList.toggle(`hidden`,!e),_.hidden=!e)};g?.addEventListener(`click`,e=>{e.stopPropagation(),v(_?.hidden??!0)}),_?.querySelectorAll(`[data-exclude-option]`).forEach(e=>{e.addEventListener(`change`,()=>{let t=e.dataset.excludeOption;!t||!(t in p)||(p[t]=e.checked,S())})}),n.addEventListener(`click`,()=>v(!1)),_?.addEventListener(`click`,e=>e.stopPropagation());let y=()=>{let e=E(t);n.querySelector(`#profile-banner-preview`).style.background=I(e.equipped.banner);let r=n.querySelector(`#profile-avatar-preview`),a=(f||`P`).charAt(0).toUpperCase();r&&(r.innerHTML=L(e.equipped.avatar)||`<span class="profile-avatar-fallback">${K(a)}</span>`);let o=n.querySelector(`#profile-avatar-stack`);o&&(o.className=`profile-avatar-stack ${F(e.equipped.frame)}`);let s=n.querySelector(`#profile-hero-username`);s&&(s.textContent=f||`Player`);let c=n.querySelector(`.profile-hero-card__title-badge`),l=Y(t);if(l)if(c)c.innerHTML=l;else{let e=n.querySelector(`.profile-hero-card__name-row`);if(e){let t=document.createElement(`span`);t.className=`profile-hero-card__title-badge`,t.innerHTML=l,e.appendChild(t)}}else c&&c.remove();i?.()},S=()=>{let e=oe({type:d,excludeOptions:p,profile:t});u.innerHTML=``;for(let n of e){let{id:e,type:r}=n,i=t.cosmetics?.owned?.[r]?.includes(e)??!1,a=t.cosmetics.equipped[r]===e,o=document.createElement(`button`);o.type=`button`,o.disabled=!i,o.className=[`profile-cosmetic-card`,q[n.rarity]||``,a?`profile-cosmetic-card--equipped`:``,i?``:`profile-cosmetic-card--locked`].filter(Boolean).join(` `);let s=B(e,n.type),c=a?`Equipped`:i?`Equip`:`Locked`;o.innerHTML=`
        <span class="profile-cosmetic-card__rarity">${n.rarity}</span>
        <div class="profile-cosmetic-card__art">${s}</div>
        <strong class="profile-cosmetic-card__name">${n.name}</strong>
        <span class="profile-cosmetic-card__action">${c}</span>`,o.addEventListener(`click`,()=>{!i||a||b(t,r,e).success&&(D(t),S(),y(),H(`cosmetic-equipped`,{type:r,id:e}))}),u.appendChild(o)}e.length||(u.innerHTML=`<p class="muted">No cosmetics match these filters. Try changing Exclude options.</p>`)};for(let e of n.querySelectorAll(`.profile-filter-btn`))e.addEventListener(`click`,()=>{d=e.dataset.cosFilter,n.querySelectorAll(`.profile-filter-btn`).forEach(t=>t.classList.toggle(`active`,t===e)),S()});n.querySelector(`.profile-filter-btn`)?.classList.add(`active`),S();let C=()=>{let e=n.querySelector(`#profile-title-grid`);if(!e)return;e.innerHTML=``;let r=O(t);for(let n of m){let s=o(t,n.id),c=r===n.id,l=document.createElement(`button`);l.type=`button`,l.disabled=!s,l.className=[`profile-title-card`,h[n.rarity]||``,`profile-title-card--glow-${n.glow}`,s?``:`profile-title-card--locked`,c?`profile-title-card--equipped`:``].filter(Boolean).join(` `),l.innerHTML=`
        <span class="profile-title-card__tag mage-title-tag mage-title-tag--glow-${n.glow} ${h[n.rarity]||``}">[${K(n.display)}]</span>
        <span class="profile-title-card__rarity">${n.rarity}</span>
        <span class="profile-title-card__action">${c?`Equipped`:s?`Equip`:`Locked`}</span>`,l.addEventListener(`click`,()=>{s&&a(t,c?null:n.id).success&&(D(t),C(),y(),i?.())}),e.appendChild(l)}},w=e=>{n.querySelectorAll(`.profile-section-tab`).forEach(t=>{t.classList.toggle(`active`,t.dataset.profileSection===e)});let t=n.querySelector(`#profile-section-cosmetics`);t&&(t.classList.toggle(`hidden`,e!==`cosmetics`),t.hidden=e!==`cosmetics`);let r=n.querySelector(`#profile-section-titles`);r&&(r.classList.toggle(`hidden`,e!==`titles`),r.hidden=e!==`titles`),e===`titles`&&C()};for(let e of n.querySelectorAll(`.profile-section-tab`))e.addEventListener(`click`,()=>w(e.dataset.profileSection));C(),l&&(async()=>{try{f=(await te(c.id))?.username||c.user_metadata?.display_name||``,y()}catch(e){console.warn(`Could not load profile username`,e)}})()}export{z as headerProfileAvatarHtml,de as renderAchievementsTab,X as renderCosmeticBoxes,fe as renderProfileTab,$ as renderQuestsTab,ne as resolveDisplayUsername};