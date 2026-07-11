import{$ as e,C as t,F as n,G as r,I as i,J as a,L as o,O as s,Q as c,T as l,W as u,_ as d,at as f,b as p,et as m,it as h,m as g,nt as _,rt as v,st as y,tt as b,v as x,w as S,x as C,y as w}from"./storage-D-VCnmGW.js";import{a as T,c as E,d as D,l as O,o as k,t as A,u as j}from"./mageTitles-BPvsmJqw.js";import{a as ee,c as te,o as ne}from"./auth-C7AK0hyz.js";import{W as re,c as M,i as N,l as P,n as F,o as I,r as L,s as R,t as z,u as B}from"./index-CgWcA4H6.js";import{playCosmeticOpenAnimation as V}from"./cosmeticOpenAnimation-DhT3A-nn.js";import{notifyUnlockTutorial as H}from"./tutorialUnlocks-CKx5XLg0.js";var U=null;function W(){U!=null&&(clearInterval(U),U=null)}function G(e){if(!e)return;W();let t=()=>{e.textContent=`Resets in: ${_(f())}`};t(),U=setInterval(t,1e3)}function K(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var q={common:`rarity-common`,uncommon:`rarity-uncommon`,rare:`rarity-rare`,epic:`rarity-epic`,legendary:`rarity-legendary`};function J(e){if(e===`pieceSkin`)return`Piece skins`;if(e===`frame`)return`Frames`;let t=R(e);return t.endsWith(`s`)?t:`${t}s`}function Y(e){let t=E(e);return t?D(t):``}var ie={pvp:`<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  </svg>`};function ae(e){let t=s(e);return`
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
    </div>`}function X(e,t,{logEl:r,onGemsChange:i,onOpened:o,cosmeticsUnlocked:s=!0}={}){if(t){if(t.innerHTML=``,!s){t.innerHTML=`<p class="vault-locked-msg muted">${y}</p>`;return}for(let c of n){let n=L[c.id]||L.style_crate,l=e.gems>=c.cost,u=document.createElement(`article`);u.className=`chest-card chest-card--${n.visual} cosmetic-box-card cosmetic-box-card--${c.id}${l?``:` chest-card--locked`}`,u.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${I(c.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${n.label}</span>
        <h3 class="chest-card__name">${c.name}</h3>
        <p class="chest-card__tagline">${re(c.weights)}</p>
        <ul class="chest-card__stats">
          <li><strong>${c.pulls}</strong> cosmetics</li>
          <li>Avatars · frames · banners · skins</li>
        </ul>
        <p class="chest-card__cost">
          <span class="chest-card__gem" aria-hidden="true">◆</span>
          <span>${c.cost}</span>
        </p>
      </div>
      <button type="button" class="btn-primary btn-open-cosmetic chest-card__btn" data-box="${c.id}">
        ${l?`Open`:`Need more gems`}
      </button>`;let d=u.querySelector(`.btn-open-cosmetic`);d.disabled=!l,d.addEventListener(`click`,async()=>{if(d.disabled)return;let l=a(e,c.id);if(!l.success){r&&(r.textContent=l.message);return}g(e),i?.(),d.disabled=!0,await V({boxId:c.id,boxLabel:n.label,pulls:l.pulls});let u=l.pulls.map(e=>`${e.name}${e.duplicate?` (duplicate)`:``}`).join(`, `);r&&(r.textContent=`Opened ${c.name}: ${u}${l.bonusGems?` · +${l.bonusGems} gems from duplicates`:``}`),o?.(l),H(`cosmetic-box-opened`,{boxId:c.id,pulls:l.pulls}),X(e,t,{logEl:r,onGemsChange:i,onOpened:o,cosmeticsUnlocked:s})}),t.appendChild(u)}}}function Z(e,n,{onTitleChanged:r}={}){if(!n)return;n.innerHTML=``;let i=[...d].sort((n,r)=>{let i=n=>p(e,n)?0:t(e,n)?2:1,a=i(n.id)-i(r.id);if(a!==0)return a;let o=x(e,r.id)-x(e,n.id);return o===0?n.title.localeCompare(r.title):o});for(let a of i){let i=w(a.id),o=S(e,a.id),s=t(e,a.id),c=p(e,a.id),u=!o&&!s,d=document.createElement(`article`);d.className=[`profile-achievement-card`,u?`profile-achievement-card--locked`:``,o?`profile-achievement-card--complete`:``,s?`profile-achievement-card--claimed`:``,c?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let f=l(e,a.id),m=a.target?Math.min(100,Math.round((e.achievements?.progress?.[a.id]||0)/a.target*100)):0,h=s?`Unlocked`:c?`Claim Title`:o?`Complete`:`In progress`;if(d.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(a.title)}</h4>
        ${i?`<span class="profile-achievement-card__reward ${j(i)}">[${K(i.display)}]</span>`:``}
      </div>
      <p class="profile-achievement-card__desc">${K(a.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${m}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${m}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${K(f)}</p>
      <span class="profile-achievement-card__status">${h}</span>`,c){let t=document.createElement(`button`);t.type=`button`,t.className=`btn-primary profile-achievement-card__claim`,t.textContent=`Claim Title`,t.addEventListener(`click`,()=>{C(e,a.id).success&&(g(e),Z(e,n,{onTitleChanged:r}),r?.())}),d.appendChild(t)}n.appendChild(d)}}function Q(t,n,{onCurrencyChange:r}={}){if(!n)return;n.innerHTML=``;let i=[...v(t)].sort((e,n)=>{let r=e=>e.canClaim?0:e.claimed?2:1,i=r(e)-r(n);return i===0?m(t,n.templateId)-m(t,e.templateId):i});for(let{template:a,templateId:o,complete:s,claimed:l,canClaim:u}of i){if(!a)continue;let i=!s&&!l,d=document.createElement(`article`);d.className=[`profile-achievement-card`,`daily-quest-card`,i?`profile-achievement-card--locked`:``,s?`profile-achievement-card--complete`:``,l?`profile-achievement-card--claimed`:``,u?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let f=e(t,o),p=a.target?Math.min(100,Math.round(h(t,o)/a.target*100)):0,m=b(o),_=a.reward.currency===`stars`?`daily-quest-card__reward--stars`:`daily-quest-card__reward--gems`,v=l?`Claimed`:u?`Claim reward`:s?`Complete`:`In progress`;if(d.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(a.title)}</h4>
        <span class="daily-quest-card__reward ${_}">${K(m)}</span>
      </div>
      <p class="profile-achievement-card__desc">${K(a.description)}</p>
      <div class="profile-achievement-card__progress" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100">
        <div class="profile-achievement-card__progress-fill" style="width:${p}%"></div>
      </div>
      <p class="profile-achievement-card__progress-text">${K(f)}</p>
      <span class="profile-achievement-card__status">${v}</span>`,u){let e=document.createElement(`button`);e.type=`button`,e.className=`btn-primary profile-achievement-card__claim`,e.textContent=a.reward.currency===`stars`?`Claim stars`:`Claim gems`,e.addEventListener(`click`,()=>{c(t,o).success&&(g(t),Q(t,n,{onCurrencyChange:r}),r?.())}),d.appendChild(e)}n.appendChild(d)}}function $(e,t,{onTitleChanged:n,onCurrencyChange:r}={}){if(!t)return;W(),t.innerHTML=`
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
    </section>`;let i=e=>{t.querySelectorAll(`.quests-section-tab`).forEach(t=>{let n=t.dataset.questsSection===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)});let n=t.querySelector(`#quests-section-daily`),r=t.querySelector(`#quests-section-title`);n&&(n.classList.toggle(`hidden`,e!==`daily`),n.hidden=e!==`daily`),r&&(r.classList.toggle(`hidden`,e!==`title`),r.hidden=e!==`title`)};for(let e of t.querySelectorAll(`.quests-section-tab`))e.addEventListener(`click`,()=>i(e.dataset.questsSection));G(t.querySelector(`#daily-quests-reset-countdown`)),Q(e,t.querySelector(`#daily-quests-grid`),{onCurrencyChange:r}),Z(e,t.querySelector(`#quests-grid`),{onTitleChanged:n})}var se=$;function ce(e,t,{onGemsChange:n,onTitleChanged:a}={}){if(!t)return;let s=r(e),c=ne(),l=te()&&!!c;t.innerHTML=`
    <section class="panel game-panel profile-panel">
      ${oe(s,e,{username:``})}
      <div class="profile-section-tabs" role="tablist" aria-label="Profile sections">
        <button type="button" class="profile-section-tab active" role="tab" data-profile-section="cosmetics">Cosmetics</button>
        <button type="button" class="profile-section-tab" role="tab" data-profile-section="titles">Titles</button>
      </div>
      <div id="profile-section-cosmetics" class="profile-section-panel">
        <div class="profile-cosmetic-filters" role="tablist" aria-label="Cosmetic category">
          ${o.map(e=>`<button type="button" class="profile-filter-btn" role="tab" data-cos-filter="${e}">${J(e)}</button>`).join(``)}
        </div>
        <div id="profile-cosmetic-grid" class="profile-cosmetic-grid"></div>
      </div>
      <div id="profile-section-titles" class="profile-section-panel hidden" hidden>
        <p class="muted profile-titles-hint">Unlock titles by completing quests, then tap to equip.</p>
        <div id="profile-title-grid" class="profile-title-grid"></div>
      </div>
    </section>
  `;let d=t.querySelector(`#profile-cosmetic-grid`),f=`avatar`,p=``,m=()=>{let n=r(e);t.querySelector(`#profile-banner-preview`).style.background=N(n.equipped.banner);let i=t.querySelector(`#profile-avatar-preview`),o=(p||`P`).charAt(0).toUpperCase();i&&(i.innerHTML=P(n.equipped.avatar)||`<span class="profile-avatar-fallback">${K(o)}</span>`);let s=t.querySelector(`#profile-avatar-stack`);s&&(s.className=`profile-avatar-stack ${M(n.equipped.frame)}`);let c=t.querySelector(`#profile-hero-username`);c&&(c.textContent=p||`Player`);let l=t.querySelector(`.profile-hero-card__title-badge`),u=Y(e);if(u)if(l)l.innerHTML=u;else{let e=t.querySelector(`.profile-hero-card__name-row`);if(e){let t=document.createElement(`span`);t.className=`profile-hero-card__title-badge`,t.innerHTML=u,e.appendChild(t)}}else l&&l.remove();a?.()},h=()=>{let t=e.cosmetics?.owned?.[f]||[];d.innerHTML=``;for(let n of t){let t=i[n];if(!t)continue;let r=e.cosmetics.equipped[f]===n,a=document.createElement(`button`);a.type=`button`,a.className=`profile-cosmetic-card ${q[t.rarity]||``} ${r?`profile-cosmetic-card--equipped`:``}`;let o=B(n,t.type);a.innerHTML=`
        <span class="profile-cosmetic-card__rarity">${t.rarity}</span>
        <div class="profile-cosmetic-card__art">${o}</div>
        <strong class="profile-cosmetic-card__name">${t.name}</strong>
        <span class="profile-cosmetic-card__action">${r?`Equipped`:`Equip`}</span>`,a.addEventListener(`click`,()=>{r||u(e,f,n).success&&(g(e),h(),m(),H(`cosmetic-equipped`,{type:f,id:n}))}),d.appendChild(a)}t.length||(d.innerHTML=`<p class="muted">Open cosmetic boxes in the Shop to unlock items.</p>`)};for(let e of t.querySelectorAll(`.profile-filter-btn`))e.addEventListener(`click`,()=>{f=e.dataset.cosFilter,t.querySelectorAll(`.profile-filter-btn`).forEach(t=>t.classList.toggle(`active`,t===e)),h()});t.querySelector(`.profile-filter-btn`)?.classList.add(`active`),h();let _=()=>{let n=t.querySelector(`#profile-title-grid`);if(!n)return;n.innerHTML=``;let r=E(e);for(let t of A){let i=O(e,t.id),o=r===t.id,s=document.createElement(`button`);s.type=`button`,s.disabled=!i,s.className=[`profile-title-card`,T[t.rarity]||``,`profile-title-card--glow-${t.glow}`,i?``:`profile-title-card--locked`,o?`profile-title-card--equipped`:``].filter(Boolean).join(` `),s.innerHTML=`
        <span class="profile-title-card__tag ${j(t)}">[${K(t.display)}]</span>
        <span class="profile-title-card__rarity">${t.rarity}</span>
        <span class="profile-title-card__action">${o?`Equipped`:i?`Equip`:`Locked`}</span>`,s.addEventListener(`click`,()=>{i&&k(e,o?null:t.id).success&&(g(e),_(),m(),a?.())}),n.appendChild(s)}},v=e=>{t.querySelectorAll(`.profile-section-tab`).forEach(t=>{t.classList.toggle(`active`,t.dataset.profileSection===e)});let n=t.querySelector(`#profile-section-cosmetics`);n&&(n.classList.toggle(`hidden`,e!==`cosmetics`),n.hidden=e!==`cosmetics`);let r=t.querySelector(`#profile-section-titles`);r&&(r.classList.toggle(`hidden`,e!==`titles`),r.hidden=e!==`titles`),e===`titles`&&_()};for(let e of t.querySelectorAll(`.profile-section-tab`))e.addEventListener(`click`,()=>v(e.dataset.profileSection));_(),l&&(async()=>{try{p=(await ee(c.id))?.username||c.user_metadata?.display_name||``,m()}catch(e){console.warn(`Could not load profile username`,e)}})()}export{z as headerProfileAvatarHtml,se as renderAchievementsTab,X as renderCosmeticBoxes,ce as renderProfileTab,$ as renderQuestsTab,F as resolveDisplayUsername};