import{O as e,q as t}from"./storage-DeQeaCz4.js";import{s as n}from"./mageTitles-BPvsmJqw.js";import{a as r}from"./auth-DU_H4sep.js";import{a as i,l as a,u as o}from"./index-CzoPGxjE.js";function s(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function c(e,t,{clickable:n=!1,userId:r=``}={}){let i=e?.equipped||{},c=(t||`P`).charAt(0).toUpperCase(),l=o(i.avatar)||`<span class="profile-avatar-fallback">${s(c)}</span>`,u=`<span class="profile-avatar-stack ${a(i.frame)}"><span class="profile-avatar-inner">${l}</span></span>`;return n&&r?`<button type="button" class="pvp-room-host-profile" data-view-profile="${s(r)}" data-profile-name="${s(t)}" aria-label="View ${s(t)}'s profile">${u}</button>`:`<span class="pvp-room-host-profile pvp-room-host-profile--static" aria-hidden="true">${u}</span>`}function l(e){return`
    <div class="profile-hero-stats public-profile-modal__stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:e.pvpWins},{key:`adventure`,label:`Floors cleared`,value:e.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:e.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${s(e.label)}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function u({username:e,cosmetics:t,stats:r}){let c=t.equipped||{},u=(e||`P`).charAt(0).toUpperCase(),d=o(c.avatar)||`<span class="profile-avatar-fallback">${s(u)}</span>`,f=n({cosmetics:t},{compact:!1});return`
    <div class="public-profile-modal" role="dialog" aria-modal="true" aria-labelledby="public-profile-title">
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <div class="profile-showcase public-profile-modal__showcase">
          <div class="profile-showcase__banner" style="background:${i(c.banner)}"></div>
          <div class="profile-showcase__hero public-profile-modal__hero">
            <div class="profile-avatar-stack ${a(c.frame)}">
              <div class="profile-avatar-inner" aria-hidden="true">${d}</div>
            </div>
            <div class="public-profile-modal__identity">
              <h2 id="public-profile-title" class="public-profile-modal__name">${s(e)}</h2>
              ${f?`<div class="public-profile-modal__title">${f}</div>`:``}
            </div>
          </div>
        </div>
        ${l(r)}
      </div>
    </div>`}var d=null;function f(){d?.remove(),d=null,document.body.classList.remove(`public-profile-modal-open`)}function p(e){e.querySelectorAll(`[data-close-public-profile]`).forEach(e=>{e.addEventListener(`click`,f)});let t=e=>{e.key===`Escape`&&(f(),document.removeEventListener(`keydown`,t))};document.addEventListener(`keydown`,t)}async function m(n,{fallbackName:i=`Player`}={}){if(!n)return;f();let a=document.createElement(`div`);a.className=`public-profile-modal public-profile-modal--loading`,a.setAttribute(`role`,`dialog`),a.setAttribute(`aria-modal`,`true`),a.setAttribute(`aria-label`,`Loading profile`),a.innerHTML=`
    <div class="public-profile-modal__backdrop"></div>
    <div class="public-profile-modal__dialog panel game-panel">
      <p class="public-profile-modal__loading muted">Loading profile…</p>
    </div>`,document.body.appendChild(a),document.body.classList.add(`public-profile-modal-open`),d=a;try{let o=await r(n),s=o?.profile_json&&typeof o.profile_json==`object`?o.profile_json:{},c=t(s.cosmetics),l=o?.username&&String(o.username).trim()||o?.display_name&&String(o.display_name).trim()||i,f=e({pvpWins:s.pvpWins,adventure:s.adventure,spellsPlayed:s.spellsPlayed});a.remove();let m=document.createElement(`div`);m.innerHTML=u({username:l,cosmetics:c,stats:f});let h=m.firstElementChild;document.body.appendChild(h),d=h,p(h)}catch{a.innerHTML=`
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <p class="public-profile-modal__loading muted">Could not load this profile.</p>
      </div>`,p(a)}}function h(e){e?.querySelectorAll(`[data-view-profile]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let n=e.getAttribute(`data-view-profile`),r=e.getAttribute(`data-profile-name`)||`Player`;n&&m(n,{fallbackName:r})})})}export{c as n,m as r,h as t};