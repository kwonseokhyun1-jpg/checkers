import{$ as e,C as t,F as n,G as r,I as i,J as a,L as o,O as s,Q as c,T as l,W as u,_ as d,at as f,b as p,et as m,it as h,m as g,nt as _,rt as v,st as y,tt as b,v as x,w as S,x as C,y as ee}from"./storage-YvJ-TZdj.js";import{a as w,c as T,d as E,l as D,o as O,t as k,u as A}from"./mageTitles-BPvsmJqw.js";import{a as te,c as ne,o as re}from"./auth-DUgkNf7I.js";import{a as j,c as ie,d as M,i as N,l as P,n as F,q as I,r as L,s as R,u as z}from"./index-BSVcnwWK.js";import{playCosmeticOpenAnimation as B}from"./cosmeticOpenAnimation-BmvS6ssV.js";import{notifyUnlockTutorial as V}from"./tutorialUnlocks-D1j5Whz1.js";import{t as H}from"./profileStatIcons-DJomtKMV.js";var U=null;function W(){U!=null&&(clearInterval(U),U=null)}function G(e){if(!e)return;W();let t=()=>{e.textContent=`Resets in: ${_(f())}`};t(),U=setInterval(t,1e3)}function K(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}var q={common:`rarity-common`,uncommon:`rarity-uncommon`,rare:`rarity-rare`,epic:`rarity-epic`,legendary:`rarity-legendary`};function J(e){if(e===`pieceSkin`)return`Piece skins`;if(e===`frame`)return`Frames`;let t=ie(e);return t.endsWith(`s`)?t:`${t}s`}function Y(e){let t=T(e);return t?E(t):``}function ae(e){let t=s(e);return`
    <div class="profile-hero-stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:t.pvpWins},{key:`adventure`,label:`Floors cleared`,value:t.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:t.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${K(e.label)}</span>
          <span class="profile-stat-card__icon">${H[e.key]}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function oe(e,t,{username:n}){let r=Y(t),i=n||`Player`,a=i.charAt(0).toUpperCase()||`?`;return`
    <div class="profile-hero-card">
      <div class="profile-showcase profile-hero-card__showcase">
        <div class="profile-showcase__banner" id="profile-banner-preview" style="background:${j(e.equipped.banner)}"></div>
        <div class="profile-showcase__hero profile-hero-card__hero">
          <div class="profile-avatar-stack ${P(e.equipped.frame)}" id="profile-avatar-stack">
            <div class="profile-avatar-inner" id="profile-avatar-preview" aria-hidden="true">${z(e.equipped.avatar)||`<span class="profile-avatar-fallback">${K(a)}</span>`}</div>
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
    </div>`}function X(e,t,{logEl:r,onGemsChange:i,onOpened:o,cosmeticsUnlocked:s=!0}={}){if(t){if(t.innerHTML=``,!s){t.innerHTML=`<p class="vault-locked-msg muted">${y}</p>`;return}for(let c of n){let n=N[c.id]||N.style_crate,l=e.gems>=c.cost,u=document.createElement(`article`);u.className=`chest-card chest-card--${n.visual} cosmetic-box-card cosmetic-box-card--${c.id}${l?``:` chest-card--locked`}`,u.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${R(c.id)}</div>
      <div class="chest-card__body">
        <span class="chest-card__tier">${n.label}</span>
        <h3 class="chest-card__name">${c.name}</h3>
        <p class="chest-card__tagline">${I(c.weights)}</p>
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
      </button>`;let d=u.querySelector(`.btn-open-cosmetic`);d.disabled=!l,d.addEventListener(`click`,async()=>{if(d.disabled)return;let l=a(e,c.id);if(!l.success){r&&(r.textContent=l.message);return}g(e),i?.(),d.disabled=!0,await B({boxId:c.id,boxLabel:n.label,pulls:l.pulls});let u=l.pulls.map(e=>`${e.name}${e.duplicate?` (duplicate)`:``}`).join(`, `);r&&(r.textContent=`Opened ${c.name}: ${u}${l.bonusGems?` · +${l.bonusGems} gems from duplicates`:``}`),o?.(l),V(`cosmetic-box-opened`,{boxId:c.id,pulls:l.pulls}),X(e,t,{logEl:r,onGemsChange:i,onOpened:o,cosmeticsUnlocked:s})}),t.appendChild(u)}}}function Z(e,n,{onTitleChanged:r}={}){if(!n)return;n.innerHTML=``;let i=[...d].sort((n,r)=>{let i=n=>p(e,n)?0:t(e,n)?2:1,a=i(n.id)-i(r.id);if(a!==0)return a;let o=x(e,r.id)-x(e,n.id);return o===0?n.title.localeCompare(r.title):o});for(let a of i){let i=ee(a.id),o=S(e,a.id),s=t(e,a.id),c=p(e,a.id),u=!o&&!s,d=document.createElement(`article`);d.className=[`profile-achievement-card`,u?`profile-achievement-card--locked`:``,o?`profile-achievement-card--complete`:``,s?`profile-achievement-card--claimed`:``,c?`profile-achievement-card--claimable`:``].filter(Boolean).join(` `);let f=l(e,a.id),m=a.target?Math.min(100,Math.round((e.achievements?.progress?.[a.id]||0)/a.target*100)):0,h=s?`Unlocked`:c?`Claim Title`:o?`Complete`:`In progress`;if(d.innerHTML=`
      <div class="profile-achievement-card__head">
        <h4 class="profile-achievement-card__title">${K(a.title)}</h4>
        ${i?`<span class="profile-achievement-card__reward ${A(i)}">[${K(i.display)}]</span>`:``}
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
    </section>`;let i=e=>{t.querySelectorAll(`.quests-section-tab`).forEach(t=>{let n=t.dataset.questsSection===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)});let n=t.querySelector(`#quests-section-daily`),r=t.querySelector(`#quests-section-title`);n&&(n.classList.toggle(`hidden`,e!==`daily`),n.hidden=e!==`daily`),r&&(r.classList.toggle(`hidden`,e!==`title`),r.hidden=e!==`title`)};for(let e of t.querySelectorAll(`.quests-section-tab`))e.addEventListener(`click`,()=>i(e.dataset.questsSection));G(t.querySelector(`#daily-quests-reset-countdown`)),Q(e,t.querySelector(`#daily-quests-grid`),{onCurrencyChange:r}),Z(e,t.querySelector(`#quests-grid`),{onTitleChanged:n})}var se=$;function ce(e,t,{onGemsChange:n,onTitleChanged:a}={}){if(!t)return;let s=r(e),c=re(),l=ne()&&!!c;t.innerHTML=`
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
  `;let d=t.querySelector(`#profile-cosmetic-grid`),f=`avatar`,p=``,m=()=>{let n=r(e);t.querySelector(`#profile-banner-preview`).style.background=j(n.equipped.banner);let i=t.querySelector(`#profile-avatar-preview`),o=(p||`P`).charAt(0).toUpperCase();i&&(i.innerHTML=z(n.equipped.avatar)||`<span class="profile-avatar-fallback">${K(o)}</span>`);let s=t.querySelector(`#profile-avatar-stack`);s&&(s.className=`profile-avatar-stack ${P(n.equipped.frame)}`);let c=t.querySelector(`#profile-hero-username`);c&&(c.textContent=p||`Player`);let l=t.querySelector(`.profile-hero-card__title-badge`),u=Y(e);if(u)if(l)l.innerHTML=u;else{let e=t.querySelector(`.profile-hero-card__name-row`);if(e){let t=document.createElement(`span`);t.className=`profile-hero-card__title-badge`,t.innerHTML=u,e.appendChild(t)}}else l&&l.remove();a?.()},h=()=>{let t=e.cosmetics?.owned?.[f]||[];d.innerHTML=``;for(let n of t){let t=i[n];if(!t)continue;let r=e.cosmetics.equipped[f]===n,a=document.createElement(`button`);a.type=`button`,a.className=`profile-cosmetic-card ${q[t.rarity]||``} ${r?`profile-cosmetic-card--equipped`:``}`;let o=M(n,t.type);a.innerHTML=`
        <span class="profile-cosmetic-card__rarity">${t.rarity}</span>
        <div class="profile-cosmetic-card__art">${o}</div>
        <strong class="profile-cosmetic-card__name">${t.name}</strong>
        <span class="profile-cosmetic-card__action">${r?`Equipped`:`Equip`}</span>`,a.addEventListener(`click`,()=>{r||u(e,f,n).success&&(g(e),h(),m(),V(`cosmetic-equipped`,{type:f,id:n}))}),d.appendChild(a)}t.length||(d.innerHTML=`<p class="muted">Open cosmetic boxes in the Shop to unlock items.</p>`)};for(let e of t.querySelectorAll(`.profile-filter-btn`))e.addEventListener(`click`,()=>{f=e.dataset.cosFilter,t.querySelectorAll(`.profile-filter-btn`).forEach(t=>t.classList.toggle(`active`,t===e)),h()});t.querySelector(`.profile-filter-btn`)?.classList.add(`active`),h();let _=()=>{let n=t.querySelector(`#profile-title-grid`);if(!n)return;n.innerHTML=``;let r=T(e);for(let t of k){let i=D(e,t.id),o=r===t.id,s=document.createElement(`button`);s.type=`button`,s.disabled=!i,s.className=[`profile-title-card`,w[t.rarity]||``,`profile-title-card--glow-${t.glow}`,i?``:`profile-title-card--locked`,o?`profile-title-card--equipped`:``].filter(Boolean).join(` `),s.innerHTML=`
        <span class="profile-title-card__tag ${A(t)}">[${K(t.display)}]</span>
        <span class="profile-title-card__rarity">${t.rarity}</span>
        <span class="profile-title-card__action">${o?`Equipped`:i?`Equip`:`Locked`}</span>`,s.addEventListener(`click`,()=>{i&&O(e,o?null:t.id).success&&(g(e),_(),m(),a?.())}),n.appendChild(s)}},v=e=>{t.querySelectorAll(`.profile-section-tab`).forEach(t=>{t.classList.toggle(`active`,t.dataset.profileSection===e)});let n=t.querySelector(`#profile-section-cosmetics`);n&&(n.classList.toggle(`hidden`,e!==`cosmetics`),n.hidden=e!==`cosmetics`);let r=t.querySelector(`#profile-section-titles`);r&&(r.classList.toggle(`hidden`,e!==`titles`),r.hidden=e!==`titles`),e===`titles`&&_()};for(let e of t.querySelectorAll(`.profile-section-tab`))e.addEventListener(`click`,()=>v(e.dataset.profileSection));_(),l&&(async()=>{try{p=(await te(c.id))?.username||c.user_metadata?.display_name||``,m()}catch(e){console.warn(`Could not load profile username`,e)}})()}export{F as headerProfileAvatarHtml,se as renderAchievementsTab,X as renderCosmeticBoxes,ce as renderProfileTab,$ as renderQuestsTab,L as resolveDisplayUsername};