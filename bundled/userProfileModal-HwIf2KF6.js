import{O as e,q as t}from"./storage-BZfxnwKz.js";import{s as n}from"./mageTitles-BPvsmJqw.js";import{a as r}from"./auth-K3rxrlkW.js";import{a as i,l as a,u as o}from"./index-CbSHMKFX.js";import{t as s}from"./profileStatCards-DHpHe70G.js";function c(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function l(e,t,{clickable:n=!1,userId:r=``,isOnline:i=!1}={}){let s=e?.equipped||{},l=(t||`P`).charAt(0).toUpperCase(),u=o(s.avatar)||`<span class="profile-avatar-fallback">${c(l)}</span>`,d=`<span class="profile-avatar-stack ${a(s.frame)}${i?` profile-avatar-stack--online`:``}"><span class="profile-avatar-inner">${u}</span></span>`;return n&&r?`<button type="button" class="pvp-room-host-profile" data-view-profile="${c(r)}" data-profile-name="${c(t)}" aria-label="View ${c(t)}'s profile">${d}</button>`:`<span class="pvp-room-host-profile pvp-room-host-profile--static" aria-hidden="true">${d}</span>`}function u(e){return s(e,{wrapperClass:`profile-hero-stats public-profile-modal__stats`})}function d({username:e,cosmetics:t,stats:r}){let s=t.equipped||{},l=(e||`P`).charAt(0).toUpperCase(),d=o(s.avatar)||`<span class="profile-avatar-fallback">${c(l)}</span>`,f=n({cosmetics:t},{compact:!1});return`
    <div class="public-profile-modal" role="dialog" aria-modal="true" aria-labelledby="public-profile-title">
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <div class="profile-showcase public-profile-modal__showcase">
          <div class="profile-showcase__banner" style="background:${i(s.banner)}"></div>
          <div class="profile-showcase__hero public-profile-modal__hero">
            <div class="profile-avatar-stack ${a(s.frame)}">
              <div class="profile-avatar-inner" aria-hidden="true">${d}</div>
            </div>
            <div class="public-profile-modal__identity">
              <h2 id="public-profile-title" class="public-profile-modal__name">${c(e)}</h2>
              ${f?`<div class="public-profile-modal__title">${f}</div>`:``}
            </div>
          </div>
        </div>
        ${u(r)}
      </div>
    </div>`}var f=null;function p(){f?.remove(),f=null,document.body.classList.remove(`public-profile-modal-open`)}function m(e){e.querySelectorAll(`[data-close-public-profile]`).forEach(e=>{e.addEventListener(`click`,p)});let t=e=>{e.key===`Escape`&&(p(),document.removeEventListener(`keydown`,t))};document.addEventListener(`keydown`,t)}async function h(n,{fallbackName:i=`Player`}={}){if(!n)return;p();let a=document.createElement(`div`);a.className=`public-profile-modal public-profile-modal--loading`,a.setAttribute(`role`,`dialog`),a.setAttribute(`aria-modal`,`true`),a.setAttribute(`aria-label`,`Loading profile`),a.innerHTML=`
    <div class="public-profile-modal__backdrop"></div>
    <div class="public-profile-modal__dialog panel game-panel">
      <p class="public-profile-modal__loading muted">Loading profile…</p>
    </div>`,document.body.appendChild(a),document.body.classList.add(`public-profile-modal-open`),f=a;try{let o=await r(n),s=o?.profile_json&&typeof o.profile_json==`object`?o.profile_json:{},c=t(s.cosmetics),l=o?.username&&String(o.username).trim()||o?.display_name&&String(o.display_name).trim()||i,u=e({pvpWins:s.pvpWins,adventure:s.adventure,spellsPlayed:s.spellsPlayed});a.remove();let p=document.createElement(`div`);p.innerHTML=d({username:l,cosmetics:c,stats:u});let h=p.firstElementChild;document.body.appendChild(h),f=h,m(h)}catch{a.innerHTML=`
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <p class="public-profile-modal__loading muted">Could not load this profile.</p>
      </div>`,m(a)}}function g(e){e?.querySelectorAll(`[data-view-profile]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let n=e.getAttribute(`data-view-profile`),r=e.getAttribute(`data-profile-name`)||`Player`;n&&h(n,{fallbackName:r})})})}export{l as n,h as r,g as t};