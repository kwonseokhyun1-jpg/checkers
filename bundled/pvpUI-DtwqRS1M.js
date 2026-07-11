import"./cardCatalog-AnvdLb5p.js";import{c as e,o as t,s as n,u as r}from"./deckRules-B0ev_ycV.js";import{B as i,E as a,G as o,I as s,K as c,M as l,O as u,V as ee,Z as te,k as d,m as ne,ot as re,q as f}from"./storage-D2Si7hWe.js";import{s as p}from"./mageTitles-BPvsmJqw.js";import{a as m,b as h,c as ie,d as ae,o as g,s as oe}from"./auth-4a6NLrPe.js";import{A as se,B as _,D as ce,E as le,M as ue,O as v,S as de,c as fe,f as y,i as pe,k as me,l as b,m as x}from"./index-B6wHtF66.js";import{t as S}from"./board-CRMGY2kg.js";import{MatchSession as he,isMutualElimination as ge,isPvpTerminalBoard as _e}from"./match-djDvMsi-.js";import{getMatchHtml as ve}from"./matchView--iXVUxGr.js";import{PVP_MODE_MYSTERY as ye,PVP_MODE_NORMAL as be,PvpService as xe,clearActivePvpMatchId as C,formatPvpError as w,isMysteryMode as T,matchRowFingerprint as Se,probePvpBackend as Ce,readActivePvpMatchId as we,saveActivePvpMatchId as E,shouldApplyPvpRow as Te,subscribeOpenRooms as Ee}from"./pvp-BClhwXlF.js";function D(e){let t=e?.code||``,n=String(e?.message||``);return t===`PGRST202`||n.includes(`Could not find the function`)}function O(e){return e?.username&&String(e.username).trim()||e?.display_name&&String(e.display_name).trim()||`Player`}async function De(e=50){let t=h();if(!t)return[];let n=await t.rpc(`pvp_leaderboard`,{p_limit:e});if(!n.error&&Array.isArray(n.data))return n.data.map((e,t)=>({id:e.id,username:O(e),pvpWins:Math.max(0,Number(e.pvp_wins)||0),rank:t+1}));if(n.error&&!D(n.error))throw n.error;let{data:r,error:i}=await t.from(`profiles`).select(`id, username, display_name, profile_json`).limit(200);if(i)throw i;return(r||[]).map(e=>({id:e.id,username:O(e),pvpWins:d(e.profile_json||{})})).filter(e=>e.pvpWins>0).sort((e,t)=>t.pvpWins-e.pvpWins||e.username.localeCompare(t.username)).slice(0,e).map((e,t)=>({...e,rank:t+1}))}async function Oe(e=20){let t=h(),n=g();if(!t||!n)return[];let{data:r,error:i}=await t.from(`pvp_matches`).select(`id, host_id, guest_id, host_display_name, guest_display_name, turn, match_mode, updated_at, version`).eq(`status`,`active`).not(`guest_id`,`is`,null).order(`updated_at`,{ascending:!1}).limit(e);if(i)throw i;return r||[]}function ke(e){let t=h();if(!t)return()=>{};let n=t.channel(`pvp-live-matches`).on(`postgres_changes`,{event:`*`,schema:`public`,table:`pvp_matches`,filter:`status=eq.active`},()=>e?.()).subscribe();return()=>{t.removeChannel(n)}}var k=4e3;function A(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function j(e,{label:t}={}){let{username:n,cosmetics:r}=e,i=r?.equipped||{},a=p({cosmetics:r},{compact:!0});return`
    <article class="pvp-loading__card">
      <div class="profile-showcase pvp-loading__showcase">
        <div class="profile-showcase__banner" style="background:${pe(i.banner)}"></div>
        <div class="profile-showcase__hero pvp-loading__hero">
          <div class="profile-avatar-stack ${fe(i.frame)}">
            <div class="profile-avatar-inner" aria-hidden="true">${b(i.avatar)}</div>
          </div>
        </div>
      </div>
      <div class="pvp-loading__identity">
        ${t?`<p class="pvp-loading__label">${A(t)}</p>`:``}
        <p class="pvp-loading__name">${A(n)}</p>
        ${a?`<div class="pvp-loading__mage-title">${a}</div>`:``}
      </div>
    </article>`}function Ae(e,t){return e.innerHTML=`
    <div class="pvp-loading" role="dialog" aria-modal="true" aria-labelledby="pvp-loading-status">
      <header class="pvp-loading__header">
        <p id="pvp-loading-status" class="pvp-loading__status">Match starting</p>
        <div class="pvp-loading__progress" aria-hidden="true">
          <span class="pvp-loading__progress-bar"></span>
        </div>
      </header>
      <div class="pvp-loading__arena">
        ${j(t.local,{label:`You`})}
        <div class="pvp-loading__vs" aria-hidden="true"><span>VS</span></div>
        ${j(t.opponent,{label:`Opponent`})}
      </div>
    </div>`,new Promise(e=>{setTimeout(e,k)})}function M(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function je(e,t,{clickable:n=!1,userId:r=``}={}){let i=e?.equipped||{},a=(t||`P`).charAt(0).toUpperCase(),o=b(i.avatar)||`<span class="profile-avatar-fallback">${M(a)}</span>`,s=`<span class="profile-avatar-stack ${fe(i.frame)}"><span class="profile-avatar-inner">${o}</span></span>`;return n&&r?`<button type="button" class="pvp-room-host-profile" data-view-profile="${M(r)}" data-profile-name="${M(t)}" aria-label="View ${M(t)}'s profile">${s}</button>`:`<span class="pvp-room-host-profile pvp-room-host-profile--static" aria-hidden="true">${s}</span>`}function N(e){return`
    <div class="profile-hero-stats public-profile-modal__stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:e.pvpWins},{key:`adventure`,label:`Floors cleared`,value:e.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:e.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${M(e.label)}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function Me({username:e,cosmetics:t,stats:n}){let r=t.equipped||{},i=(e||`P`).charAt(0).toUpperCase(),a=b(r.avatar)||`<span class="profile-avatar-fallback">${M(i)}</span>`,o=p({cosmetics:t},{compact:!1});return`
    <div class="public-profile-modal" role="dialog" aria-modal="true" aria-labelledby="public-profile-title">
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <div class="profile-showcase public-profile-modal__showcase">
          <div class="profile-showcase__banner" style="background:${pe(r.banner)}"></div>
          <div class="profile-showcase__hero public-profile-modal__hero">
            <div class="profile-avatar-stack ${fe(r.frame)}">
              <div class="profile-avatar-inner" aria-hidden="true">${a}</div>
            </div>
            <div class="public-profile-modal__identity">
              <h2 id="public-profile-title" class="public-profile-modal__name">${M(e)}</h2>
              ${o?`<div class="public-profile-modal__title">${o}</div>`:``}
            </div>
          </div>
        </div>
        ${N(n)}
      </div>
    </div>`}var P=null;function F(){P?.remove(),P=null,document.body.classList.remove(`public-profile-modal-open`)}function I(e){e.querySelectorAll(`[data-close-public-profile]`).forEach(e=>{e.addEventListener(`click`,F)});let t=e=>{e.key===`Escape`&&(F(),document.removeEventListener(`keydown`,t))};document.addEventListener(`keydown`,t)}async function L(e,{fallbackName:t=`Player`}={}){if(!e)return;F();let n=document.createElement(`div`);n.className=`public-profile-modal public-profile-modal--loading`,n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-modal`,`true`),n.setAttribute(`aria-label`,`Loading profile`),n.innerHTML=`
    <div class="public-profile-modal__backdrop"></div>
    <div class="public-profile-modal__dialog panel game-panel">
      <p class="public-profile-modal__loading muted">Loading profile…</p>
    </div>`,document.body.appendChild(n),document.body.classList.add(`public-profile-modal-open`),P=n;try{let r=await m(e),i=r?.profile_json&&typeof r.profile_json==`object`?r.profile_json:{},a=f(i.cosmetics),o=r?.username&&String(r.username).trim()||r?.display_name&&String(r.display_name).trim()||t,s=u({pvpWins:i.pvpWins,adventure:i.adventure,spellsPlayed:i.spellsPlayed});n.remove();let c=document.createElement(`div`);c.innerHTML=Me({username:o,cosmetics:a,stats:s});let l=c.firstElementChild;document.body.appendChild(l),P=l,I(l)}catch{n.innerHTML=`
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <p class="public-profile-modal__loading muted">Could not load this profile.</p>
      </div>`,I(n)}}function Ne(e){e?.querySelectorAll(`[data-view-profile]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let n=e.getAttribute(`data-view-profile`),r=e.getAttribute(`data-profile-name`)||`Player`;n&&L(n,{fallbackName:r})})})}var R={gold:`#e8c547`,goldDim:`#c9a227`,goldGlow:`rgba(232, 197, 71, 0.45)`,ember:`#f6ad55`,stone:`#2a3448`,stoneDark:`#121a28`,sky:`#0c1018`},z={gem:`#5ce1e6`,gemDim:`#38b2ac`,gemGlow:`rgba(92, 225, 230, 0.4)`,violet:`#9f7aea`,stone:`#1e2a3d`,stoneDark:`#0f1520`,sky:`#0a1018`};function B(e,t,n){return`
    <defs>
      <linearGradient id="${e}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${n.sky||n}"/>
        <stop offset="45%" stop-color="${n.stone||`#1a2438`}"/>
        <stop offset="100%" stop-color="#080a12"/>
      </linearGradient>
      <radialGradient id="${e}-glow" cx="50%" cy="30%" r="55%">
        <stop offset="0%" stop-color="${t}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="${t}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${e}-pillar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${n.stoneDark||`#0f1520`}"/>
        <stop offset="30%" stop-color="${n.stone||`#2a3448`}"/>
        <stop offset="70%" stop-color="${n.stone||`#2a3448`}"/>
        <stop offset="100%" stop-color="${n.stoneDark||`#0f1520`}"/>
      </linearGradient>
      <filter id="${e}-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.4"/>
      </filter>
      <filter id="${e}-glow-filter" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`}function V(){let e=`pvp-arena`,t=R;return`<svg class="pvp-scenery-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${B(e,t.gold,{sky:t.sky,stone:t.stone,stoneDark:t.stoneDark})}
    <rect width="320" height="200" fill="url(#${e}-sky)"/>
    <rect width="320" height="200" fill="url(#${e}-glow)"/>
    <!-- distant arena arches -->
    <g opacity="0.55" fill="${t.stone}">
      <path d="M20 90 Q20 55 40 55 Q60 55 60 90 L60 120 L20 120 Z"/>
      <path d="M70 90 Q70 50 95 50 Q120 50 120 90 L120 120 L70 120 Z"/>
      <path d="M130 90 Q130 48 160 48 Q190 48 190 90 L190 120 L130 120 Z"/>
      <path d="M200 90 Q200 50 225 50 Q250 50 250 90 L250 120 L200 120 Z"/>
      <path d="M260 90 Q260 55 280 55 Q300 55 300 90 L300 120 L260 120 Z"/>
    </g>
    <g opacity="0.35" fill="${t.stoneDark}">
      <rect x="0" y="118" width="320" height="6"/>
      <rect x="0" y="124" width="320" height="76"/>
    </g>
    <!-- arena floor -->
    <ellipse cx="160" cy="138" rx="130" ry="18" fill="rgba(0,0,0,0.35)"/>
    <ellipse cx="160" cy="136" rx="100" ry="12" fill="${t.stoneDark}" opacity="0.6"/>
    <!-- pillars -->
    <rect x="28" y="72" width="10" height="52" fill="url(#${e}-pillar)" opacity="0.7"/>
    <rect x="282" y="72" width="10" height="52" fill="url(#${e}-pillar)" opacity="0.7"/>
    <!-- crossed swords centerpiece -->
    <g transform="translate(160 108)" opacity="0.85" filter="url(#${e}-glow-filter)">
      <g transform="rotate(-38)">
        <rect x="-3" y="-28" width="6" height="36" rx="1.5" fill="${t.goldDim}"/>
        <rect x="-5" y="6" width="10" height="4" rx="1" fill="${t.gold}"/>
        <circle cx="0" cy="12" r="3.5" fill="${t.gold}" opacity="0.9"/>
        <polygon points="0,-32 -4,-24 4,-24" fill="${t.gold}"/>
      </g>
      <g transform="rotate(38)">
        <rect x="-3" y="-28" width="6" height="36" rx="1.5" fill="${t.goldDim}"/>
        <rect x="-5" y="6" width="10" height="4" rx="1" fill="${t.gold}"/>
        <circle cx="0" cy="12" r="3.5" fill="${t.gold}" opacity="0.9"/>
        <polygon points="0,-32 -4,-24 4,-24" fill="${t.gold}"/>
      </g>
    </g>
    <!-- torches -->
    <g opacity="0.9">
      <rect x="42" y="88" width="3" height="14" fill="${t.stoneDark}"/>
      <ellipse cx="43.5" cy="86" rx="4" ry="5" fill="${t.ember}" filter="url(#${e}-glow-filter)" opacity="0.85"/>
      <ellipse cx="43.5" cy="85" rx="2" ry="2.5" fill="#fff8e0" opacity="0.55"/>
      <rect x="275" y="88" width="3" height="14" fill="${t.stoneDark}"/>
      <ellipse cx="276.5" cy="86" rx="4" ry="5" fill="${t.ember}" filter="url(#${e}-glow-filter)" opacity="0.85"/>
      <ellipse cx="276.5" cy="85" rx="2" ry="2.5" fill="#fff8e0" opacity="0.55"/>
    </g>
    <!-- floating embers -->
    <circle cx="90" cy="70" r="1.2" fill="${t.gold}" opacity="0.5" filter="url(#${e}-glow-filter)"/>
    <circle cx="230" cy="64" r="1" fill="${t.ember}" opacity="0.45" filter="url(#${e}-glow-filter)"/>
    <circle cx="160" cy="58" r="0.8" fill="${t.gold}" opacity="0.35" filter="url(#${e}-glow-filter)"/>
    <!-- banner pennants -->
    <g opacity="0.5">
      <path d="M55 62 L55 78 L68 70 Z" fill="${t.goldDim}"/>
      <path d="M252 60 L252 76 L265 68 Z" fill="${t.goldDim}"/>
    </g>
  </svg>`}function Pe(){let e=`pvp-lb`,t=z;return`<svg class="pvp-scenery-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    ${B(e,t.gem,{sky:t.sky,stone:t.stone,stoneDark:t.stoneDark})}
    <rect width="320" height="200" fill="url(#${e}-sky)"/>
    <rect width="320" height="200" fill="url(#${e}-glow)"/>
    <!-- hall columns -->
    <g opacity="0.45" fill="url(#${e}-pillar)">
      <rect x="24" y="50" width="12" height="90" rx="1"/>
      <rect x="284" y="50" width="12" height="90" rx="1"/>
      <rect x="68" y="62" width="8" height="78" rx="1" opacity="0.7"/>
      <rect x="244" y="62" width="8" height="78" rx="1" opacity="0.7"/>
    </g>
    <!-- vaulted ceiling hint -->
    <path d="M0 40 Q160 10 320 40 L320 55 Q160 28 0 55 Z" fill="${t.stone}" opacity="0.35"/>
    <!-- podium tiers -->
    <g opacity="0.7">
      <rect x="118" y="118" width="84" height="10" rx="2" fill="${t.stone}"/>
      <rect x="128" y="108" width="64" height="10" rx="2" fill="${t.stone}"/>
      <rect x="142" y="98" width="36" height="10" rx="2" fill="${t.gemDim}" opacity="0.6"/>
    </g>
    <!-- central trophy -->
    <g transform="translate(160 88)" filter="url(#${e}-glow-filter)" opacity="0.9">
      <path d="M-14 0 Q-14 -18 -6 -22 Q0 -24 6 -22 Q14 -18 14 0 L10 4 L-10 4 Z" fill="${t.gem}" opacity="0.85"/>
      <rect x="-8" y="4" width="16" height="6" rx="1" fill="${t.gemDim}"/>
      <rect x="-10" y="10" width="20" height="4" rx="1" fill="${t.gem}"/>
      <ellipse cx="0" cy="-14" rx="5" ry="3" fill="#fff" opacity="0.25"/>
      <!-- handles -->
      <path d="M-14 -6 Q-22 -4 -20 2 Q-18 6 -14 2" fill="none" stroke="${t.gem}" stroke-width="2" opacity="0.7"/>
      <path d="M14 -6 Q22 -4 20 2 Q18 6 14 2" fill="none" stroke="${t.gem}" stroke-width="2" opacity="0.7"/>
    </g>
    <!-- side trophies (smaller) -->
    <g transform="translate(108 100)" opacity="0.55">
      <path d="M-8 0 Q-8 -10 -3 -12 Q0 -13 3 -12 Q8 -10 8 0 L6 3 L-6 3 Z" fill="${t.violet}"/>
      <rect x="-5" y="3" width="10" height="4" rx="1" fill="${t.violet}" opacity="0.7"/>
    </g>
    <g transform="translate(212 100)" opacity="0.55">
      <path d="M-8 0 Q-8 -10 -3 -12 Q0 -13 3 -12 Q8 -10 8 0 L6 3 L-6 3 Z" fill="${t.violet}"/>
      <rect x="-5" y="3" width="10" height="4" rx="1" fill="${t.violet}" opacity="0.7"/>
    </g>
    <!-- laurel wreaths -->
    <g opacity="0.4" stroke="${t.gem}" stroke-width="1.2" fill="none">
      <ellipse cx="160" cy="72" rx="22" ry="10"/>
      <ellipse cx="160" cy="72" rx="18" ry="8" opacity="0.6"/>
    </g>
    <!-- star sparkles -->
    <g fill="${t.gem}" opacity="0.55" filter="url(#${e}-glow-filter)">
      <polygon points="160,42 161,46 165,46 162,48 163,52 160,50 157,52 158,48 155,46 159,46"/>
      <polygon points="80,55 80.6,57 83,57 81,58.4 81.6,60.5 80,59.2 78.4,60.5 79,58.4 77,57 79.4,57" opacity="0.7"/>
      <polygon points="240,52 240.6,54 243,54 241,55.4 241.6,57.5 240,56.2 238.4,57.5 239,55.4 237,54 239.4,54" opacity="0.7"/>
    </g>
    <!-- floor reflection -->
    <ellipse cx="160" cy="142" rx="110" ry="14" fill="rgba(92,225,230,0.06)"/>
  </svg>`}function Fe(){let e=`pvp-hub-arena`,t=R;return`<svg class="pvp-hub-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <radialGradient id="${e}-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${t.goldGlow}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="${e}-glow">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#${e}-bg)"/>
    <g transform="translate(32 34)" filter="url(#${e}-glow)">
      <g transform="rotate(-42)">
        <rect x="-2.5" y="-18" width="5" height="24" rx="1.2" fill="${t.goldDim}"/>
        <rect x="-4" y="4" width="8" height="3" rx="0.8" fill="${t.gold}"/>
        <polygon points="0,-22 -3.5,-15 3.5,-15" fill="${t.gold}"/>
      </g>
      <g transform="rotate(42)">
        <rect x="-2.5" y="-18" width="5" height="24" rx="1.2" fill="${t.goldDim}"/>
        <rect x="-4" y="4" width="8" height="3" rx="0.8" fill="${t.gold}"/>
        <polygon points="0,-22 -3.5,-15 3.5,-15" fill="${t.gold}"/>
      </g>
    </g>
    <circle cx="32" cy="34" r="4" fill="${t.gold}" opacity="0.35"/>
  </svg>`}function Ie(){let e=`pvp-hub-lb`,t=z;return`<svg class="pvp-hub-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <radialGradient id="${e}-bg" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${t.gemGlow}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <filter id="${e}-glow">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <circle cx="32" cy="32" r="28" fill="url(#${e}-bg)"/>
    <g transform="translate(32 34)" filter="url(#${e}-glow)">
      <path d="M-12 0 Q-12 -16 -5 -19 Q0 -21 5 -19 Q12 -16 12 0 L9 4 L-9 4 Z" fill="${t.gem}"/>
      <rect x="-7" y="4" width="14" height="5" rx="1" fill="${t.gemDim}"/>
      <rect x="-9" y="9" width="18" height="4" rx="1" fill="${t.gem}"/>
      <ellipse cx="0" cy="-12" rx="4" ry="2.5" fill="#fff" opacity="0.3"/>
      <path d="M-12 -4 Q-18 -2 -16 4 Q-14 8 -12 4" fill="none" stroke="${t.gem}" stroke-width="1.8" opacity="0.75"/>
      <path d="M12 -4 Q18 -2 16 4 Q14 8 12 4" fill="none" stroke="${t.gem}" stroke-width="1.8" opacity="0.75"/>
    </g>
  </svg>`}function Le(e){return`<div class="pvp-scenery pvp-scenery--${e}" aria-hidden="true">${e===`leaderboard`?Pe():V()}</div>`}function H(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Re(){return`<span class="pvp-mode-badge pvp-mode-badge--mystery">Mystery</span>`}function ze(e){return T(e)?Re():``}function Be(e){return`
    <header class="panel-head panel-head--compact">
      <div class="panel-head-title-row">
        <h2 class="panel-head__title">PvP Arena</h2>
        <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How PvP Arena works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
      </div>
      <p id="pvp-help-desc" class="panel-head__desc" hidden>${e}</p>
    </header>`}function U({root:u,getProfile:d,openAuthModal:p,onNavigateTab:h,onPvpViewShown:fe,onOpenDeckEdit:pe}){if(!u)return{render:()=>{},dispose:()=>{}};function b(){ue(u.querySelector(`#pvp-help-btn`),u.querySelector(`#pvp-help-desc`))}let D=null,O=null,k=!1,A=null,j=null,M=null,N=null,Me=!1,P=!1,F=!1,I=null,L=null,R=`hub`,z=null,B=null,V=!1,Pe=!1;function U(){z&&=(clearInterval(z),null),B?.(),B=null}function Ve(){return`<button type="button" class="btn-text pvp-back-btn" id="pvp-back-hub">← PvP</button>`}function He(){u.querySelector(`#pvp-back-hub`)?.addEventListener(`click`,()=>{G(),U(),ht(),!O&&!V&&(D?.dispose(),D=null),R=`hub`,W()})}function Ue(){Q(),I=null,V=!1,R=`hub`,W()}function W(e=``,t=!1){if(G(),U(),!ie()){u.innerHTML=`
        <section class="panel game-panel pvp-panel">
          ${Be(`Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.`)}
        </section>`,b();return}let n=g();u.innerHTML=`
      <section class="panel game-panel pvp-hub-panel">
        ${Le(`arena`)}
        <div class="pvp-panel-content">
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">PvP</h2>
            <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How PvP works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
          </div>
          <p id="pvp-help-desc" class="panel-head__desc" hidden>Tap Arena to host or join matches. Tap Leaderboard for global ranks and live spectating.</p>
        </header>
        <div class="pvp-hub" role="group" aria-label="PvP destinations">
          <button type="button" class="pvp-hub-tile pvp-hub-tile--arena" id="pvp-go-arena">
            <span class="pvp-hub-tile__icon" aria-hidden="true">${Fe()}</span>
            <span class="pvp-hub-tile__title">Arena</span>
            <span class="pvp-hub-tile__desc">Host or join live matches</span>
          </button>
          <button type="button" class="pvp-hub-tile pvp-hub-tile--leaderboard" id="pvp-go-leaderboard">
            <span class="pvp-hub-tile__icon" aria-hidden="true">${Ie()}</span>
            <span class="pvp-hub-tile__title">Leaderboard</span>
            <span class="pvp-hub-tile__desc">Global ranks &amp; spectate live games</span>
          </button>
        </div>
        ${n?``:`<p class="pvp-sign-in-nudge">${_}</p>`}
        <p id="pvp-status" class="pvp-status${t?` pvp-status--error`:``}" role="status">${H(e)}</p>
        </div>
      </section>`,b(),u.querySelector(`#pvp-go-arena`)?.addEventListener(`click`,()=>{if(!g()){p();return}R=`arena`,q()}),u.querySelector(`#pvp-go-leaderboard`)?.addEventListener(`click`,()=>{if(!g()){p();return}R=`leaderboard`,Xe()})}function We(e,t=!1){let n=u.querySelector(`#pvp-leaderboard-status`);n&&(n.textContent=e,n.classList.toggle(`pvp-status--error`,t))}function Ge(e){return e===1?`🥇`:e===2?`🥈`:e===3?`🥉`:String(e)}function Ke(e,t){return e.length?e.map(e=>`<li class="pvp-leaderboard-row${e.id===t?` pvp-leaderboard-row--self`:``}">
          <span class="pvp-leaderboard-row__rank">${Ge(e.rank)}</span>
          <span class="pvp-leaderboard-row__name">${H(e.username)}</span>
          <span class="pvp-leaderboard-row__wins">${e.pvpWins} win${e.pvpWins===1?``:`s`}</span>
        </li>`).join(``):`<li class="pvp-leaderboard-empty">No ranked players yet — win PvP matches to appear here.</li>`}function qe(e,t){return e.length?e.map(e=>{let n=H(e.host_display_name?.trim()||`Red`),r=H(e.guest_display_name?.trim()||`Black`),i=e.host_id===t||e.guest_id===t,a=T(e)?Re():``,o=e.turn===S.RED?e.host_display_name?.trim()||`Red`:e.guest_display_name?.trim()||`Black`,s=i?`<span class="pvp-live-match__tag">Your match</span>`:`<button type="button" class="btn-secondary pvp-live-spectate" data-spectate-match="${e.id}">Spectate</button>`;return`<li class="pvp-live-match">
          <div class="pvp-live-match__body">
            <span class="pvp-live-match__players">${n} vs ${r} ${a}</span>
            <span class="pvp-live-match__meta">${H(o)}&apos;s turn</span>
          </div>
          ${s}
        </li>`}).join(``):`<li class="pvp-leaderboard-empty">No live matches right now.</li>`}async function Je(){let e=u.querySelector(`#pvp-rank-list`),t=u.querySelector(`#pvp-live-list`),n=g();if(!(!e||!t||!n||O||V)&&!Pe){Pe=!0;try{let[r,i]=await Promise.all([De(50),Oe(20)]);e.innerHTML=Ke(r,n.id),t.innerHTML=qe(i,n.id),t.querySelectorAll(`[data-spectate-match]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-spectate-match`);t&&Ze(t)})})}catch(n){let r=`<li class="pvp-leaderboard-empty pvp-open-empty--error">${H(w(n))}</li>`;e.innerHTML=r,t.innerHTML=r}finally{Pe=!1}}}function Ye(){U(),Je(),z=setInterval(()=>void Je(),8e3),B=ke(()=>void Je())}function Xe(e=``,t=!1){if(G(),!g()){R=`hub`,W();return}u.innerHTML=`
      <section class="panel game-panel pvp-leaderboard-panel">
        ${Le(`leaderboard`)}
        <div class="pvp-panel-content">
        ${Ve()}
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">Leaderboard</h2>
            <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How the leaderboard works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
          </div>
          <p id="pvp-help-desc" class="panel-head__desc" hidden>Players are ranked by total PvP wins. Spectate ongoing matches — hands stay hidden, but you can scrub move history during the watch.</p>
        </header>
        <div class="pvp-leaderboard-section">
          <h3 class="pvp-room-section__title">Global ranks</h3>
          <ol id="pvp-rank-list" class="pvp-leaderboard-list" aria-live="polite">
            <li class="pvp-leaderboard-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ol>
        </div>
        <div class="pvp-leaderboard-section">
          <h3 class="pvp-room-section__title">Live matches</h3>
          <p class="pvp-room-section__hint">Watch ongoing games — hands are hidden, but move history is available.</p>
          <ul id="pvp-live-list" class="pvp-live-list" aria-live="polite">
            <li class="pvp-leaderboard-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ul>
        </div>
        <p id="pvp-leaderboard-status" class="pvp-status${t?` pvp-status--error`:``}" role="status">${H(e)}</p>
        </div>
      </section>`,b(),He(),Ye()}async function Ze(e){if(!g()){p();return}if(!(O||k||V))try{We(`Joining as spectator…`);let t=new xe,n=await t.fetchMatch(e);if(!n||n.status!==`active`||!n.guest_id||!n.state_json){We(`That match is no longer live.`,!0),Je();return}let r=g();if(n.host_id===r.id||n.guest_id===r.id){R=`arena`,$().attachToMatch(n,r.id),E(n.id),k=!0,await At(n,{resume:!0});return}U(),D?.dispose(),D=t,D.onMatchRow=Z,D.onError=e=>O?.setMessage(w(e)),D.attachAsSpectator(n),k=!0,await $e(n)}catch(e){We(w(e),!0),k=!1,V=!1}}function Qe(e){if(!O||!V||!e?.state_json||!Te(e,D,O))return;let t=e.host_display_name?.trim()||`Red`,n=e.guest_display_name?.trim()||`Black`;if(e.status===`finished`){if(O.actionBusy=!1,O.importState(e.state_json),!e.winner_id&&ge(e.state_json))O.setMessage(`Match over — tie game.`);else if(e.winner_id){let r=e.winner_id===e.host_id?t:n;O.setMessage(`Match over — ${r} wins.`)}else O.setMessage(`Match over.`);return}O.importState(e.state_json);let r=e.turn===S.RED?t:n;O.setMessage(`${r} is playing…`)}async function $e(e){if(!e?.state_json||e.status!==`active`){k=!1,V=!1,Xe(`That match is no longer live.`,!0);return}V=!0,Pt();let t=e.host_display_name?.trim()||`Red`,n=e.guest_display_name?.trim()||`Black`,r=d(),[i,a]=await Promise.all([pt(e.host_id,r),pt(e.guest_id,r)]),o=ee(i,e.host_piece_skin),s=ee(a,e.guest_piece_skin);u.innerHTML=``;let c=document.createElement(`div`);c.id=`pvp-match-root`,u.appendChild(c),c.innerHTML=ve(n,{exitLabel:`← Leave spectate`,pvp:!0,spectator:!0,localName:t}),D._lastVersion=e.version??0,D._lastAppliedFingerprint=Se(e),O=new he(Array.isArray(e.host_deck_ids)?e.host_deck_ids:e.host_deck_ids||[],c,()=>{O=null,k=!1,V=!1,v(),y(),x(`hub`),D?.dispose(),D=null,R=`leaderboard`,Xe()},null,{pvp:!0,spectator:!0,localColor:S.RED,initialState:e.state_json,opponentName:n,cosmetics:o,opponentCosmetics:s,skipCheckpoint:!0}),ce({kind:`pvp`}),await y(),x(`match`),O.setMessage(`Spectating ${t} vs ${n}`),O.render(),D.startPolling(1200),k=!1}function G(){j&&=(clearInterval(j),null),M&&=(clearTimeout(M),null),N=null,Me=!1,P=!1,A?.(),A=null}function K(e=null){e&&(N=e),!M&&(M=setTimeout(()=>{M=null;let e=N;N=null,tt(e)},300))}function et(){G(),K(),j=setInterval(()=>K(),5e3),A=Ee(()=>K())}function q(e=``,t=!1){let n=g(),i=d(),a=(i.decks||[]).filter(e=>r(e.cardIds,i).valid),o=a.find(e=>e.id===i.selectedDeckId)||a[0];if(G(),!ie()){u.innerHTML=`
        <section class="panel game-panel pvp-panel">
          ${Be(`Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.`)}
        </section>`,b();return}if(!n){R=`hub`,W();return}u.innerHTML=`
      <section class="panel game-panel pvp-panel pvp-panel--arena">
        ${Le(`arena`)}
        <div class="pvp-panel-content">
        ${Ve()}
        ${Be(`Host a room or join an open match below. Piece skins are shown on the board — matching non-default skins block joins so both sides stay distinct.`)}
        <div class="pvp-setup-row">
          <div class="pvp-setup-field">
            <label class="label-sm" for="pvp-deck-select">Your deck</label>
            <select id="pvp-deck-select" class="select-input">
              ${a.length?a.map(e=>`<option value="${e.id}" ${e.id===o?.id?`selected`:``}>${H(e.name)}</option>`).join(``):`<option value="">No PvP-ready deck — open Decks</option>`}
            </select>
          </div>
          <div class="pvp-setup-field">
            <label class="label-sm" for="pvp-mode-select">Mode</label>
            <select id="pvp-mode-select" class="select-input">
              <option value="${be}" selected>Normal</option>
              <option value="${ye}">Mystery</option>
            </select>
          </div>
        </div>
        <p id="pvp-mode-hint" class="pvp-mode-hint hidden">Mystery — both players get a fully random deck, including spells you haven't unlocked.</p>
        <div class="pvp-actions">
          <button type="button" class="btn-primary btn-lg" id="pvp-host">Host a room</button>
        </div>
        <div class="pvp-room-section pvp-your-rooms">
          <h3 class="pvp-room-section__title">Your rooms</h3>
          <p class="pvp-room-section__hint">You can host one room at a time. Cancel anytime before someone joins.</p>
          <ul id="pvp-your-list" class="pvp-open-list" aria-live="polite">
            <li class="pvp-open-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ul>
        </div>
        <div class="pvp-room-section pvp-open-rooms">
          <h3 class="pvp-room-section__title">Open rooms</h3>
          <p class="pvp-room-section__hint">Rooms hosted by other players — tap to join.</p>
          <ul id="pvp-open-list" class="pvp-open-list" aria-live="polite">
            <li class="pvp-open-empty meta-skeleton"><span class="meta-skeleton__row"></span></li>
          </ul>
        </div>
        <p id="pvp-status" class="pvp-status${t?` pvp-status--error`:``}" role="status">${H(e)}</p>
        <div id="pvp-waiting" class="pvp-waiting hidden"></div>
        </div>
      </section>`,u.querySelector(`#pvp-host`)?.addEventListener(`click`,()=>void jt()),de(u.querySelector(`#pvp-deck-select`)),de(u.querySelector(`#pvp-mode-select`)),u.querySelector(`#pvp-mode-select`)?.addEventListener(`change`,lt),lt(),b(),He(),et(),Ce().then(e=>{if(!e.ok&&e.reason){let t=u.querySelector(`#pvp-status`);t&&!t.textContent&&(t.textContent=e.reason,t.classList.add(`pvp-status--error`));return}e.hint&&console.info(`[PvP]`,e.hint)})}async function tt(e=null){let t=u.querySelector(`#pvp-your-list`),n=u.querySelector(`#pvp-open-list`),r=g();if(!(!t||!n||!r||O)){if(F){e&&(N=e);return}F=!0;try{let t=D??new xe,[n,r]=await Promise.all([t.listMyWaitingRooms(),t.listOthersWaitingRooms()]),i=n;e&&!n.some(t=>t.id===e.id)&&(i=[e,...n]);let a=await at([...i,...r]);st(i,r,a),ot(i.length)}catch(e){let r=`<li class="pvp-open-empty pvp-open-empty--error">${H(w(e))}</li>`;t.innerHTML=r,n.innerHTML=r}finally{if(F=!1,N){let e=N;N=null,K(e)}}}}function nt(e){return s[e]?.name||`Classic Disc`}function rt(e,t){return t?.get(e.host_id)?.displayName||e.host_display_name||`Player`}function it(e,t,{clickable:n=!1}={}){let r=rt(e,t);return je(t?.get(e.host_id)?.cosmetics||f(null),r,{clickable:n,userId:e.host_id})}async function at(e){let t=g(),n=d(),r=[...new Set(e.map(e=>e.host_id).filter(Boolean))],i=new Map;return await Promise.all(r.map(async r=>{if(r===t?.id){i.set(r,{displayName:await Y(),cosmetics:o(n)});return}try{let t=await m(r),n=e.find(e=>e.host_id===r)?.host_display_name,a=t?.username&&String(t.username).trim()||t?.display_name&&String(t.display_name).trim()||n&&String(n).trim()||`Player`,o=t?.profile_json?.cosmetics;i.set(r,{displayName:a,cosmetics:f(o||null)})}catch{let t=e.find(e=>e.host_id===r)?.host_display_name;i.set(r,{displayName:t||`Player`,cosmetics:f(null)})}})),i}function ot(e=0){let t=u.querySelector(`#pvp-host`);if(!t)return;let n=e>0;t.disabled=n,t.title=n?`You already have a room open — cancel it first.`:``,t.setAttribute(`aria-disabled`,n?`true`:`false`)}function st(e,t,n=new Map){let r=u.querySelector(`#pvp-your-list`),a=u.querySelector(`#pvp-open-list`);if(!r||!a)return;let o=c(d()),s=g()?.id;e.length?r.innerHTML=e.map(e=>{let t=rt(e,n);return`<li class="pvp-open-item pvp-open-item--mine">
            ${it(e,n,{clickable:!1})}
            <div class="pvp-open-item__body">
              <span class="pvp-open-item__label">${H(t)} ${ze(e)}</span>
              <span class="pvp-open-item__meta">${T(e)?`Mystery — waiting for opponent…`:`Waiting for opponent…`}</span>
            </div>
            <button type="button" class="btn-secondary pvp-open-cancel" data-cancel-room="${e.id}">Cancel</button>
          </li>`}).join(``):r.innerHTML=`<li class="pvp-open-empty">No rooms yet — host one above.</li>`,ot(e.length),t.length?a.innerHTML=t.map(e=>{let t=e.host_piece_skin||`skin_classic`,r=te(t,o),a=nt(t),c=rt(e,n),l=it(e,n,{clickable:e.host_id!==s});return r?`<li class="pvp-open-item pvp-open-item--blocked">
              ${l}
              <div class="pvp-open-join pvp-open-join--disabled" title="${H(i)}">
                <span class="pvp-open-join__name">${H(c)} ${ze(e)}</span>
                <span class="pvp-open-join__skin">${H(a)} skin — same as yours</span>
              </div>
            </li>`:`<li class="pvp-open-item">
            ${l}
            <button type="button" class="pvp-open-join" data-join-room="${e.id}" data-mystery="${T(e)?`1`:`0`}">
              <span class="pvp-open-join__name">${H(c)} ${ze(e)}</span>
              <span class="pvp-open-join__skin">${H(a)} skin</span>
              <span class="pvp-open-join__action">${T(e)?`Join Mystery`:`Join match`}</span>
            </button>
          </li>`}).join(``):a.innerHTML=`<li class="pvp-open-empty">${e.length?`No open rooms from other players. Yours is listed above under <strong>Your rooms</strong>.`:`No open rooms from other players.`}</li>`,Ne(r),Ne(a),a.querySelectorAll(`[data-join-room]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-join-room`),n=e.getAttribute(`data-mystery`)===`1`;t&&Mt(t,{mystery:n})})}),r.querySelectorAll(`[data-cancel-room]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-cancel-room`);t&&It(t)})})}function ct(){return u.querySelector(`#pvp-mode-select`)?.value||`normal`}function lt(){let e=ct()===ye,t=u.querySelector(`#pvp-deck-select`),n=u.querySelector(`#pvp-mode-hint`);t&&(t.disabled=e),n?.classList.toggle(`hidden`,!e)}function J(){let e=d(),t=u.querySelector(`#pvp-deck-select`)?.value||e.selectedDeckId;return e.decks.find(e=>e.id===t)}async function Y(){let e=g();if(!e)return`Player`;try{let t=await m(e.id),n=t?.username||t?.display_name;if(n&&String(n).trim())return String(n).trim()}catch{}return e.user_metadata?.display_name||e.email?.split(`@`)[0]||`Player`}function ut(e){let t=D?.localColor===S.RED?e.guest_display_name:e.host_display_name;return t&&String(t).trim()?String(t).trim():`Opponent`}function dt(e){let t=D?.localColor===S.RED?e.host_display_name:e.guest_display_name;return t&&String(t).trim()?String(t).trim():`You`}function ft(e){return D?.localColor===S.RED?e.guest_id:e.host_id}async function pt(e,t){if(!e)return o(t);try{let t=(await m(e))?.profile_json?.cosmetics;if(t)return f(t)}catch{}return o(t)}function X(e,t=!1){let n=u.querySelector(`#pvp-status`);n&&(n.textContent=e,n.classList.toggle(`pvp-status--error`,t))}function mt(){let e=u.querySelector(`#pvp-waiting`);e&&(e.classList.remove(`hidden`),e.innerHTML=`<p class="pvp-wait-hint">Your room is listed under <strong>Your rooms</strong>. Waiting for someone to join…</p>`)}function ht(){let e=u.querySelector(`#pvp-waiting`);e&&(e.classList.add(`hidden`),e.innerHTML=``)}function gt(e){if(!O||!e?.state_json||!Te(e,D,O))return;let t=e.version??0,n=_e(e.state_json,D.localColor),r=e.status===`finished`;(n||r)&&(O.actionBusy=!1);let i=e.turn===D.localColor,a=ut(e);if(O.opponentName=a,O.importState(e.state_json)&&(D._lastAppliedFingerprint=Se(e),t>(D?._lastVersion??-1)&&(D._lastVersion=t)),!O._gameOverUiShown&&r){if(!e.winner_id&&ge(e.state_json))O.showGameOver(`Tie!`,`Both players lost all their pieces.`);else if(e.winner_id){let t=g()?.id===e.winner_id,n=!_e(e.state_json,D.localColor);O.showGameOver(t?`Victory!`:`Defeat`,t?n?`Your opponent left the match.`:`You won the match!`:`You lost the match.`)}}O._gameOverUiShown||O.setMessage(i?`Your turn — cast a spell or move.`:`${a} is acting…`)}function Z(e){if(e){if(V&&O){Qe(e);return}if(O?._gameOverUiShown&&I){if(e.status===`active`&&e.state_json&&(e.id===I.localRematchRoomId||e.id===I.opponentRematchRoomId)){wt(e);return}if(e.status===`waiting`&&e.id===I.localRematchRoomId)return;if(e.status===`finished`&&e.id===I.finishedRow?.id){I.finishedRow=e;return}}if(e.status===`waiting`&&D?.role===`host`&&!O?._gameOverUiShown){X(`Your room is open — waiting for an opponent…`),mt(),Me||(Me=!0,D.startPolling(4e3)),K();return}if(O&&e.state_json&&(e.status===`active`||e.status===`finished`)){let t=_e(e.state_json,D.localColor),n=e.status===`finished`;if(!n&&!Te(e,D,O))return;if((O.actionBusy||O._syncBusy||O._syncDirty)&&!t&&!n){O.queuePvpRow(e);return}gt(e);return}if(e.status===`active`&&!O&&!k){if(e.state_json){let t=g();t&&Nt(e,t.id)&&D?.attachToMatch(e,t.id),G(),ht(),P=!1,k=!0,At(e).finally(()=>{O||(k=!1)});return}P||(P=!0,D.startPolling(600));return}}}function _t(r){let i=d(),a=T(r),o=D?.localColor;if(a&&r?.state_json&&o){let e=t(r.state_json,o);if(Array.isArray(e)&&e.length===30)return e}let s=o===S.RED?r.host_deck_ids:r.guest_deck_ids,c=a?null:i;if(Array.isArray(s)&&!e(s,c)){if(a){let e=J()?.cardIds;if(e&&n(s,e)){let e=o&&t(r?.state_json,o);return Array.isArray(e)&&e.length===30?e:null}}return s}if(a)return null;let l=J();return l&&!e(l.cardIds,i)?l.cardIds:null}function Q(){L&&=(clearInterval(L),null)}function vt(e,{isTie:t}){if(t)return[{id:`rematch`,label:`Rematch`,primary:!0},{id:`back`,label:`Back to PvP`}];if(e?.opponentRematchRoomId){let t=[{id:`joinRematch`,label:`Join rematch`,primary:!0}];return T(e.finishedRow)||t.push({id:`editDeck`,label:`Edit deck`}),t.push({id:`back`,label:`Back to PvP`}),t}let n=[];return e?.localRematchRoomId?n.push({id:`rematch`,label:`Waiting for opponent…`,primary:!0,disabled:!0}):n.push({id:`rematch`,label:`Rematch`,primary:!0}),T(e?.finishedRow)||n.push({id:`editDeck`,label:`Edit deck`}),n.push({id:`back`,label:`Back to PvP`}),n}function yt(){if(!O?._gameOverUiShown||!I)return;let e=O.root.querySelector(`#game-over-title`)?.textContent||``,t=e.startsWith(`Victory`),n=e.startsWith(`Tie`);O.renderGameOverActions({won:t,isTie:n,stars:0})}function bt(e,t){return!e?.created_at||!t?!0:new Date(e.created_at).getTime()>=t-1e4}async function xt(e,t){return!e||!D?null:(await D.listOthersWaitingRooms()).filter(n=>n.host_id===e&&bt(n,t)).sort((e,t)=>new Date(t.created_at)-new Date(e.created_at))[0]||null}async function St(e){if(!(!O?._gameOverUiShown||!e||!D))try{if(e.localRematchRoomId){let t=await D.fetchMatch(e.localRematchRoomId);if(t?.status===`active`&&t.state_json){Q(),await wt(t);return}t?.status!==`waiting`&&(e.localRematchRoomId=null)}let t=await xt(e.opponentId,e.matchEndedAt);if(t&&t.id!==e.opponentRematchRoomId){e.opponentRematchRoomId=t.id,yt();let n=O.root.querySelector(`#game-over-text`);n&&(n.textContent=`${e.opponentName} wants a rematch — join when you're ready.`)}}catch{}}function Ct(e){Q(),L=setInterval(()=>void St(e),2e3),St(e)}async function wt(e){Q(),I=null,O?.dispose(),O=null,k=!0;try{D?.attachToMatch(e),E(e.id),await At(e)}finally{O||(k=!1)}}async function Tt(t,n){let r=T(n.finishedRow);if(!r){let t=e((d().decks.find(e=>e.id===n.deckId)||J())?.cardIds??[],d());if(t){let e=O?.root.querySelector(`#game-over-text`);e&&(e.textContent=t);return}}Q(),n.localRematchRoomId&&n.localRematchRoomId!==t&&(await It(n.localRematchRoomId),n.localRematchRoomId=null);let i=r?null:(d().decks.find(e=>e.id===n.deckId)||J())?.cardIds,a=await $().joinRoomById(t,i,await Y(),{guestPieceSkin:c(d())});I=null,await wt(a)}async function Et(t,{joinOnly:n=!1}={}){if(!(!t||!D))try{let r=n&&t.opponentRematchRoomId?await D.fetchMatch(t.opponentRematchRoomId):await xt(t.opponentId,t.matchEndedAt);if(r?.status===`waiting`&&!r.guest_id){await Tt(r.id,t);return}if(n)return;let i=T(t.finishedRow);if(!i){let n=e((d().decks.find(e=>e.id===t.deckId)||J())?.cardIds??[],d());if(n){let e=O?.root.querySelector(`#game-over-text`);e&&(e.textContent=n);return}}let a=d().decks.find(e=>e.id===t.deckId)||J(),o=await D.createRoom(i?null:a.cardIds,await Y(),{matchMode:t.finishedRow.match_mode||`normal`,hostPieceSkin:c(d())});t.localRematchRoomId=o.id,t.opponentRematchRoomId=null,D.attachToMatch(o),E(o.id),D.startPolling(2e3),Ct(t),yt();let s=O?.root.querySelector(`#game-over-text`);s&&(s.textContent=`Waiting for ${t.opponentName} to join rematch…`)}catch(e){let t=O?.root.querySelector(`#game-over-text`);t&&(t.textContent=w(e,{context:`rematch`}))}}async function Dt(e,t){if(e===`back`){Q(),t?.localRematchRoomId&&await It(t.localRematchRoomId),I=null,O?.onExit?.();return}if(e===`editDeck`){Q(),t?.localRematchRoomId&&await It(t.localRematchRoomId);let e=t?.deckId||d().selectedDeckId;O?.dispose(),O=null,k=!1,I=null,v(),y(),x(`hub`),C(),D?.dispose(),D=null,u.innerHTML=``,h?.(`deck`),e&&pe?.(e);return}if(e===`rematch`){await Et(t);return}e===`joinRematch`&&await Et(t,{joinOnly:!0})}function Ot(t){if(T(t))return`Mystery deck not ready yet — wait a moment, then try again.`;let n=d(),r=D?.localColor===S.RED?t.host_deck_ids:t.guest_deck_ids;if(Array.isArray(r)){let t=e(r,n);if(t)return t}let i=J();return i?e(i.cardIds,n)||`Deck not ready for PvP — open Decks and fix your deck.`:`No deck selected — open Decks and build a complete 30-card deck.`}function kt(e,t=g()?.id){return e?.host_id&&e.host_id===t?S.RED:e?.guest_id&&e.guest_id===t?S.BLACK:D?.localColor??S.RED}async function At(e,{resume:t=!1}={}){let n=d(),r=_t(e);if(!r&&T(e)&&D?.matchId)try{let t=await D.fetchMatch(D.matchId);t&&(e=t,r=_t(e))}catch{}if(!r){k=!1,X(Ot(e),!0),T(e)||q();return}Pt();let i=g();i&&Nt(e,i.id)&&D.attachToMatch(e,i.id);let o=kt(e,i?.id),s=ut(e),c=dt(e),[te,f]=await Promise.all([pt(i?.id,n),pt(ft(e),n)]),p=o===S.RED,m=p?e.host_piece_skin:e.guest_piece_skin,ie=p?e.guest_piece_skin:e.host_piece_skin,ae=ee(te,m),oe=ee(f,ie),se=n.decks.find(e=>e.id===n.selectedDeckId)||n.decks[0];if(I={finishedRow:e,opponentId:ft(e),opponentName:s,matchEndedAt:null,localRematchRoomId:null,opponentRematchRoomId:null,deckId:se?.id||n.selectedDeckId},t||await Ae(u,{local:{username:c,cosmetics:ae},opponent:{username:s,cosmetics:oe}}),!D||e.status!==`active`||!e.state_json){k=!1,O||q();return}u.innerHTML=``;let _=document.createElement(`div`);_.id=`pvp-match-root`,u.appendChild(_),_.innerHTML=ve(s,{exitLabel:`← Leave PvP`,pvp:!0}),D._lastVersion=e.version??0,D._lastAppliedFingerprint=Se(e);try{O=new he(r,_,()=>{O=null,k=!1,Q(),I=null,v(),y(),x(`hub`),C(),D?.dispose(),D=null;let e=le();e?h?.(e):Ue()},null,{pvp:!0,localColor:o,initialState:e.state_json,opponentName:s,cosmetics:ae,opponentCosmetics:oe,onStateSync:async e=>{let t=D._lastVersion,n=await D.pushState(e,t);if(n){D._lastVersion=n.version,D._lastAppliedFingerprint=Se(n);return}let r=await D.fetchMatch(D.matchId);r&&Z(r)},onPvpForfeit:async()=>{if(!D||O?._gameOverUiShown)return;let t=ft(e);t&&await D.finishMatch(t)},onPvpWin:async t=>{let n=g();if(n){if(t===null)await D.finishMatch(null);else{if(t){let e=d();l(e),re(e,`pvp_wins`,1),a(e),ne(e)}let r=t?n.id:o===S.RED?e.guest_id:e.host_id;r&&await D.finishMatch(r)}if(I){try{let e=await D.fetchMatch(D.matchId);e&&(I.finishedRow=e)}catch{}I.matchEndedAt=new Date(I.finishedRow?.updated_at||Date.now()).getTime(),Ct(I)}}},onPvpPendingRow:e=>gt(e),buildGameOverActions:({won:e,isTie:t})=>vt(I,{won:e,isTie:t}),onGameOverAction:e=>{Dt(e,I)},onPvpSyncError:e=>{O?._gameOverUiShown||O.setMessage(w(e,{context:`sync`}))}})}catch(e){throw O=null,k=!1,_.remove(),q(),e}ce({kind:`pvp`}),await y(),x(`match`),O.setMessage(t?`Match resumed — pick up where you left off.`:T(e)?o===e.turn?`Mystery Mode — your turn with a random deck!`:`${s} is thinking…`:o===e.turn?`Your turn — cast a spell or move.`:`${s} is thinking…`),O.render(),E(e.id),D.startPolling(800),k=!1}function $(){return D||(D=new xe,D.onMatchRow=Z,D.onError=e=>X(w(e),!0)),D}async function jt(){if(!g()){p();return}let t=ct(),n=t===ye,r=J();if(!n){let t=e(r?.cardIds??[],d());if(t){X(t,!0);return}}D?.dispose(),D=null;try{X(n?`Opening Mystery room…`:`Opening your room…`);let e=await $().createRoom(n?null:r.cardIds,await Y(),{matchMode:t,hostPieceSkin:c(d())}),i=await at([e]);st([e],[],i),X(n?`Mystery room open — waiting under Your rooms.`:`Room open — waiting under Your rooms.`),E(e.id),Z(e),K(e)}catch(e){X(w(e),!0),D?.dispose(),D=null}}async function Mt(t,{mystery:n=!1}={}){if(!g()){p();return}if(!n){let t=e(J()?.cardIds??[],d());if(t){X(t,!0);return}}D?.dispose(),D=null;try{X(n?`Joining Mystery match…`:`Joining match…`),G();let e=$(),r=n?null:J().cardIds,i=c(d()),a=await e.joinRoomById(t,r,await Y(),{guestPieceSkin:i});E(a.id),Z(a)}catch(e){X(w(e),!0),D?.dispose(),D=null,et()}}function Nt(e,t){return e?.host_id===t||e?.guest_id===t}function Pt(){document.querySelectorAll(`.tab-btn`).forEach(e=>{e.classList.toggle(`active`,e.dataset.tab===`pvp`)}),document.querySelectorAll(`.view`).forEach(e=>{e.classList.toggle(`hidden`,e.id!==`view-pvp`)}),fe?.()}async function Ft(){if(O||k)return!1;let e=g();if(!e||!ie())return!1;let t=$(),n=null,r=we();if(r)try{let i=await t.fetchMatch(r);i&&Nt(i,e.id)&&i.status!==`finished`?n=i:C()}catch{C()}if(!n)try{n=await t.listActiveMatchForUser()}catch(e){return X(w(e),!0),!1}if(n?.status===`active`){if(R=`arena`,Pt(),!n.state_json)return t.attachToMatch(n,e.id),E(n.id),t.startPolling(800),!0;G(),ht(),t.attachToMatch(n,e.id),k=!0;try{return await At(n,{resume:!0}),!!O}finally{O||(k=!1)}}if(!D?.matchId)try{let n=await t.listMyWaitingRooms();if(n.length){R=`arena`,Pt();let r=n[0];return t.attachToMatch({...r,status:`waiting`},e.id),E(r.id),Z(r),K(r),!0}}catch{}return!1}async function It(e){if(!e&&D?.matchId&&(e=D.matchId),e)try{X(`Cancelling room…`),await(D??new xe).cancelRoom(e),D?.matchId===e&&(D.dispose(),D=null,C()),ht(),X(``),K()}catch(e){X(w(e),!0)}}function Lt(){return!O||k||me()?!1:(O=null,v({clearCheckpoint:!1}),u.querySelector(`#pvp-match-root`)?.remove(),!0)}function Rt({resume:e=!1}={}){Lt(),!(k||u.querySelector(`.pvp-loading`))&&(O||(R===`arena`?q():R===`leaderboard`?Xe():W(),e&&Ft()))}let zt=()=>{!u||u.classList.contains(`hidden`)||Rt({resume:!0})};window.addEventListener(`cc-match-shell-reconciled`,zt);let Bt=null,Vt=ae(e=>{if(O||k)return;let t=e?.id??null;t!==Bt&&(Bt=t,Rt({resume:!!t}))});return oe().then(e=>{Bt=e?.id??null,Rt({resume:!!e})}),{render:Rt,tryResume:Ft,dispose(){Vt(),window.removeEventListener(`cc-match-shell-reconciled`,zt),G(),U(),Q(),I=null,O=null,V=!1,R=`hub`,C(),D?.dispose(),D=null,v({clearCheckpoint:!0}),se()}}}export{U as initPvpUI};