const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./spell-visuals-D4K75gZk.css","./chess-theme-D039pXxE.css","./settings-C2qefs18.css"])))=>i.map(i=>d[i]);
import{n as e,o as t,t as n}from"./cardCatalog-dJdvie_N.js";import{c as r,i,r as a}from"./deckRules-DZQUcLp7.js";import{$ as o,Ct as s,Dt as c,Et as l,H as u,I as d,Ot as f,R as p,St as m,T as h,Tt as g,X as _,_t as v,a as y,bt as ee,c as b,ct as x,d as S,dt as te,f as C,ft as ne,g as re,gt as ie,ht as ae,i as oe,kt as se,l as ce,lt as le,m as w,mt as ue,o as de,ot as fe,p as pe,pt as me,q as he,r as ge,s as _e,st as ve,t as ye,u as T,ut as be,vt as xe,wt as Se,xt as Ce,yt as we,z as Te}from"./storage-np6UGASY.js";import{f as Ee,l as De,r as Oe}from"./mageTitles-DcAwBwLH.js";import{t as E}from"./preload-helper-CV77j2BA.js";import{_ as ke,a as Ae,c as je,d as Me,f as Ne,h as Pe,l as Fe,m as Ie,o as D,s as Le,t as Re}from"./auth-DFecQAOy.js";var ze=Object.defineProperty,Be=(e,t)=>{let n={};for(var r in e)ze(n,r,{get:e[r],enumerable:!0});return t||ze(n,Symbol.toStringTag,{value:`Module`}),n};function Ve(){let e=window.visualViewport;return e?Math.max(0,Math.round(e.offsetTop)):0}function He(){let e=window.visualViewport;return e?Math.max(0,Math.round(window.innerHeight-e.offsetTop-e.height)):0}function Ue(){let e=document.documentElement,t=()=>{e.style.setProperty(`--viewport-inset-top`,`${Ve()}px`),e.style.setProperty(`--viewport-inset-bottom`,`${He()}px`)};t(),window.visualViewport?.addEventListener(`resize`,t),window.visualViewport?.addEventListener(`scroll`,t),window.addEventListener(`resize`,t),window.addEventListener(`orientationchange`,t)}Ue();var We=1100,Ge=120;function Ke(){let e=document.getElementById(`app-splash`);if(!e||e.classList.contains(`app-splash--hide`))return;e.classList.add(`app-splash--hide`),document.body.classList.remove(`splash-active`);let t=()=>{e.remove()};e.addEventListener(`transitionend`,t,{once:!0}),window.setTimeout(t,600)}function qe(){Ke()}function Je(){let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?Ge:We,t=performance.now(),n=()=>{let n=performance.now()-t,r=Math.max(0,e-n);window.setTimeout(Ke,r)};document.readyState===`interactive`||document.readyState===`complete`?n():document.addEventListener(`DOMContentLoaded`,n,{once:!0})}document.body.classList.add(`splash-active`),Je();var Ye=`(max-width: 768px)`,Xe=null;function Ze(){return document.getElementById(`mobile-confirm`)}function Qe(e){let t=Ze();if(!t)return;t.classList.add(`hidden`),document.body.classList.remove(`mobile-confirm-open`);let n=Xe;Xe=null,n?.(e)}function $e(e,t={}){if(!window.matchMedia(Ye).matches)return Promise.resolve(window.confirm(e));let n=Ze();if(!n)return Promise.resolve(window.confirm(e));let{title:r=`Confirm`,confirmLabel:i=`OK`,cancelLabel:a=`Cancel`,destructive:o=!1}=t;return new Promise(t=>{Xe&&Qe(!1),Xe=t,n.querySelector(`#mobile-confirm-title`).textContent=r,n.querySelector(`#mobile-confirm-body`).textContent=e;let s=n.querySelector(`#mobile-confirm-ok`),c=n.querySelector(`#mobile-confirm-cancel`);s.textContent=i,c.textContent=a,s.classList.toggle(`btn-danger`,o),s.classList.toggle(`btn-primary`,!o),n.classList.remove(`hidden`),document.body.classList.add(`mobile-confirm-open`),c.focus()})}function et(){let e=Ze();!e||e.dataset.bound||(e.dataset.bound=`1`,e.querySelector(`#mobile-confirm-ok`)?.addEventListener(`click`,()=>Qe(!0)),e.querySelector(`#mobile-confirm-cancel`)?.addEventListener(`click`,()=>Qe(!1)),e.querySelector(`[data-mobile-confirm-backdrop]`)?.addEventListener(`click`,()=>Qe(!1)))}var tt=`cc_install_banner_dismissed`;function nt(){return window.matchMedia(`(display-mode: standalone)`).matches||window.navigator.standalone===!0}function rt(){let e=window.navigator.userAgent;return/iphone|ipad|ipod/i.test(e)&&!/crios|fxios/i.test(e)}function it(){if(nt()||localStorage.getItem(tt)===`1`)return;let e=document.getElementById(`install-banner`);if(!e)return;let t=null,n=()=>{e.classList.remove(`hidden`),document.body.classList.add(`install-banner-visible`)},r=()=>{e.classList.add(`hidden`),document.body.classList.remove(`install-banner-visible`)};window.addEventListener(`beforeinstallprompt`,r=>{r.preventDefault(),t=r,e.querySelector(`#install-banner-ios-hint`)?.classList.add(`hidden`),e.querySelector(`.install-banner__hint--default`)?.classList.remove(`hidden`),e.querySelector(`#install-banner-btn`)?.classList.remove(`hidden`),n()}),rt()&&(e.querySelector(`#install-banner-ios-hint`)?.classList.remove(`hidden`),e.querySelector(`.install-banner__hint--default`)?.classList.add(`hidden`),e.querySelector(`#install-banner-btn`)?.classList.add(`hidden`),window.setTimeout(n,2500)),e.querySelector(`#install-banner-btn`)?.addEventListener(`click`,async()=>{t&&(t.prompt(),await t.userChoice,t=null,r())}),e.querySelector(`#install-banner-dismiss`)?.addEventListener(`click`,()=>{localStorage.setItem(tt,`1`),r()})}var at=[`attack`,`control`,`defense`,`movement`,`trap`,`special`],ot={attack:`Attack`,control:`Control`,defense:`Defense`,movement:`Movement`,trap:`Trap`,special:`Special`},st={aegis:`defense`,anchor:`defense`,backpedal:`control`,backstab:`attack`,backstep:`movement`,barrier:`defense`,bishops_mark:`movement`,blind:`control`,blizzard:`control`,snowball:`control`,berserk:`movement`,bomb:`attack`,shockwave:`control`,plague:`control`,bulwark:`defense`,create_foe:`special`,call_forward:`movement`,chain_lightning:`attack`,clone:`special`,coin_flip:`attack`,collapse:`special`,confusion:`control`,constitution:`defense`,counterspell:`trap`,crown:`special`,cryo_bolt:`attack`,cull:`attack`,darkness:`defense`,dash:`movement`,deep_freeze:`control`,deflect:`trap`,demote:`control`,deport:`movement`,displacement:`movement`,dominion:`special`,duel:`attack`,earthquake:`special`,execution:`attack`,pyromancy:`attack`,fusion:`special`,hibernation:`special`,hostile_swap:`movement`,ignore:`special`,iron_will:`defense`,landmine:`trap`,last_king:`special`,bounty:`special`,link_fate:`special`,last_stand:`trap`,leapfrog:`movement`,long_step:`movement`,magnet:`movement`,nudge:`movement`,offering:`special`,panic:`control`,poison:`attack`,mind_control:`special`,press:`control`,purify:`special`,quick_march:`movement`,quicksand:`trap`,rally:`defense`,recall:`movement`,repel:`movement`,random_teleport:`movement`,retreat:`movement`,revive:`defense`,rooks_mark:`movement`,root:`control`,sacrifice:`attack`,sanctuary:`defense`,scatter:`movement`,shadow_swap:`movement`,sidestep:`movement`,shatter:`attack`,snipe:`attack`,snowball:`control`,stab:`attack`,stall:`defense`,tangle:`control`,teleport:`movement`,trickster:`special`,vengeance:`trap`,ward:`defense`};function ct(e){let t=st[e?.id];if(t)return t;let n=`${e?.id||``} ${e?.effect||``} ${e?.name||``} ${e?.desc||``}`.toLowerCase();return/trap|mine|quicksand|counterspell|vengeance|last.?stand/.test(n)?`trap`:/shield|ward|aegis|sanctuary|barrier|anchor|deflect|stall|iron_will|rally|darkness/.test(n)?`defense`:/move|nudge|teleport|recall|leap|step|displace|swap|scatter|retreat|bishop|rook|overrun|promote|pull|push|shift|earthquake|magnet|repel/.test(n)?`movement`:/freeze|blind|confusion|hex|root|panic|press|silence|paraly|control|cannot play|random|mark|poison|die in \d+ turn/.test(n)?`control`:/\bdestroy\b|\bkills?\b|fireball|bolt|stab|snipe|duel|sacrifice|execution|shatter|cull|lightning/.test(n)?`attack`:`special`}var lt=[{id:`bronze`,name:`Bronze Chest`,cost:25,cards:3,weights:{common:70,uncommon:25,rare:5,epic:0}},{id:`silver`,name:`Silver Chest`,cost:50,cards:5,weights:{common:50,uncommon:35,rare:12,epic:3}},{id:`gold`,name:`Gold Chest`,cost:100,cards:8,weights:{common:32,uncommon:38,rare:22,epic:6,legendary:2}}];function ut(e){let t=Math.random()*100,n=0;for(let r of[`common`,`uncommon`,`rare`,`epic`,`legendary`])if(n+=e[r]||0,t<=n)return r;return`common`}function dt(t){let n=e().filter(e=>e.rarity===t);return n.length?n[Math.floor(Math.random()*n.length)]:e()[0]}function ft(e,t){return dt(ut(t.weights))}function pt(e,n,r={}){let{starRefundChance:i=0}=r;if(oe(e,n.id)<t(n))return ye(e,n.id,1),{...n,duplicate:!1};let a=he[n.rarity]||5;if(i>0&&Math.random()<i){let e=Math.random()<.5?1:2;return{...n,duplicate:!0,starRefund:e}}return{...n,duplicate:!0,gemRefund:a}}function mt(e,t){let n=lt.find(e=>e.id===t);if(!n)return{success:!1,message:`Unknown chest.`};if(e.gems<n.cost)return{success:!1,message:`Not enough gems.`};e.gems-=n.cost;let r=[],i=0;for(let t=0;t<n.cards;t++){let t=pt(e,ft(e,n));r.push(t),t.gemRefund&&(i+=t.gemRefund)}return i&&(e.gems+=i),w(e),{success:!0,pulls:r,chest:n,bonusGems:i}}var ht=[`common`,`uncommon`,`rare`,`epic`,`legendary`];function gt(e,{minPct:t=1}={}){return ht.filter(n=>(e[n]??0)>=t).map(t=>`${e[t]}% ${t}`).join(` · `)}var _t={bronze:{label:`Bronze`,tagline:`Mostly common cards`,accent:`#cd7f32`,glow:`rgba(205, 127, 50, 0.45)`},silver:{label:`Silver`,tagline:`Balanced card mix`,accent:`#a8b8d8`,glow:`rgba(168, 184, 216, 0.5)`},gold:{label:`Gold`,tagline:`Higher rare & epic odds`,accent:`#e8c547`,glow:`rgba(232, 197, 71, 0.55)`}};function vt(e){let t=_t[e]||_t.bronze;return{t,lid:e===`gold`?`#f5e6a8`:e===`silver`?`#e8eef8`:`#d4954a`,body:e===`gold`?`#7a5c12`:e===`silver`?`#4a5568`:`#5c3a1e`,trim:e===`gold`?`#ffe566`:e===`silver`?`#c8d8f0`:t.accent}}function yt(e,t){let{lid:n,body:r,trim:i}=vt(e);return`
    <defs>
      <linearGradient id="${t}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${r}"/>
        <stop offset="45%" stop-color="${n}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#120c08"/>
      </linearGradient>
      <linearGradient id="${t}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${n}"/>
        <stop offset="100%" stop-color="${r}"/>
      </linearGradient>
      <radialGradient id="${t}-inner" cx="50%" cy="25%" r="75%">
        <stop offset="0%" stop-color="${i}" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="${i}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${t}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${i}"/>
        <stop offset="100%" stop-color="${r}"/>
      </linearGradient>
      <filter id="${t}-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${t}-gemGlow">
        <feGaussianBlur stdDeviation="1" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <linearGradient id="${t}-gemFill" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${e===`gold`?`#ff6bcb`:e===`silver`?`#7dd3fc`:`#f6ad55`}"/>
        <stop offset="100%" stop-color="${i}"/>
      </linearGradient>
    </defs>`}function bt(e,t){return`
    <rect x="24" y="58" width="72" height="4" rx="1" fill="url(#${e}-band)" opacity="0.85"/>
    <rect x="24" y="68" width="72" height="3" rx="1" fill="${t}" opacity="0.35"/>
    <circle cx="28" cy="60" r="2" fill="#1a1208"/>
    <circle cx="92" cy="60" r="2" fill="#1a1208"/>
    <circle cx="28" cy="69" r="1.5" fill="#1a1208" opacity="0.8"/>
    <circle cx="92" cy="69" r="1.5" fill="#1a1208" opacity="0.8"/>`}function xt(e,t,n){return`${e===`bronze`?`<path d="M58 30 L60 34 L64 34 L61 37 L62 41 L58 39 L54 41 L55 37 L52 34 L56 34 Z" fill="${t}" opacity="0.7"/>`:`<path d="M60 24 L64 32 L72 32 L66 37 L68 45 L60 40 L52 45 L54 37 L48 32 L56 32 Z" fill="${t}" opacity="0.9" filter="url(#${n}-glow)"/>`}${e===`gold`?`<circle cx="60" cy="32" r="5" fill="url(#${n}-gemFill)" filter="url(#${n}-gemGlow)"/>
         <circle cx="60" cy="32" r="8" fill="none" stroke="${t}" stroke-width="1" opacity="0.6"/>`:e===`silver`?`<rect x="56" y="28" width="8" height="8" rx="1" transform="rotate(45 60 32)" fill="url(#${n}-gemFill)" filter="url(#${n}-gemGlow)"/>`:``}${e===`gold`?`<path d="M34 30 L38 26 M38 30 L34 26 M82 30 L86 26 M86 30 L82 26" stroke="${t}" stroke-width="1" opacity="0.5"/>`:``}`}function St(e,t,n,r){let i=r?`<g class="chest-stage__interior">
        <rect x="26" y="46" width="68" height="36" rx="2" fill="url(#${e}-inner)" opacity="0"/>
      </g>`:``,a=r?` class="chest-stage__lid"`:``,o=r?` class="chest-stage__body"`:``,s=xt(n,t,e);return`
    ${i}
    <g${o}>
      <rect x="22" y="42" width="76" height="44" rx="5" fill="url(#${e}-body)" stroke="${t}" stroke-width="2"/>
      ${bt(e,t)}
      <rect x="52" y="48" width="16" height="18" rx="3" fill="url(#${e}-band)" stroke="${t}" stroke-width="1"/>
      <circle cx="60" cy="57" r="3.5" fill="#1a1208" stroke="${t}" stroke-width="1"/>
      <ellipse cx="60" cy="55" rx="2" ry="1" fill="${t}" opacity="0.25"/>
    </g>
    <g${a}>
      <path d="M16 42 L60 18 L104 42 Z" fill="url(#${e}-lid)" stroke="${t}" stroke-width="2" filter="url(#${e}-glow)"/>
      <path d="M22 42 L60 22 L98 42" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      ${s}
    </g>`}function Ct(e){let{trim:t}=vt(e),n=`chestStage-${e}`;return`<svg class="chest-stage-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${yt(e,n)}
    <ellipse class="chest-stage__shadow" cx="60" cy="90" rx="44" ry="9" fill="rgba(0,0,0,0.5)"/>
    ${St(n,t,e,!0)}
  </svg>`}function wt(e){let{trim:t}=vt(e),n=`chestCard-${e}`;return`<svg class="chest-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${yt(e,n)}
    <ellipse cx="60" cy="90" rx="44" ry="9" fill="rgba(0,0,0,0.5)"/>
    ${St(n,t,e,!1)}
  </svg>`}var Tt={accent:`#c4b5fd`,glow:`rgba(167, 139, 250, 0.55)`,body:`#2a1848`,bodyHi:`#4c2d7a`,lid:`#6b46c1`,trim:`#e9d5ff`,gold:`#fbbf24`,gemSpell:`#7dd3fc`,gemCosmetic:`#f0abfc`},Et={accent:`#fde68a`,glow:`rgba(251, 191, 36, 0.6)`,body:`#3d2810`,bodyHi:`#6b4420`,lid:`#b45309`,trim:`#fef3c7`,gold:`#fcd34d`,gemSpell:`#38bdf8`,gemCosmetic:`#e879f9`};function Dt(e,t){let{body:n,bodyHi:r,lid:i,trim:a,gold:o,gemSpell:s,gemCosmetic:c,glow:l}=e;return`
    <defs>
      <linearGradient id="${t}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${r}"/>
        <stop offset="45%" stop-color="${n}"/>
        <stop offset="100%" stop-color="#0c0618"/>
      </linearGradient>
      <linearGradient id="${t}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${i}"/>
        <stop offset="55%" stop-color="${r}"/>
        <stop offset="100%" stop-color="${n}"/>
      </linearGradient>
      <radialGradient id="${t}-inner" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="${a}" stop-opacity="0.85"/>
        <stop offset="50%" stop-color="${o}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${t}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${o}"/>
        <stop offset="100%" stop-color="${r}"/>
      </linearGradient>
      <linearGradient id="${t}-gemSpell" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${s}"/>
        <stop offset="100%" stop-color="${a}"/>
      </linearGradient>
      <linearGradient id="${t}-gemCosmetic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c}"/>
        <stop offset="100%" stop-color="${a}"/>
      </linearGradient>
      <filter id="${t}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="${t}-softGlow">
        <feGaussianBlur stdDeviation="3" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <radialGradient id="${t}-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${l}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>`}function Ot(e,t,n,r,i=1){return`
    <g transform="translate(${e} ${t}) scale(${n})" opacity="${i}">
      <path d="M0 -8 C4 -8 6 -5 6 -2 C6 1 3 2 2 5 L-2 5 C-1 1 2 0 2 -2 C2 -4 0 -5 -2 -5 C-4 -5 -5 -3 -5 -1" fill="none" stroke="${r}" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="0" cy="9" r="2" fill="${r}"/>
    </g>`}function O(e,t,n,r,i=.9){return`<path d="M${e} ${t-n} L${e+n*.28} ${t-n*.28} L${e+n} ${t} L${e+n*.28} ${t+n*.28} L${e} ${t+n} L${e-n*.28} ${t+n*.28} L${e-n} ${t} L${e-n*.28} ${t-n*.28} Z" fill="${r}" opacity="${i}"/>`}function kt(e,t){let{trim:n,gold:r}=t;return`
    <ellipse cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${e}-aura)" opacity="0.55"/>
    <g class="mystery-box-svg__float">
      <rect x="26" y="48" width="68" height="38" rx="6" fill="url(#${e}-body)" stroke="${n}" stroke-width="2"/>
      <rect x="30" y="58" width="60" height="4" rx="1" fill="url(#${e}-band)" opacity="0.9"/>
      <rect x="30" y="68" width="60" height="3" rx="1" fill="${r}" opacity="0.4"/>
      <rect x="52" y="54" width="16" height="16" rx="3" fill="url(#${e}-band)" stroke="${n}" stroke-width="1"/>
      <circle cx="60" cy="62" r="3.5" fill="#1a0f28" stroke="${r}" stroke-width="1"/>
      <circle cx="44" cy="72" r="5" fill="url(#${e}-gemSpell)" filter="url(#${e}-glow)"/>
      <circle cx="76" cy="72" r="5" fill="url(#${e}-gemCosmetic)" filter="url(#${e}-glow)"/>
      <path d="M18 48 L60 24 L102 48 Z" fill="url(#${e}-lid)" stroke="${n}" stroke-width="2" filter="url(#${e}-glow)"/>
      <path d="M24 48 L60 30 L96 48" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      <rect x="22" y="44" width="76" height="5" rx="1" fill="url(#${e}-band)" opacity="0.75"/>
      ${Ot(60,36,1.1,n,.95)}
      ${O(34,30,4,r,.7)}
      ${O(86,32,3.5,n,.55)}
      ${O(60,18,3,r,.85)}
    </g>`}function At(e,t){let{trim:n,gold:r}=t;return`
    <ellipse cx="60" cy="94" rx="48" ry="10" fill="rgba(0,0,0,0.5)"/>
    <circle cx="60" cy="50" r="52" fill="url(#${e}-aura)" opacity="0.7"/>
    <g class="mystery-box-svg__float">
      <rect x="18" y="46" width="84" height="44" rx="7" fill="url(#${e}-body)" stroke="${n}" stroke-width="2.5"/>
      <rect x="22" y="58" width="76" height="5" rx="1" fill="url(#${e}-band)" opacity="0.95"/>
      <rect x="22" y="70" width="76" height="4" rx="1" fill="${r}" opacity="0.45"/>
      <rect x="22" y="80" width="76" height="3" rx="1" fill="${n}" opacity="0.25"/>
      <rect x="48" y="52" width="24" height="20" rx="4" fill="url(#${e}-band)" stroke="${r}" stroke-width="1.5"/>
      <circle cx="60" cy="62" r="5" fill="#1a1008" stroke="${r}" stroke-width="1.5"/>
      <ellipse cx="60" cy="60" rx="3" ry="1.5" fill="${r}" opacity="0.3"/>
      <circle cx="32" cy="76" r="7" fill="url(#${e}-gemSpell)" filter="url(#${e}-softGlow)"/>
      <circle cx="88" cy="76" r="7" fill="url(#${e}-gemCosmetic)" filter="url(#${e}-softGlow)"/>
      <path d="M12 46 L60 14 L108 46 Z" fill="url(#${e}-lid)" stroke="${n}" stroke-width="2.5" filter="url(#${e}-glow)"/>
      <path d="M18 46 L60 20 L102 46" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
      <rect x="16" y="41" width="88" height="6" rx="1.5" fill="url(#${e}-band)" opacity="0.9"/>
      <path d="M52 18 L60 8 L68 18 L64 18 L66 26 L60 22 L54 26 L56 18 Z" fill="${r}" filter="url(#${e}-glow)"/>
      ${Ot(60,30,1.35,n)}
      ${O(24,24,5,r,.9)}
      ${O(96,26,4.5,n,.75)}
      ${O(60,6,4,r,1)}
      ${O(42,14,3,n,.6)}
      ${O(78,14,3,r,.65)}
      ${O(48,86,3.5,r,.8)}
      ${O(72,86,3.5,r,.8)}
    </g>`}function jt(e){let t=e===`big`,n=t?Et:Tt,r=t?`mysteryBig`:`mysterySmall`,i=t?At(r,n):kt(r,n);return`<svg class="mystery-box-svg ${t?`mystery-box-svg--big`:`mystery-box-svg--small`}" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${Dt(n,r)}
    ${i}
  </svg>`}function Mt(){return jt(`small`)}function Nt(){return Pt()}function Pt(){let e={accent:`#fde68a`,glow:`rgba(251, 191, 36, 0.55)`,body:`#2a1a10`,bodyHi:`#4a3020`,lid:`#92400e`,trim:`#fef3c7`,gold:`#fbbf24`,scroll:`#fff7ed`},t=`titleBox`,{body:n,bodyHi:r,lid:i,trim:a,gold:o,scroll:s,glow:c}=e;return`<svg class="mystery-box-svg mystery-box-svg--title" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="${t}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${r}"/>
        <stop offset="45%" stop-color="${n}"/>
        <stop offset="100%" stop-color="#0c0618"/>
      </linearGradient>
      <linearGradient id="${t}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${i}"/>
        <stop offset="55%" stop-color="${r}"/>
        <stop offset="100%" stop-color="${n}"/>
      </linearGradient>
      <radialGradient id="${t}-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${c}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="${t}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${o}"/>
        <stop offset="100%" stop-color="${r}"/>
      </linearGradient>
      <filter id="${t}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${t}-aura)" opacity="0.55"/>
    <g class="mystery-box-svg__float">
      <rect x="26" y="48" width="68" height="38" rx="6" fill="url(#${t}-body)" stroke="${a}" stroke-width="2"/>
      <rect x="30" y="58" width="60" height="4" rx="1" fill="url(#${t}-band)" opacity="0.9"/>
      <rect x="52" y="54" width="16" height="16" rx="3" fill="url(#${t}-band)" stroke="${a}" stroke-width="1"/>
      <circle cx="60" cy="62" r="3.5" fill="#1a0f08" stroke="${o}" stroke-width="1"/>
      <path d="M18 48 L60 24 L102 48 Z" fill="url(#${t}-lid)" stroke="${a}" stroke-width="2" filter="url(#${t}-glow)"/>
      <rect x="22" y="44" width="76" height="5" rx="1" fill="url(#${t}-band)" opacity="0.75"/>
      <rect x="42" y="28" width="36" height="22" rx="2" fill="${s}" stroke="${o}" stroke-width="1.5" filter="url(#${t}-glow)"/>
      <path d="M44 32 H76 M44 36 H72 M44 40 H68" stroke="${r}" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
      <text x="60" y="24" text-anchor="middle" font-size="7" font-weight="700" fill="${o}" font-family="serif">T</text>
      ${O(34,30,4,o,.7)}
      ${O(86,32,3.5,a,.55)}
      ${O(60,14,3,o,.85)}
    </g>
  </svg>`}function Ft(){return Mt()}var It=.5,Lt=.1,Rt=[{id:`bronze`,name:`Bronze Chest`,cards:3,weights:{common:70,uncommon:25,rare:5,epic:0}},{id:`silver`,name:`Silver Chest`,cards:5,weights:{common:50,uncommon:35,rare:12,epic:3}},{id:`gold`,name:`Gold Chest`,cards:8,weights:{common:32,uncommon:38,rare:22,epic:6,legendary:2}}],zt=[{id:`bronze`,name:`Bronze Cosmetic Box`,pulls:3,weights:{common:70,uncommon:25,rare:5,epic:0}},{id:`silver`,name:`Silver Cosmetic Box`,pulls:5,weights:{common:50,uncommon:35,rare:12,epic:3}},{id:`gold`,name:`Gold Cosmetic Box`,pulls:8,weights:{common:32,uncommon:38,rare:22,epic:6,legendary:2}}];function Bt(e,{premium:t=!1}={}){let n=Math.random()*100;return t?n>50?e[2]:n>15?e[1]:e[0]:n>70?e[2]:n>35?e[1]:e[0]}function Vt(e){if((e.stars??0)<10)return{success:!1,message:`Not enough stars.`};e.stars=(e.stars??0)-10;let t=m(e),n=[],r=[],i=0,a=0;for(let o=0;o<6;o++)if(t&&Math.random()<.5){let t=_(e,Bt(zt).weights);t&&(r.push(t),t.duplicate&&(i+=t.gemRefund||5))}else{let t=pt(e,ft(e,Bt(Rt)),{starRefundChance:Lt});n.push(t),t.gemRefund&&(i+=t.gemRefund),t.starRefund&&(a+=t.starRefund)}return i&&(e.gems=(e.gems||0)+i),a&&(e.stars=(e.stars??0)+a),w(e),{success:!0,kind:n.length&&r.length?`mixed`:n.length?`card`:`cosmetic`,cardPulls:n,cosPulls:r,bonusGems:i,bonusStars:a,message:`Got ${n.length} spells and ${r.length} cosmetics`}}function Ht(e){if((e.stars??0)<10)return{success:!1,message:`Not enough stars.`};e.stars=(e.stars??0)-10;let t=Oe.filter(t=>!De(e,t.id)),n,r=0;if(t.length){let r=t[Math.floor(Math.random()*t.length)];Ee(e,r.id),n={...r,duplicate:!1}}else{let t=Oe[Math.floor(Math.random()*Oe.length)];r=3,e.stars=(e.stars??0)+r,n={...t,duplicate:!0,starRefund:r}}return w(e),{success:!0,kind:`title`,pulls:[n],bonusStars:r,message:n.duplicate?`Duplicate ${n.name} — +${r} ★ refunded`:`Unlocked title: ${n.name}`}}var Ut=`arcane_checkers_guest_mode_v1`,Wt=`Sign in to save progress / play PvP`,Gt=`Sign in to save progress`;function Kt(){return qt()&&!D()}function qt(){try{return localStorage.getItem(Ut)===`1`}catch{return!1}}function Jt(){try{localStorage.setItem(Ut,`1`)}catch{}}function Yt(){try{localStorage.removeItem(Ut)}catch{}}var Xt=Be({pullCloudProfile:()=>tn,scheduleCloudSave:()=>nn}),Zt=null;function Qt(e){if(!e||typeof e!=`object`)return!0;let t=Object.keys(e);if(t.length===0||t.every(e=>e===`loginEmail`||e===`login_email`||e===`savedAt`))return!0;let n=e.collection&&Object.keys(e.collection).length>0,r=Array.isArray(e.decks)&&e.decks.length>0,i=e.adventure?.cleared,a=(Array.isArray(i)?i.length:Object.keys(i||{}).length)>0,o=typeof e.gems==`number`||typeof e.stars==`number`,s=typeof e.pvpWins==`number`&&e.pvpWins>0||typeof e.spellsPlayed==`number`&&e.spellsPlayed>0;return!(n||r||a||o||s)}function $t(e){return C(e),w(e,{bumpTimestamp:!1}),e}function en(e,t){let n=_e();return!(n!==e&&n!==null||n===null&&qt()&&t&&!Qt(t))}async function tn(){let e=D();if(!e||!je())return null;let t=await Ae(e.id),n=S(),r=t?.profile_json,i=en(e.id,r);if(!r||typeof r!=`object`||Qt(r)){if(!ce(n)&&i)$t(n);else if(!ce(n)&&!i)return $t(pe());return S()}if(ce(n)||!i){let e={...r};return i&&p(e,n),Te(e),$t(e)}return(r.savedAt||0)>=(n.savedAt||0)?$t(u(n,r)):(p(n,r),w(n),n)}function nn(e){let t=D();!t||!je()||(clearTimeout(Zt),Zt=setTimeout(async()=>{try{await ke(t.id,{profile_json:e,display_name:t.user_metadata?.display_name||t.email?.split(`@`)[0]})}catch(e){console.warn(`Cloud save failed`,e)}},800))}var rn=Re;function an({authBtn:e,modal:t,onSignedIn:n,onSignedOut:r,onNewAccount:i}){if(!e||!t)return;let a=t.querySelector(`#auth-form`),o=t.querySelector(`#auth-modal-title`),s=t.querySelector(`#auth-toggle-mode`),c=t.querySelector(`#auth-error`),l=t.querySelector(`#auth-username-hint`),u=t.querySelector(`#auth-close`),d=t.querySelector(`.auth-modal-backdrop`),f=a?.querySelector(`button[type="submit"]`),p=`signin`,m=null,h=!1,g=!1;function _(){a?.querySelectorAll(`.auth-field-signup`).forEach(e=>{e.classList.toggle(`hidden`,p!==`signup`)});let e=a?.querySelector(`#auth-identifier`),t=a?.querySelector(`label[for="auth-identifier"]`);t&&(t.textContent=p===`signup`?`Email`:`Username or email`),e&&(e.placeholder=p===`signup`?`you@email.com`:`username or email`,e.type=p===`signup`?`email`:`text`,e.autocomplete=p===`signup`?`email`:`username`),f&&(f.textContent=p===`signup`?`Create account`:`Sign in`),l&&(l.textContent=``),l?.classList.remove(`auth-username-hint--ok`,`auth-username-hint--bad`)}function v(e){c&&(c.textContent=e||``)}function y(e,t=``){l&&(l.textContent=e||``,l.classList.remove(`auth-username-hint--ok`,`auth-username-hint--bad`),t===`ok`&&l.classList.add(`auth-username-hint--ok`),t===`bad`&&l.classList.add(`auth-username-hint--bad`))}async function ee(){if(p!==`signup`)return;let e=a?.querySelector(`#auth-username`)?.value?.trim();if(!e){y(``);return}if(!rn.test(e)){y(`3–24 letters, numbers, or underscore`,`bad`);return}if(y(`Checking…`),!await Fe(e)){let t=await Pe(e);y(t?`Taken — try "${t}"`:`That username is taken`,`bad`),t&&l&&(l.dataset.suggestion=t);return}l&&delete l.dataset.suggestion,y(`Available`,`ok`)}function b(e,n={}){if(h=!!n.forced,!je()){v(`Add Supabase anon key in js/supabaseConfig.js`),t.classList.remove(`hidden`),u?.classList.toggle(`hidden`,h);return}p=e||p,o&&(o.textContent=p===`signup`?`Create account`:`Sign in`),s&&(s.textContent=p===`signup`?`Already have an account? Sign in`:`Need an account? Sign up`),v(``),_(),u?.classList.toggle(`hidden`,h),d?.classList.toggle(`auth-modal-backdrop--locked`,h),t.classList.remove(`hidden`)}function x(){h||(t.classList.add(`hidden`),v(``),y(``))}function S(t){if(e){if(!je()){e.textContent=`Setup cloud`,e.title=`Configure Supabase`,e.classList.remove(`hidden`),e.hidden=!1;return}t?(e.classList.add(`hidden`),e.hidden=!0):(e.textContent=`Sign in`,e.title=`Sign in or sign up`,e.classList.remove(`hidden`),e.hidden=!1)}}e.addEventListener(`click`,()=>{D()||b(`signin`)}),s?.addEventListener(`click`,e=>{e.preventDefault(),p=p===`signup`?`signin`:`signup`,b(p)}),u?.addEventListener(`click`,x),d?.addEventListener(`click`,()=>{h||x()});let te=a?.querySelector(`#auth-username`);te?.addEventListener(`input`,()=>{clearTimeout(m),m=setTimeout(()=>{ee().catch(()=>y(``))},350)}),l?.addEventListener(`click`,()=>{let e=l?.dataset?.suggestion;!e||!te||(te.value=e,delete l.dataset.suggestion,ee().catch(()=>{}))}),a?.addEventListener(`submit`,async e=>{e.preventDefault(),v(``);let t=a.querySelector(`#auth-identifier`)?.value?.trim(),r=a.querySelector(`#auth-username`)?.value?.trim(),o=a.querySelector(`#auth-password`)?.value;if(!t||!o){v(p===`signup`?`Email and password required.`:`Username or email and password required.`);return}f&&(f.disabled=!0),g=!0;try{if(p===`signup`){if(!t.includes(`@`)){v(`Use your email address to sign up.`);return}if(!r||!rn.test(r)){v(`Choose a username (3–24 letters, numbers, underscore).`);return}let e=r;if(!await Fe(e)){let t=await Pe(e);if(t){v(`"${e}" is taken. Try "${t}" or tap the hint below.`),y(`Tap to use "${t}"`,`bad`),l&&(l.dataset.suggestion=t);return}v(`Username "${e}" is already taken. Pick another.`);return}i?.();let a=(await Ie(t,o,e,e)).session?.user??D();if(a){let r=await Ae(a.id),i=r?.profile_json&&typeof r.profile_json==`object`?{...r.profile_json}:{};i.loginEmail=t.toLowerCase();try{await ke(a.id,{username:e,display_name:e,profile_json:i})}catch(t){if((t?.code||t?.details?.code)===`23505`){let t=await Pe(e);v(t?`Account created but "${e}" was taken. Sign in and change your name to "${t}", or try sign up again with that username.`:`Account created but that username was just taken. Sign in with your email and pick another name in Profile.`),p=`signin`,b(`signin`);return}throw t}try{await tn()}catch(e){console.warn(`Profile sync after signup failed`,e)}n?.(),h=!1,u?.classList.remove(`hidden`),d?.classList.remove(`auth-modal-backdrop--locked`),x();return}v(`Account created. Check your email to confirm, then sign in.`),p=`signin`,b(`signin`);return}await Ne(t,o);let e=D();if(!e){v(`Sign-in failed — no session returned. Try again or confirm your email.`);return}try{await tn()}catch(e){console.warn(`Profile sync after sign-in failed`,e)}n?.(),h=!1,u?.classList.remove(`hidden`),d?.classList.remove(`auth-modal-backdrop--locked`),S(e),x()}catch(e){let t=e?.message||`Authentication failed`;if(t.includes(`Database error saving new user`)||t.includes(`username_taken`)||e?.code===`23505`){let e=r&&rn.test(r)?await Pe(r):null;t=e?`Sign-up failed (username conflict). Try "${e}" instead.`:`Sign-up failed on the server. Try a different username, or sign in if you already have an account.`}else t.includes(`over_email_send_rate_limit`)||t.includes(`rate limit`)?t=`Too many sign-up attempts. Wait a few minutes or sign in with an existing account.`:t.includes(`User already registered`)&&(t=`That email is already registered. Try Sign in instead.`);t.includes(`Invalid login credentials`)?v(`Wrong email/username or password.`):t.includes(`Email not confirmed`)?v(`Confirm your email first (check inbox), or disable email confirmation in Supabase for testing.`):v(t)}finally{g=!1,f&&(f.disabled=!1)}});let C=!1;return Me(async e=>{if(S(e),e){if(C=!0,g)return;try{await tn()}catch(e){console.warn(`Profile sync failed`,e)}n?.(),h=!1,u?.classList.remove(`hidden`),d?.classList.remove(`auth-modal-backdrop--locked`),x()}else C&&(C=!1,r?.())}),Le().then(S),{open:b,close:x}}function on(){return!!D()||qt()}function sn({onSignIn:e,onSignUp:t,onGuest:n}){let r=document.getElementById(`auth-gate`);if(!r)return{show:()=>{},hide:()=>{},sync:()=>{}};let i=r.querySelector(`#auth-gate-signin`),a=r.querySelector(`#auth-gate-signup`),o=r.querySelector(`#auth-gate-guest`),s=r.querySelector(`#auth-gate-notice`);i?.addEventListener(`click`,()=>e?.()),a?.addEventListener(`click`,()=>t?.()),o?.addEventListener(`click`,()=>n?.());function c(){je()?s&&(s.textContent=`Create an account to sync decks, stars, and collection — or continue as guest to play Adventure on this device.`):s&&(s.textContent=`Cloud sign-in is not configured. Add your Supabase keys in js/supabaseConfig.js.`),r.classList.remove(`hidden`),document.body.classList.add(`auth-gate-active`)}function l(){r.classList.add(`hidden`),document.body.classList.remove(`auth-gate-active`)}function u(){on()?l():c()}return{show:c,hide:l,sync:u}}function cn(){return je()&&!on()}var ln=`arcane_checkers_tutorial_v1`,un=`arcane_checkers_interactive_tutorial_v1`,dn=`arcane_checkers_meta_tutorial_v1`,fn=`arcane_checkers_quests_tutorial_v1`,pn=`arcane_checkers_pvp_tutorial_v1`,mn=`arcane_checkers_cosmetics_tutorial_v1`,hn=`arcane_checkers_pending_signup_tutorial_v1`;function gn(){try{sessionStorage.setItem(hn,`1`)}catch{}}function _n(){try{sessionStorage.removeItem(hn)}catch{}}function vn(){try{return sessionStorage.getItem(hn)===`1`}catch{return!1}}function yn(e){if(!e)return;let t=[[un,e.interactiveTutorialDone||e.tutorialDone],[dn,e.metaTutorialDone||e.tutorialDone],[fn,e.questsTutorialDone],[pn,e.pvpTutorialDone],[mn,e.cosmeticsTutorialDone]];try{for(let[e,n]of t)n?localStorage.setItem(e,`done`):localStorage.getItem(e)===`done`&&localStorage.removeItem(e)}catch{}}function bn(e,t){gn();try{localStorage.removeItem(un),localStorage.removeItem(dn),localStorage.removeItem(fn),localStorage.removeItem(pn),localStorage.removeItem(mn),localStorage.removeItem(ln)}catch{}e&&(delete e.interactiveTutorialDone,delete e.metaTutorialDone,delete e.questsTutorialDone,delete e.pvpTutorialDone,delete e.cosmeticsTutorialDone,delete e.tutorialDone,t?.(e))}function xn(e={}){if(_n(),e.persist){try{localStorage.setItem(un,`done`)}catch{}e.profile&&(e.profile.interactiveTutorialDone=!0),e.saveProfile?.(e.profile)}}function Sn(e={}){if(e.persist){try{localStorage.setItem(dn,`done`),localStorage.setItem(ln,`done`)}catch{}e.profile&&(e.profile.metaTutorialDone=!0,e.profile.tutorialDone=!0),e.saveProfile?.(e.profile)}}function Cn(e){if(vn())return!0;if(e?.interactiveTutorialDone||e?.tutorialDone)return!1;try{return localStorage.getItem(un)!==`done`}catch{return!0}}function wn(e){if(e?.metaTutorialDone||e?.tutorialDone)return!1;if(!e?.interactiveTutorialDone)try{if(localStorage.getItem(un)!==`done`)return!1}catch{return!1}try{return localStorage.getItem(dn)!==`done`}catch{return!0}}function Tn(e={}){if(e.persist){try{localStorage.setItem(fn,`done`)}catch{}e.profile&&(e.profile.questsTutorialDone=!0),e.saveProfile?.(e.profile)}}function En(e={}){if(e.persist){try{localStorage.setItem(pn,`done`)}catch{}e.profile&&(e.profile.pvpTutorialDone=!0),e.saveProfile?.(e.profile)}}function Dn(e){if(e?.questsTutorialDone)return!1;try{return localStorage.getItem(fn)!==`done`}catch{return!0}}function On(e){if(e?.pvpTutorialDone)return!1;if(!e?.questsTutorialDone)try{if(localStorage.getItem(fn)!==`done`)return!1}catch{return!1}try{return localStorage.getItem(pn)!==`done`}catch{return!0}}function kn(e={}){if(e.persist){try{localStorage.setItem(mn,`done`)}catch{}e.profile&&(e.profile.cosmeticsTutorialDone=!0),e.saveProfile?.(e.profile)}}function An(e){if(e?.cosmeticsTutorialDone)return!1;try{return localStorage.getItem(mn)!==`done`}catch{return!0}}function jn(e){return e instanceof Element?!!e.closest(`#mobile-confirm, #tutorial-meta-overlay, #tutorial-match-overlay, .card-preview-modal`):!1}var Mn=new WeakSet,Nn=!1,Pn=null,Fn=null;function In(){return document.getElementById(`panel-help-popup`)}function Ln(){let e=In();!e||e.classList.contains(`hidden`)||(e.classList.add(`hidden`),document.body.classList.remove(`panel-help-open`),Pn&&=(Pn.setAttribute(`aria-expanded`,`false`),Pn.classList.remove(`panel-help-btn--active`),null),Fn&&=(clearTimeout(Fn),null))}function Rn({title:e,bodyHtml:t,triggerBtn:n=null,autoCloseMs:r=0}){let i=In();if(!i)return;Ln();let a=i.querySelector(`#panel-help-popup-title`),o=i.querySelector(`#panel-help-popup-body`);a&&(a.textContent=e||`Help`),o&&(o.innerHTML=t||``),i.classList.remove(`hidden`),document.body.classList.add(`panel-help-open`),n&&(Pn=n,n.setAttribute(`aria-expanded`,`true`),n.classList.add(`panel-help-btn--active`)),r>0&&(Fn=setTimeout(Ln,r)),i.querySelector(`.panel-help-popup__dismiss`)?.focus()}function zn(){if(Nn)return;Nn=!0;let e=In();e&&(e.querySelectorAll(`[data-panel-help-close]`).forEach(e=>{e.addEventListener(`click`,Ln)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Ln()}))}function Bn(e,t){let n=typeof e==`string`?document.getElementById(e):e,r=typeof t==`string`?document.getElementById(t):t;!n||!r||Mn.has(n)||(Mn.add(n),zn(),n.addEventListener(`click`,e=>{e.stopPropagation();let t=In();if(t&&!t.classList.contains(`hidden`)&&Pn===n){Ln();return}Rn({title:n.getAttribute(`aria-label`)||`Help`,bodyHtml:r.innerHTML,triggerBtn:n})}))}var Vn=`cc_match_checkpoint`,Hn=1440*60*1e3,Un=null,Wn=!1,Gn=null;function Kn(){return document.body.classList.contains(`match-active`)}function qn(e){if(!e||!(e instanceof Element)||e.closest(`.hidden`))return!1;let t=getComputedStyle(e);return!(t.display===`none`||t.visibility===`hidden`)}function Jn(){let e=document.querySelector(`#btn-leave-match`);if(!e)return!1;if(qn(e))return!0;if(!Kn())return!1;let t=document.getElementById(`view-match`),n=document.getElementById(`view-pvp`);return!!(t?.contains(e)||n?.contains(e))}function Yn(e){Un=e}function Xn(){let e=Un;return Un=null,e}function Zn(){Un=null}function Qn(){Wn=!0}function $n(){let e=Wn;return Wn=!1,e}function er(){let e=document.getElementById(`view-match`);e?.classList.contains(`hidden`)&&e.innerHTML.trim()&&(e.innerHTML=``);let t=document.getElementById(`pvp-match-root`);t&&(qn(t.querySelector(`#btn-leave-match`))||t.remove())}function tr(){return!Kn()||Jn()?!1:(er(),ar({clearCheckpoint:!1}),window.dispatchEvent(new CustomEvent(`cc-match-shell-reconciled`)),!0)}function nr(e){document.querySelector(`.game-shell`)?.classList.toggle(`game-shell--in-match`,e)}function rr(e){Gn=e,document.body.classList.add(`match-active`),nr(!0)}function ir(){try{sessionStorage.removeItem(Vn)}catch{}}function ar(e={}){Gn=null,document.body.classList.remove(`match-active`),nr(!1),e.clearCheckpoint&&ir()}function or(e){if(!(!Gn||!e?.state||Gn.kind!==`adventure`||e.state.gameOver))try{sessionStorage.setItem(Vn,JSON.stringify({...Gn,state:e.state,winRewarded:!!e.winRewarded,savedAt:Date.now()}))}catch{}}function sr(){try{let e=sessionStorage.getItem(Vn);if(!e)return null;let t=JSON.parse(e);return!t?.state||t.state.gameOver||t.kind!==`adventure`||t.savedAt&&Date.now()-t.savedAt>Hn?(ir(),null):t}catch{return ir(),null}}function cr(e){if(window.__ccMatchVisibilityBound)return;window.__ccMatchVisibilityBound=!0;let t=()=>{let t=e();t&&or(t)};document.addEventListener(`visibilitychange`,()=>{let n=e();document.hidden?(t(),n?.pauseForBackground?.()):n?.resumeFromBackground?.()}),window.addEventListener(`pagehide`,t)}var lr=new Set;function ur(e){for(let t of lr)t!==e&&t.close()}function dr(e){if(!e||e.dataset.customSelectEnhanced)return e?._customSelectApi??null;e.dataset.customSelectEnhanced=`1`;let t=document.createElement(`div`);t.className=`custom-select`;let n=document.createElement(`button`);n.type=`button`,n.className=`custom-select__trigger select-input`,n.setAttribute(`aria-haspopup`,`listbox`),n.setAttribute(`aria-expanded`,`false`);let r=document.createElement(`span`);r.className=`custom-select__chevron`,r.setAttribute(`aria-hidden`,`true`),r.textContent=`▾`;let i=document.createElement(`span`);i.className=`custom-select__label`;let a=document.createElement(`div`);a.className=`custom-select__list hidden`,a.setAttribute(`role`,`listbox`);let o=e.id;o&&(n.id=o,e.removeAttribute(`id`));let s=e.getAttribute(`aria-label`)?null:document.querySelector(`label[for="${o}"]`)?.id;s?n.setAttribute(`aria-labelledby`,s):e.getAttribute(`aria-label`)&&n.setAttribute(`aria-label`,e.getAttribute(`aria-label`)),e.classList.add(`custom-select__native`),e.tabIndex=-1,e.setAttribute(`aria-hidden`,`true`),e.parentNode.insertBefore(t,e),t.appendChild(e),t.appendChild(n),n.appendChild(i),n.appendChild(r),t.appendChild(a);let c=!1,l=-1;function u(){return[...e.options]}function d(){return e.options[e.selectedIndex]??null}function f(){let r=d();i.textContent=r?.textContent?.trim()||`Select…`,n.disabled=e.disabled,t.classList.toggle(`custom-select--disabled`,e.disabled),a.querySelectorAll(`.custom-select__option`).forEach(t=>{let n=t.dataset.value===e.value;t.classList.toggle(`custom-select__option--selected`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)})}function p(t){let n=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,t);!n?.set||!n?.get||Object.defineProperty(e,t,{configurable:!0,enumerable:n.enumerable,get(){return n.get.call(this)},set(e){n.set.call(this,e),f()}})}p(`value`),p(`selectedIndex`),p(`disabled`);function m(t){e.disabled||(e.value=t.value,e.dispatchEvent(new Event(`change`,{bubbles:!0})),f(),y())}function h(){a.innerHTML=``;for(let e of u()){let t=document.createElement(`button`);t.type=`button`,t.className=`custom-select__option`,t.setAttribute(`role`,`option`),t.dataset.value=e.value,t.textContent=e.textContent?.trim()||e.value,t.addEventListener(`click`,t=>{t.stopPropagation(),m(e)}),a.appendChild(t)}f()}function g(e){let t=[...a.querySelectorAll(`.custom-select__option`)];t.length&&(l=Math.max(0,Math.min(e,t.length-1)),t.forEach((e,t)=>{e.classList.toggle(`custom-select__option--active`,t===l)}),t[l]?.scrollIntoView({block:`nearest`}))}function _(){a.classList.remove(`custom-select__list--above`);let e=n.getBoundingClientRect(),t=Math.min(256,window.innerHeight*.5),r=window.innerHeight-e.bottom,i=e.top;r<t*.65&&i>r&&a.classList.add(`custom-select__list--above`)}function v(){c||e.disabled||(ur(b),c=!0,lr.add(b),a.classList.remove(`hidden`),t.classList.add(`custom-select--open`),n.setAttribute(`aria-expanded`,`true`),_(),g(Math.max(0,e.selectedIndex)),document.addEventListener(`click`,x),document.addEventListener(`keydown`,S))}function y(){c&&(c=!1,lr.delete(b),a.classList.add(`hidden`),t.classList.remove(`custom-select--open`),n.setAttribute(`aria-expanded`,`false`),l=-1,a.querySelectorAll(`.custom-select__option--active`).forEach(e=>{e.classList.remove(`custom-select__option--active`)}),document.removeEventListener(`click`,x),document.removeEventListener(`keydown`,S))}function ee(){return c}let b={close:y,rebuild:h,isOpen:ee};e._customSelectApi=b,n.addEventListener(`click`,t=>{t.stopPropagation(),!e.disabled&&(c?y():v())}),n.addEventListener(`keydown`,t=>{e.disabled||((t.key===`ArrowDown`||t.key===`ArrowUp`||t.key===`Enter`||t.key===` `)&&(t.preventDefault(),c||v(),t.key===`ArrowDown`&&g(l+1),t.key===`ArrowUp`&&g(l<=0?0:l-1),(t.key===`Enter`||t.key===` `)&&l>=0&&[...a.querySelectorAll(`.custom-select__option`)][l]?.click()),t.key===`Escape`&&y())});let x=e=>{if(!t.isConnected){y();return}t.contains(e.target)||y()},S=e=>{e.key===`Escape`&&y()},te=new MutationObserver(()=>{h()});te.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`disabled`,`value`,`selected`]}),e.addEventListener(`change`,f);let C=e.remove.bind(e);return e.remove=function(){y(),te.disconnect(),C(),t.isConnected&&t.remove()},h(),b}function fr(e){if(!e)return null;let t=typeof e==`string`?document.getElementById(e):e;return t?t.tagName===`SELECT`?t:t.closest(`.custom-select`)?.querySelector(`select.custom-select__native`)??null:null}function pr(e=document){e.querySelectorAll(`select.select-input:not([data-custom-select-enhanced]):not([data-no-custom-select])`).forEach(e=>{dr(e)})}var mr={nudge:[`Move your piece 1 square forward-diagonally`],shield_1:[`Shield 1 turn — blocks one capture or spell hit`],shield_2:[`Shield 2 turns — cannot be captured`],forward_bolt:[`Destroy first enemy on forward diagonal (Stab)`],trickster:[`Swap up to 6 random pieces (not on back ranks)`],purify:[`Removes all debuffs from your pieces, including burn and freeze`],chain_lightning:[`Strike adjacent enemies only`,`Up to 2 kills if enemies touch each other`,`Your piece is paralyzed 2 turns`],pyromancy:[`Enemy piece + empty dark square — both burn 2 turns; fire tiles block enemies`,`You cannot cast spells on your next turn`],freeze_1:[`Enemy cannot move on their next turn`],snowball:[`Freeze an enemy piece — cannot move on its owner's next turn`],freeze_2:[`Enemy cannot move on their next turn`],deep_freeze:[`Freeze all enemies on one diagonal through your piece for 2 turns`],retreat_3:[`Backward movement for 3 turns`],bishop_2:[`Diagonal slide over empty dark squares for 2 turns`],rook_2:[`Rank/file slide over empty dark squares for 2 turns`],crown:[`Instantly crown a friendly piece`],swap_friendly:[`Swap two friendly pieces`],quick_march:[`Same piece moves again; either step may capture`],offering:[`Sacrifice a friendly piece`,`Draw 2 cards`,`Cast another spell immediately`],destroy_unshielded:[`Destroy any unshielded enemy`,`You cannot cast spells on your next turn`],revive:[`Requires a captured friendly piece`,`Place on any empty dark square on your side of the board`,`Revived piece cannot capture this turn`],blink_2:[`Teleport within 2 squares`],random_teleport:[`Jump to a random empty dark square`,`Crowned if you land on the back rank`],long_step:[`Epic: leap 2 squares diagonally (no capture)`],dash:[`Move 1 square forward-diagonally`,`Destroy enemy on landing square`],sidestep:[`Skip 2 columns on the same row`],landmine:[`Hidden trap 2 turns — destroys enemy lander`],quicksand:[`Hidden trap — freezes the next piece to land there`],detonate:[`Destroy self + adjacent enemies`],venom:[`Poison — 2 ticks destroys target`],bomb:[`Arm friendly piece`,`On next move: explodes`,`Kills all adjacent pieces`],shockwave:[`Arm friendly piece`,`On next move: paralyzes all adjacent pieces`,`1 turn — does not kill`],plague:[`Infect your piece + adjacent pieces`,`Seed spreads plague on every move`,`All infected die in 2 owner turns`],press:[`Opponent must move again after their normal move on their next turn`],mind_control:[`Convert an enemy man to your color for 2 of your turns`,`Reverts to the enemy afterward`],barrier:[`Place on any dark square`,`Blocks enemies for 2 turn cycles`],vengeance:[`Hidden trap — destroys the next enemy who captures your piece`,`Expires after 2 of your turn cycles if unused`,`Your piece survives 2 turns (blood counters), then dies`],hibernation:[`Sleep 2 turns (immobile)`,`Wake with Awoken Bear mark`,`Extra move every turn after`],fusion:[`Merge two adjacent men into one`,`Gains Awoken Bear mark`,`Extra move every turn after`],root_2:[`Enemy cannot jump/capture next turn`],silence_3:[`Suppress special movement 3 turns`],poison_3:[`Enemy dies in 3 turns — 3-turn poison bar`],deflect_1:[`Hidden trap — spell hit within 2 turns kills closest enemy instead`],last_stand:[`Hidden trap — ultra shield on capture or destroy for 3 turns`,`Expires after 1 of your turn cycles if unused`],clone:[`Your man, then adjacent empty square — copy cannot capture or be taken this turn; dies to freeze/poison/burn/plague`],deport:[`Send an enemy back to its game-start square`,`Destroys any piece already on that square`],bounty:[`Mark an enemy piece`,`When you jump-capture it, draw 2 cards`,`Spell destroys do not count`],link_fate:[`Link two enemies — when one is destroyed, the other dies too`]},hr={instant:[`Instant — no board target`],friendly:[`Target your piece`],enemy:[`Target enemy piece`],empty:[`Target empty dark square`],f_empty:[`Your piece, then destination`],f_f:[`Two friendly pieces`],f_e:[`Your piece, then enemy`],f_e_adj:[`Your piece, then adjacent enemy`],diagonal:[`Your piece, then diagonal strike`],discard_pick:[`Choose a card to discard`],e_e:[`Two enemy pieces`],column:[`Pick a board file (a–h)`]};function gr(e){let t=[];return mr[e.effect]?t.push(...mr[e.effect]):e.desc&&t.push(e.desc),hr[e.mode]&&t.push(...hr[e.mode]),(e.rarity===`epic`||e.rarity===`legendary`)&&t.push(`${e.rarity.charAt(0).toUpperCase()+e.rarity.slice(1)} spell`),[...new Set(t)]}function _r(e){return gr(e).join(` · `)}var k=70,A=60,vr=k/64,yr=A/64;function br(e){return`<g transform="scale(${vr}, ${yr})">${e}</g>`}function xr(e){return`<g class="card-motif" opacity="0.98">${e}</g>`}function Sr(e,t,n=5,r=.88){return`<circle cx="${e}" cy="${t}" r="${n}" fill="currentColor" opacity="${r}" stroke="#0f172a" stroke-width="0.8"/>`}function Cr(e,t,n=4){return`<circle cx="${e}" cy="${t}" r="${n}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.5"/>
    <ellipse cx="${e}" cy="${t+n*.5}" rx="${n*.8}" ry="${n*.3}" fill="currentColor" opacity="0.12"/>`}function wr(e,t,n=6){return`<path d="M${e-n} ${t-n} L${e+n} ${t+n} M${e+n} ${t-n} L${e-n} ${t+n}" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.4"/>
    <path d="M${e-n} ${t-n} L${e+n} ${t+n} M${e+n} ${t-n} L${e-n} ${t+n}" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`}function Tr(e,t,n=5){return`<ellipse cx="${e}" cy="${t+n*.55}" rx="${n*1.1}" ry="${n*.35}" fill="#000" opacity="0.28"/>
    <circle cx="${e}" cy="${t}" r="${n}" fill="#b91c1c" stroke="#450a0a" stroke-width="1.8"/>
    <circle cx="${e}" cy="${t}" r="${n*.82}" fill="#dc2626"/>
  <ellipse cx="${e-n*.28}" cy="${t-n*.32}" rx="${n*.42}" ry="${n*.28}" fill="#fca5a5" opacity="0.55"/>
    <path d="M${e-n*.35} ${t+n*.15} Q${e} ${t+n*.45} ${e+n*.35} ${t+n*.15}" fill="none" stroke="#7f1d1d" stroke-width="1.2" opacity="0.5"/>`}function j(e,t,n=8,r=`#fbbf24`,i=`#b45309`){let a=[];for(let r=0;r<8;r++){let i=r*Math.PI/4-Math.PI/2,o=i+Math.PI/8;a.push([e+Math.cos(i)*n,t+Math.sin(i)*n]),a.push([e+Math.cos(o)*n*.45,t+Math.sin(o)*n*.45])}let o=a.map(([e,t],n)=>`${n===0?`M`:`L`}${e.toFixed(1)} ${t.toFixed(1)}`).join(` `)+` Z`;return`<circle cx="${e}" cy="${t}" r="${n*.55}" fill="${r}" opacity="0.35"/>
    <path d="${o}" fill="${r}" stroke="${i}" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="${e-n*.2}" cy="${t-n*.2}" r="${n*.18}" fill="#fff" opacity="0.35"/>`}function M(e=32,t=56,n=18,r=4){return`<ellipse cx="${e}" cy="${t}" rx="${n+2}" ry="${r+1}" fill="#000" opacity="0.12"/>
    <ellipse cx="${e}" cy="${t}" rx="${n}" ry="${r}" fill="#000" opacity="0.32"/>`}function N(e,t=`#e2e8f0`,n=.55){return e.map(([e,r,i=1])=>{let a=i*2.2;return`<path d="M${e} ${r-a} L${e+a*.3} ${r-a*.3} L${e+a} ${r} L${e+a*.3} ${r+a*.3} L${e} ${r+a} L${e-a*.3} ${r+a*.3} L${e-a} ${r} L${e-a*.3} ${r-a*.3} Z" fill="${t}" opacity="${n}"/>`}).join(``)}function P(e,t,n=5.5){return`${jr(e,t,n)}
    <ellipse cx="${e-n*.22}" cy="${t-n*.34}" rx="${n*.48}" ry="${n*.32}" fill="#bfdbfe" opacity="0.65"/>
    <circle cx="${e}" cy="${t}" r="${n+2.8}" fill="none" stroke="#60a5fa" stroke-width="1.1" opacity="0.28"/>
    <circle cx="${e}" cy="${t}" r="${n+4.5}" fill="none" stroke="#93c5fd" stroke-width="0.7" opacity="0.15"/>`}function F(e,t,n=5.5){return`${Tr(e,t,n)}
    <circle cx="${e}" cy="${t}" r="${n+2.5}" fill="none" stroke="#f87171" stroke-width="1" opacity="0.28"/>
    <path d="M${e-2} ${t-1} L${e} ${t-3} L${e+2} ${t-1}" stroke="#450a0a" stroke-width="1" fill="none" opacity="0.45"/>`}function I(e,t,n=6,r=`#cbd5e1`){return`<circle cx="${e}" cy="${t}" r="${n+4}" fill="${r}" opacity="0.06"/>
    <circle cx="${e}" cy="${t}" r="${n+1}" fill="none" stroke="${r}" stroke-width="2" stroke-dasharray="4 2" opacity="0.55"/>
    <circle cx="${e}" cy="${t}" r="${n}" fill="none" stroke="${r}" stroke-width="1.6" opacity="0.82"/>
    <circle cx="${e}" cy="${t}" r="2.2" fill="${r}" opacity="0.5"/>`}function L(e,t,n,r,i=`#e2e8f0`,a=2.6){let o=n-e,s=r-t,c=Math.hypot(o,s)||1,l=o/c,u=s/c,d=-u,f=l;return`<path d="M${e} ${t} L${n} ${r}" stroke="#0f172a" stroke-width="${a+2}" fill="none" stroke-linecap="round" opacity="0.28"/>
    <path d="M${e} ${t} L${n} ${r}" stroke="${i}" stroke-width="${a}" fill="none" stroke-linecap="round"/>
    <path d="M${n} ${r} L${n-l*7+d*4} ${r-u*7+f*4} M${n} ${r} L${n-l*7-d*4} ${r-u*7-f*4}" stroke="${i}" stroke-width="${a}" fill="none" stroke-linecap="round"/>`}function Er(e,t,n,r,i=`#93c5fd`,a=2){let o=(e+n)/2,s=(t+r)/2-8;return`<path d="M${e} ${t} Q${o} ${s} ${n} ${r}" stroke="#0f172a" stroke-width="${a+2.4}" fill="none" opacity="0.22"/>
    <path d="M${e} ${t} Q${o} ${s} ${n} ${r}" stroke="${i}" stroke-width="${a+1}" fill="none" opacity="0.28"/>
    <path d="M${e} ${t} Q${o} ${s} ${n} ${r}" stroke="${i}" stroke-width="${a}" fill="none" stroke-linecap="round"/>`}function Dr(e,t,n=`#60a5fa`,r=`#93c5fd`,i=``){let a=i?` filter="url(#${i})"`:``;return`<path d="M${e} ${t-14} L${e+11} ${t-6} L${e+11} ${t+8} C${e+11} ${t+16} ${e} ${t+22} ${e} ${t+22} C${e} ${t+22} ${e-11} ${t+16} ${e-11} ${t+8} L${e-11} ${t-6} Z" fill="${n}" opacity="0.48" stroke="#0f172a" stroke-width="2.2"${a}/>
    <path d="M${e} ${t-14} L${e+11} ${t-6} L${e+11} ${t+8} C${e+11} ${t+16} ${e} ${t+22} ${e} ${t+22} C${e} ${t+22} ${e-11} ${t+16} ${e-11} ${t+8} L${e-11} ${t-6} Z" fill="none" stroke="${r}" stroke-width="1.6"/>
    <path d="M${e} ${t-10} L${e+6} ${t-5} L${e+6} ${t+4} C${e+6} ${t+9} ${e} ${t+13} ${e} ${t+13} C${e} ${t+13} ${e-6} ${t+9} ${e-6} ${t+4} L${e-6} ${t-5} Z" fill="${r}" opacity="0.32"/>
    <path d="M${e-2} ${t-8} L${e+3} ${t-3}" stroke="#fff" stroke-width="1.2" opacity="0.35" stroke-linecap="round"/>`}function Or(e,t,n=28,r=!0){return`<rect x="${e-n/2}" y="${t-n/2}" width="${n}" height="${n}" rx="3" fill="#1c1917" opacity="0.65" stroke="#57534e" stroke-width="1.6"/>
    <rect x="${e-n/2+3}" y="${t-n/2+3}" width="${n-6}" height="${n-6}" rx="2" fill="#292524" opacity="0.5"/>
    ${r?`<path d="M${e-7} ${t-7} L${e+7} ${t+7} M${e+7} ${t-7} L${e-7} ${t+7}" stroke="#a8a29e" stroke-width="1.4" opacity="0.4"/>`:``}
    <rect x="${e-n/2+2}" y="${t-n/2+2}" width="${n-4}" height="${n-4}" rx="1" fill="none" stroke="#78716c" stroke-width="0.9" opacity="0.35"/>`}function kr(e,t,n=5,r=`#c4b5fd`){return`<circle cx="${e}" cy="${t}" r="${n+5}" fill="${r}" opacity="0.1"/>
    <circle cx="${e}" cy="${t}" r="${n+2}" fill="none" stroke="${r}" stroke-width="0.8" opacity="0.35"/>
    <path d="M${e} ${t-n} L${e+n*.6} ${t-n*.2} L${e+n} ${t+n*.4} L${e+n*.3} ${t+n} L${e-n*.3} ${t+n} L${e-n} ${t+n*.4} L${e-n*.6} ${t-n*.2} Z" fill="none" stroke="${r}" stroke-width="1.4" opacity="0.72"/>`}function Ar(e,t,n,r){let i=`lg-${e}`;return`<defs>
    <radialGradient id="${i}" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${t}"/>
      <stop offset="55%" stop-color="${n}"/>
      <stop offset="100%" stop-color="${n}" stop-opacity="0.92"/>
    </radialGradient>
    <filter id="${i}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${k}" height="${A}" fill="url(#${i})"/>
  ${br(r)}`}function R(e,t,n,r){let i=`cm-${e}`,a=`cm-vig-${e}`;return`<defs>
    <radialGradient id="${i}" cx="50%" cy="36%" r="76%">
      <stop offset="0%" stop-color="${t}"/>
      <stop offset="42%" stop-color="${n}"/>
      <stop offset="100%" stop-color="#0b1220" stop-opacity="0.96"/>
    </radialGradient>
    <radialGradient id="${a}" cx="50%" cy="50%" r="58%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.42"/>
    </radialGradient>
    <filter id="${i}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.85" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${k}" height="${A}" fill="url(#${i})"/>
  <g opacity="0.38">${N([[10,12,.8],[54,8,1],[48,52,.7],[8,44,.9],[32,6,1.2],[58,30,.6]],`#cbd5e1`,.45)}</g>
  <rect width="${k}" height="${A}" fill="url(#${a})"/>
  <g filter="url(#${i}-glow)">${br(r)}</g>`}function z(e,t,n,r){let i=`uc-${e}`,a=`uc-vig-${e}`;return`<defs>
    <radialGradient id="${i}" cx="50%" cy="34%" r="78%">
      <stop offset="0%" stop-color="${t}"/>
      <stop offset="40%" stop-color="${n}"/>
      <stop offset="100%" stop-color="#061525" stop-opacity="0.96"/>
    </radialGradient>
    <radialGradient id="${a}" cx="50%" cy="50%" r="58%">
      <stop offset="50%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.38"/>
    </radialGradient>
    <filter id="${i}-glow" x="-25%" y="-25%" width="150%" height="150%">
      <feGaussianBlur stdDeviation="1" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${k}" height="${A}" fill="url(#${i})"/>
  <g opacity="0.5">${N([[12,10,1],[52,14,1.2],[6,36,.8],[58,48,1],[28,8,.9],[44,56,.7]],`#7dd3fc`,.55)}</g>
  <path d="M8 20 C18 14 26 18 32 10 C38 18 46 14 56 20" stroke="#38bdf8" stroke-width="0.8" fill="none" opacity="0.18"/>
  <rect width="${k}" height="${A}" fill="url(#${a})"/>
  <g filter="url(#${i}-glow)">${br(r)}</g>`}function B(e,t,n,r){let i=`ra-${e}`,a=`ra-vig-${e}`;return`<defs>
    <radialGradient id="${i}" cx="50%" cy="32%" r="80%">
      <stop offset="0%" stop-color="${t}"/>
      <stop offset="38%" stop-color="${n}"/>
      <stop offset="100%" stop-color="#12061f" stop-opacity="0.97"/>
    </radialGradient>
    <radialGradient id="${a}" cx="50%" cy="50%" r="58%">
      <stop offset="48%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.4"/>
    </radialGradient>
    <filter id="${i}-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.15" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${k}" height="${A}" fill="url(#${i})"/>
  <g opacity="0.55">${N([[10,8,1.1],[54,12,1.3],[8,50,.9],[56,44,1],[32,4,1.4],[20,28,.8],[48,30,.9]],`#e9d5ff`,.6)}</g>
  <circle cx="32" cy="28" r="22" fill="none" stroke="#c4b5fd" stroke-width="0.6" opacity="0.15"/>
  <circle cx="32" cy="28" r="14" fill="none" stroke="#a78bfa" stroke-width="0.5" opacity="0.12"/>
  <rect width="${k}" height="${A}" fill="url(#${a})"/>
  <g filter="url(#${i}-glow)">${br(r)}</g>`}function V(e,t,n,r){let i=`ep-${e}`;return`<defs>
    <radialGradient id="${i}" cx="50%" cy="36%" r="74%">
      <stop offset="0%" stop-color="${t}"/>
      <stop offset="50%" stop-color="${n}"/>
      <stop offset="100%" stop-color="${n}" stop-opacity="0.94"/>
    </radialGradient>
    <filter id="${i}-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${k}" height="${A}" fill="url(#${i})"/>
  ${br(r)}`}function jr(e,t,n=5){return`<ellipse cx="${e}" cy="${t+n*.55}" rx="${n*1.1}" ry="${n*.35}" fill="#000" opacity="0.28"/>
    <circle cx="${e}" cy="${t}" r="${n}" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.8"/>
    <circle cx="${e}" cy="${t}" r="${n*.82}" fill="#2563eb"/>
    <ellipse cx="${e-n*.28}" cy="${t-n*.32}" rx="${n*.42}" ry="${n*.28}" fill="#93c5fd" opacity="0.55"/>
    <path d="M${e-n*.35} ${t+n*.15} Q${e} ${t+n*.45} ${e+n*.35} ${t+n*.15}" fill="none" stroke="#1e40af" stroke-width="1.2" opacity="0.45"/>`}var Mr=new Set(`nudge.backstep.retreat_3.anchor_2.recall.repel.leapfrog.random_teleport.rally.coin_flip.ignore.iron_will.demote.quicksand.create_foe.barrier.panic.swap_friendly.sidestep.press.shield_1.snowball.long_step.shield_2.poison_3.deflect_1.forward_bolt.crown.blink_2.landmine.reverse_only_2.root_2.sacrifice.scatter.mass_nudge.sanctuary_pulse.last_stand.cryo_bolt.collapse.last_king.snipe.dominion.backstab.bomb.berserk.bounty.chain_lightning.clone.confusion.constitution.counterspell.cull.deep_freeze.deport.destroy_unshielded.duel.earthquake.execution.hostile_swap.link_fate.magnet.mind_control.purify.pyromancy.quick_march.revive.shockwave.plague.bishop_2.rook_2.offering.tangle.call_forward.dash.blizzard.bulwark.darkness.fortify.hibernation.vengeance.sanctuary.fusion.chameleon.blind.trickster.displacement`.split(`.`));function Nr(e){return Mr.has(e)}function Pr(){return`${M(32,54,20,4)}
    ${F(18,52,5.5)}${F(38,52,5.5)}
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#0f172a" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#4b5563" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M28 12 C26 16 27 20 29 24" stroke="#6b7280" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M30 40 L28 54" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 40 L38 48 L32 50 L26 46 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M32 46 L40 52" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    ${j(32,48,7,`#ef4444`,`#991b1b`)}
    <path d="M14 20 L18 16 M50 18 L54 14" stroke="#fca5a5" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`}function Fr(){return`${M(32,56,20,4)}
    <circle cx="32" cy="34" r="20" fill="#fbbf24" opacity="0.12"/>
    <circle cx="32" cy="34" r="18" fill="#0a0a0a" stroke="#000" stroke-width="2.4"/>
    <circle cx="32" cy="34" r="14.5" fill="#1a1a1a"/>
    <ellipse cx="26" cy="28" rx="6" ry="5" fill="#525252" opacity="0.45"/>
    <ellipse cx="36" cy="38" rx="3" ry="2" fill="#404040" opacity="0.35"/>
    <path d="M38 20 C44 14 48 8 46 2" stroke="#78716c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 12 C42 10 44 8 43 4" stroke="#a8a29e" stroke-width="1.2" fill="none" opacity="0.6"/>
    <circle cx="46" cy="2" r="5" fill="#f97316" stroke="#c2410c" stroke-width="1.4"/>
    <circle cx="46" cy="2" r="3" fill="#fde047" opacity="0.85"/>
    <path d="M47 -1 L51 -3 M45 1 L41 -1 M48 4 L52 3 M44 4 L40 2" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round"/>
    ${j(32,34,12,`#fbbf24`,`#b45309`)}
    ${j(32,34,7,`#fde68a`,`#d97706`)}
    <path d="M12 16 L16 12 M52 18 L56 14 M10 38 L6 42 M54 42 L58 46 M20 8 L24 4" stroke="#fde68a" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="14" cy="14" r="2" fill="#fbbf24" opacity="0.6"/><circle cx="54" cy="16" r="1.5" fill="#fde68a" opacity="0.5"/>`}function Ir(){return`${M(32,56,24,5)}
    <circle cx="32" cy="24" r="14" fill="#38bdf8" opacity="0.1"/>
    <path d="M32 2 L24 18 L34 18 L16 50 L38 22 L26 22 L42 2 Z" fill="#e0f2fe" stroke="#1e40af" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M32 2 L24 18 L34 18 L16 50 L38 22 L26 22 L42 2 Z" fill="#7dd3fc" opacity="0.35"/>
    <path d="M38 22 L54 6 L46 24 L60 14 L48 38" fill="none" stroke="#bae6fd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 22 L54 6 L46 24 L60 14 L48 38" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <path d="M26 18 L8 8 L16 28 L2 20 L14 40" fill="none" stroke="#93c5fd" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26 18 L8 8 L16 28 L2 20" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
    ${F(22,50,4.5)}${F(38,44,4.5)}
    <path d="M22 50 L38 44" stroke="#93c5fd" stroke-width="2.2" stroke-dasharray="3 2" opacity="0.85"/>
    <circle cx="30" cy="49" r="2" fill="#fde047" opacity="0.7"/><circle cx="36" cy="46" r="1.5" fill="#fde047" opacity="0.6"/>
    <path d="M50 6 L53 3 M58 14 L61 11 M8 8 L5 5 M4 22 L1 19" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round"/>
    ${N([[48,8,.8],[10,10,.7],[56,20,.9],[6,24,.6]],`#e0f2fe`,.7)}`}function Lr(){return`${M(32,54,18,4)}
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="#6366f1" opacity="0.42" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="none" stroke="#c7d2fe" stroke-width="1.2" opacity="0.7"/>
    <path d="M24 22 L40 38 M40 22 L24 38" stroke="#e0e7ff" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 16 L22 20 M46 14 L42 18 M14 34 L18 30 M50 36 L46 32" stroke="#c7d2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
    ${F(32,52,5.5)}
    ${j(32,28,10,`#818cf8`,`#4338ca`)}
    ${j(32,28,5,`#e0e7ff`,`#6366f1`)}
    <path d="M10 24 L14 28 L8 32 M54 26 L50 30 L56 34" stroke="#a5b4fc" stroke-width="1.4" fill="none" opacity="0.7"/>`}function Rr(){return`${M(32,54,18,4)}
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#292524" stroke="#57534e" stroke-width="1.4"/>
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#f97316" opacity="0.4"/>
    <path d="M40 50 C42 46 44 44 46 46" stroke="#ea580c" stroke-width="1.2" fill="none"/>
    ${F(22,48,5)}
    <path d="M14 30 C18 16 24 8 28 16 C30 6 36 2 38 14 C42 4 48 10 50 22 C54 12 58 18 56 30 C60 22 62 28 58 36" fill="#f97316" opacity="0.9" stroke="#c2410c" stroke-width="1"/>
    <path d="M18 32 C22 22 26 18 30 22 C32 16 36 14 40 20 C42 16 46 18 48 26" fill="#fbbf24" opacity="0.95"/>
    <path d="M38 36 C42 28 44 22 48 26 C50 20 54 24 52 32" fill="#fb923c" opacity="0.85"/>
    <path d="M20 34 Q24 38 28 34" stroke="#fde047" stroke-width="1.4" fill="none"/>
    <circle cx="30" cy="22" r="8" fill="#fbbf24" opacity="0.22"/>
    ${N([[16,12,.7],[52,14,.8],[44,8,.6]],`#fde68a`,.65)}`}function zr(){return`${M(32,54,22,4)}
    <path d="M8 54 H56" stroke="#0f172a" stroke-width="3" opacity="0.25"/>
    <path d="M8 54 H56" stroke="#14532d" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="50" width="44" height="6" rx="1.5" fill="#166534" opacity="0.42" stroke="#14532d" stroke-width="1"/>
    <rect x="12" y="51" width="40" height="3" rx="0.5" fill="#22c55e" opacity="0.2"/>
    ${Cr(32,40,7)}
    <path d="M32 46 L32 28" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M32 46 L32 28" stroke="#86efac" stroke-width="2.4" stroke-dasharray="4 3" opacity="0.75"/>
    <circle cx="32" cy="36" r="5" fill="#4ade80" opacity="0.18"/>
    <circle cx="32" cy="30" r="7" fill="#4ade80" opacity="0.14"/>
    ${P(32,22,6)}
    <circle cx="32" cy="22" r="12" fill="#4ade80" opacity="0.15"/>
    <circle cx="32" cy="22" r="16" fill="none" stroke="#86efac" stroke-width="1.4" opacity="0.35"/>
    ${j(32,22,9,`#4ade80`,`#15803d`)}
    <path d="M26 12 L32 4 L38 12" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.3"/>
    <path d="M26 12 L32 4 L38 12" stroke="#bbf7d0" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M18 18 C24 14 28 16 32 12 C36 16 40 14 46 18" stroke="#86efac" stroke-width="1.6" fill="none" opacity="0.55"/>
    ${N([[20,10,.9],[44,12,.8],[32,6,1.1],[14,24,.7],[50,22,.7]],`#bbf7d0`,.65)}`}function Br(){return`${M(32,56,24,5)}
    <path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#78716c" stroke-width="1.6" opacity="0.4"/>
    <path d="M32 12 L28 28 L36 28 Z M32 52 L28 36 L36 36 Z M12 32 L28 28 L28 36 Z M52 32 L36 28 L36 36 Z" fill="#57534e" opacity="0.55" stroke="#44403c" stroke-width="1"/>
    <path d="M24 24 L40 40 M40 24 L24 40" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" opacity="0.25"/>
    <path d="M26 26 L38 38 M38 26 L26 38" stroke="#a8a29e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M30 30 L34 34 M34 30 L30 34" stroke="#d6d3d1" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
    ${F(16,16,4)}${F(48,16,4)}${F(16,48,4)}${F(48,48,4)}
    ${L(20,20,28,28,`#d6d3d1`,2.2)}${L(44,20,36,28,`#d6d3d1`,2.2)}
    ${L(20,44,28,36,`#d6d3d1`,2.2)}${L(44,44,36,36,`#d6d3d1`,2.2)}
    ${j(32,32,8,`#d6d3d1`,`#78716c`)}
    <circle cx="32" cy="32" r="6" fill="#a8a29e" opacity="0.2"/>
  <path d="M14 54 L18 50 M50 54 L46 50 M54 14 L50 18 M10 14 L14 18" stroke="#d6d3d1" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
    <path d="M8 32 L14 32 M50 32 L56 32 M32 8 L32 14 M32 50 L32 56" stroke="#a8a29e" stroke-width="1.4" stroke-linecap="round" opacity="0.4"/>`}function Vr(){return`${M(32,54,22,4)}
    ${F(46,28,5.5)} ${wr(46,28,6)}
    ${P(18,46,5.5)}
    <path d="M22 42 Q34 8 44 30" stroke="#0f172a" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M22 42 Q34 8 44 30" stroke="#ef4444" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M22 42 Q34 8 44 30" stroke="#fca5a5" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.5" stroke-dasharray="3 2"/>
    ${L(40,32,44,28,`#fde68a`,2.4)}
    <circle cx="18" cy="46" r="10" fill="#ef4444" opacity="0.18"/>
    <circle cx="46" cy="28" r="12" fill="#ef4444" opacity="0.22"/>
    ${j(46,28,7,`#ef4444`,`#991b1b`)}
    <path d="M10 46 C16 38 22 32 30 28" stroke="#fca5a5" stroke-width="1.8" fill="none" opacity="0.55" stroke-dasharray="3 2"/>
    <path d="M14 12 L18 8 M50 10 L46 6 M52 50 L48 54" stroke="#fecaca" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
    ${N([[34,14,.9],[40,20,.7],[28,18,.8]],`#fca5a5`,.6)}`}function Hr(){return`${M(32,56,16,4)}
    ${F(32,52,6)}
    <circle cx="32" cy="52" r="10" fill="#7c3aed" opacity="0.12"/>
    <path d="M14 2 C10 14 8 28 12 38 C14 46 20 50 28 48" fill="#4c1d95" stroke="#0f172a" stroke-width="2.2"/>
    <path d="M14 2 C10 14 8 28 12 38 C14 46 20 50 28 48" fill="#4c1d95" stroke="#2e1065" stroke-width="1.4"/>
    <path d="M28 48 L30 40 L36 42 L38 34 L44 36 L48 28 L54 34" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 48 L30 40 L36 42 L38 34 L44 36 L48 28 L54 34" fill="none" stroke="#1e1b4b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 40 L32 38 L34 40 M36 42 L38 40 L40 42 M44 36 L46 34 L48 36" stroke="#a78bfa" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M16 8 C18 20 20 32 24 40" stroke="#a78bfa" stroke-width="2.4" fill="none" opacity="0.7"/>
    <path d="M46 4 C42 18 40 32 44 42" stroke="#a78bfa" stroke-width="2.4" fill="none" opacity="0.6"/>
    <path d="M24 6 C20 16 18 26 20 34" stroke="#c4b5fd" stroke-width="1.8" fill="none" opacity="0.5"/>
    ${kr(50,10,4,`#e9d5ff`)}
    ${N([[12,6,.8],[48,8,1],[22,4,.7],[36,44,.9]],`#e9d5ff`,.65)}`}function Ur(){let e=(e,t,n)=>`<g transform="translate(${e}, 40) scale(${t?-1:1}, 1)">
      <ellipse cx="0" cy="8" rx="10" ry="3.5" fill="#000" opacity="0.28"/>
      <rect x="-8" y="-4" width="16" height="22" rx="2.5" fill="#9ca3af" stroke="#0f172a" stroke-width="2"/>
      <rect x="-6" y="-2" width="12" height="16" rx="1.5" fill="#b0b8c4" opacity="0.5"/>
      <path d="M-9 -4 L0 -18 L9 -4 Z" fill="#6b7280" stroke="#0f172a" stroke-width="1.6"/>
      <path d="M-5 -8 L0 -14 L5 -8" fill="#94a3b8" opacity="0.45"/>
      <path d="M0 -18 L0 -24" stroke="#0f172a" stroke-width="5" stroke-linecap="round" opacity="0.3"/>
      <path d="M0 -18 L0 -24" stroke="${n}" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="0" cy="-22" r="2" fill="${n}" opacity="0.6"/>
      <path d="M6 6 L18 -12" stroke="#0f172a" stroke-width="4.2" stroke-linecap="round" opacity="0.3"/>
      <path d="M6 6 L18 -12" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
      <path d="M6 6 L16 -10" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
      <path d="M-2 2 L2 6" stroke="#64748b" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    </g>`;return`${M(32,54,22,4)}
    ${e(18,!1,`#dc2626`)}${e(46,!0,`#2563eb`)}
    ${j(32,30,10,`#fbbf24`,`#b45309`)}
    ${j(32,30,5,`#fde68a`,`#d97706`)}
    <path d="M24 26 L40 34 M40 26 L24 34" stroke="#0f172a" stroke-width="2" opacity="0.25"/>
    <path d="M24 26 L40 34 M40 26 L24 34" stroke="#fde68a" stroke-width="1.6" opacity="0.5"/>
    ${N([[32,24,1],[26,20,.7],[38,20,.7]],`#fde68a`,.7)}`}function Wr(){return`${M(36,56,18,4)}
    ${F(42,52,6)}
    <path d="M8 58 L8 28" stroke="#0f172a" stroke-width="6" stroke-linecap="round" opacity="0.3"/>
    <path d="M8 58 L8 28" stroke="#92400e" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M8 28 L8 12 L32 4 L36 20 L28 36 Z" fill="#9ca3af" stroke="#0f172a" stroke-width="2"/>
    <path d="M8 28 L8 12 L32 4 L36 20 L28 36 Z" fill="none" stroke="#64748b" stroke-width="1.2"/>
    <path d="M12 14 L26 8 L30 22 L16 28 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.2"/>
    <path d="M16 12 L22 10 L24 18" stroke="#fca5a5" stroke-width="1" fill="none" opacity="0.5"/>
    ${j(42,50,8,`#ef4444`,`#991b1b`)}
    <path d="M34 40 L44 54" stroke="#0f172a" stroke-width="3" stroke-linecap="round" opacity="0.25"/>
    <path d="M34 40 L44 54" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    <circle cx="40" cy="48" r="2.2" fill="#dc2626" opacity="0.85"/>
    <circle cx="36" cy="44" r="1.8" fill="#ef4444" opacity="0.7"/>
    <circle cx="44" cy="52" r="1.5" fill="#b91c1c" opacity="0.6"/>
    ${N([[38,38,.7],[46,46,.6]],`#fca5a5`,.55)}`}function Gr(){return`${M(32,54,22,4)}
    ${P(20,40,5.5)}${F(50,40,5.5)}
    <path d="M28 12 C18 12 10 22 10 34 C10 46 18 54 28 54" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round" opacity="0.25"/>
    <path d="M28 12 C18 12 10 22 10 34 C10 46 18 54 28 54" fill="none" stroke="#dc2626" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M36 12 C46 12 54 22 54 34 C54 46 46 54 36 54" fill="none" stroke="#0f172a" stroke-width="7" stroke-linecap="round" opacity="0.25"/>
    <path d="M36 12 C46 12 54 22 54 34 C54 46 46 54 36 54" fill="none" stroke="#1d4ed8" stroke-width="5.5" stroke-linecap="round"/>
    <rect x="24" y="6" width="16" height="8" rx="2.5" fill="#64748b" stroke="#0f172a" stroke-width="1.8"/>
    <ellipse cx="32" cy="10" rx="6" ry="2" fill="#94a3b8" opacity="0.4"/>
    <path d="M44 40 L28 40" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M44 40 L28 40" stroke="#fbbf24" stroke-width="2.8" stroke-dasharray="4 3" opacity="0.85"/>
    <path d="M40 40 L30 40 M30 40 L32 37 M30 40 L32 43" stroke="#fde68a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="40" r="3" fill="#fde047" opacity="0.35"/>
    ${N([[34,36,.7],[38,44,.6],[32,22,.8]],`#fde68a`,.6)}`}function Kr(){return`${M(32,54,20,4)}
    ${P(32,42,6)}
    <path d="M32 36 L32 22" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 36 L32 22" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L32 10" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 24 L32 10" stroke="#60a5fa" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${L(32,38,32,26,`#93c5fd`,2.4)}
    ${L(32,24,32,12,`#60a5fa`,2.4)}
    <path d="M32 38 L26 34 M32 38 L38 34" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L26 20 M32 24 L38 20" stroke="#60a5fa" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="48" rx="6" ry="3.5" fill="#1e3a8a" opacity="0.4"/>
    <ellipse cx="40" cy="48" rx="6" ry="3.5" fill="#1e3a8a" opacity="0.4"/>
    <ellipse cx="28" cy="30" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.25"/>
    <ellipse cx="36" cy="18" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.25"/>
    ${I(32,10,5,`#93c5fd`)}
    <text x="38" y="14" font-size="7" fill="#93c5fd" opacity="0.85" font-weight="700">×2</text>
    ${N([[32,8,.8],[20,32,.6],[44,32,.6]],`#bae6fd`,.55)}`}function qr(){return`${M(32,54,22,4)}
    ${P(32,36,6)}
    <circle cx="32" cy="36" r="10" fill="#a78bfa" opacity="0.15"/>
    <circle cx="32" cy="36" r="10" fill="none" stroke="#0f172a" stroke-width="2.8" opacity="0.2"/>
    <circle cx="32" cy="36" r="10" fill="none" stroke="#c4b5fd" stroke-width="2.4" opacity="0.75"/>
    <circle cx="32" cy="36" r="16" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.6"/>
    <circle cx="32" cy="36" r="22" fill="none" stroke="#8b5cf6" stroke-width="1.6" opacity="0.45"/>
    <circle cx="32" cy="36" r="28" fill="none" stroke="#7c3aed" stroke-width="1" opacity="0.25"/>
    ${F(14,28,4)}${F(50,28,4)}${F(14,44,4)}${F(50,44,4)}
    <path d="M14 28 L10 22 M50 28 L54 22 M14 44 L10 50 M50 44 L54 50" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
    <path d="M28 18 L32 12 L36 18" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M28 18 L32 12 L36 18" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${j(32,36,6,`#c4b5fd`,`#7c3aed`)}
    ${N([[32,14,.9],[8,36,.7],[56,36,.7]],`#e9d5ff`,.6)}`}function Jr(){return`${M(32,54,22,4)}
    ${P(32,36,6)}
    <circle cx="32" cy="36" r="9" fill="#22c55e" opacity="0.18"/>
    <circle cx="32" cy="36" r="9" fill="none" stroke="#86efac" stroke-width="2.2" opacity="0.85"/>
    ${F(14,28,4)}${F(50,28,4)}${F(14,44,4)}${F(50,44,4)}
    <circle cx="14" cy="28" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <circle cx="50" cy="28" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <circle cx="14" cy="44" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <circle cx="50" cy="44" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <path d="M32 36 L14 28 M32 36 L50 28 M32 36 L14 44 M32 36 L50 44" stroke="#4ade80" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    <text x="28" y="34" font-size="8" fill="#bbf7d0" font-weight="700">☣</text>
    ${N([[32,22,.85],[10,24,.6],[54,24,.6]],`#86efac`,.55)}`}function Yr(){return`${M(32,54,22,4)}
    ${F(48,32,6)}
    <circle cx="48" cy="32" r="11" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="48" cy="32" r="11" fill="none" stroke="#f87171" stroke-width="1.8" opacity="0.55"/>
    <circle cx="22" cy="32" r="14" fill="#7c3aed" opacity="0.12"/>
    <circle cx="22" cy="32" r="14" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <circle cx="22" cy="32" r="14" fill="none" stroke="#c4b5fd" stroke-width="2.4" opacity="0.8"/>
    <circle cx="22" cy="32" r="6" fill="#7c3aed" opacity="0.65" stroke="#e9d5ff" stroke-width="1.8"/>
    <circle cx="22" cy="32" r="2.5" fill="#f0e6ff"/>
    <path d="M22 18 C30 22 30 42 22 46 C14 42 14 22 22 18 Z" fill="#a78bfa" opacity="0.42" stroke="#c4b5fd" stroke-width="1.2"/>
    <path d="M22 22 C26 24 26 40 22 42 C18 40 18 24 22 22 Z" fill="#c4b5fd" opacity="0.25"/>
    <path d="M34 32 L40 32" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 32 L40 32" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
    <path d="M28 24 C34 28 34 36 28 40" stroke="#fde68a" stroke-width="2.2" fill="none" opacity="0.8"/>
    <path d="M48 32 L40 32" stroke="#fca5a5" stroke-width="2" stroke-dasharray="3 2" opacity="0.65"/>
    ${N([[22,20,.8],[36,28,.7],[36,36,.7]],`#e9d5ff`,.6)}`}function Xr(){return`${M(32,54,18,4)}
    ${F(32,36,6)}
    <circle cx="32" cy="36" r="14" fill="#a78bfa" opacity="0.1"/>
    <path d="M14 14 C24 24 14 34 26 44 C38 34 46 44 50 26 C44 14 34 18 26 12" stroke="#0f172a" stroke-width="3.6" fill="none" opacity="0.2"/>
    <path d="M14 14 C24 24 14 34 26 44 C38 34 46 44 50 26 C44 14 34 18 26 12" stroke="#c4b5fd" stroke-width="2.6" fill="none" opacity="0.8"/>
    <path d="M18 10 C28 18 22 28 32 22" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M42 48 C36 42 30 46 24 40" stroke="#e9d5ff" stroke-width="1.6" fill="none" opacity="0.5" stroke-dasharray="3 2"/>
    <text x="10" y="50" font-size="10" fill="#fde68a" opacity="0.85" font-weight="700">?</text>
    <text x="48" y="16" font-size="8" fill="#c4b5fd" opacity="0.7" font-weight="700">?</text>
    <path d="M24 32 L30 26 M34 32 L40 36 M30 40 L24 46" stroke="#f0e6ff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <path d="M28 20 C32 24 36 20 40 24" stroke="#fde68a" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${N([[16,20,.8],[48,38,.7],[32,10,.9]],`#e9d5ff`,.6)}`}function Zr(){return`${M(32,54,20,4)}
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="none" stroke="#a78bfa" stroke-width="1.8" opacity="0.7"/>
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.45"/>
    ${kr(32,30,6,`#c4b5fd`)}
    <path d="M22 26 L42 46 M42 26 L22 46" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
    <path d="M22 26 L42 46 M42 26 L22 46" stroke="#f87171" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M6 8 L20 22 L12 30 L28 46" fill="none" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.2"/>
    <path d="M6 8 L20 22 L12 30 L28 46" fill="none" stroke="#fbbf24" stroke-width="2.8" stroke-linecap="round" opacity="0.7"/>
    <circle cx="6" cy="8" r="5" fill="#fde68a" opacity="0.6" stroke="#b45309" stroke-width="1.2"/>
    ${j(32,36,7,`#a78bfa`,`#4c1d95`)}
    ${N([[14,14,.8],[48,16,.7],[32,8,.9]],`#e9d5ff`,.6)}`}function Qr(){return`${M(32,54,22,4)}
    ${P(32,50,5)}
    <path d="M6 58 L58 6" stroke="#0f172a" stroke-width="5" opacity="0.2"/>
    <path d="M6 58 L58 6" stroke="#bae6fd" stroke-width="4" opacity="0.45"/>
    <path d="M6 58 L58 6" stroke="#e0f2fe" stroke-width="1.8" opacity="0.9"/>
    ${F(18,46,4.5)}${F(32,32,4.5)}${F(46,18,4.5)}
    <path d="M16 42 L20 38 M26 28 L30 24 M38 14 L42 10" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M14 40 L18 44 M24 26 L28 30 M36 12 L40 16" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
    <path d="M20 44 L24 40 M34 26 L38 22 M46 12 L50 8" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    <text x="48" y="12" font-size="10" fill="#e0f2fe" opacity="0.9">❄</text>
    ${N([[50,10,1],[12,52,.8],[40,20,.7]],`#e0f2fe`,.7)}`}function $r(){return`${M(32,54,22,4)}
    ${P(20,42,5.5)}${F(44,22,5.5)}
    <path d="M26 38 C32 30 38 26 44 26" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M26 38 C32 30 38 26 44 26" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 26 L44 26 L41 22 M44 26 L41 30" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 30 C32 38 26 42 20 42" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M38 30 C32 38 26 42 20 42" stroke="#fca5a5" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M26 42 L20 42 L23 38 M20 42 L23 46" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${Er(24,38,40,26,`#fde68a`,2.2)}
    <path d="M28 34 L36 30" stroke="#fde68a" stroke-width="1.8" stroke-dasharray="3 2" opacity="0.65"/>
    ${I(20,42,5,`#93c5fd`)}${I(44,22,5,`#fca5a5`)}
    ${N([[32,32,.8],[28,28,.6],[36,36,.6]],`#fde68a`,.55)}`}function ei(){return`${M(32,54,22,4)}
    ${P(20,46,4.5)}${P(44,46,4.5)}
    <circle cx="32" cy="24" r="18" fill="#fbbf24" opacity="0.15"/>
    <path d="M32 6 L35 20 H48 L37 28 L40 42 L32 34 L24 42 L27 28 L16 20 H29 Z" fill="#fde68a" opacity="0.82" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 6 L35 20 H48 L37 28 L40 42 L32 34 L24 42 L27 28 L16 20 H29 Z" fill="none" stroke="#f59e0b" stroke-width="1.4"/>
    <path d="M32 14 L34 22 H40 L35 26 L36 34 L32 30 L28 34 L29 26 L24 22 H30 Z" fill="#fff" opacity="0.25"/>
    <path d="M14 38 L18 42 M50 38 L46 42" stroke="#86efac" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M16 32 L20 36 M48 32 L44 36" stroke="#fca5a5" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
    ${j(32,26,8,`#fde68a`,`#d97706`)}
    ${N([[20,12,.9],[44,12,.8],[32,4,1],[14,28,.7],[50,28,.7]],`#fff`,.55)}`}function ti(){return`${M(32,56,18,4)}
    <rect x="10" y="4" width="44" height="54" rx="4" fill="#fef3c7" stroke="#0f172a" stroke-width="2.8"/>
    <rect x="12" y="6" width="40" height="50" rx="3" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="32" y="18" text-anchor="middle" font-size="8" font-weight="bold" fill="#92400e" font-family="Georgia,serif">WANTED</text>
    <line x1="14" y1="22" x2="50" y2="22" stroke="#d97706" stroke-width="1.6"/>
    <line x1="14" y1="24" x2="50" y2="24" stroke="#fbbf24" stroke-width="0.6" opacity="0.5"/>
    <circle cx="32" cy="38" r="14" fill="#dc2626" stroke="#0f172a" stroke-width="2.4"/>
    <circle cx="32" cy="38" r="11" fill="#b91c1c"/>
    <ellipse cx="27" cy="33" rx="5" ry="3.5" fill="#fca5a5" opacity="0.45"/>
    <path d="M26 42 Q32 46 38 42" fill="none" stroke="#7f1d1d" stroke-width="1.2" opacity="0.5"/>
    <circle cx="8" cy="8" r="2" fill="#78716c" opacity="0.6"/><circle cx="56" cy="8" r="2" fill="#78716c" opacity="0.6"/>
    <circle cx="8" cy="54" r="2" fill="#78716c" opacity="0.6"/><circle cx="56" cy="54" r="2" fill="#78716c" opacity="0.6"/>
    <text x="32" y="54" text-anchor="middle" font-size="7" font-weight="bold" fill="#b45309">REWARD</text>
    ${N([[14,10,.7],[50,10,.7],[32,28,.8]],`#fde68a`,.6)}`}function ni(){return`${M(32,54,22,4)}
    ${F(18,36,5.5)}${F(46,36,5.5)}
    <path d="M24 36 H40" stroke="#0f172a" stroke-width="4" opacity="0.2"/>
    <path d="M24 36 H40" stroke="#c4b5fd" stroke-width="3.2"/>
    <circle cx="32" cy="36" r="5" fill="#7c3aed" stroke="#0f172a" stroke-width="1.6"/>
    <circle cx="32" cy="36" r="3" fill="#e9d5ff" opacity="0.6"/>
    <path d="M24 36 C28 28 36 28 40 36 C36 44 28 44 24 36 Z" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M24 36 C28 28 36 28 40 36 C36 44 28 44 24 36 Z" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.7"/>
    <path d="M18 36 L12 30 M18 36 L12 42 M46 36 L52 30 M46 36 L52 42" stroke="#f87171" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
    <path d="M22 32 L26 36 L22 40 M42 32 L38 36 L42 40" stroke="#c4b5fd" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${kr(32,36,4,`#e9d5ff`)}
    ${N([[32,28,.8],[32,44,.7]],`#e9d5ff`,.6)}`}function ri(){return`${M(32,54,20,4)}
    ${P(22,38,5.5)}
    <circle cx="42" cy="38" r="6" fill="#2563eb" opacity="0.2" stroke="#93c5fd" stroke-width="2" stroke-dasharray="4 2"/>
    <circle cx="42" cy="38" r="5.5" fill="#2563eb" opacity="0.35" stroke="#0f172a" stroke-width="1.6" stroke-dasharray="3 2"/>
    <ellipse cx="42" cy="38" rx="4.5" ry="4.5" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="3 2"/>
    <ellipse cx="39" cy="35" rx="2.5" ry="1.8" fill="#93c5fd" opacity="0.35"/>
    <path d="M28 38 L36 38" stroke="#0f172a" stroke-width="3" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M28 38 L36 38" stroke="#fde68a" stroke-width="2.4" stroke-dasharray="4 3" opacity="0.75"/>
    <path d="M42 38 L42 30 M42 38 L42 46 M34 38 L50 38" stroke="#93c5fd" stroke-width="1.6" opacity="0.55"/>
    <circle cx="42" cy="38" r="11" fill="#7c3aed" opacity="0.12"/>
    <circle cx="42" cy="38" r="14" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.3"/>
    ${N([[36,32,.7],[48,34,.6],[42,28,.8]],`#e9d5ff`,.55)}`}function ii(){return`${M(32,56,18,4)}
    ${P(32,42,6)}
    <path d="M20 12 L24 2 L28 10 L32 0 L36 10 L40 2 L44 12 L44 50 L20 50 Z" fill="#fef3c7" stroke="#0f172a" stroke-width="2"/>
    <path d="M20 12 L24 2 L28 10 L32 0 L36 10 L40 2 L44 12 L44 50 L20 50 Z" fill="none" stroke="#d97706" stroke-width="1.4" opacity="0.85"/>
    <path d="M24 20 H40 M24 28 H40 M24 36 H34" stroke="#92400e" stroke-width="1.4" opacity="0.6"/>
    <path d="M26 22 H38 M26 30 H38" stroke="#fbbf24" stroke-width="0.6" opacity="0.4"/>
    <path d="M20 8 L24 0 L28 8 L32 -2 L36 8 L40 0 L44 8" fill="#fbbf24" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M32 42 L32 28" stroke="#93c5fd" stroke-width="2.4" opacity="0.55"/>
    <path d="M22 36 L32 28 L42 36" fill="#2563eb" opacity="0.42" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M26 34 L32 30 L38 34" fill="#60a5fa" opacity="0.3"/>
    ${Dr(32,36,`#fbbf24`,`#fde68a`)}
    ${N([[24,6,.7],[40,6,.7],[32,16,.8]],`#fde68a`,.55)}`}function ai(){let e=(e,t,n)=>{let r=[];for(let i=0;i<5;i++){let a=i*4*Math.PI/5-Math.PI/2,o=a+Math.PI/5;r.push([e+Math.cos(a)*n,t+Math.sin(a)*n]),r.push([e+Math.cos(o)*n*.42,t+Math.sin(o)*n*.42])}return`<polygon points="${r.map(([e,t])=>`${e.toFixed(1)},${t.toFixed(1)}`).join(` `)}" fill="#fde68a" stroke="#b45309" stroke-width="0.8"/>`},t=(e,t,n)=>`
    <ellipse cx="${e}" cy="${t-n*.15}" rx="${n*.72}" ry="${n*.82}" fill="#cbd5e1" stroke="#475569" stroke-width="0.9"/>
    <ellipse cx="${e-n*.28}" cy="${t-n*.1}" rx="${n*.2}" ry="${n*.24}" fill="#1e293b"/>
    <ellipse cx="${e+n*.28}" cy="${t-n*.1}" rx="${n*.2}" ry="${n*.24}" fill="#1e293b"/>
    <path d="M${e-n*.22} ${t+n*.18} Q${e} ${t+n*.42} ${e+n*.22} ${t+n*.18}" fill="none" stroke="#475569" stroke-width="0.8"/>
    <path d="M${e-n*.16} ${t+n*.34} V${t+n*.58} M${e} ${t+n*.3} V${t+n*.58} M${e+n*.16} ${t+n*.34} V${t+n*.58}" stroke="#64748b" stroke-width="0.7"/>`,n=(e,t,n,r)=>`<circle cx="${e}" cy="${t}" r="${n}" fill="none" stroke="${r}" stroke-width="1.1" opacity="0.55"/>
     <circle cx="${e}" cy="${t}" r="${n-2.2}" fill="none" stroke="${r}" stroke-width="0.6" opacity="0.35" stroke-dasharray="1.8 1.4"/>`;return`<defs>
    <radialGradient id="cf-gold" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#fff6c8"/>
      <stop offset="55%" stop-color="#d4a017"/>
      <stop offset="100%" stop-color="#6b4a0a"/>
    </radialGradient>
    <radialGradient id="cf-silver" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="55%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#334155"/>
    </radialGradient>
    <radialGradient id="cf-bg" cx="50%" cy="50%" r="72%">
      <stop offset="0%" stop-color="#2a2218"/>
      <stop offset="45%" stop-color="#14100c"/>
      <stop offset="100%" stop-color="#080604"/>
    </radialGradient>
  </defs>
  <rect width="${k}" height="${A}" fill="url(#cf-bg)"/>
  ${br(`<ellipse cx="32" cy="56" rx="20" ry="4" fill="#000" opacity="0.35"/>
  <path d="M6 34 C14 28 20 24 28 22" stroke="#fbbf24" stroke-width="1.6" fill="none" opacity="0.55" stroke-linecap="round"/>
  <path d="M58 30 C50 24 44 20 36 18" stroke="#93c5fd" stroke-width="1.6" fill="none" opacity="0.5" stroke-linecap="round"/>
  <circle cx="12" cy="30" r="1.4" fill="#fde68a" opacity="0.8"/>
  <circle cx="18" cy="26" r="1" fill="#fbbf24" opacity="0.65"/>
  <circle cx="52" cy="28" r="1.4" fill="#cbd5e1" opacity="0.75"/>
  <circle cx="46" cy="22" r="1" fill="#94a3b8" opacity="0.55"/>
  <g transform="translate(20, 34) rotate(-18)">
    <circle cx="0" cy="0" r="15" fill="url(#cf-gold)" stroke="#b45309" stroke-width="1.6"/>
    ${n(0,0,15,`#fbbf24`)}
    ${e(0,0,6.5)}
  </g>
  <g transform="translate(44, 30) rotate(22)">
    <circle cx="0" cy="0" r="14" fill="url(#cf-silver)" stroke="#64748b" stroke-width="1.6"/>
    ${n(0,0,14,`#cbd5e1`)}
    ${t(0,0,9)}
  </g>
  <path d="M26 48 C30 44 34 44 38 48" stroke="#fbbf24" stroke-width="1.4" fill="none" opacity="0.45"/>
  <text x="32" y="60" text-anchor="middle" font-size="6.5" fill="#fde68a" opacity="0.7" font-weight="700">50 / 50</text>
  ${Tr(14,50,3.2)}${jr(50,50,3.2)}`)}`}function oi(){return`${M(24,54,20,4)}
    ${F(48,20,5.5)}
    <ellipse cx="20" cy="40" rx="14" ry="12" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="2"/>
    <ellipse cx="20" cy="40" rx="14" ry="12" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <ellipse cx="20" cy="40" rx="8" ry="6" fill="#1e1b4b" opacity="0.65"/>
    <circle cx="20" cy="40" r="4" fill="#c4b5fd" opacity="0.75"/>
    <circle cx="20" cy="40" r="2" fill="#f0e6ff"/>
    <path d="M42 24 C34 28 26 34 22 38" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 24 C34 28 26 34 22 38" stroke="#fca5a5" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${L(40,22,24,36,`#fca5a5`,2.4)}
    <path d="M8 52 H32" stroke="#0f172a" stroke-width="2.8" opacity="0.25"/>
    <path d="M8 52 H32" stroke="#78716c" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="50" width="20" height="5" rx="1.5" fill="#57534e" opacity="0.5" stroke="#44403c" stroke-width="1"/>
    <text x="12" y="49" font-size="5.5" fill="#d6d3d1" opacity="0.8" font-weight="600">start</text>
    ${N([[18,32,.8],[28,28,.6]],`#e9d5ff`,.55)}`}function si(){return`${M(28,54,18,4)}
    ${P(22,44,5.5)}
    <path d="M22 44 C14 32 16 18 28 12" stroke="#0f172a" stroke-width="3.2" fill="none" opacity="0.2"/>
    <path d="M22 44 C14 32 16 18 28 12" stroke="#c4b5fd" stroke-width="2.6" fill="none" opacity="0.8"/>
    <circle cx="28" cy="12" r="5" fill="#e9d5ff" opacity="0.9" stroke="#a78bfa" stroke-width="1.4"/>
    <circle cx="28" cy="12" r="8" fill="#a78bfa" opacity="0.18"/>
    <rect x="32" y="8" width="16" height="24" rx="2.5" fill="#4c1d95" stroke="#0f172a" stroke-width="2" transform="rotate(10 40 20)"/>
    <rect x="32" y="8" width="16" height="24" rx="2.5" fill="none" stroke="#a78bfa" stroke-width="1.4" transform="rotate(10 40 20)"/>
    <rect x="42" y="12" width="16" height="24" rx="2.5" fill="#5b21b6" stroke="#0f172a" stroke-width="2" transform="rotate(-8 50 24)"/>
    <rect x="42" y="12" width="16" height="24" rx="2.5" fill="none" stroke="#c4b5fd" stroke-width="1.4" transform="rotate(-8 50 24)"/>
    <path d="M36 16 L44 16 M36 20 H48 M36 24 H44" stroke="#e9d5ff" stroke-width="1.2" opacity="0.65"/>
    <path d="M46 20 L54 20 M46 24 H56" stroke="#ddd6fe" stroke-width="1.2" opacity="0.55"/>
    <path d="M28 10 L34 6 M46 8 L52 4" stroke="#f0e6ff" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    <text x="36" y="50" font-size="8" fill="#e9d5ff" opacity="0.9" font-weight="700">+2</text>
    ${N([[30,8,.8],[52,6,.7],[24,28,.6]],`#e9d5ff`,.6)}`}function ci(){return`${M(32,52,22,4)}
    ${F(20,34,5.5)}${F(44,34,5.5)}
    <path d="M26 34 C32 24 38 24 44 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M26 34 C32 24 38 24 44 34" stroke="#fca5a5" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 34 C32 44 26 44 20 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M38 34 C32 44 26 44 20 34" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 28 L44 34 L40 38" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M26 40 L20 34 L24 30" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M14 16 L18 20 M50 16 L46 20" stroke="#bae6fd" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <path d="M16 12 C22 8 26 10 18 18" stroke="#e0f2fe" stroke-width="1.6" fill="none" opacity="0.65"/>
    <path d="M48 12 C42 8 38 10 46 18" stroke="#e0f2fe" stroke-width="1.6" fill="none" opacity="0.65"/>
    <circle cx="16" cy="18" r="6" fill="#7dd3fc" opacity="0.15" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="16" cy="18" r="6" fill="none" stroke="#bae6fd" stroke-width="1.2"/>
    <circle cx="48" cy="18" r="6" fill="#7dd3fc" opacity="0.15" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="48" cy="18" r="6" fill="none" stroke="#bae6fd" stroke-width="1.2"/>
    ${N([[32,34,.9],[16,14,.7],[48,14,.7]],`#e0f2fe`,.6)}`}function li(){return`${M(32,54,18,4)}
    ${P(32,48,5.5)}
    <path d="M32 44 L10 22 M32 44 L54 22" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 44 L10 22 M32 44 L54 22" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M14 26 L18 22 M50 26 L46 22" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
    ${kr(44,16,5,`#e9d5ff`)}
    <text x="40" y="20" font-size="16" fill="#f0e6ff" opacity="0.95">♗</text>
    <circle cx="16" cy="24" r="4" fill="#a78bfa" opacity="0.65" stroke="#0f172a" stroke-width="1.2"/>
    <circle cx="48" cy="24" r="4" fill="#a78bfa" opacity="0.65" stroke="#0f172a" stroke-width="1.2"/>
    ${I(14,22,3,`#c4b5fd`)}${I(50,22,3,`#c4b5fd`)}
    ${N([[12,18,.7],[52,18,.7],[32,36,.6]],`#e9d5ff`,.55)}`}function ui(){return`${M(32,54,18,4)}
    ${P(32,48,5.5)}
    <path d="M32 44 V8 M32 44 H6 M32 44 H58" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 44 V8 M32 44 H6 M32 44 H58" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M32 12 V4 M6 44 H2 M58 44 H62" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
    ${kr(44,16,5,`#e9d5ff`)}
    <text x="40" y="20" font-size="16" fill="#f0e6ff" opacity="0.95">♜</text>
    <rect x="26" y="6" width="12" height="6" rx="1.5" fill="#a78bfa" opacity="0.5" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="28" y="8" width="8" height="2" rx="0.5" fill="#c4b5fd" opacity="0.4"/>
    ${I(32,8,3,`#c4b5fd`)}${I(6,44,3,`#c4b5fd`)}${I(58,44,3,`#c4b5fd`)}
    ${N([[32,6,.7],[4,44,.6],[60,44,.6]],`#e9d5ff`,.55)}`}function di(){return`${M(30,52,20,4)}
    ${F(46,20,5.5)}
    <circle cx="46" cy="20" r="12" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="46" cy="20" r="12" fill="none" stroke="#fca5a5" stroke-width="1.8" opacity="0.55"/>
    <circle cx="46" cy="20" r="16" fill="#ef4444" opacity="0.1"/>
    <path d="M42 24 C32 30 24 36 18 42" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 24 C32 30 24 36 18 42" stroke="#f87171" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${L(40,22,20,40,`#fca5a5`,2.6)}
    ${I(18,42,6,`#93c5fd`)}
    <path d="M50 12 L54 8 M12 48 L8 52" stroke="#e9d5ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
    <path d="M28 32 L36 24" stroke="#fde68a" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.55"/>
    ${N([[36,26,.7],[22,38,.6]],`#fca5a5`,.5)}`}function fi(){return`${M(30,54,18,4)}
    ${P(18,50,5)}
    ${F(44,28,5)}
    ${L(22,46,40,32,`#c4b5fd`,2.8)}
    ${I(42,30,5,`#a78bfa`)}
    ${j(44,28,5,`#ef4444`,`#991b1b`)}
    <path d="M34 36 L46 24" stroke="#fde68a" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.5"/>
    ${N([[38,34,.7]],`#e9d5ff`,.5)}`}function pi(){return`${M(32,54,26,4)}
    <path d="M4 32 H60" stroke="#0f172a" stroke-width="6" opacity="0.15"/>
    <path d="M4 32 H60" stroke="#bae6fd" stroke-width="4.5" opacity="0.4"/>
    <path d="M4 32 H60" stroke="#e0f2fe" stroke-width="2" opacity="0.9"/>
    ${F(16,32,4.5)}${F(32,32,4.5)}${F(48,32,4.5)}
    <path d="M10 22 L14 26 M24 22 L28 26 M38 22 L42 26 M50 22 L54 26" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 20 L16 24 M26 20 L30 24 M40 20 L44 24 M52 20 L56 24" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M48 10 L52 6 M54 14 L58 10 M8 16 L4 12 M6 22 L2 18" stroke="#e0f2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    <circle cx="52" cy="8" r="7" fill="#7dd3fc" opacity="0.18"/>
    <text x="50" y="12" font-size="10" fill="#e0f2fe" opacity="0.85">❄</text>
    ${N([[8,10,.8],[56,12,.9],[32,18,.7]],`#e0f2fe`,.65)}`}function mi(){return`${M(32,54,22,4)}
    ${P(14,48,4.5)}${P(32,32,5.5)}${P(50,16,4.5)}
    <path d="M8 52 L56 12" stroke="#0f172a" stroke-width="3" opacity="0.2" stroke-dasharray="5 3"/>
    <path d="M8 52 L56 12" stroke="#c4b5fd" stroke-width="2.2" opacity="0.45" stroke-dasharray="5 3"/>
    <path d="M24 24 L40 40 L24 48 L8 40 Z" fill="#7c3aed" opacity="0.5" stroke="#0f172a" stroke-width="2.2" transform="translate(4, 2)"/>
    <path d="M24 24 L40 40 L24 48 L8 40 Z" fill="none" stroke="#c4b5fd" stroke-width="1.6" transform="translate(4, 2)"/>
    <path d="M28 30 L34 36 M34 30 L28 36" stroke="#f0e6ff" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <circle cx="32" cy="36" r="14" fill="#a78bfa" opacity="0.12"/>
    ${Dr(32,34,`#7c3aed`,`#e9d5ff`)}
    ${N([[20,40,.7],[44,24,.7],[32,28,.8]],`#e9d5ff`,.55)}`}function hi(){return`${M(32,54,24,4)}
    <circle cx="32" cy="32" r="24" fill="#1e1b4b" opacity="0.68" stroke="#0f172a" stroke-width="2.4"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#6d28d9" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="17" fill="#312e81" opacity="0.48"/>
    <circle cx="32" cy="32" r="10" fill="#4c1d95" opacity="0.32"/>
    ${P(32,32,4.5)}${P(22,22,3.5)}${P(42,22,3.5)}${P(22,42,3.5)}${P(42,42,3.5)}
    <path d="M16 16 L48 48 M48 16 L16 48" stroke="#a78bfa" stroke-width="1.2" opacity="0.32"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#c4b5fd" stroke-width="1.6" opacity="0.5"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" stroke-width="0.8" opacity="0.25"/>
    ${N([[16,10,.7],[48,10,.7],[10,32,.6],[54,32,.6]],`#c4b5fd`,.45)}`}function gi(){return`${M(32,56,16,4)}
    ${P(32,34,6)}
    <circle cx="32" cy="34" r="14" fill="none" stroke="#0f172a" stroke-width="2.8" opacity="0.2"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#a78bfa" stroke-width="2.4" opacity="0.75"/>
    <circle cx="32" cy="34" r="19" fill="none" stroke="#7c3aed" stroke-width="1.8" opacity="0.55"/>
    <circle cx="32" cy="34" r="24" fill="none" stroke="#6d28d9" stroke-width="1.2" opacity="0.35"/>
    <path d="M32 14 L32 20 M32 48 L32 54 M14 34 L20 34 M44 34 L50 34" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    ${Dr(32,30,`#7c3aed`,`#e9d5ff`)}
    <text x="18" y="54" font-size="7" fill="#ddd6fe" opacity="0.8" font-weight="700">HOLD</text>
    ${N([[32,12,.8],[12,34,.6],[52,34,.6]],`#e9d5ff`,.5)}`}function _i(){return`${M(32,56,16,4)}
    ${P(32,38,6)}
    <text x="14" y="16" font-size="11" fill="#c4b5fd" opacity="0.85" font-style="italic" font-weight="600">zzz</text>
    <path d="M20 10 C28 6 36 6 44 10" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.55"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="#fbbf24" opacity="0.88" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="none" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="24" cy="10" r="1.5" fill="#fde68a"/><circle cx="32" cy="6" r="1.5" fill="#fde68a"/><circle cx="40" cy="10" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="52" r="5" fill="#fbbf24" opacity="0.45"/>
    <path d="M24 50 C30 44 34 44 40 50" stroke="#fde68a" stroke-width="2" fill="none" opacity="0.7"/>
    ${j(32,14,5,`#fde68a`,`#b45309`)}
    ${N([[32,4,.8],[18,8,.6],[46,8,.6]],`#fde68a`,.55)}`}function vi(){return`${M(30,54,18,4)}
    ${P(28,36,6)}
    <circle cx="48" cy="22" r="10" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="48" cy="22" r="10" fill="none" stroke="#f87171" stroke-width="2" opacity="0.65"/>
    <circle cx="48" cy="22" r="13" fill="#ef4444" opacity="0.1"/>
    <path d="M34 32 L44 24" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 32 L44 24" stroke="#fca5a5" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M14 50 L18 46 M20 52 L24 48" stroke="#dc2626" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <circle cx="16" cy="50" r="2.5" fill="#ef4444" opacity="0.9" stroke="#991b1b" stroke-width="0.8"/>
    <circle cx="22" cy="48" r="2.2" fill="#ef4444" opacity="0.7"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="#4c1d95" opacity="0.6" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
    <text x="8" y="19" font-size="6" fill="#e9d5ff" opacity="0.7" font-weight="700">?</text>
    <path d="M6 18 L14 26" stroke="#c4b5fd" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.45"/>
    ${N([[12,12,.7],[46,18,.6]],`#fca5a5`,.5)}`}function yi(){return`${M(32,54,20,4)}
    <path d="M32 6 L52 16 V40 L32 52 L12 40 V16 Z" fill="#312e81" opacity="0.55" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M32 6 L52 16 V40 L32 52 L12 40 V16 Z" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M32 10 L48 18 V38 L32 48 L16 38 V18 Z" fill="none" stroke="#c4b5fd" stroke-width="0.9" opacity="0.4"/>
    ${P(32,30,4.5)}${P(22,20,3.5)}${P(42,20,3.5)}${P(22,40,3.5)}${P(42,40,3.5)}
    <path d="M32 10 L35 22 H46 L38 28 L40 40 L32 34 L24 40 L26 28 L18 22 H29 Z" fill="#c4b5fd" opacity="0.55" stroke="#0f172a" stroke-width="1.2"/>
    <path d="M32 10 L35 22 H46 L38 28 L40 40 L32 34 L24 40 L26 28 L18 22 H29 Z" fill="none" stroke="#f0e6ff" stroke-width="0.9"/>
    ${N([[32,8,.8],[14,28,.6],[50,28,.6]],`#e9d5ff`,.5)}`}function bi(){return`${M(32,54,20,4)}
    ${P(16,42,4.5)}${P(48,42,4.5)}
    <path d="M22 42 C28 32 36 32 42 42" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 42 C28 32 36 32 42 42" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M20 40 L30 28 M44 40 L34 28" stroke="#fbbf24" stroke-width="1.6" opacity="0.55"/>
    ${P(32,30,6)}
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="#fbbf24" opacity="0.88" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="none" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="24" cy="10" r="1.5" fill="#fde68a"/><circle cx="32" cy="6" r="1.5" fill="#fde68a"/><circle cx="40" cy="10" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="52" r="5" fill="#fbbf24" opacity="0.45"/>
    <path d="M24 50 C30 44 34 44 40 50" stroke="#fde68a" stroke-width="2" fill="none" opacity="0.7"/>
    ${j(32,14,5,`#fde68a`,`#b45309`)}
    ${N([[24,36,.7],[40,36,.7],[32,8,.9]],`#fde68a`,.6)}`}function xi(){return`${M(32,54,18,4)}
    ${P(32,34,6)}
    <ellipse cx="32" cy="18" rx="12" ry="7" fill="#a78bfa" opacity="0.32" stroke="#c4b5fd" stroke-width="1"/>
    <path d="M10 18 L32 34 L54 18" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M10 18 L32 34 L54 18" stroke="#86efac" stroke-width="2.4" fill="none" opacity="0.65"/>
    <path d="M32 6 L32 34 M10 50 L32 34 L54 50" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M32 6 L32 34 M10 50 L32 34 L54 50" stroke="#93c5fd" stroke-width="2.4" fill="none" opacity="0.65"/>
    <path d="M14 14 L32 34 L50 50" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="4 2"/>
    <circle cx="10" cy="18" r="4.5" fill="#4ade80" opacity="0.65" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="54" cy="18" r="4.5" fill="#60a5fa" opacity="0.65" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="10" cy="50" r="4.5" fill="#f87171" opacity="0.55" stroke="#0f172a" stroke-width="1.4"/>
    ${N([[32,12,.8],[8,34,.6],[56,34,.6]],`#e9d5ff`,.55)}`}function Si(){return`${M(32,54,20,4)}
    <path d="M12 26 C24 16 40 16 52 26 C40 38 24 38 12 26 Z" fill="#312e81" opacity="0.78" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M12 26 C24 16 40 16 52 26 C40 38 24 38 12 26 Z" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M18 26 H46" stroke="#0f172a" stroke-width="3.6"/>
    <path d="M18 26 H46" stroke="#1e1b4b" stroke-width="2.4"/>
    <path d="M16 24 C26 22 38 22 48 24" stroke="#c4b5fd" stroke-width="1.2" fill="none" opacity="0.45"/>
    <rect x="34" y="8" width="18" height="26" rx="2.5" fill="#4c1d95" stroke="#0f172a" stroke-width="2" transform="rotate(12 43 21)"/>
    <rect x="34" y="8" width="18" height="26" rx="2.5" fill="none" stroke="#c4b5fd" stroke-width="1.4" transform="rotate(12 43 21)"/>
    <path d="M36 14 L54 32 M54 14 L36 32" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.3"/>
    <path d="M36 14 L54 32 M54 14 L36 32" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <circle cx="46" cy="22" r="11" fill="none" stroke="#fca5a5" stroke-width="1.8" opacity="0.55"/>
    <circle cx="46" cy="22" r="14" fill="#ef4444" opacity="0.08"/>
    ${N([[46,16,.7],[24,20,.5]],`#c4b5fd`,.45)}`}function Ci(){return`${M(32,54,24,4)}
    ${P(12,16,4)}${F(52,16,4)}${P(12,50,4)}${F(52,50,4)}
    <path d="M16 16 L48 50 M52 16 L16 50" stroke="#0f172a" stroke-width="3.2" opacity="0.2"/>
    <path d="M16 16 L48 50 M52 16 L16 50" stroke="#c4b5fd" stroke-width="2.4" opacity="0.65"/>
    <path d="M16 16 L52 16 M12 50 L52 50 M16 16 L16 50 M52 16 L52 50" stroke="#a78bfa" stroke-width="1.4" opacity="0.35" stroke-dasharray="4 2"/>
    ${kr(32,32,6,`#fde68a`)}
    <text x="26" y="38" font-size="14" fill="#fde68a" opacity="0.95" font-weight="700">✦</text>
    <path d="M20 20 L44 42 M44 20 L20 42" stroke="#e9d5ff" stroke-width="1.6" opacity="0.5"/>
    ${j(32,32,6,`#fde68a`,`#b45309`)}
    ${N([[8,8,.7],[56,8,.7],[8,56,.7],[56,56,.7]],`#fde68a`,.6)}`}function wi(){return`${M(28,54,18,4)}
    ${P(18,44,5.5)}
    ${I(42,24,6,`#cbd5e1`)}
    ${L(24,40,38,28,`#e2e8f0`,3)}
    <path d="M20 38 C26 32 32 28 36 26" stroke="#0f172a" stroke-width="2.4" fill="none" opacity="0.2"/>
    <path d="M20 38 C26 32 32 28 36 26" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <ellipse cx="36" cy="28" rx="6" ry="3" fill="#64748b" opacity="0.2"/>
    <path d="M12 18 L16 14 M50 12 L54 8" stroke="#cbd5e1" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    ${N([[40,20,.7],[22,36,.5]],`#e2e8f0`,.45)}`}function Ti(){return`${M(32,54,16,4)}
    ${P(32,20,5.5)}
    ${I(32,48,6,`#cbd5e1`)}
    ${L(32,26,32,42,`#e2e8f0`,3)}
    <path d="M24 34 C28 40 30 44 32 46" stroke="#0f172a" stroke-width="2.4" fill="none" opacity="0.2"/>
    <path d="M24 34 C28 40 30 44 32 46" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <ellipse cx="32" cy="50" rx="10" ry="3.5" fill="#64748b" opacity="0.28"/>
    <path d="M26 48 L32 54 L38 48" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.35"/>
    ${N([[32,16,.6],[32,44,.5]],`#cbd5e1`,.4)}`}function Ei(){return`${M(32,54,16,4)}
    ${P(32,26,5.5)}
    ${L(32,32,32,50,`#93c5fd`,3)}
    <path d="M22 46 L32 54 L42 46" stroke="#60a5fa" stroke-width="2" fill="none" opacity="0.55"/>
    <text x="42" y="48" font-size="9" fill="#cbd5e1" opacity="0.95" font-weight="700">×3</text>
    <circle cx="32" cy="40" r="12" fill="none" stroke="#0f172a" stroke-width="1.4" opacity="0.15"/>
    <circle cx="32" cy="40" r="12" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.35"/>
    <ellipse cx="32" cy="36" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.2"/>
    <ellipse cx="32" cy="44" rx="6" ry="2.5" fill="#1e3a8a" opacity="0.15"/>
    ${N([[32,22,.6]],`#93c5fd`,.4)}`}function Di(){return`${M(32,54,20,4)}
    ${P(20,36,4.5)}${P(44,36,4.5)}
    <path d="M32 8 V24 M32 24 C32 34 22 36 22 44 C22 52 32 54 32 54 C32 54 42 52 42 44 C42 36 32 34 32 24 Z" fill="#94a3b8" opacity="0.78" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 8 V24 M32 24 C32 34 22 36 22 44 C22 52 32 54 32 54 C32 54 42 52 42 44 C42 36 32 34 32 24 Z" fill="none" stroke="#e2e8f0" stroke-width="1.6"/>
    <path d="M26 28 L38 28 M28 38 L36 38" stroke="#cbd5e1" stroke-width="1.4" opacity="0.55"/>
    <path d="M16 36 L24 36 M40 36 L48 36" stroke="#64748b" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.4"/>
    <path d="M30 10 L34 10 M32 6 L32 12" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    ${N([[32,6,.7]],`#cbd5e1`,.4)}`}function Oi(){return`${M(32,54,22,4)}
    ${P(32,24,5.5)}
    ${L(32,30,32,46,`#93c5fd`,2.8)}
    <path d="M6 52 H58" stroke="#0f172a" stroke-width="3" opacity="0.2"/>
    <path d="M6 52 H58" stroke="#64748b" stroke-width="2.4" opacity="0.6"/>
    <rect x="8" y="48" width="48" height="7" rx="1.5" fill="#475569" opacity="0.5" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="10" y="50" width="44" height="3" rx="0.5" fill="#64748b" opacity="0.3"/>
    <path d="M12 46 L16 42 M52 46 L48 42" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <text x="14" y="47" font-size="5.5" fill="#cbd5e1" opacity="0.85" font-weight="700">BACK ROW</text>
    ${N([[20,40,.5],[44,40,.5]],`#93c5fd`,.4)}`}function ki(){return`${M(30,54,20,4)}
    ${P(20,36,5)}${F(40,36,5)}
    ${I(54,36,5,`#fca5a5`)}
    ${L(26,36,50,36,`#fde68a`,3)}
    <path d="M32 30 L42 30" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M32 30 L42 30" stroke="#fbbf24" stroke-width="1.8" opacity="0.55"/>
    ${j(46,36,5,`#fca5a5`,`#dc2626`)}
    ${N([[48,32,.6]],`#fde68a`,.45)}`}function Ai(){return`${M(28,54,20,4)}
    ${P(12,50,4.5)}${P(28,32,4.5)}
    ${I(46,16,5,`#cbd5e1`)}
    <path d="M16 46 Q30 10 44 20" stroke="#0f172a" stroke-width="4" fill="none" opacity="0.2"/>
    <path d="M16 46 Q30 10 44 20" stroke="#93c5fd" stroke-width="2.8" fill="none"/>
    ${Er(16,46,44,20,`#93c5fd`,2.6)}
    <path d="M42 18 L46 14 M42 22 L46 26" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="34" rx="7" ry="3.5" fill="#1e3a8a" opacity="0.3"/>
    ${N([[30,14,.8],[20,38,.5]],`#bae6fd`,.5)}`}function ji(){return`${M(32,54,18,4)}
    ${P(32,40,5.5)}
    <path d="M12 14 Q32 2 52 14 Q44 32 32 24 Q20 32 12 14" stroke="#0f172a" stroke-width="3" fill="#7c3aed" fill-opacity="0.15" opacity="0.3"/>
    <path d="M12 14 Q32 2 52 14 Q44 32 32 24 Q20 32 12 14" stroke="#c4b5fd" stroke-width="2.4" fill="#7c3aed" fill-opacity="0.12" opacity="0.7" stroke-dasharray="4 2"/>
    ${I(26,16,5,`#93c5fd`)}${I(44,28,4,`#c4b5fd`)}
    <text x="40" y="18" font-size="14" fill="#fde68a" opacity="0.95" font-weight="700">?</text>
    <path d="M18 10 L22 6 M46 8 L50 4" stroke="#e9d5ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
    ${N([[24,12,.8],[48,20,.7],[32,6,.9]],`#e9d5ff`,.55)}`}function Mi(){return`${M(32,54,22,4)}
    ${P(32,30,6)}${P(14,46,4)}${P(50,46,4)}
    <circle cx="32" cy="30" r="22" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.15"/>
    <circle cx="32" cy="30" r="22" fill="none" stroke="#93c5fd" stroke-width="2" opacity="0.5"/>
    <circle cx="32" cy="30" r="16" fill="#2563eb" opacity="0.1"/>
    <path d="M14 46 L24 36 M50 46 L40 36" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M14 46 L24 36 M50 46 L40 36" stroke="#60a5fa" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.65"/>
    <path d="M32 12 L35 20 H42 L36 26 L38 32 L32 28 L26 32 L28 26 L22 20 H29 Z" fill="#60a5fa" opacity="0.28" stroke="#0f172a" stroke-width="1"/>
    <path d="M32 12 L35 20 H42 L36 26 L38 32 L32 28 L26 32 L28 26 L22 20 H29 Z" fill="none" stroke="#93c5fd" stroke-width="0.9"/>
    ${N([[32,10,.8],[16,40,.5],[48,40,.5]],`#93c5fd`,.45)}`}function Ni(){return`${M(32,54,16,4)}
    ${P(32,36,6)}
    <circle cx="16" cy="20" r="12" fill="#ef4444" opacity="0.12" stroke="#0f172a" stroke-width="1.8"/>
    <circle cx="16" cy="20" r="12" fill="none" stroke="#f87171" stroke-width="1.6"/>
    <path d="M10 14 L22 26 M22 14 L10 26" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.3"/>
    <path d="M10 14 L22 26 M22 14 L10 26" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <text x="36" y="18" font-size="8" fill="#cbd5e1" opacity="0.9" font-weight="700">SKIP</text>
    <path d="M26 30 L38 30" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.45"/>
    ${N([[16,12,.6]],`#fca5a5`,.4)}`}function Pi(){return`${M(32,54,18,4)}
    ${P(32,34,6)}
    <path d="M12 18 C22 34 16 50 32 50 C48 50 42 34 52 18" stroke="#0f172a" stroke-width="3.2" fill="none" opacity="0.25"/>
    <path d="M12 18 C22 34 16 50 32 50 C48 50 42 34 52 18" stroke="#94a3b8" stroke-width="2.6" fill="none"/>
    <path d="M16 26 L26 36 M48 26 L38 36" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" opacity="0.25"/>
    <path d="M16 26 L26 36 M48 26 L38 36" stroke="#e2e8f0" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 28 L24 34 M46 28 L40 34" stroke="#64748b" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#cbd5e1" stroke-width="1" opacity="0.3"/>
    ${N([[32,20,.7]],`#e2e8f0`,.4)}`}function Fi(){return`${M(32,54,16,4)}
    ${F(32,40,6)}
    <path d="M18 12 L22 2 L26 8 L32 -2 L38 8 L42 2 L46 12 L46 20 H18 Z" fill="#fbbf24" opacity="0.72" stroke="#0f172a" stroke-width="2"/>
    <path d="M18 12 L22 2 L26 8 L32 -2 L38 8 L42 2 L46 12 L46 20 H18 Z" fill="none" stroke="#b45309" stroke-width="1.4"/>
    <path d="M20 14 L44 38 M44 14 L20 38" stroke="#0f172a" stroke-width="3.2" opacity="0.3"/>
    <path d="M20 14 L44 38 M44 14 L20 38" stroke="#fca5a5" stroke-width="2.6" opacity="0.85"/>
    <path d="M26 6 L32 10 L38 6" stroke="#fde68a" stroke-width="1.4" fill="none" opacity="0.55"/>
    ${j(32,26,6,`#fca5a5`,`#dc2626`)}
    ${N([[24,4,.6],[40,4,.6]],`#fde68a`,.45)}`}function Ii(){return`${M(32,54,18,4)}
    ${Or(32,36,32)}
    <path d="M16 44 C26 34 38 34 48 44 C38 54 26 54 16 44 Z" fill="#a8a29e" opacity="0.62" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 40 C28 36 36 36 44 40" stroke="#d6d3d1" stroke-width="1.6" fill="none" opacity="0.55"/>
    <path d="M22 46 C30 42 34 42 42 46" stroke="#78716c" stroke-width="1.4" fill="none" opacity="0.4"/>
    <text x="38" y="16" font-size="10" fill="#d6d3d1" opacity="0.75" font-weight="700">?</text>
    <path d="M24 38 L28 42 M36 38 L32 42" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
    ${N([[30,36,.5]],`#d6d3d1`,.35)}`}function Li(){return`${M(32,54,16,4)}
    <rect x="16" y="18" width="32" height="32" rx="2.5" fill="#292524" opacity="0.48" stroke="#0f172a" stroke-width="2"/>
    <rect x="16" y="18" width="32" height="32" rx="2.5" fill="none" stroke="#57534e" stroke-width="1.4"/>
    <path d="M18 20 H46 M18 48 H46 M18 20 V48 M46 20 V48" stroke="#78716c" stroke-width="0.8" opacity="0.3"/>
    ${F(32,34,6)}
    <path d="M40 14 L46 8 M42 18 L48 12" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <text x="40" y="16" font-size="12" fill="#fca5a5" opacity="0.95" font-weight="700">+</text>
    ${j(32,34,5,`#ef4444`,`#991b1b`)}
    ${N([[46,10,.7]],`#fca5a5`,.5)}`}function Ri(){return`${M(32,54,16,4)}
    <rect x="18" y="14" width="28" height="36" rx="2.5" fill="#334155" opacity="0.45" stroke="#0f172a" stroke-width="2"/>
    <rect x="18" y="14" width="28" height="36" rx="2.5" fill="none" stroke="#64748b" stroke-width="1.4"/>
    <path d="M22 16 V50 M42 16 V50" stroke="#0f172a" stroke-width="4.2" opacity="0.25"/>
    <path d="M22 16 V50 M42 16 V50" stroke="#cbd5e1" stroke-width="3.4" opacity="0.9"/>
    <path d="M20 22 H46 M20 32 H46 M20 42 H46" stroke="#94a3b8" stroke-width="1.2" opacity="0.45"/>
    <path d="M24 18 L28 22 L24 26 M38 18 L34 22 L38 26" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${N([[32,20,.5],[32,40,.5]],`#cbd5e1`,.35)}`}function zi(){return`${M(32,54,16,4)}
    ${F(32,22,6)}
    <path d="M24 14 L28 10 M40 14 L36 10" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M26 12 L30 8 M38 12 L34 8" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    ${L(32,30,32,50,`#fca5a5`,3)}
    <path d="M24 50 L32 42 L40 50" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M24 50 L32 42 L40 50" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="28" r="12" fill="#ef4444" opacity="0.1"/>
    ${j(32,48,5,`#fca5a5`,`#dc2626`)}
    ${N([[28,16,.6],[36,16,.6]],`#fca5a5`,.45)}`}function Bi(){return`${M(32,54,20,4)}
    ${P(16,34,5.5)}${P(48,34,5.5)}
    <path d="M22 34 L42 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 34 L42 34" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M42 28 L22 28" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 28 L22 28" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M32 22 L32 46" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 2" opacity="0.6"/>
    <circle cx="32" cy="34" r="8" fill="#a78bfa" opacity="0.15" stroke="#c4b5fd" stroke-width="1"/>
    ${kr(32,34,4,`#c4b5fd`)}
    ${N([[32,30,.7]],`#e9d5ff`,.45)}`}function Vi(){return`${M(28,54,18,4)}
    ${P(12,34,5.5)}
    ${I(50,34,6,`#cbd5e1`)}
    ${L(18,34,44,34,`#e2e8f0`,3)}
    <path d="M22 28 L28 34 L22 40" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.2"/>
    <path d="M22 28 L28 34 L22 40" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <text x="28" y="18" font-size="7" fill="#cbd5e1" opacity="0.7" font-weight="700">×2</text>
    <ellipse cx="28" cy="34" rx="5" ry="2.5" fill="#64748b" opacity="0.2"/>
    ${N([[46,30,.6]],`#e2e8f0`,.4)}`}function Hi(){return`${M(32,54,18,4)}
    ${F(32,28,6)}
    ${L(32,36,32,54,`#fca5a5`,3)}
    <path d="M32 54 L26 46 M32 54 L38 46" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M32 54 L26 46 M32 54 L38 46" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M18 54 H46" stroke="#0f172a" stroke-width="2.4" opacity="0.25"/>
    <path d="M18 54 H46" stroke="#64748b" stroke-width="1.8" opacity="0.55"/>
    <path d="M24 46 L28 50 L32 46 L36 50 L40 46" stroke="#f87171" stroke-width="1.4" fill="none" opacity="0.45"/>
    ${j(32,52,5,`#fca5a5`,`#dc2626`)}`}function Ui(){return`${M(32,56,16,4)}
    ${P(32,38,6)}
    ${Dr(32,30,`#60a5fa`,`#93c5fd`)}
    <circle cx="32" cy="32" r="18" fill="none" stroke="#0f172a" stroke-width="1.6" opacity="0.15"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.35"/>
    ${N([[32,18,.7],[20,32,.5],[44,32,.5]],`#bae6fd`,.4)}`}function Wi(){return`${M(32,54,18,4)}
    ${P(32,36,6)}
    <circle cx="16" cy="18" r="10" fill="#e0f2fe" opacity="0.55" stroke="#0f172a" stroke-width="2"/>
    <circle cx="16" cy="18" r="10" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M10 12 L22 24 M22 12 L10 24" stroke="#bae6fd" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
    <path d="M18 26 L30 34" stroke="#0f172a" stroke-width="2.8" stroke-dasharray="3 2" opacity="0.2"/>
    <path d="M18 26 L30 34" stroke="#bae6fd" stroke-width="2" stroke-dasharray="3 2" opacity="0.7"/>
    <path d="M12 8 L14 4 M18 10 L22 6" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${N([[14,10,.7],[20,22,.5]],`#e0f2fe`,.5)}`}function Gi(){return`${M(30,54,20,4)}
    ${P(14,50,5.5)}
    ${I(50,14,6,`#7dd3fc`)}
    ${L(18,46,46,18,`#bae6fd`,3)}
    <path d="M20 42 L32 30 L40 22" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.2" stroke-dasharray="3 2"/>
    <path d="M20 42 L32 30 L40 22" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.45" stroke-dasharray="3 2"/>
    <ellipse cx="30" cy="36" rx="6" ry="3" fill="#1e3a8a" opacity="0.2"/>
    ${N([[48,12,.7],[24,38,.5]],`#bae6fd`,.45)}`}function Ki(){return`${M(32,56,16,4)}
    ${P(32,38,6)}
    ${Dr(32,28,`#38bdf8`,`#7dd3fc`)}
    <circle cx="32" cy="34" r="20" fill="none" stroke="#0f172a" stroke-width="1.8" opacity="0.15"/>
    <circle cx="32" cy="34" r="20" fill="none" stroke="#bae6fd" stroke-width="1.8" opacity="0.55"/>
    <circle cx="32" cy="34" r="24" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3"/>
    ${N([[32,14,.8],[14,34,.5],[50,34,.5]],`#bae6fd`,.45)}`}function qi(){return`${M(32,54,16,4)}
    ${F(32,34,6)}
    <circle cx="32" cy="16" r="12" fill="#86efac" opacity="0.18" stroke="#0f172a" stroke-width="1.6"/>
    <circle cx="32" cy="16" r="12" fill="none" stroke="#4ade80" stroke-width="1.4"/>
    <path d="M26 8 C30 12 34 12 38 8 M24 14 C32 20 40 14" stroke="#86efac" stroke-width="1.8" fill="none" opacity="0.75"/>
    <path d="M24 48 H40" stroke="#0f172a" stroke-width="3.2" opacity="0.2"/>
    <path d="M24 48 H40" stroke="#4ade80" stroke-width="2.6" opacity="0.65"/>
    <path d="M26 52 H38" stroke="#22c55e" stroke-width="1.8" opacity="0.45"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#86efac" stroke-width="1.2" opacity="0.35"/>
    ${N([[32,10,.7],[28,44,.5],[36,44,.5]],`#86efac`,.45)}`}function Ji(){return`${M(26,54,16,4)}
    ${P(24,38,5.5)}
    <path d="M24 26 L32 18 V38 C32 46 24 50 24 50 C24 50 16 46 16 38 V22 Z" fill="#38bdf8" opacity="0.42" stroke="#0f172a" stroke-width="2"/>
    <path d="M24 26 L32 18 V38 C32 46 24 50 24 50 C24 50 16 46 16 38 V22 Z" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M34 24 L54 12" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 24 L54 12" stroke="#fde68a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${F(52,12,4.5)}
    <path d="M36 26 L44 16" stroke="#fbbf24" stroke-width="2" opacity="0.75"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
    <text x="8" y="54" font-size="6.5" fill="#cbd5e1" opacity="0.65" font-weight="700">TRAP</text>
    ${N([[48,10,.6]],`#fde68a`,.45)}`}function Yi(){return`${M(30,54,18,4)}
    ${P(20,50,4.5)}${F(44,22,5.5)}
    <path d="M24 46 L40 28" stroke="#0f172a" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M24 46 L40 28" stroke="#fde68a" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 26 L46 16 L42 32 L52 26 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M40 24 L44 20" stroke="#fff" stroke-width="1" opacity="0.4"/>
    ${j(42,24,6,`#ef4444`,`#991b1b`)}
    ${N([[42,20,.7]],`#fde68a`,.5)}`}function Xi(){return`${M(32,56,16,4)}
    ${P(32,40,6)}
    <path d="M18 16 L22 4 L26 10 L32 -2 L38 10 L42 4 L46 16 L46 26 H18 Z" fill="#fbbf24" opacity="0.9" stroke="#0f172a" stroke-width="2"/>
    <path d="M18 16 L22 4 L26 10 L32 -2 L38 10 L42 4 L46 16 L46 26 H18 Z" fill="none" stroke="#b45309" stroke-width="1.4"/>
    <circle cx="22" cy="8" r="1.5" fill="#fde68a"/><circle cx="32" cy="2" r="1.5" fill="#fde68a"/><circle cx="42" cy="8" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="26" r="12" fill="#fbbf24" opacity="0.2"/>
    <path d="M22 12 L28 8 L32 12 L36 8 L42 12" stroke="#fde68a" stroke-width="1.2" fill="none" opacity="0.55"/>
    <circle cx="32" cy="6" r="4" fill="#fde68a" opacity="0.4"/>
    ${N([[22,4,.7],[32,0,.8],[42,4,.7]],`#fde68a`,.6)}`}function Zi(){return`${M(30,54,20,4)}
    ${P(16,48,5)}${F(48,16,4.5)}
    <circle cx="48" cy="16" r="14" fill="#38bdf8" opacity="0.12" stroke="#0f172a" stroke-width="2"/>
    <circle cx="48" cy="16" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.8" opacity="0.65"/>
    <path d="M22 44 L40 22" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 44 L40 22" stroke="#bae6fd" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="5 3"/>
    <circle cx="48" cy="16" r="4" fill="#38bdf8" opacity="0.8" stroke="#0f172a" stroke-width="1"/>
    <path d="M18 42 L14 46 M50 12 L54 8" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${N([[46,12,.8],[24,40,.5]],`#e0f2fe`,.5)}`}function Qi(){return`${M(32,54,16,4)}
    ${Or(32,36,32)}
    <circle cx="32" cy="36" r="7" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
    <circle cx="32" cy="36" r="5" fill="#b91c1c"/>
    <ellipse cx="30" cy="34" rx="2.5" ry="1.8" fill="#fca5a5" opacity="0.45"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#0f172a" stroke-width="2.8" opacity="0.3"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#fca5a5" stroke-width="2.2"/>
    <path d="M32 26 L32 22 M26 32 L22 30 M38 32 L42 30" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${N([[32,24,.6]],`#fca5a5`,.4)}`}function $i(){return`${M(32,54,18,4)}
    ${F(32,20,6)}
    ${L(32,28,32,50,`#fca5a5`,3)}
    <path d="M18 52 H46" stroke="#0f172a" stroke-width="2.8" opacity="0.25"/>
    <path d="M18 52 H46" stroke="#64748b" stroke-width="2.2" opacity="0.55"/>
    <path d="M24 48 L32 40 L40 48" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.65"/>
    <rect x="18" y="50" width="28" height="5" rx="1.5" fill="#475569" opacity="0.42" stroke="#334155" stroke-width="1"/>
    ${N([[32,44,.5]],`#fca5a5`,.4)}`}function ea(){return`${M(32,54,16,4)}
    ${F(32,24,6)}
    <path d="M18 46 C28 34 36 34 46 46" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M18 46 C28 34 36 34 46 46" stroke="#86efac" stroke-width="2.4" fill="none" opacity="0.85"/>
    <path d="M20 52 C30 40 34 40 44 52" stroke="#4ade80" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M24 44 L32 34 L40 44" stroke="#22c55e" stroke-width="1.8" fill="none" opacity="0.6"/>
    <path d="M26 42 L22 50 M38 42 L42 50" stroke="#16a34a" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
  <path d="M28 48 L24 54 M36 48 L40 54" stroke="#86efac" stroke-width="1.4" stroke-linecap="round" opacity="0.35"/>
    ${N([[20,40,.5],[44,40,.5]],`#86efac`,.4)}`}function ta(){return`${M(30,54,20,4)}
    <circle cx="16" cy="44" r="6" fill="#2563eb" opacity="0.28" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="4 2"/>
    <circle cx="16" cy="44" r="6" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="4 2"/>
    ${F(48,22,6)}
    <path d="M22 40 L44 28" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 40 L44 28" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M46 18 L54 26 M46 30 L54 22 M42 24 L54 24 M46 18 L46 32" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>
    <path d="M46 18 L54 26 M46 30 L54 22 M42 24 L54 24 M46 18 L46 32" stroke="#ef4444" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="16" cy="44" r="10" fill="#dc2626" opacity="0.1"/>
    ${j(48,22,5,`#ef4444`,`#991b1b`)}`}function na(){return`${M(32,54,18,4)}
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="#475569" opacity="0.55" stroke="#0f172a" stroke-width="1.8"/>
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
    ${P(32,12,3.5)}${F(52,32,3.5)}${P(32,52,3.5)}${F(12,32,3.5)}
    <path d="M32 22 L32 12" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 22 L32 12" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 32 L50 32" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M32 38 L32 48" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M26 32 L14 32" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="#0f172a" stroke-width="1.2" opacity="0.15"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="#7dd3fc" stroke-width="0.9" opacity="0.3"/>
    ${N([[32,8,.6],[56,32,.6],[32,56,.6],[8,32,.6]],`#bae6fd`,.4)}`}function ra(){return`${M(26,54,20,4)}
    ${P(12,42,4.5)}${P(30,42,4.5)}
    <path d="M16 38 L8 24" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M16 38 L8 24" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M34 38 L42 24" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 38 L42 24" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${I(8,24,4.5,`#7dd3fc`)}${I(42,24,4.5,`#7dd3fc`)}
    <path d="M18 36 L28 36" stroke="#60a5fa" stroke-width="1.6" opacity="0.4"/>
    ${L(14,38,10,26,`#93c5fd`,2.2)}${L(32,38,40,26,`#93c5fd`,2.2)}
    ${N([[8,20,.6],[42,20,.6]],`#bae6fd`,.4)}`}function ia(){return`${M(32,54,22,4)}
    <path d="M4 30 H60" stroke="#0f172a" stroke-width="2.8" opacity="0.18"/>
    <path d="M4 30 H60" stroke="#64748b" stroke-width="2" opacity="0.45" stroke-dasharray="5 3"/>
    <rect x="6" y="30" width="52" height="22" rx="2" fill="#4c1d95" opacity="0.16" stroke="#553c7a" stroke-width="1.2"/>
    <text x="10" y="38" font-size="5" fill="#c4b5fd" opacity="0.8" font-weight="700">YOUR SIDE</text>
    ${Cr(44,18,5)}
    ${P(18,48,5)}
    ${I(44,18,5.5,`#a78bfa`)}
    <path d="M22 44 Q34 20 44 18" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 44 Q34 20 44 18" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="5 3"/>
    ${Er(22,44,44,18,`#a78bfa`,2.4)}
    <circle cx="44" cy="18" r="10" fill="#a78bfa" opacity="0.12" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="44" cy="18" r="10" fill="none" stroke="#c4b5fd" stroke-width="1.4" opacity="0.55"/>
    <path d="M40 14 L48 22 M48 14 L40 22" stroke="#e9d5ff" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
    ${N([[44,10,.75],[30,28,.55],[20,46,.5]],`#e9d5ff`,.5)}`}function aa(){return`${M(32,54,24,4)}
    <path d="M4 46 H60" stroke="#0f172a" stroke-width="3" opacity="0.2"/>
    <path d="M4 46 H60" stroke="#64748b" stroke-width="2.6" opacity="0.6"/>
    <rect x="6" y="42" width="52" height="6" rx="1.5" fill="#475569" opacity="0.42" stroke="#334155" stroke-width="1"/>
    ${P(12,44,4)}${P(28,44,4)}${P(44,44,4)}
    <path d="M22 32 L28 38 L22 44 L16 38 Z" fill="#38bdf8" opacity="0.55" stroke="#0f172a" stroke-width="1.6" transform="translate(2, 0)"/>
    <path d="M22 32 L28 38 L22 44 L16 38 Z" fill="none" stroke="#7dd3fc" stroke-width="1.2" transform="translate(2, 0)"/>
    <circle cx="32" cy="36" r="14" fill="none" stroke="#0f172a" stroke-width="1.4" opacity="0.15"/>
    <circle cx="32" cy="36" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.35"/>
    <circle cx="32" cy="36" r="20" fill="none" stroke="#38bdf8" stroke-width="0.8" opacity="0.2"/>
    ${N([[32,28,.7],[12,38,.5],[52,38,.5]],`#bae6fd`,.45)}`}function oa(){return`${M(32,56,14,3)}
    ${P(32,34,6)}
    ${Dr(32,28,`#38bdf8`,`#7dd3fc`)}
    <path d="M14 50 L28 36" stroke="#fde68a" stroke-width="2.4" opacity="0.6"/>
    <path d="M12 16 L16 20 L12 24 L8 20 Z" fill="#4c1d95" opacity="0.45" stroke="#a78bfa" stroke-width="1"/>
    <text x="10" y="18" font-size="6" fill="#e9d5ff" opacity="0.55">?</text>`}function sa(){return`${M(30,54,18,3.5)}
    ${F(42,22,5.5)}${P(20,48,4.5)}
    <path d="M24 44 L38 28" stroke="#e0f2fe" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 14 L46 22 L34 22 Z" fill="#7dd3fc" opacity="0.75" stroke="#bae6fd" stroke-width="1"/>
    <path d="M44 12 L48 8 M38 16 L34 12" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
    <circle cx="42" cy="22" r="8" fill="#7dd3fc" opacity="0.12"/>`}function ca(){return`${M(32,54,14,3.5)}
    ${Or(32,36,30,!1)}
    ${jr(32,34,4)}
    <path d="M20 44 L32 32 L44 44 M22 50 L42 50" stroke="#a8a29e" stroke-width="2.2" opacity="0.7" stroke-linecap="round"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#78716c" stroke-width="1.6" opacity="0.5"/>
    <path d="M24 38 L28 42 M36 38 L40 42" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>`}function la(){return`${M(32,56,14,3)}
    ${P(32,38,7)}
    <path d="M20 16 L24 4 L28 10 L32 0 L36 10 L40 4 L44 16 L44 24 H20 Z" fill="#fbbf24" opacity="0.85" stroke="#b45309" stroke-width="1.4"/>
    ${Dr(32,34,`#38bdf8`,`#7dd3fc`)}
    <circle cx="32" cy="12" r="4" fill="#fde68a" opacity="0.3"/>`}function ua(){return`${M(32,54,20,4)}
    ${P(16,50,4)}${F(50,12,5.5)}
    <path d="M20 46 L46 16" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="12" r="10" fill="none" stroke="#fca5a5" stroke-width="1.6" opacity="0.5"/>
    <circle cx="50" cy="12" r="6" fill="#ef4444" opacity="0.1"/>
    <path d="M44 18 L50 12 L48 22" stroke="#ef4444" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M18 44 L22 40 M46 18 L50 14" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>`}function da(){return`${M(32,54,18,3.5)}
    ${P(20,26,4.5)}${P(44,26,4.5)}
    <path d="M20 32 L20 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M44 32 L44 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M20 50 L16 44 M20 50 L24 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M44 50 L40 44 M44 50 L48 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M16 50 H48" stroke="#64748b" stroke-width="1.4" opacity="0.4"/>
    <circle cx="32" cy="40" r="14" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.2"/>`}var fa={nudge:()=>R(`nu`,`#94a3b8`,`#1e293b`,wi()),backstep:()=>R(`bs`,`#9ca3af`,`#1f2937`,Ti()),retreat_3:()=>R(`ret`,`#93c5fd`,`#1e3a5f`,Ei()),leapfrog:()=>R(`lf`,`#94a3b8`,`#1e293b`,Ai()),long_step:()=>z(`ls`,`#7dd3fc`,`#1e3a5f`,Gi()),sidestep:()=>R(`ss`,`#9ca3af`,`#1f2937`,Vi()),blink_2:()=>z(`bl`,`#38bdf8`,`#0c4a6e`,Zi()),random_teleport:()=>R(`rtp`,`#a78bfa`,`#312e81`,ji()),recall:()=>R(`rc`,`#93c5fd`,`#1e3a5f`,Oi()),repel:()=>R(`rp`,`#94a3b8`,`#1e293b`,ki()),mass_nudge:()=>z(`mn`,`#7dd3fc`,`#1e3a5f`,ra()),displacement:()=>B(`dp`,`#b794f4`,`#553c7a`,ia()),swap_friendly:()=>R(`sw`,`#a78bfa`,`#312e81`,Bi()),dominion:()=>z(`dm`,`#60a5fa`,`#1e3a5f`,da()),shield_1:()=>R(`s1`,`#60a5fa`,`#1e3a5f`,Ui()),shield_2:()=>z(`s2`,`#38bdf8`,`#0c4a6e`,Ki()),bulwark:()=>B(`bw`,`#b794f4`,`#553c7a`,mi()),barrier:()=>R(`br`,`#94a3b8`,`#1f2937`,Ri()),last_stand:()=>z(`ls`,`#38bdf8`,`#0c4a6e`,oa()),fortify:()=>B(`fo`,`#a78bfa`,`#4c1d95`,gi()),sanctuary_pulse:()=>z(`sp`,`#7dd3fc`,`#1e3a5f`,aa()),sanctuary:()=>B(`sa`,`#c4b5fd`,`#4c1d95`,yi()),deflect_1:()=>z(`df`,`#38bdf8`,`#0c4a6e`,Ji()),anchor_2:()=>R(`an`,`#94a3b8`,`#1f2937`,Di()),iron_will:()=>R(`iw`,`#9ca3af`,`#1f2937`,Pi()),vengeance:()=>B(`vg`,`#9f7aea`,`#3b0764`,vi()),rally:()=>R(`rl`,`#60a5fa`,`#1e3a5f`,Mi()),forward_bolt:()=>z(`fb`,`#fde68a`,`#1e3a5f`,Yi()),destroy_unshielded:()=>Ar(`sh`,`#4338ca`,`#1e1b4b`,Lr()),pyromancy:()=>Ar(`py`,`#ea580c`,`#431407`,Rr()),snipe:()=>z(`sn`,`#fde68a`,`#1e3a5f`,ua()),duel:()=>R(`du`,`#d4b896`,`#3d2817`,Ur()),sacrifice:()=>z(`sc`,`#fca5a5`,`#1e3a5f`,ta()),cull:()=>V(`cu`,`#a78bfa`,`#2e1065`,Hr()),execution:()=>V(`ex`,`#6ee7b7`,`#14532d`,Wr()),chain_lightning:()=>Ar(`cl`,`#2563eb`,`#0c1929`,Ir()),backstab:()=>z(`bk`,`#c4a574`,`#2d4a6e`,Pr()),cryo_bolt:()=>z(`cb`,`#7dd3fc`,`#0c4a6e`,sa()),bomb:()=>Ar(`bm`,`#f59e0b`,`#78350f`,Fr()),shockwave:()=>V(`sw`,`#c4b5fd`,`#3b1f6e`,qr()),plague:()=>V(`pg`,`#86efac`,`#14532d`,Jr()),magnet:()=>V(`mg`,`#6ee7b7`,`#14532d`,Gr()),poison_3:()=>z(`po`,`#86efac`,`#14532d`,qi()),root_2:()=>z(`ro`,`#86efac`,`#14532d`,ea()),panic:()=>R(`pn`,`#fca5a5`,`#1f2937`,zi()),blizzard:()=>B(`bz`,`#7dd3fc`,`#1e3a5f`,pi()),snowball:()=>R(`sb`,`#bae6fd`,`#0c4a6e`,Wi()),berserk:()=>Ar(`bk`,`#991b1b`,`#450a0a`,Vr()),create_foe:()=>R(`cf`,`#78716c`,`#292524`,Li()),deep_freeze:()=>V(`df`,`#7dd3fc`,`#0c4a6e`,Qr()),reverse_only_2:()=>z(`rv`,`#fca5a5`,`#1e3a5f`,$i()),press:()=>R(`pr`,`#fca5a5`,`#1f2937`,Hi()),tangle:()=>B(`tg`,`#93c5fd`,`#312e81`,ci()),blind:()=>B(`bl`,`#a78bfa`,`#4c1d95`,Si()),confusion:()=>V(`cf`,`#c4b5fd`,`#4c1d95`,Xr()),fog_2:()=>xr(`${Sr(32,34,6)}<ellipse cx="32" cy="24" rx="16" ry="8" fill="currentColor" opacity="0.22"/>`),crown:()=>z(`cr`,`#fbbf24`,`#451a03`,Xi()),demote:()=>R(`dm`,`#fca5a5`,`#1f2937`,Fi()),fusion:()=>B(`fu`,`#8b5cf6`,`#4c1d95`,bi()),clone:()=>V(`cln`,`#93c5fd`,`#312e81`,ri()),chameleon:()=>B(`ch`,`#86efac`,`#312e81`,xi()),hibernation:()=>B(`hi`,`#c4b5fd`,`#4c1d95`,_i()),quicksand:()=>R(`qs`,`#a8a29e`,`#292524`,Ii()),landmine:()=>z(`lm`,`#78716c`,`#292524`,Qi()),collapse:()=>R(`co`,`#78716c`,`#292524`,ca()),darkness:()=>B(`dk`,`#6d28d9`,`#1e1b4b`,hi()),scatter:()=>z(`st`,`#7dd3fc`,`#1e3a5f`,na()),call_forward:()=>B(`cfw`,`#fca5a5`,`#4c1d95`,di()),dash:()=>B(`ds`,`#c4b5fd`,`#4c1d95`,fi()),earthquake:()=>Ar(`eq`,`#78716c`,`#292524`,Br()),coin_flip:()=>ai(),ignore:()=>R(`ig`,`#94a3b8`,`#1f2937`,Ni()),counterspell:()=>V(`cs`,`#a78bfa`,`#2e1065`,Zr()),purify:()=>V(`pu`,`#6ee7b7`,`#14532d`,ei()),trickster:()=>B(`tr`,`#c4b5fd`,`#553c7a`,Ci()),offering:()=>B(`of`,`#d8b4fe`,`#553c7a`,si()),quick_march:()=>V(`qm`,`#60a5fa`,`#1e3a5f`,Kr()),constitution:()=>V(`co`,`#4ade80`,`#14532d`,ii()),last_king:()=>z(`lk`,`#fbbf24`,`#1e3a5f`,la()),revive:()=>Ar(`rv`,`#15803d`,`#052e16`,zr()),mind_control:()=>V(`mc`,`#c4b5fd`,`#3b0764`,Yr()),bounty:()=>V(`bo`,`#4ade80`,`#14532d`,ti()),link_fate:()=>V(`lf`,`#a78bfa`,`#2e1065`,ni()),bishop_2:()=>B(`bp`,`#b794f4`,`#4c1d95`,li()),rook_2:()=>B(`rk`,`#a78bfa`,`#4c1d95`,ui()),hostile_swap:()=>V(`hs`,`#93c5fd`,`#312e81`,$r()),deport:()=>V(`dp`,`#c4b5fd`,`#1e1b4b`,oi())};function pa(e,t=0){let n=fa[e.effect];return n?n(t):null}var ma={movement:{symbol:`↗`,label:`Motion`,anim:`movement`},combat:{symbol:`⚔`,label:`Strike`,anim:`combat`},defense:{symbol:`🛡`,label:`Ward`,anim:`defense`},debuff:{symbol:`❄`,label:`Curse`,anim:`debuff`},transform:{symbol:`✦`,label:`Morph`,anim:`transform`},board:{symbol:`◇`,label:`Terrain`,anim:`board`},crown:{symbol:`♔`,label:`Royal`,anim:`crown`},arcane:{symbol:`✧`,label:`Arcane`,anim:`arcane`}},ha=[[`movement`,[`nudge`,`backstep`,`long_step`,`leapfrog`,`recall`,`teleport`,`random_teleport`,`displacement`,`berserk`,`dash`]],[`combat`,[`stab`,`shatter`,`destroy`,`snipe`,`duel`,`execution`,`cull`,`pyromancy`,`backstab`,`sacrifice`,`chain_lightning`,`cryo`,`bomb`,`magnet`]],[`special`,[`create_foe`,`clone`,`earthquake`]],[`defense`,[`shield`,`ward`,`aegis`,`bulwark`,`stall`,`sanctuary`,`barrier`,`anchor`,`iron_will`,`hibernation`,`constitution`]],[`debuff`,[`root`,`panic`,`backpedal`,`blizzard`,`deep_freeze`,`snowball`,`blind`,`confusion`,`press`,`tangle`,`shockwave`]],[`board`,[`quicksand`,`landmine`,`collapse`,`darkness`,`earthquake`,`scatter`,`call_forward`]],[`meta`,[`counterspell`,`vengeance`,`last_stand`,`purify`,`trickster`,`ignore`,`offering`,`quick_march`,`dominion`,`last_king`,`revive`,`mind_control`]]];function ga(e){let t=0;for(let n=0;n<e.length;n++)t=(t+e.charCodeAt(n)*41)%360;return t}function _a(e){let t=0;for(let n=0;n<e.length;n++)t=(t+e.charCodeAt(n)*13)%3;return t}function va(e){let t=`${e.id} ${e.effect} ${e.name}`.toLowerCase();for(let[e,n]of ha)if(Array.isArray(n)&&n.some(e=>t.includes(e)))return e;return`arcane`}function ya(e){return`ca${String(e).replace(/[^a-zA-Z0-9]/g,``)}`}function ba(e,t,n){let r=[[12,18,.35],[48,12,.5],[52,44,.25],[18,50,.4],[38,28,.55]],i=n*4;return r.map(([e,n,r],a)=>`<circle cx="${(e+i+a*7)%56+4}" cy="${(n+i*2+a*5)%52+6}" r="1.2" fill="hsl(${t} 90% 85% / ${r})"/>`).join(``)}function xa(e,t){let n=t,r={movement:`
      <g class="card-motif" opacity="0.95">
        <path d="M18 ${44-n} L42 ${18+n} M42 ${18+n} L34 ${18+n} M42 ${18+n} L42 ${26+n}" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="26" cy="38" r="7" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="1.5"/>
        <path d="M46 46 Q52 38 58 46" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.5"/>
      </g>`,combat:`
      <g class="card-motif">
        <path d="M14 42 L30 ${14+n} L38 22 L22 50 Z" fill="currentColor" opacity="0.35"/>
        <path d="M26 ${18+n} L50 42" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <circle cx="38" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>
        <path d="M32 24 L44 36 M44 24 L32 36" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
      </g>`,defense:`
      <g class="card-motif">
        <path d="M32 12 L52 22 L52 40 C52 50 32 56 32 56 C32 56 12 50 12 40 L12 22 Z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/>
        <path d="M32 20 L32 48" stroke="currentColor" stroke-width="2" opacity="0.5"/>
        <path d="M22 32 H42" stroke="currentColor" stroke-width="2" opacity="0.5"/>
      </g>`,debuff:`
      <g class="card-motif">
        <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/>
        <path d="M24 ${28+n} L32 40 L40 ${26-n}" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M20 20 L24 24 M44 44 L40 40" stroke="currentColor" stroke-width="1.5" opacity="0.4"/>
      </g>`,transform:`
      <g class="card-motif">
        <polygon points="32,12 48,28 40,50 24,50 16,28" fill="currentColor" opacity="0.25" stroke="currentColor" stroke-width="2"/>
        <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.55"/>
        <path d="M32 16 L32 24 M32 40 L32 48 M16 28 L24 32 M40 32 L48 28" stroke="currentColor" stroke-width="1.5" opacity="0.5"/>
      </g>`,board:`
      <g class="card-motif">
        <rect x="12" y="16" width="40" height="32" rx="5" fill="none" stroke="currentColor" stroke-width="2"/>
        <path d="M18 26 H46 M18 34 H38 M18 42 H42" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>
        <rect x="${20+n}" y="22" width="8" height="8" rx="1" fill="currentColor" opacity="0.35"/>
      </g>`,crown:`
      <g class="card-motif">
        <path d="M12 40 L18 22 L26 30 L32 16 L38 30 L46 22 L52 40 Z" fill="currentColor" opacity="0.4"/>
        <rect x="12" y="40" width="40" height="8" rx="2" fill="currentColor"/>
        <circle cx="32" cy="24" r="4" fill="currentColor" opacity="0.7"/>
      </g>`,arcane:`
      <g class="card-motif">
        <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35"/>
        <circle cx="32" cy="32" r="12" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5"/>
        <circle cx="32" cy="32" r="5" fill="currentColor" opacity="0.65"/>
        <path d="M32 8 L32 14 M32 50 L32 56 M8 32 L14 32 M50 32 L56 32" stroke="currentColor" stroke-width="1.5" opacity="0.45"/>
      </g>`};return r[e]||r.arcane}function Sa(e,t,n,r){return Ca(e,t,n,r)}function Ca(e,t,n,r){let i=ya(n),a=(t+42)%360,o=_a(n),s=r&&pa(r,o)||xa(e,o);return r?.effect&&Nr(r.effect)&&s?`<svg class="spell-card__svg spell-card__svg--full-bleed" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${s}</svg>`:`<svg class="spell-card__svg" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="${i}-bg" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stop-color="hsl(${t} 75% 58% / 0.95)"/>
        <stop offset="55%" stop-color="hsl(${t} 55% 32% / 0.5)"/>
        <stop offset="100%" stop-color="hsl(${t} 40% 12% / 0.2)"/>
      </radialGradient>
      <linearGradient id="${i}-beam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${a} 90% 70% / 0)"/>
        <stop offset="45%" stop-color="hsl(${a} 85% 65% / 0.35)"/>
        <stop offset="100%" stop-color="hsl(${a} 70% 40% / 0)"/>
      </linearGradient>
      <filter id="${i}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="70" height="60" fill="url(#${i}-bg)"/>
    <rect width="70" height="60" fill="url(#${i}-beam)" opacity="0.9"/>
    <rect x="4" y="4" width="62" height="52" rx="8" fill="none" stroke="hsl(${t} 60% 70% / 0.35)" stroke-width="1"/>
    ${ba(i,t,o)}
    <g filter="url(#${i}-glow)" color="hsl(${t} 88% 88%)">${s}</g>
  </svg>`}function wa(e){return e.tiny?`tiny`:e.small?`small`:e.compact?`compact`:`full`}function Ta(e){let t=gr(e);return t.length?`<ul class="spell-card__effects">${t.map(e=>`<li>${ka(e)}</li>`).join(``)}</ul>`:``}var Ea=new WeakMap;function Da(e){let t=e?.querySelector?.(`.spell-card__name`),n=e?.querySelector?.(`.spell-card__title-frame`);if(!t||!n)return;let r=()=>{t.classList.add(`spell-card__name--fit`),t.style.fontSize=``,t.style.textOverflow=``,t.style.overflow=``;let e=n.clientWidth;if(e<=0)return;let r=parseFloat(getComputedStyle(t).fontSize);if(!r)return;let i=r*.55;for(;t.scrollWidth>e&&r>i;)r-=.5,t.style.fontSize=`${r}px`;t.scrollWidth>e&&(t.style.overflow=`hidden`,t.style.textOverflow=`ellipsis`)};if(r(),requestAnimationFrame(r),!Ea.has(e)&&typeof ResizeObserver<`u`){let t=new ResizeObserver(()=>r());t.observe(n),Ea.set(e,t)}}function Oa(e,t={}){let n=va(e),r=ga(e.id),i=ma[n]||ma.arcane,a=wa(t),o=!(t.hideDesc||t.gallery)&&a!==`tiny`,s=t.showViewFullHint||t.gallery,c=t.button?`button`:`div`,l=document.createElement(c);t.button&&(l.type=`button`);let u=e.rarity===`legendary`?`legendary`:e.rarity;l.className=[`spell-card`,`spell-card--${a}`,`spell-card--anim-${i.anim}`,u,e.rarity===`rare`?`spell-card--rare-fx`:``,e.rarity===`epic`?`spell-card--epic-fx`:``,e.rarity===`legendary`?`spell-card--legendary-fx`:``,e.rarity===`uncommon`?`spell-card--uncommon-fx`:``,e.rarity===`common`?`spell-card--common-fx`:``,`theme-${n}`,t.disabled?`disabled`:``,t.selected?`selected`:``,t.static?`static`:``,t.deal?`spell-card--deal`:``,t.fullDesc?`spell-card--full-desc`:``,t.gallery?`spell-card--gallery`:``].filter(Boolean).join(` `),l.style.setProperty(`--card-hue`,String(r)),l.dataset.cardId=e.id,l.title=_r(e);let d=e.rarity===`legendary`?`<div class="spell-card__fx spell-card__fx--legendary" aria-hidden="true"></div>`:e.rarity===`epic`?`<div class="spell-card__fx spell-card__fx--epic" aria-hidden="true"></div>`:e.rarity===`rare`?`<div class="spell-card__fx spell-card__fx--rare" aria-hidden="true"></div>`:e.rarity===`uncommon`?`<div class="spell-card__fx spell-card__fx--uncommon" aria-hidden="true"></div>`:e.rarity===`common`?`<div class="spell-card__fx spell-card__fx--common" aria-hidden="true"></div>`:``,f=e?.effect&&Nr(e.effect);return l.innerHTML=`
    ${d}
    <div class="spell-card__frame">
      <div class="spell-card__title-frame">
        <h3 class="spell-card__name">${ka(e.name)}</h3>
      </div>
      <div class="spell-card__art-frame">
        <div class="spell-card__art spell-card__art--animated${f?` spell-card__art--full-bleed`:``}" aria-hidden="true">
          <div class="spell-card__art-shine"></div>
          ${Sa(n,r,e.id,e)}
          <span class="spell-card__sigil spell-card__sigil--effect" aria-hidden="true">${i.symbol}</span>
        </div>
      </div>
      <div class="spell-card__type-frame${s?` spell-card__type-frame--with-hint`:``}">
        <span class="spell-card__rarity">${e.rarity}</span>
        ${s?`<span class="spell-card__view-full">Click to see full card</span>`:``}
        ${t.meta?`<span class="spell-card__meta">${ka(t.meta)}</span>`:``}
      </div>
      ${o?`<div class="spell-card__text-frame"><p class="spell-card__desc">${ka(e.desc)}</p></div>`:``}
    </div>
    <div class="spell-card__tooltip" role="tooltip">
      <strong>${ka(e.name)}</strong>
      ${Ta(e)}
    </div>
  `,t.onClick&&l.addEventListener(`click`,n=>t.onClick(n,e)),Da(l),l}function ka(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Aa(e){return document.getElementById(e)}function ja(){let e=Aa(`card-preview-modal`);e&&e.parentElement!==document.body&&document.body.appendChild(e)}function Ma(e){document.body.classList.toggle(`card-preview-open`,e),window.dispatchEvent(new CustomEvent(`card-preview-change`,{detail:{open:e}}))}function Na(){Aa(`card-preview-modal`)?.classList.add(`hidden`),Aa(`card-preview-mount`)?.classList.remove(`card-preview-mount--reveal-only`),Ma(!1)}function Pa(e,t={}){ja();let n=Aa(`card-preview-modal`),r=Aa(`card-preview-mount`),i=Aa(`card-preview-actions`);if(!(!n||!r||!e)){if(r.innerHTML=``,r.classList.toggle(`card-preview-mount--reveal-only`,!!t.hideDesc),r.appendChild(Oa(e,{static:!0,hideDesc:t.hideDesc})),i){if(i.innerHTML=``,t.meta){let e=document.createElement(`p`);e.className=`card-preview-meta`,e.textContent=t.meta,i.appendChild(e)}let e=document.createElement(`div`);if(e.className=`card-preview-actions-row`,t.onPlay){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary`,n.textContent=`Cast spell`,n.addEventListener(`click`,()=>{Na(),t.onPlay()}),e.appendChild(n)}if(t.onAdd){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary`,n.textContent=`Add to deck`,n.disabled=!!t.addDisabled,n.addEventListener(`click`,()=>{t.addDisabled||t.onAdd()}),e.appendChild(n)}if(t.onBuy){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary`,n.textContent=t.buyLabel||`Buy copy`,n.disabled=!!t.buyDisabled,n.addEventListener(`click`,()=>{t.buyDisabled||t.onBuy()}),e.appendChild(n)}if(t.onRemove){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-secondary`,n.textContent=`Remove all from deck`,n.addEventListener(`click`,()=>{t.onRemove(),Na()}),e.appendChild(n)}e.children.length&&i.appendChild(e)}n.classList.remove(`hidden`),Ma(!0)}}function Fa(){Aa(`card-preview-close`)?.addEventListener(`click`,Na),Aa(`card-preview-backdrop`)?.addEventListener(`click`,Na),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Na()})}function Ia(e,t=`.spell-card`){e&&e.querySelectorAll(t).forEach((e,t)=>{e.classList.add(`spell-card--deal`),e.style.animationDelay=`${t*.1}s`})}function La(e){e&&(e.classList.add(`spell-card--rare-burst`),setTimeout(()=>e.classList.remove(`spell-card--rare-burst`),900))}function Ra(e){e&&(e.classList.add(`spell-card--epic-burst`),setTimeout(()=>e.classList.remove(`spell-card--epic-burst`),1200))}function za(e){e&&(e.classList.add(`spell-card--legendary-burst`),setTimeout(()=>e.classList.remove(`spell-card--legendary-burst`),1500))}function Ba(e,t){t===`legendary`?za(e):t===`epic`?Ra(e):t===`rare`&&La(e)}var Va={common:10,uncommon:20,rare:30,epic:40,legendary:50};function Ha(e){return Va[e]??30}function Ua(e,r){let i=oe(e,r);if(i<1)return{success:!1,message:`Get this spell from a chest first.`};let a=n(r);if(!a)return{success:!1,message:`Unknown card.`};let o=t(r);if(i>=o)return{success:!1,message:`You already own the maximum (${o} copies).`};let s=Ha(a.rarity);if(e.gems<s)return{success:!1,message:`Need ${s} gems (${e.gems} available).`};e.gems-=s;let c=ye(e,r,1);return c?{success:!0,cost:s,message:`+1 ${a.name} for ${s} gems (${i+c} owned).`}:(e.gems+=s,w(e),{success:!1,message:`You already own the maximum copies for this rarity.`})}var Wa={deck:`<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="4" y="3" width="11" height="15" rx="2" fill="currentColor" opacity="0.35"/>
    <rect x="9" y="6" width="11" height="15" rx="2" fill="currentColor" stroke="currentColor" stroke-width="1.2"/>
    <path d="M12 10h5M12 13h5M12 16h3" stroke="#080a12" stroke-width="1.2" stroke-linecap="round"/>
  </svg>`,chests:`<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 9h16v11H4V9z" fill="currentColor" opacity="0.4"/>
    <path d="M3 9l2-4h14l2 4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="3" y="9" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 9v11" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="12" cy="14" r="1.5" fill="var(--accent-gem, #5ce1e6)"/>
  </svg>`,play:`<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 4l14 8-14 8V4z" fill="currentColor"/>
    <path d="M6 4l14 8-14 8V4z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`,pvp:`<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5 5l5 14M19 5l-5 14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="7" cy="5" r="2" fill="var(--accent-red, #e85d5d)"/>
    <circle cx="17" cy="5" r="2" fill="var(--accent-violet, #9f7aea)"/>
  </svg>`,quests:`<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 4h10l1 4H6l1-4z" fill="currentColor" opacity="0.5"/>
    <path d="M6 8h12v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8z" stroke="currentColor" stroke-width="1.5"/>
    <path d="M9 12h6M9 15h4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
    <circle cx="16" cy="5" r="3" fill="var(--accent-gold, #e8c547)" stroke="#080a12" stroke-width="1"/>
  </svg>`};function Ga(){let e={deck:Wa.deck,chests:Wa.chests,play:Wa.play,pvp:Wa.pvp,quests:Wa.quests};for(let t of document.querySelectorAll(`.game-nav .tab-btn[data-tab]`)){let n=t.querySelector(`.tab-btn__icon`),r=t.dataset.tab;n&&e[r]&&(n.innerHTML=e[r])}}var Ka=`arcaneCheckersSettings_v1`,qa={musicEnabled:!0,musicVolume:.45,sfxEnabled:!0,sfxVolume:.7,hapticsEnabled:!0},Ja={...qa};function Ya(){try{let e=localStorage.getItem(Ka);return e?{...qa,...JSON.parse(e)}:{...qa}}catch{return{...qa}}}function H(){return{...Ja}}function Xa(e){Ja={...Ja,...e};try{localStorage.setItem(Ka,JSON.stringify(Ja))}catch{}return window.dispatchEvent(new CustomEvent(`arcane-settings-changed`,{detail:H()})),H()}function Za(){return Ja=Ya(),H()}var Qa={hub:`assets/audio/background.m4a`,match:`assets/audio/background.m4a`},$a={tap:`assets/audio/sfx/tap.mp3`,spell:`assets/audio/sfx/spell.mp3`,capture:`assets/audio/sfx/capture.mp3`,win:`assets/audio/sfx/win.mp3`,chest:`assets/audio/sfx/chest.mp3`},eo=null,to=null,no=`hub`,ro=!1;function io(){return typeof Audio<`u`}function ao(e,t){if(!(!io()||!H().sfxEnabled))try{let n=new Audio(e);n.volume=Math.max(0,Math.min(1,t*H().sfxVolume)),n.play().catch(()=>{})}catch{}}function oo(e){let t=Qa[e];if(!t||!io())return null;let n=e===`hub`?eo:to;return n||(n=new Audio(t),n.loop=!0,n.preload=`auto`,e===`hub`?eo=n:to=n),n}function so(e){e&&(e.volume=Math.max(0,Math.min(1,H().musicVolume)))}function co(){eo?.pause(),to?.pause()}function lo(){ro||!io()||(ro=!0,[eo,to].forEach(e=>{e&&e.play().then(()=>e.pause()).catch(()=>{})}))}function uo(e){if(no=e,!H().musicEnabled){co();return}let t=oo(`hub`),n=oo(`match`);e===`match`?(t?.pause(),n&&(so(n),n.play().catch(()=>{}))):(n?.pause(),t&&(so(t),t.play().catch(()=>{})))}function fo(){if(!H().musicEnabled){co();return}so(eo),so(to),uo(no)}function po(){if(!io())return;window.addEventListener(`arcane-settings-changed`,()=>fo());let e=()=>{lo(),H().musicEnabled&&uo(no),window.removeEventListener(`pointerdown`,e),window.removeEventListener(`keydown`,e)};window.addEventListener(`pointerdown`,e,{once:!0}),window.addEventListener(`keydown`,e,{once:!0})}function mo(e){let t=$a[e];t&&ao(t,1)}var ho={tap:()=>mo(`tap`),spell:()=>mo(`spell`),capture:()=>mo(`capture`),win:()=>mo(`win`),chest:()=>mo(`chest`)},go=null,_o=!1;async function vo(){if(_o)return go;_o=!0;try{let{Capacitor:e}=await E(async()=>{let{Capacitor:e}=await import(`./dist-DM6qMOWp.js`);return{Capacitor:e}},[],import.meta.url);if(!e.isNativePlatform())return null;go=(await E(()=>import(`./esm-TGGH6JYM.js`),[],import.meta.url)).ScreenOrientation}catch{go=null}return go}async function yo(){document.body.classList.remove(`orientation-match`),document.body.classList.add(`orientation-portrait`);let e=await vo();if(e)try{await e.lock({orientation:`portrait`})}catch{}}async function bo(){await yo()}var xo=null;function So(){return xo||(xo=document.createElement(`div`),xo.id=`network-banner`,xo.className=`network-banner hidden`,xo.setAttribute(`role`,`status`),xo.setAttribute(`aria-live`,`polite`),document.body.appendChild(xo),xo)}function Co(){let e=So(),t=!navigator.onLine;e.textContent=t?`No connection — some features need internet`:``,e.classList.toggle(`hidden`,!t)}function wo(){Co(),window.addEventListener(`online`,Co),window.addEventListener(`offline`,Co)}async function To(){try{let{Capacitor:e}=await E(async()=>{let{Capacitor:e}=await import(`./dist-DM6qMOWp.js`);return{Capacitor:e}},[],import.meta.url);if(!e.isNativePlatform())return;let{StatusBar:t,Style:n}=await E(async()=>{let{StatusBar:e,Style:t}=await import(`./esm-C-SIlwqj.js`);return{StatusBar:e,Style:t}},[],import.meta.url);await t.setOverlaysWebView({overlay:!0}),await t.setStyle({style:n.Dark}),await t.setBackgroundColor({color:`#080a12`});let{SplashScreen:r}=await E(async()=>{let{SplashScreen:e}=await import(`./esm-Ck_AT-RK.js`);return{SplashScreen:e}},[],import.meta.url);await r.hide()}catch(e){console.warn(`Capacitor init skipped`,e)}}var Eo=null,Do=!1;async function Oo(){if(Do)return Eo;Do=!0;try{let{Capacitor:e}=await E(async()=>{let{Capacitor:e}=await import(`./dist-DM6qMOWp.js`);return{Capacitor:e}},[],import.meta.url);if(!e.isNativePlatform())return null;let{Haptics:t,ImpactStyle:n}=await E(async()=>{let{Haptics:e,ImpactStyle:t}=await import(`./esm-D_it6P9V.js`);return{Haptics:e,ImpactStyle:t}},[],import.meta.url);Eo={Haptics:t,ImpactStyle:n}}catch{Eo=null}return Eo}async function ko(){if(!H().hapticsEnabled)return;let e=await Oo();if(e)try{await e.Haptics.impact({style:e.ImpactStyle.Light})}catch{}}var Ao={bronze:{label:`Bronze`,tagline:`Same odds as Bronze Chest`,visual:`bronze`,accent:`#c77dff`,glow:`rgba(199, 125, 255, 0.45)`},silver:{label:`Silver`,tagline:`Same odds as Silver Chest`,visual:`silver`,accent:`#7dd3fc`,glow:`rgba(125, 211, 252, 0.5)`},gold:{label:`Gold`,tagline:`Same odds as Gold Chest`,visual:`gold`,accent:`#ffd87a`,glow:`rgba(255, 216, 122, 0.55)`}};function jo(e){let t=Ao[e]||Ao.style_crate,n=t.visual;return{tier:t,lid:n===`gold`?`#f0e6c8`:n===`silver`?`#e4ecf8`:`#e8c4f8`,body:n===`gold`?`#5a4518`:n===`silver`?`#3d4a62`:`#4a2860`,trim:t.accent,ribbon:n===`gold`?`#ff9de2`:n===`silver`?`#a5f3fc`:`#d8b4fe`}}function Mo(e,t){let{lid:n,body:r,trim:i,ribbon:a}=jo(e);return`
    <defs>
      <linearGradient id="${t}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${r}"/>
        <stop offset="50%" stop-color="${n}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#0c0814"/>
      </linearGradient>
      <linearGradient id="${t}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${n}"/>
        <stop offset="100%" stop-color="${r}"/>
      </linearGradient>
      <radialGradient id="${t}-inner" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stop-color="${i}" stop-opacity="0.9"/>
        <stop offset="55%" stop-color="${a}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${t}-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="100%" stop-color="${i}"/>
      </linearGradient>
      <filter id="${t}-glow">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`}function No(e,t,n){let{trim:r,ribbon:i,tier:a}=jo(e);return`
    ${n?`<g class="chest-stage__interior">
        <rect x="28" y="48" width="64" height="32" rx="3" fill="url(#${t}-inner)" opacity="0"/>
        <circle cx="60" cy="58" r="14" fill="url(#${t}-inner)" opacity="0"/>
      </g>`:``}
    <g${n?` class="chest-stage__body"`:``}>
      <rect x="24" y="44" width="72" height="40" rx="6" fill="url(#${t}-body)" stroke="${r}" stroke-width="2"/>
      <ellipse cx="60" cy="62" rx="18" ry="12" fill="none" stroke="${r}" stroke-width="1.5" opacity="0.7"/>
      <ellipse cx="60" cy="62" rx="12" ry="8" fill="rgba(255,255,255,0.08)"/>
      <path d="M48 56 L60 48 L72 56" fill="none" stroke="${i}" stroke-width="1" opacity="0.6"/>
      <rect x="54" y="66" width="12" height="10" rx="2" fill="url(#${t}-ribbon)" opacity="0.5"/>
    </g>
    <g${n?` class="chest-stage__lid"`:``}>
      <path d="M18 44 L60 20 L102 44 Z" fill="url(#${t}-lid)" stroke="${r}" stroke-width="2" filter="url(#${t}-glow)"/>
      <path d="M24 44 L60 26 L96 44" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      ${a.visual===`gold`?`<circle cx="60" cy="26" r="6" fill="url(#${t}-ribbon)" filter="url(#${t}-glow)"/>
         <path d="M52 26 Q60 18 68 26" fill="none" stroke="${r}" stroke-width="1.5"/>`:`<ellipse cx="60" cy="28" rx="8" ry="5" fill="url(#${t}-ribbon)" filter="url(#${t}-glow)"/>`}
      <rect x="22" y="40" width="76" height="5" rx="1" fill="url(#${t}-ribbon)" opacity="0.85"/>
    </g>`}function Po(e){let t=`vanityStage-${e}`;return`<svg class="chest-stage-svg vanity-box-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${Mo(e,t)}
    <ellipse class="chest-stage__shadow" cx="60" cy="90" rx="42" ry="8" fill="rgba(0,0,0,0.5)"/>
    ${No(e,t,!0)}
  </svg>`}function Fo(e){let t=`vanityCard-${e}`;return`<svg class="chest-svg vanity-box-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${Mo(e,t)}
    <ellipse cx="60" cy="90" rx="42" ry="8" fill="rgba(0,0,0,0.5)"/>
    ${No(e,t,!1)}
  </svg>`}function Io(e){let t=Lo[e]||Lo.avatar_default,n=`av-${e.replace(/[^a-z0-9]/gi,``)}`;return`<svg viewBox="0 0 64 64" class="cosmetic-avatar-svg cosmetic-avatar-svg--${e.replace(`avatar_`,``)}" aria-hidden="true">
    <defs>
      <linearGradient id="${n}-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${t.bg[0]}"/>
        <stop offset="100%" stop-color="${t.bg[1]}"/>
      </linearGradient>
      <radialGradient id="${n}-glow" cx="50%" cy="35%" r="55%">
        <stop offset="0%" stop-color="${t.glow}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${t.bg[1]}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#${n}-bg)"/>
    <circle cx="32" cy="30" r="22" fill="url(#${n}-glow)"/>
    ${t.svg}
  </svg>`}var Lo={avatar_default:{bg:[`#4a5f7a`,`#1e2a3a`],glow:`#8fa4c4`,svg:`<ellipse cx="32" cy="38" rx="14" ry="16" fill="#2a3548"/>
      <circle cx="32" cy="24" r="11" fill="#c5d4ea"/>
      <rect x="22" y="14" width="20" height="6" rx="2" fill="#6b7f9c"/>
      <circle cx="28" cy="24" r="2" fill="#1a2030"/>
      <circle cx="36" cy="24" r="2" fill="#1a2030"/>`},avatar_mystic:{bg:[`#4c1d95`,`#1e1035`],glow:`#c4a8ff`,svg:`<path d="M32 12 L42 22 L38 44 L26 44 L22 22 Z" fill="#2d1b4e" stroke="#c4a8ff" stroke-width="1.5"/>
      <circle cx="32" cy="28" r="8" fill="#0f0618" stroke="#e9d5ff" stroke-width="2"/>
      <circle cx="32" cy="28" r="3" fill="#a78bfa"/>
      <path d="M20 48 Q32 36 44 48" fill="none" stroke="#7c3aed" stroke-width="2"/>`},avatar_shadow:{bg:[`#111827`,`#030712`],glow:`#6b7280`,svg:`<path d="M18 50 Q32 20 46 50 Z" fill="#0a0f18"/>
      <ellipse cx="32" cy="26" rx="12" ry="14" fill="#1f2937"/>
      <path d="M22 18 Q32 8 42 18 L40 26 Q32 22 24 26 Z" fill="#030712"/>
      <ellipse cx="27" cy="28" rx="2" ry="3" fill="#9ca3af" opacity="0.8"/>
      <ellipse cx="37" cy="28" rx="2" ry="3" fill="#9ca3af" opacity="0.8"/>`},avatar_sun:{bg:[`#b45309`,`#451a03`],glow:`#fde68a`,svg:`<circle cx="32" cy="30" r="14" fill="#fbbf24" stroke="#fef3c7" stroke-width="2"/>
      <path d="M32 6 L34 14 M32 54 L34 46 M6 30 L14 32 M54 30 L46 32 M12 14 L18 20 M46 46 L52 52 M46 14 L52 8 M12 46 L18 52" stroke="#fde68a" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 48 Q32 40 40 48" fill="#d97706"/>`},avatar_void:{bg:[`#0c0a14`,`#312e81`],glow:`#818cf8`,svg:`<circle cx="32" cy="32" r="18" fill="#05030a" stroke="#6366f1" stroke-width="2"/>
      <ellipse cx="32" cy="32" rx="10" ry="14" fill="#1e1b4b"/>
      <circle cx="32" cy="32" r="4" fill="#c7d2fe"/>
      <circle cx="26" cy="24" r="1.5" fill="#fff" opacity="0.9"/>
      <circle cx="38" cy="28" r="1" fill="#fff" opacity="0.7"/>
      <circle cx="30" cy="38" r="1.2" fill="#fff" opacity="0.6"/>`},avatar_scout:{bg:[`#2d5016`,`#1a2e0e`],glow:`#86efac`,svg:`<ellipse cx="32" cy="38" rx="14" ry="16" fill="#1a3010"/>
      <circle cx="32" cy="24" r="11" fill="#c5e8b7"/>
      <path d="M20 18 Q32 8 44 18 L42 24 Q32 20 22 24 Z" fill="#3d6b28"/>
      <circle cx="28" cy="24" r="2" fill="#1a3010"/>
      <circle cx="36" cy="24" r="2" fill="#1a3010"/>
      <path d="M28 30 Q32 34 36 30" fill="none" stroke="#4ade80" stroke-width="1.5"/>`},avatar_crystal:{bg:[`#0e7490`,`#164e63`],glow:`#67e8f9`,svg:`<path d="M32 10 L44 28 L38 50 L26 50 L20 28 Z" fill="#083344" stroke="#67e8f9" stroke-width="1.5"/>
      <circle cx="32" cy="30" r="9" fill="#042f2e" stroke="#a5f3fc" stroke-width="2"/>
      <circle cx="32" cy="30" r="4" fill="#22d3ee"/>
      <path d="M28 26 L32 22 L36 26 L32 34 Z" fill="#ecfeff" opacity="0.6"/>`},avatar_moon:{bg:[`#1e293b`,`#0f172a`],glow:`#cbd5e1`,svg:`<circle cx="32" cy="30" r="16" fill="#334155"/>
      <circle cx="38" cy="26" r="13" fill="#0f172a"/>
      <circle cx="26" cy="28" r="2" fill="#e2e8f0" opacity="0.9"/>
      <circle cx="34" cy="32" r="1.5" fill="#e2e8f0" opacity="0.7"/>
      <path d="M22 48 Q32 40 42 48" fill="#475569"/>`},avatar_flame:{bg:[`#9a3412`,`#431407`],glow:`#fdba74`,svg:`<path d="M32 8 Q38 22 34 32 Q40 28 42 38 Q32 52 22 38 Q24 28 30 32 Q26 22 32 8" fill="#ea580c" stroke="#fed7aa" stroke-width="1"/>
      <circle cx="32" cy="34" r="8" fill="#7c2d12"/>
      <circle cx="29" cy="32" r="2" fill="#fef3c7"/>
      <circle cx="35" cy="32" r="2" fill="#fef3c7"/>
      <path d="M28 38 Q32 42 36 38" fill="#c2410c"/>`},avatar_cosmos:{bg:[`#1a0533`,`#4c1d95`],glow:`#e879f9`,svg:`<circle cx="32" cy="32" r="20" fill="#0a0118"/>
      <ellipse cx="32" cy="32" rx="16" ry="8" fill="none" stroke="#c084fc" stroke-width="2" transform="rotate(-30 32 32)"/>
      <ellipse cx="32" cy="32" rx="12" ry="5" fill="none" stroke="#f0abfc" stroke-width="1.5" transform="rotate(20 32 32)"/>
      <circle cx="32" cy="32" r="5" fill="#581c87"/>
      <circle cx="32" cy="32" r="2" fill="#fae8ff"/>
      <circle cx="20" cy="22" r="1.2" fill="#fff" opacity="0.8"/>
      <circle cx="44" cy="28" r="1" fill="#fff" opacity="0.6"/>
      <circle cx="38" cy="42" r="1.3" fill="#fff" opacity="0.7"/>`},avatar_sage:{bg:[`#4a5d4a`,`#1e2a1e`],glow:`#a8c4a0`,svg:`<ellipse cx="32" cy="38" rx="14" ry="16" fill="#2a3a2a"/>
      <circle cx="32" cy="24" r="11" fill="#d4e4cc"/>
      <path d="M22 20 Q32 12 42 20 L40 26 Q32 22 24 26 Z" fill="#5a7a52"/>
      <circle cx="28" cy="24" r="2" fill="#1e2a1e"/>
      <circle cx="36" cy="24" r="2" fill="#1e2a1e"/>
      <path d="M28 30 Q32 33 36 30" fill="none" stroke="#6b8a62" stroke-width="1.5"/>`},avatar_rookie:{bg:[`#1e4a6e`,`#0f2840`],glow:`#7ec8ff`,svg:`<ellipse cx="32" cy="38" rx="14" ry="16" fill="#1a3050"/>
      <circle cx="32" cy="24" r="11" fill="#c5dff0"/>
      <rect x="22" y="14" width="20" height="7" rx="2" fill="#3d7ab8"/>
      <circle cx="28" cy="24" r="2" fill="#0f2840"/>
      <circle cx="36" cy="24" r="2" fill="#0f2840"/>
      <path d="M28 30 Q32 34 36 30" fill="none" stroke="#5ba3d9" stroke-width="1.5"/>`},avatar_aurora:{bg:[`#0a1628`,`#1a0a30`],glow:`#5ce1e6`,svg:`<path d="M6 50 Q18 18 32 34 Q46 50 58 22" fill="none" stroke="#5ce1e6" stroke-width="3" opacity="0.75"/>
      <path d="M8 54 Q22 30 36 44 Q50 58 60 30" fill="none" stroke="#9f7aea" stroke-width="2" opacity="0.65"/>
      <ellipse cx="32" cy="38" rx="12" ry="14" fill="#1a2040"/>
      <circle cx="32" cy="26" r="10" fill="#c5d8f0"/>
      <circle cx="28" cy="26" r="2" fill="#0a1628"/>
      <circle cx="36" cy="26" r="2" fill="#0a1628"/>`}};function Ro(e){let t={banner_default:`linear-gradient(135deg,#1e2a44,#2d4a6e)`,banner_nebula:`linear-gradient(135deg,#2a1f4e,#6b4fd4 55%,#1a1030)`,banner_crimson:`linear-gradient(135deg,#3a1018,#8b2030 50%,#1a0a10)`,banner_storm:`linear-gradient(135deg,#1a2840,#3d7ab8 45%,#9ad4ff)`,banner_aurora:`linear-gradient(135deg,#0f3d3a,#5ce1e6 40%,#9f7aea 80%,#1a0a20)`,banner_forest:`linear-gradient(135deg,#1a2e0e,#2d5016 50%,#0f1a08)`,banner_sunset:`linear-gradient(135deg,#431407,#c2410c 45%,#fdba74 75%,#1a0a04)`,banner_midnight:`linear-gradient(135deg,#0f172a,#1e3a5f 50%,#020617)`,banner_ocean:`linear-gradient(135deg,#042f2e,#0e7490 45%,#164e63 80%,#020617)`,banner_eclipse:`linear-gradient(135deg,#0a0a0a,#1a1a2e 35%,#fbbf24 50%,#0a0a0a 65%,#312e81)`,banner_sand:`linear-gradient(135deg,#78350f,#d97706 45%,#fcd34d 75%,#451a03)`,banner_mist:`linear-gradient(135deg,#374151,#6b7280 50%,#9ca3af 80%,#1f2937)`,banner_dawn:`linear-gradient(135deg,#4a1942,#ec4899 40%,#fbbf24 70%,#1a0a20)`};return t[e]||t.banner_default}function zo(e){return e===`pieceSkin`?`Piece skin`:e===`frame`?`Frame`:e===`avatar`?`Avatar`:e===`banner`?`Banner`:e}function Bo(e){return`profile-frame profile-frame--${(e||`frame_default`).replace(/^frame_/,``)}`}function Vo(e){return(e||`frame_default`).replace(/^frame_/,``),`<div class="cosmetic-frame-preview ${Bo(e)}">
    <div class="cosmetic-frame-preview__inner">${Io(`avatar_default`)}</div>
  </div>`}function Ho(e,t){return t===`avatar`?Io(e):t===`frame`?Vo(e):t===`banner`?`<div class="cosmetic-preview-banner" style="background:${Ro(e)}"></div>`:t===`pieceSkin`?Uo(e):``}function Uo(e){let t=e.replace(`skin_`,``);return`<div class="cosmetic-skin-preview">
    <span class="piece red piece-skin-${t} king"></span>
    <span class="piece black piece-skin-${t}"></span>
  </div>`}function Wo(e){let t=document.createElement(`article`);t.className=`cosmetic-reveal-card rarity-${e.rarity} cosmetic-reveal-card--${e.type}`,e.duplicate&&t.classList.add(`cosmetic-reveal-card--duplicate`);let n=Ho(e.id,e.type),r=zo(e.type);return t.innerHTML=`
    <div class="cosmetic-reveal-card__frame">
      <span class="cosmetic-reveal-card__rarity">${e.rarity}</span>
      <div class="cosmetic-reveal-card__preview">${n}</div>
      <strong class="cosmetic-reveal-card__name">${e.name}</strong>
      <span class="cosmetic-reveal-card__type">${r}</span>
      ${e.duplicate?`<span class="cosmetic-reveal-card__dup">Duplicate · gems refunded</span>`:`<span class="cosmetic-reveal-card__new">Unlocked!</span>`}
    </div>`,t.style.animationDelay=`0s`,t}function Go(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Ko(e,t=``){let n=o(e),r=(t||`P`).charAt(0).toUpperCase(),i=Io(n.equipped.avatar)||`<span class="profile-avatar-fallback">${Go(r)}</span>`;return`<span class="profile-avatar-stack header-profile-btn__stack ${Bo(n.equipped.frame)}"><span class="profile-avatar-inner header-profile-btn__inner">${i}</span></span>`}async function qo(e){if(!e)return``;try{return(await Ae(e.id))?.username||e.user_metadata?.display_name||e.email?.split(`@`)[0]||``}catch{return e.user_metadata?.display_name||e.email?.split(`@`)[0]||``}}var Jo=null;function Yo(){return Jo||=Promise.all([E(()=>import(`./match-DjoMf5gp.js`),[],import.meta.url),E(()=>import(`./matchView-CvZpZCck.js`),[],import.meta.url),E(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url),E(()=>Promise.resolve({}),__vite__mapDeps([1]),import.meta.url)]).then(([e,t])=>({MatchSession:e.MatchSession,getMatchHtml:t.getMatchHtml})),Jo}var Xo=null;function Zo(){return Xo||=Promise.all([E(()=>import(`./pvpUI-2HQsdFKm.js`),[],import.meta.url),E(()=>import(`./pvp-DEccZ0mW.js`),[],import.meta.url)]).then(([e,t])=>({initPvpUI:e.initPvpUI,clearAllWaitingRoomsOnce:t.clearAllWaitingRoomsOnce})),Xo}var Qo=null;function $o(){return Qo||=E(()=>import(`./profileUI-iVEf8l-N.js`),[],import.meta.url),Qo}function es(){Qo=null}var ts=null;function ns(){return ts||=Promise.all([E(()=>import(`./settingsUI-C_xQ7218.js`),[],import.meta.url),E(()=>Promise.resolve({}),__vite__mapDeps([2]),import.meta.url)]).then(([e])=>e),ts}var rs=null;function is(){return rs||=Promise.all([E(()=>import(`./chestOpenAnimation-DHACE7hM.js`),[],import.meta.url),E(()=>import(`./cosmeticOpenAnimation-bNH1l5a_.js`),[],import.meta.url),E(()=>import(`./titleOpenAnimation-gerie8AO.js`),[],import.meta.url)]).then(([e,t,n])=>({playChestOpenAnimation:e.playChestOpenAnimation,playCosmeticOpenAnimation:t.playCosmeticOpenAnimation,playTitleOpenAnimation:n.playTitleOpenAnimation})),rs}var as=null;function os(){return as||=E(()=>import(`./tutorialMeta-CrNZOUdk.js`),[],import.meta.url),as}var ss=null;function cs(){return ss||=E(()=>import(`./tutorialUnlocks-CIaHHVlb.js`),[],import.meta.url),ss}var ls=null;function us(){return ls||=E(()=>import(`./tutorialMatch-Bq-XP8F1.js`),[],import.meta.url),ls}function ds(e,t){os().then(n=>n.notifyMetaTutorial(e,t))}function fs(e,t){cs().then(n=>n.notifyUnlockTutorial(e,t))}var U;try{U=T()}catch(e){console.error(`Failed to load profile, resetting save:`,e),localStorage.removeItem(`cardCheckersProfile_v7`),localStorage.removeItem(`cardCheckersProfile_v5`),U=T()}var W=`deck`,ps={deck:`Decks`,chests:`Shop`,play:`Play`,pvp:`PvP`,quests:`Quests`,profile:`Profile`,settings:`Settings`},ms=new Set(Object.keys(ps)),hs=`cards`,gs=`list`,G=null,K=[],_s=null,vs=``,ys=`all`,bs=`all`,xs=!0,Ss={legendary:5,epic:4,rare:3,uncommon:2,common:1};function Cs(e){return[...e].sort((e,t)=>{let n=Ss[e.rarity]??0,r=Ss[t.rarity]??0;return n===r?e.name.localeCompare(t.name):r-n})}var q=null,ws=null,Ts=null;function Es(){return ws?Promise.resolve(ws):(Ts||=Zo().then(({initPvpUI:e,clearAllWaitingRoomsOnce:t})=>(t(),ws=e({root:document.getElementById(`view-pvp`),getProfile:()=>U,openAuthModal:()=>Os?.open(`signin`,{forced:!0}),onNavigateTab:Z,onOpenDeckEdit:Wc,onPvpViewShown:()=>{W=`pvp`,Js()}}),ws)),Ts)}var Ds=null,Os=null,J=!1,ks=!1,As=!1,js=!1,Ms=!1,Ns=null,Ps=null,Fs=null,Y=1,Is=null;function Ls(e){return Ss[e?.rarity]??0}function Rs(e){let t=i(e);return Object.entries(t).map(([e,t])=>({def:n(e),count:t})).filter(e=>e.def).sort((e,t)=>{let n=Ls(t.def)-Ls(e.def);return n===0?e.def.name.localeCompare(t.def.name):n})}function zs(e){let t=K.indexOf(e);t<0||(K.splice(t,1),Jc(),ds(`card-removed-from-deck`,{cardId:e}))}function Bs(e){let t=K.length;K=K.filter(t=>t!==e),K.length!==t&&(Jc(),ds(`card-removed-from-deck`,{cardId:e}))}function Vs(){let n=e().map(e=>({def:e,owned:oe(U,e.id)})).filter(e=>e.owned>0).sort((e,t)=>{let n=Ls(t.def)-Ls(e.def);return n===0?e.def.name.localeCompare(t.def.name):n});K=[];for(let{def:e,owned:r}of n){let n=Math.min(r,t(e));for(let t=0;t<n&&K.length<30;t++)K.push(e.id);if(K.length>=30)break}Jc()}var X=e=>document.getElementById(e);function Hs(){let e=document.getElementById(`adventure-prebattle`);e&&e.parentElement!==document.body&&document.body.appendChild(e)}function Us(){let e=document.querySelector(`nav.game-nav.tabs`);e&&e.parentElement!==document.body&&document.body.appendChild(e)}function Ws(){return window.matchMedia(`(min-width: 1000px) and (max-width: 1400px)`).matches?2.5:window.matchMedia(`(min-width: 600px) and (max-width: 999px)`).matches?1.85:1}function Gs(){Hs(),document.getElementById(`adventure-prebattle`)?.classList.remove(`hidden`),document.body.classList.add(`adventure-floor-open`)}function Ks(){document.getElementById(`adventure-prebattle`)?.classList.add(`hidden`),document.body.classList.remove(`adventure-floor-open`)}function qs(e=x,t=`Locked`){Rn({title:t,bodyHtml:e,autoCloseMs:4500})}function Js(){document.body.classList.toggle(`main-tab-active`,ms.has(W)),document.body.classList.toggle(`adventure-active`,W===`play`)}function Ys(e,t,n){let r=e.querySelector(`.tab-btn__sign-in-badge`);t?(r||(r=document.createElement(`span`),r.className=`tab-btn__sign-in-badge`,r.setAttribute(`aria-hidden`,`true`),e.appendChild(r)),r.textContent=n,e.classList.add(`tab-btn--sign-in-nudge`)):(r?.remove(),e.classList.remove(`tab-btn--sign-in-nudge`))}function Xs(){let e=g(U),t=Kt();for(let n of[`quests`,`pvp`]){let r=document.querySelector(`.tab-btn[data-tab="${n}"]`);if(!r)continue;let i=n===`pvp`?`PvP`:`Quests`,a=!e,o=n===`pvp`?Wt:Gt;r.classList.toggle(`tab-btn--locked`,a),r.setAttribute(`aria-disabled`,a?`true`:`false`),a?(r.title=t?`${c(i)} ${o}.`:c(i),Ys(r,t,`Sign in`)):t?(r.title=o,Ys(r,n===`pvp`,`Sign in`)):(r.title=``,Ys(r,!1))}let n=m(U),r=document.querySelector(`.vault-tab[data-vault-tab="cosmetics"]`);r&&(r.classList.toggle(`vault-tab--locked`,!n),r.title=n?``:fe,r.setAttribute(`aria-disabled`,n?`false`:`true`))}async function Z(e){let t=document.getElementById(`view-match`);if(!(J&&t&&!t.classList.contains(`hidden`))){if(!ks&&(e===`quests`||e===`pvp`)&&!g(U)){let t=e===`pvp`?`PvP`:`Quests`,n=Kt(),r=e===`pvp`?Wt:Gt;await $e(n?`${c(t)}\n\n${r}.`:c(t),{title:`${t} locked`,confirmLabel:`Go to Adventure`,cancelLabel:n?`Sign in`:`Not now`})?(ks=!0,Z(`play`),ks=!1):n&&Os?.open(`signin`,{forced:!0});return}if(tr(),Kn()&&Jn()){if(e===W)return;if(!(e===`pvp`&&document.getElementById(`pvp-match-root`))){if(!await $e(`Leave your current match to open ${ps[e]||e}?`,{title:`Leave match?`,confirmLabel:`Leave`,cancelLabel:`Stay`,destructive:!0}))return;Yn(e),Qn(),document.querySelector(`#btn-leave-match`)?.click();return}}if(gs===`edit`&&(e!==`deck`||e===`deck`&&W===`deck`)){if(!await Hc())return;Uc()}e!==`deck`&&gs===`edit`&&(xc(),document.body.classList.remove(`deck-editing`)),W=e,Js(),ms.has(e)&&yc(),document.querySelectorAll(`.tab-btn`).forEach(t=>{t.classList.toggle(`active`,t.dataset.tab===e)}),document.querySelectorAll(`.view`).forEach(t=>{t.classList.toggle(`hidden`,t.id!==`view-${e}`)}),ds(`tab-changed`,{tab:e}),fs(`tab-changed`,{tab:e}),e===`chests`&&(jc(hs),Nc()),e===`deck`&&(gs=`list`,Cc(`list`)),e===`profile`&&nc(),e===`settings`&&rc(),e===`quests`&&(oc(),cc()),e===`play`&&$c(),e===`pvp`&&Es().then(e=>e?.render({resume:!0})).catch(e=>{console.error(`[PvP] init failed`,e);let t=document.getElementById(`view-pvp`);t&&!t.innerHTML.trim()&&(t.innerHTML=`<section class="panel game-panel pvp-panel"><p class="pvp-status pvp-status--error">Couldn't load PvP — please reload the page.</p></section>`)}),Kn()||(uo(`hub`),await yo())}}var Q=``;function Zs(e=Q){e&&(Q=e);let t=document.getElementById(`header-profile-menu`),n=document.getElementById(`header-profile-btn`),r=document.getElementById(`header-username`),i=document.getElementById(`auth-header-btn`),a=!!D();if(i&&(i.classList.toggle(`hidden`,a),i.hidden=a),t&&(t.classList.toggle(`hidden`,!a),t.hidden=!a),r){let e=a&&Q;r.textContent=e?Q:``,r.classList.toggle(`hidden`,!e),r.hidden=!e}n&&a&&(n.innerHTML=Ko(U,Q),n.title=Q?`Account — ${Q}`:`Account menu`)}function Qs(){let e=document.getElementById(`header-profile-btn`),t=document.getElementById(`header-profile-dropdown`);!e||!t||(t.classList.add(`hidden`),t.hidden=!0,e.setAttribute(`aria-expanded`,`false`))}function $s(){let e=document.getElementById(`header-profile-menu`),t=document.getElementById(`header-profile-btn`),n=document.getElementById(`header-profile-dropdown`);if(!e||!t||!n)return;let r=e=>{n.classList.toggle(`hidden`,!e),n.hidden=!e,t.setAttribute(`aria-expanded`,e?`true`:`false`)};t.addEventListener(`click`,e=>{e.stopPropagation();let t=!n.hidden;r(!t)}),n.querySelectorAll(`[data-profile-menu-action]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.profileMenuAction;Qs(),t===`settings`?Z(`settings`):tc()})}),document.addEventListener(`click`,t=>{n.hidden||e.contains(t.target)||Qs()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&!n.hidden&&Qs()})}async function ec(){let e=D();if(!e){Q=``,Zs();return}Q=await qo(e),Zs()}function tc(){Qs(),Z(`profile`),fs(`profile-opened`)}async function nc(){let{renderProfileTab:e}=await $o(),t=X(`view-profile`);e(U,t,{onGemsChange:lc,onTitleChanged:()=>Zs()})}async function rc(){let{renderSettingsTab:e}=await ns();e(X(`view-settings`),{onUsernameChanged:e=>{Q=e,Zs(e)}})}var ic=`
  <section class="panel game-panel quests-panel quests-panel--loading" aria-busy="true">
    <p class="quests-status" role="status">Loading quests…</p>
  </section>`,ac=`
  <section class="panel game-panel quests-panel quests-panel--error">
    <p class="quests-status quests-status--error">Couldn't load Quests.</p>
    <p class="quests-status-hint muted">Check your connection and try again, or reload the page.</p>
    <button type="button" class="btn-secondary quests-retry-btn">Try again</button>
  </section>`;function oc(){let e=X(`view-quests`);e&&(e.innerHTML=ic)}function sc(e=X(`view-quests`)){e&&(e.innerHTML=ac,e.querySelector(`.quests-retry-btn`)?.addEventListener(`click`,()=>{es(),oc(),cc()}))}async function cc(){let e=X(`view-quests`);if(e)try{let{renderQuestsTab:t}=await $o();t(U,e,{onTitleChanged:()=>Zs(),onCurrencyChange:()=>$()})}catch(t){console.error(`[Quests] render failed`,t),sc(e)}}function $(){let e=X(`header-gems`);e&&(e.textContent=String(U.gems??0));let t=X(`header-stars`);t&&(t.textContent=String(U.stars??0)),document.querySelector(`.hud-gems`)?.classList.toggle(`hud-gems--low`,(U.gems??0)<50),document.querySelector(`.hud-stars`)?.classList.toggle(`hud-stars--low`,(U.stars??0)<10)}function lc(){$()}function uc(){document.querySelectorAll(`.collection-owned-only-toggle`).forEach(e=>{e.checked=xs});for(let e of[`collection-search`]){let t=X(e);t&&(t.value=vs)}for(let e of[`collection-rarity`]){let t=fr(e);t&&(t.value=ys)}let e=fr(`collection-category`);e&&(e.value=bs)}var dc=`(max-width: 899px)`,fc=`(max-width: 1280px)`,pc=null;function mc(){return window.matchMedia(dc).matches}function hc(){return document.body.classList.contains(`main-tab-active`)&&!document.body.classList.contains(`match-active`)&&!document.body.classList.contains(`deck-editing`)&&window.matchMedia(fc).matches}function gc(){return document.querySelector(`.game-main`)}function _c(){let e=gc();return hc()&&e?e.scrollTop:window.scrollY||document.documentElement.scrollTop||0}function vc(e){let t=gc();if(hc()&&t){t.scrollTop=e;return}window.scrollTo(0,e)}function yc(){let e=gc();if(hc()&&e){e.scrollTop=0;return}window.scrollTo(0,0)}function bc(){mc()&&(pc=_c(),document.body.style.position=`fixed`,document.body.style.top=`0`,document.body.style.left=`0`,document.body.style.right=`0`,document.body.style.width=`100%`)}function xc(){if(pc==null)return;let e=pc;pc=null,document.body.style.position=``,document.body.style.top=``,document.body.style.left=``,document.body.style.right=``,document.body.style.width=``,vc(e)}function Sc(){yc(),document.documentElement.scrollTop=0,document.body.scrollTop=0,document.querySelector(`.game-shell`)?.scrollTo?.(0,0),gc()?.scrollTo?.(0,0),document.querySelector(`#view-deck`)?.scrollTo?.(0,0),document.querySelectorAll(`#deck-subview-edit, #deck-subview-edit .deck-editor, #deck-subview-edit .deck-editor__body, #deck-subview-edit .deck-editor__grid, #deck-subview-edit .deck-editor__grid-cards`).forEach(e=>{e.scrollTop=0})}function Cc(e){e!==`edit`&&xc(),gs=e,document.body.classList.toggle(`deck-editing`,e===`edit`),X(`deck-subview-list`)?.classList.toggle(`hidden`,e!==`list`),X(`deck-subview-edit`)?.classList.toggle(`hidden`,e!==`edit`),e===`edit`&&(bc(),C(U),w(U),ys=`all`,vs=``,bs=`all`,xs=!0,uc(),Bc()),e===`list`&&qc(),e===`edit`&&(Jc(),Sc(),requestAnimationFrame(()=>{Sc(),requestAnimationFrame(Sc)}))}function wc({id:e,title:t,desc:n,cost:r,variant:i=`mystery`}){let a=(U.stars??0)>=r,o=i===`title`?Nt():Ft();return`
    <article class="mystery-box ${i===`title`?`mystery-box--title`:``} ${a?`mystery-box--ready`:`mystery-box--locked`}" data-mystery-id="${e}" role="button" tabindex="0" aria-label="Open ${t} for ${r} stars">
      <div class="mystery-box__glow" aria-hidden="true"></div>
      <div class="mystery-box__visual" aria-hidden="true">${o}</div>
      <h3 class="mystery-box__title">${t}</h3>
      <p class="mystery-box__desc">${n}</p>
      <p class="mystery-box__cost"><span aria-hidden="true">★</span> ${r} stars</p>
      <button type="button" class="btn-primary mystery-box__btn" data-mystery-open="${e}" ${a?``:`disabled`}>
        ${a?`Open for ${r} ★`:`Need more stars`}
      </button>
    </article>`}function Tc(e,t){e.querySelector(`[data-mystery-open]`)?.addEventListener(`click`,e=>{e.stopPropagation(),t()}),e.addEventListener(`click`,t),e.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),t())})}function Ec({bonusGems:e=0,bonusStars:t=0}={}){let n=[];return e&&n.push(`+${e} gem refund`),t&&n.push(`+${t} ★ from duplicates`),n.length?` (${n.join(`, `)})`:``}async function Dc(e,t){let{playChestOpenAnimation:n,playCosmeticOpenAnimation:r,playTitleOpenAnimation:i}=await is();e.kind===`card`?(await n({tier:`silver`,tierLabel:`Mystery Box`,pulls:e.cardPulls}),t&&(t.textContent=`Got ${e.cardPulls.length} spells.${Ec(e)}`)):e.kind===`cosmetic`?(await r({boxId:`silver`,boxLabel:`Mystery Box`,pulls:e.cosPulls}),t&&(t.textContent=e.message+Ec(e))):e.kind===`mixed`?(e.cardPulls.length&&await n({tier:`silver`,tierLabel:`Mystery Box — Spells`,pulls:e.cardPulls}),e.cosPulls.length&&await r({boxId:`silver`,boxLabel:`Mystery Box — Cosmetics`,pulls:e.cosPulls}),t&&(t.textContent=`${e.message}${Ec(e)}`)):e.kind===`title`&&(await i({boxLabel:`Title Box`,pulls:e.pulls}),t&&(t.textContent=e.message))}async function Oc(){let e=X(`mystery-box-log`);if(!((U.stars??0)>=10)){e&&(e.textContent=`Need 10 ★ stars. Clear Adventure floors to earn stars.`,e.classList.add(`chest-log--error`));return}let t=Vt(U);if(!t.success){e&&(e.textContent=t.message,e.classList.add(`chest-log--error`));return}w(U),$(),e&&e.classList.remove(`chest-log--error`),X(`mystery-box-list`)?.querySelectorAll(`.mystery-box__btn`).forEach(e=>{e.disabled=!0});try{await Dc(t,e)}catch(n){console.error(`Mystery box animation failed:`,n),e&&(e.textContent=t.message)}Nc({clearPulls:!1}),nc()}async function kc(){let e=X(`mystery-box-log`);if(!((U.stars??0)>=10)){e&&(e.textContent=`Need 10 ★ stars. Clear Adventure floors to earn stars.`,e.classList.add(`chest-log--error`));return}let t=Ht(U);if(!t.success){e&&(e.textContent=t.message,e.classList.add(`chest-log--error`));return}w(U),$(),e&&e.classList.remove(`chest-log--error`),X(`mystery-box-list`)?.querySelectorAll(`.mystery-box__btn`).forEach(e=>{e.disabled=!0});try{await Dc(t,e)}catch(n){console.error(`Title box animation failed:`,n),e&&(e.textContent=t.message)}Nc({clearPulls:!1}),nc()}function Ac(){let e=X(`mystery-box-list`);if(!e)return;e.innerHTML=`
    ${wc({id:`mystery`,title:`Mystery Box`,desc:`6 random pulls — mix of spells and cosmetics (${Math.round(It*100)}% cosmetic per slot when unlocked).`,cost:10})}
    ${wc({id:`title`,title:`Title Box`,desc:`Box-exclusive mage titles only — The Brave, Ruthless, Omnipotent, and more.`,cost:10,variant:`title`})}
  `;let t=e.querySelectorAll(`.mystery-box`);Tc(t[0],()=>Oc()),Tc(t[1],()=>kc())}function jc(e){if(!As&&e===`cosmetics`&&!m(U)){qs(fe,`Cosmetics locked`),As=!0,jc(`cards`),As=!1;return}hs=e,document.querySelectorAll(`.vault-tab`).forEach(t=>{let n=t.dataset.vaultTab===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)}),document.querySelectorAll(`.vault-tab-panel`).forEach(t=>{let n=t.id===`vault-tab-${e}`;t.classList.toggle(`hidden`,!n),t.hidden=!n}),fs(`vault-tab-changed`,{tab:e})}function Mc(){$o().then(({renderCosmeticBoxes:e})=>{e(U,X(`cosmetic-box-list`),{logEl:X(`cosmetic-box-log`),onGemsChange:lc,cosmeticsUnlocked:m(U),onOpened:()=>{W===`profile`&&nc(),W===`quests`&&cc()}})})}function Nc(e={}){let{clearPulls:t=!0}=e;$(),Mc(),Ac();let n=X(`chest-list`),r=X(`chest-pulls`);if(r&&t&&(r.innerHTML=``,r.classList.add(`chest-pulls--hidden`),r.classList.remove(`chest-pulls--reveal`)),n){n.innerHTML=``;for(let e of lt){let t=_t[e.id]||_t.bronze,i=U.gems>=e.cost,a=document.createElement(`article`);a.className=`chest-card chest-card--${e.id}${i?``:` chest-card--locked`}`,a.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${wt(e.id)}</div>
      <div class="chest-card__body">
        <h3 class="chest-card__name">${e.name}</h3>
        <p class="chest-card__tagline">${gt(e.weights)}</p>
        <ul class="chest-card__stats">
          <li><strong>${e.cards}</strong> spells</li>
        </ul>
        <p class="chest-card__cost">
          <span class="chest-card__gem" aria-hidden="true">◆</span>
          <span>${e.cost}</span>
        </p>
      </div>
      <button type="button" class="btn-primary chest-open chest-card__btn" data-id="${e.id}">
        ${i?`Open`:`Need more gems`}
      </button>
    `;let o=a.querySelector(`.chest-open`);o.disabled=!i,o.addEventListener(`click`,async()=>{if(o.disabled)return;let n=mt(U,e.id),i=X(`chest-log`);if(!n.success){i&&(i.textContent=n.message,i.classList.add(`chest-log--error`));return}w(U),$(),o.disabled=!0;let{playChestOpenAnimation:a}=await is();if(await a({tier:e.id,tierLabel:t.label,pulls:n.pulls}),ds(`chest-opened`,{chestId:e.id}),i){let t=n.bonusGems?` (+${n.bonusGems} gems from duplicates)`:``;i.textContent=`Got ${n.pulls.length} spells from ${e.name}.${t}`,i.classList.remove(`chest-log--error`)}if(r){r.classList.remove(`chest-pulls--hidden`),r.classList.add(`chest-pulls--reveal`),r.innerHTML=`<p class="chest-pulls__label">Chest opened</p><div class="chest-pulls__grid"></div>`;let e=r.querySelector(`.chest-pulls__grid`);n.pulls.forEach((t,n)=>{let r=Oa(t,{button:!0,deal:!0,gallery:!0,onClick:()=>Pa(t)});if(r.style.animationDelay=`${n*.12}s`,t.duplicate){r.classList.add(`spell-card--duplicate-pull`);let e=document.createElement(`span`);e.className=`chest-pull-dup-badge`,e.textContent=t.starRefund?`Duplicate · +${t.starRefund} ★`:`Duplicate · +${t.gemRefund} ◆`,r.appendChild(e)}e.appendChild(r),Ba(r,t.rarity)}),Ia(e),r.scrollIntoView({behavior:`smooth`,block:`nearest`})}Nc()}),n.appendChild(a)}}}function Pc(){return Cs(e().filter(e=>{if(bs!==`all`&&ct(e)!==bs||ys!==`all`&&e.rarity!==ys)return!1;if(vs){let t=vs.toLowerCase();if(!e.name.toLowerCase().includes(t)&&!e.desc.toLowerCase().includes(t))return!1}return!(xs&&oe(U,e.id)<=0)}))}function Fc(e,t){let n=Ua(U,e);return t&&(t.textContent=n.message,t.className=n.success?`deck-status ok`:`deck-status warn`),n.success&&(w(U),$(),gs===`list`&&qc(),gs===`edit`&&Jc()),n}function Ic(e,t){let n=Ua(U,e);return n.success?(w(U),$(),K.push(e),ge(U,e),w(U),Jc(),t&&(t.hidden=!1,t.textContent=`Bought and added to deck.`,t.className=`deck-editor__error deck-status ok`),!0):(t&&(t.hidden=!1,t.textContent=n.message,t.className=`deck-editor__error deck-status warn`),!1)}function Lc(e){return a(K,e,U).ok?(K.push(e),ge(U,e),w(U),Jc(),ds(`card-added-to-deck`,{cardId:e}),!0):!1}function Rc(e,n,r={}){let{deckEdit:o=!1,statusEl:s=null}=r,c=oe(U,n.id),l=t(n),u=c>=l,d=Ha(n.rarity),f=U.gems>=d&&!u,p=o?a(K,n.id,U):{ok:!1},m=o&&i(K)[n.id]||0,h=K.length<30,g=m<l,_=c>=1&&c<=m,v=c>=1&&!u,y=o&&!p.ok&&h&&g&&_&&v,ee=()=>Fc(n.id,s),x=()=>{let e=oe(U,n.id),t=o&&i(K)[n.id]||0,r=e>=l,s=U.gems>=d&&!r,c=o?a(K,n.id,U):{ok:!1};Pa(n,{meta:o?`Owned ${e}/${l} · In deck ${t}/${l} · ${r?`max copies`:`${d} gems per copy`}`:`Owned ${e}/${l}${r?` · max copies`:` · ${d} gems per copy`}`,buyLabel:r?`Max copies owned`:`Buy copy (${d} gems)`,buyDisabled:!s||r||e<1,onBuy:()=>{ee(),Na()},addDisabled:!c.ok,onAdd:o?()=>{Lc(n.id)&&x()}:void 0})};if(o){let t=document.createElement(`div`);t.className=`deck-editor-tile`+(b(U,n.id)?` deck-editor-tile--new`:``);let r=Oa(n,{button:!0,gallery:!0,onClick:()=>x()});r.classList.add(`deck-editor-tile__card`),r.title=`${n.name} — tap for full card`;let i=c>0?`Owned ${c}/${l}`:`Not in collection`,a=document.createElement(`div`);a.className=`deck-editor-tile__meta`,a.innerHTML=`${i} · In deck ${m}/${l}${b(U,n.id)?`<span class="deck-editor-tile__new">New</span>`:``}`,a.addEventListener(`click`,()=>x());let o=document.createElement(`button`);o.type=`button`,o.className=`deck-editor-tile__action`,p.ok?(o.classList.add(`deck-editor-tile__action--add`),o.textContent=`+ Add to deck`,o.addEventListener(`click`,e=>{e.stopPropagation(),Lc(n.id)})):y?(o.classList.add(`deck-editor-tile__action--buy`),o.textContent=f?`Add for ${d} gems`:`Need ${d} gems`,o.disabled=!f,o.addEventListener(`click`,e=>{e.stopPropagation(),Ic(n.id,s)})):(o.classList.add(`deck-editor-tile__action--disabled`),o.disabled=!0,K.length>=30?o.textContent=`Deck full (30/30)`:m>=l?o.textContent=`Max copies in deck`:c<1?o.textContent=`Open Shop chests to unlock`:p.reason?o.textContent=p.reason:o.textContent=`Can't add`),t.append(r,a,o),e.appendChild(t);return}let S=document.createElement(`div`);S.className=`collection-card-wrap`+(c<1?` collection-card-wrap--unowned`:``);let te=Oa(n,{button:!0,compact:!0,disabled:c<1||u,onClick:e=>{if(e.shiftKey||c<1||u){x();return}ee()}});te.title=u?`${n.name} — max ${l} copies owned. Tap to view full card.`:c<1?`${n.name} — not owned. Tap to view full card.`:`${n.name} — tap to buy (${d} gems). Shift+click to inspect.`,S.appendChild(te);let C=document.createElement(`span`);C.className=`collection-owned-count`,C.textContent=c>0?`×${c}`:`—`,S.appendChild(C);let ne=document.createElement(`span`);ne.className=`collection-buy-cost`,ne.textContent=u?`MAX`:`${d} ◆`,(!f||u)&&ne.classList.add(`collection-buy-cost--cant`),S.appendChild(ne),e.appendChild(S)}function zc(e,t={}){if(!e)return;let{deckEdit:n=!1,statusEl:r=null}=t;e.innerHTML=``;let i=Pc();if(!i.length){e.className=`deck-editor__grid collection-grid`;let t=document.createElement(`p`);t.className=`collection-grid-empty muted`,t.textContent=n?`No spells match your filters. Try “All types”, clear search, or uncheck Owned only.`:`No cards match your filters. Open chests in the Shop to get more spells.`,e.appendChild(t);return}let a=0,o={deckEdit:n,statusEl:r};if(n||bs!==`all`){e.className=`deck-editor__grid collection-grid`;for(let t of i)try{Rc(e,t,o),a+=1}catch(e){console.error(`Failed to render card:`,t?.id,e)}}else{e.className=`deck-editor__grid collection-categories`;let t=Object.fromEntries(at.map(e=>[e,[]]));for(let e of i)t[ct(e)].push(e);for(let n of at){let r=t[n];if(!r.length)continue;let i=document.createElement(`section`);i.className=`collection-category-section`,i.dataset.category=n;let s=document.createElement(`h3`);s.className=`collection-category-title`,s.textContent=ot[n],i.appendChild(s);let c=document.createElement(`div`);c.className=`collection-grid deck-editor__grid-cards`;for(let e of r)try{Rc(c,e,o),a+=1}catch(t){console.error(`Failed to render card:`,e?.id,t)}i.appendChild(c),e.appendChild(i)}}if(i.length>0&&a===0){e.className=`deck-editor__grid collection-grid`;let t=document.createElement(`p`);t.className=`collection-grid-empty collection-grid-empty--error`,t.textContent=`Spells failed to display. Hard refresh the page (Ctrl+Shift+R).`,e.appendChild(t)}}function Bc(){_s={name:X(`deck-name-input`)?.value?.trim()??``,cardIds:[...K]}}function Vc(){return _s?(X(`deck-name-input`)?.value?.trim()??``)!==_s.name||K.length!==_s.cardIds.length?!0:K.some((e,t)=>e!==_s.cardIds[t]):!1}async function Hc(){return Vc()?$e(`Discard unsaved changes to this deck?`,{title:`Unsaved changes`,confirmLabel:`Discard`,cancelLabel:`Keep editing`,destructive:!0}):!0}function Uc(){G=null,K=[],_s=null}function Wc(e){let t=U.decks.find(t=>t.id===e);if(!t)return;G=t.id,K=[...t.cardIds];let n=X(`deck-name-input`);n&&(n.value=t.name),Cc(`edit`),ds(`deck-edit-opened`,{deckId:e})}function Gc(e){let t=Object.fromEntries(at.map(e=>[e,0]));for(let r of e){let e=n(r);e&&(t[ct(e)]+=1)}return t}function Kc(e){let t=Gc(e),n=[];for(let e of at){let r=t[e];if(r<=0)continue;let i=ot[e];n.push(`<span class="deck-row__cat" title="${ka(i)}: ${r}"><span class="deck-row__cat-dot deck-row__cat-dot--${e}" aria-hidden="true"></span><span class="deck-row__cat-n">${r}</span></span>`)}return n.length?`<div class="deck-row__cats">${n.join(``)}</div>`:``}function qc(){C(U)&&w(U),$();let e=X(`deck-list`);if(!e)return;e.innerHTML=``;let t=X(`deck-list-count`);if(t){let e=U.decks.length;t.textContent=e?`${e} deck${e===1?``:`s`}`:``}if(!U.decks.length){if(C(U)&&w(U),U.decks.length){qc();return}e.innerHTML=`
      <div class="deck-list-empty">
        <span class="deck-list-empty__icon" aria-hidden="true">▣</span>
        <p class="deck-list-empty__title">No decks yet</p>
        <p class="deck-list-empty__desc">Tap <strong>New deck</strong> above to build your first 30-card list.</p>
      </div>`;return}for(let t of U.decks){let n=r(t.cardIds,U).valid,i=Math.min(100,Math.round(t.cardIds.length/30*100)),a=document.createElement(`button`);a.type=`button`,a.className=`deck-row deck-row--open${n?` deck-row--ready`:``}`,a.innerHTML=`
      <span class="deck-row__aura" aria-hidden="true"></span>
      <div class="deck-row__top">
        <span class="deck-row__sigil" aria-hidden="true">
          <span class="deck-row__sigil-card"></span>
          <span class="deck-row__sigil-card"></span>
          <span class="deck-row__sigil-card"></span>
        </span>
        <span class="deck-row__badge ${n?`deck-row__badge--ready`:`deck-row__badge--warn`}">${n?`Ready`:`Incomplete`}</span>
      </div>
      <h3 class="deck-row-name">${ka(t.name)}</h3>
      <div class="deck-row__progress">
        <div class="deck-progress-bar deck-row__progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="30" aria-valuenow="${t.cardIds.length}" aria-label="${ka(t.name)} progress">
          <div class="deck-progress-fill deck-row__progress-fill${n?` deck-row__progress-fill--ready`:``}" style="width:${i}%"></div>
        </div>
        <span class="deck-row__count">${t.cardIds.length}/30</span>
      </div>
      ${Kc(t.cardIds)}
      <div class="deck-row__footer">
        <span class="deck-row-hint">Tap to edit</span>
        <span class="deck-row-chevron" aria-hidden="true">›</span>
      </div>
    `,a.addEventListener(`click`,()=>Wc(t.id)),e.appendChild(a)}}function Jc(){$();let e=X(`collection-grid`),t=X(`deck-slots`),n=X(`deck-status`),i=X(`edit-deck-heading`),a=X(`deck-count-badge`),o=X(`deck-progress-bar`);if(!e||!t)return;let s=X(`btn-delete-deck`);s&&(s.hidden=!(G&&G!==`new`&&G!==`deck-starter`)),i&&(i.textContent=G===`new`?`New deck`:`In your deck`);let c=r(K,U),l=`${K.length}/30`;a&&(a.textContent=l,a.classList.toggle(`deck-editor__count--ready`,c.valid));let u=X(`deck-progress-fill`),d=Math.min(100,K.length/30*100);u&&(u.style.width=`${d}%`),o&&(o.hidden=c.valid,c.valid||(o.setAttribute(`aria-valuenow`,String(K.length)),o.setAttribute(`aria-valuemax`,`30`))),n&&(c.valid?(n.textContent=``,n.hidden=!0,n.className=`deck-editor__error deck-status ok`):(n.hidden=!1,n.textContent=c.errors[0]||`${l} — keep adding spells`,n.className=`deck-editor__error deck-status warn`));let f=X(`deck-collection-hint`);f&&(f.hidden=!1,f.innerHTML=K.length>=30?`Deck is full. Remove a card from the strip above, or save when ready.`:`Tap <strong>+ Add to deck</strong> for copies you own. When all owned copies are in the deck, tap <strong>Add for X gems</strong> to buy another.`),zc(e,{deckEdit:!0,statusEl:n}),t.innerHTML=``;let p=Rs(K);if(!p.length){let e=document.createElement(`p`);e.className=`deck-editor__strip-empty`,e.textContent=`Empty deck — tap + Add to deck below`,t.appendChild(e)}for(let{def:e,count:n}of p){let r=document.createElement(`div`);r.className=`deck-slot-wrap deck-slot-wrap--strip`;let i=Oa(e,{button:!0,tiny:!0,onClick:()=>{Pa(e,{meta:n>1?`${n} copies in deck`:`In your deck`,onRemove:()=>Bs(e.id)})}});if(r.appendChild(i),n>1){let e=document.createElement(`span`);e.className=`deck-stack-count`,e.textContent=`×${n}`,r.appendChild(e)}let a=document.createElement(`button`);a.type=`button`,a.className=`deck-slot-remove deck-slot-remove--visible`,a.setAttribute(`aria-label`,`Remove one ${e.name} from deck`),a.textContent=`−`,a.addEventListener(`click`,t=>{t.stopPropagation(),zs(e.id)}),r.appendChild(a),t.appendChild(r)}}function Yc(){let e=X(`deck-name-input`)?.value?.trim()||`My Deck`,t=r(K,U);if(!t.valid){X(`deck-status`).textContent=t.errors.join(` `);return}let n;G&&G!==`new`?(n=U.decks.find(e=>e.id===G),n?(n.name=e,n.cardIds=[...K],n.updatedAt=Date.now()):n=y(e,K)):n=y(e,K),re(U,n),U.selectedDeckId=n.id,w(U),ds(`deck-saved`,{deckId:n.id}),Uc(),Cc(`list`)}function Xc(e=[]){let t=`New Deck`,n=new Set(e.map(e=>e.name?.trim()).filter(Boolean));if(!n.has(t))return t;let r=2;for(;n.has(`${t} ${r}`);)r++;return`${t} ${r}`}function Zc(){G=`new`,K=[];let e=X(`deck-name-input`);e&&(e.value=Xc(U.decks)),Cc(`edit`)}function Qc(){Ks(),Fs=null}function $c(){U.adventure=se(U.adventure),X(`adventure-map-view`)?.classList.remove(`hidden`),Qc(),Is=null,al()}function el(e){let t=ve[e]||ve.verdant,n=`map-${e}`;return`<svg class="adventure-map-scenery-svg" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="${n}-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#08060e"/>
        <stop offset="35%" stop-color="${t.sky}"/>
        <stop offset="70%" stop-color="${t.skyGlow}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${t.grassDark}"/>
      </linearGradient>
      <linearGradient id="${n}-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${t.grassDark}"/>
        <stop offset="100%" stop-color="#0a0808"/>
      </linearGradient>
      <linearGradient id="${n}-foundation" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${t.rock}"/>
        <stop offset="100%" stop-color="${t.rockDark}"/>
      </linearGradient>
      <radialGradient id="${n}-glow" cx="50%" cy="22%" r="50%">
        <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${t.accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${n}-storm" cx="50%" cy="0%" r="80%">
        <stop offset="0%" stop-color="#1a1028" stop-opacity="0.9"/>
        <stop offset="60%" stop-color="#000" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>
      <filter id="${n}-soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2"/>
      </filter>
      <filter id="${n}-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.8" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="100" height="120" fill="url(#${n}-sky)"/>
    <rect width="100" height="120" fill="url(#${n}-storm)"/>
    <rect width="100" height="120" fill="url(#${n}-glow)"/>
    <!-- distant ruined castle silhouettes -->
    <g opacity="0.35" fill="#1a1420">
      <rect x="6" y="36" width="5" height="22" rx="0.5"/>
      <rect x="4" y="42" width="9" height="3"/>
      <rect x="14" y="44" width="12" height="14"/>
      <polygon points="14,44 20,36 26,44" fill="#120e18"/>
      <rect x="76" y="34" width="6" height="24" rx="0.5"/>
      <rect x="74" y="40" width="10" height="3"/>
      <rect x="68" y="46" width="14" height="12"/>
      <polygon points="68,46 75,38 82,46" fill="#120e18"/>
      <rect x="42" y="48" width="3" height="10" opacity="0.6"/>
      <rect x="54" y="50" width="2" height="8" opacity="0.5"/>
    </g>
    <!-- jagged hills -->
    <path fill="${t.grassDark}" opacity="0.55" d="M0 48 C12 40 22 44 36 38 C50 32 62 40 76 36 C88 32 96 38 100 34 L100 68 L0 68 Z"/>
    <path fill="#0a0808" opacity="0.45" d="M0 54 C18 46 30 50 50 44 C70 38 84 46 100 42 L100 78 L0 78 Z"/>
    <!-- dead twisted trees -->
    <g opacity="0.5" stroke="${t.rockDark}" stroke-width="0.6" fill="none">
      <path d="M8 68 L10 56 M10 60 L6 58 M10 58 L13 55"/>
      <path d="M90 64 L92 52 M92 56 L88 54 M92 54 L95 50"/>
    </g>
    <!-- storm clouds -->
    <ellipse cx="18" cy="14" rx="16" ry="6" fill="#4a4068" opacity="0.85" filter="url(#${n}-soft)"/>
    <ellipse cx="28" cy="12" rx="12" ry="5" fill="#3a3458" opacity="0.8" filter="url(#${n}-soft)"/>
    <ellipse cx="72" cy="10" rx="18" ry="7" fill="#4a4068" opacity="0.9" filter="url(#${n}-soft)"/>
    <ellipse cx="84" cy="9" rx="11" ry="5" fill="#3a3458" opacity="0.75" filter="url(#${n}-soft)"/>
    <ellipse cx="48" cy="18" rx="14" ry="5" fill="#504070" opacity="0.65" filter="url(#${n}-soft)"/>
    <!-- eerie moon -->
    <circle cx="78" cy="22" r="6" fill="#d8d0c0" opacity="0.35" filter="url(#${n}-soft)"/>
    <circle cx="80" cy="20.5" r="5.2" fill="#141020" opacity="0.9"/>
    <!-- distant lightning flash -->
    <path d="M62 8 L64 18 L61 18 L63 28" stroke="${t.accent}" stroke-width="0.8" opacity="0.55" fill="none" filter="url(#${n}-glow-filter)"/>
    <path d="M62 8 L64 18 L61 18 L63 28" stroke="#fff" stroke-width="0.3" opacity="0.4" fill="none"/>
    <!-- eerie embers / wisps -->
    <circle cx="24" cy="30" r="0.5" fill="${t.accent}" opacity="0.45" filter="url(#${n}-glow-filter)"/>
    <circle cx="70" cy="26" r="0.4" fill="${t.flag}" opacity="0.35" filter="url(#${n}-glow-filter)"/>
    <circle cx="44" cy="34" r="0.35" fill="${t.accent}" opacity="0.3" filter="url(#${n}-glow-filter)"/>
    <!-- ravens -->
    <g opacity="0.4" fill="#0a0808">
      <path d="M32 28 Q34 26 36 28 Q34 27 32 28Z"/>
      <path d="M58 24 Q60 22 62 24 Q60 23 58 24Z"/>
    </g>
    <!-- ground -->
    <rect x="0" y="82" width="100" height="38" fill="url(#${n}-hill)"/>
    <ellipse cx="50" cy="86" rx="48" ry="8" fill="rgba(0,0,0,0.35)"/>
    <!-- tower foundation platform -->
    <path fill="url(#${n}-foundation)" d="M10 88 L90 88 L94 96 L6 96 Z"/>
    <path fill="${t.rockDark}" d="M6 96 L94 96 L92 102 L8 102 Z"/>
    <path fill="${t.rockDark}" opacity="0.85" d="M0 102 L100 102 L100 120 L0 120 Z"/>
    <path fill="none" stroke="${t.flag}" stroke-width="0.3" opacity="0.2" d="M12 90 L88 90"/>
    <!-- braziers flanking tower base -->
    <g opacity="0.9">
      <rect x="18" y="80" width="2" height="8" fill="${t.rockDark}"/>
      <ellipse cx="19" cy="79" rx="2.5" ry="3" fill="${t.accent}" filter="url(#${n}-glow-filter)" opacity="0.7"/>
      <ellipse cx="19" cy="79" rx="1.2" ry="1.5" fill="#fff8e0" opacity="0.5"/>
      <rect x="80" y="80" width="2" height="8" fill="${t.rockDark}"/>
      <ellipse cx="81" cy="79" rx="2.5" ry="3" fill="${t.accent}" filter="url(#${n}-glow-filter)" opacity="0.7"/>
      <ellipse cx="81" cy="79" rx="1.2" ry="1.5" fill="#fff8e0" opacity="0.5"/>
    </g>
    <!-- ground fog wisps -->
    <ellipse cx="30" cy="92" rx="22" ry="5" fill="#b8b0c8" opacity="0.22" filter="url(#${n}-soft)"/>
    <ellipse cx="70" cy="94" rx="24" ry="6" fill="#b8b0c8" opacity="0.18" filter="url(#${n}-soft)"/>
    <ellipse cx="50" cy="96" rx="30" ry="4" fill="#a8a0b8" opacity="0.15" filter="url(#${n}-soft)"/>
  </svg>`}function tl(e=`#e8c547`){return`<svg class="adventure-map-tile__pawn-svg" viewBox="0 0 28 36" aria-hidden="true">
    <defs>
      <linearGradient id="pawn-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f0e8d8"/>
        <stop offset="100%" stop-color="#c8b898"/>
      </linearGradient>
      <radialGradient id="pawn-gem" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${e}"/>
        <stop offset="100%" stop-color="#8a6910"/>
      </radialGradient>
      <filter id="pawn-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="14" cy="34" rx="8" ry="2.2" fill="rgba(0,0,0,0.35)"/>
    <path fill="url(#pawn-body)" stroke="#8a7860" stroke-width="0.7"
      d="M14 3 C18 3 21 7 21 12 C21 17 17 19 14 23 C11 19 7 17 7 12 C7 7 10 3 14 3 Z"/>
    <circle cx="14" cy="11" r="4" fill="url(#pawn-gem)" stroke="#c9a227" stroke-width="0.8" filter="url(#pawn-glow)"/>
    <path fill="none" stroke="${e}" stroke-width="0.5" opacity="0.6"
      d="M14 6 L14 16 M11 9 L17 9 M11 13 L17 13"/>
    <rect x="11.5" y="21" width="5" height="11" rx="1.2" fill="url(#pawn-body)" stroke="#8a7860" stroke-width="0.6"/>
    <ellipse cx="14" cy="32" rx="6.5" ry="2.2" fill="url(#pawn-body)" stroke="#8a7860" stroke-width="0.6"/>
    <circle cx="14" cy="11" r="1.2" fill="#fff" opacity="0.55"/>
  </svg>`}function nl(e){let t=ve[e]||ve.verdant;return`<svg class="adventure-map-tile__banner-svg" viewBox="0 0 24 20" aria-hidden="true">
    <defs>
      <linearGradient id="banner-cloth" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${t.accent}"/>
        <stop offset="100%" stop-color="${t.flag}"/>
      </linearGradient>
    </defs>
    <rect x="11" y="2" width="2" height="16" fill="${t.rockDark}" rx="0.5"/>
    <circle cx="12" cy="2" r="1.5" fill="${t.flag}"/>
    <path fill="url(#banner-cloth)" d="M13 4 C18 5 20 8 20 10 C20 12 18 14 13 15 Z"/>
    <path fill="none" stroke="${t.flag}" stroke-width="0.5" opacity="0.6" d="M14 7 L18 8 M14 10 L18 10 M14 13 L17 12"/>
  </svg>`}function rl(e){let t=e?.querySelector(`.adventure-map-tower`);if(!e||!t)return;let n=window.matchMedia(`(min-width: 600px) and (max-width: 1400px)`),r=()=>[t,...t.querySelectorAll(`.adventure-map-tile, .adventure-map-tower__base, .adventure-map-tower__mist, .adventure-map-tower__beacon`)],i=()=>{let i=e.getBoundingClientRect(),a=1/0,o=-1/0;for(let e of r()){let t=e.getBoundingClientRect();!t.height&&!t.width||(a=Math.min(a,t.top),o=Math.max(o,t.bottom))}if(!Number.isFinite(a))return;let s=o-a,c=n.matches?Math.max(Math.round(s*.06),24):Math.max(Math.round(s*.12),32),l=parseFloat(getComputedStyle(t).bottom)||0,u=o-i.top,d=Math.ceil(Math.max(u+l,s+c+l)),f=e.closest(`.adventure-map-scene`);if(f&&n.matches&&(d=Math.max(d,f.clientHeight)),e.style.minHeight=`${d}px`,e.style.height=`${d}px`,f){let t=Math.max(0,e.offsetHeight-f.clientHeight);f.scrollTop>t&&(f.scrollTop=t)}};requestAnimationFrame(()=>{i(),requestAnimationFrame(i)})}function il(){let e=X(`adventure-map`),t=e?.closest(`.adventure-map-scene`);if(!e||!t)return;let n=Math.max(0,e.offsetHeight-t.clientHeight);t.scrollTop>n&&(t.scrollTop=n)}function al(){$(),Xs();let e=se(U.adventure);U.adventure=e,Y=e.selectedWorld||1;let t=X(`adventure-world-tabs`);if(t){t.innerHTML=``;let n=we(e);for(let n of le){let r=l(e,n.id),i=document.createElement(`button`);i.type=`button`,i.className=`adventure-world-shield`,i.dataset.world=String(n.id),n.id===Y&&i.classList.add(`active`),r||i.classList.add(`adventure-world-shield--locked`),i.disabled=!r,i.innerHTML=`<span class="adventure-world-shield__icon" aria-hidden="true"></span><span class="adventure-world-shield__label">Tower ${n.id}</span>`,i.title=r?n.name:`Clear floor 30 to unlock`,i.addEventListener(`click`,()=>{l(e,n.id)&&(Y=n.id,e.selectedWorld=n.id,w(U),al())}),t.appendChild(i)}l(e,Y)||(Y=n[0]?.id||1,e.selectedWorld=Y)}let n=le.find(e=>e.id===Y),r=X(`adventure-map`);if(!r)return;let i=n?.theme||`verdant`,a=ve[i]||ve.verdant;r.className=`adventure-map-canvas adventure-map-canvas--${i} adventure-map-canvas--iso`,r.style.setProperty(`--map-accent`,a.accent),r.style.setProperty(`--map-glow`,a.glow),r.style.setProperty(`--map-mist`,a.mist),r.style.setProperty(`--map-stone-light`,a.stoneLight),r.style.setProperty(`--map-stone-mid`,a.stoneMid),r.style.setProperty(`--map-stone-dark`,a.stoneDark),r.style.setProperty(`--map-stone-side`,a.stoneSide),r.style.setProperty(`--map-moss`,a.moss),r.setAttribute(`role`,`group`),r.setAttribute(`aria-label`,`Adventure floor map`);let o=Ce(e),c=ee(e),u=Y===5&&o?`<div class="adventure-map-challenge-corner">
        <div class="adventure-map-ominous__moon" aria-hidden="true"></div>
        <button type="button" class="adventure-challenge-toggle${c?` adventure-challenge-toggle--on`:``}"
          aria-pressed="${c?`true`:`false`}"
          title="Challenge mode: enemy starts with an extra rank of pieces on rank 5">
          <span class="adventure-challenge-toggle__icon" aria-hidden="true">⚔</span>
          <span class="adventure-challenge-toggle__label">Challenge</span>
        </button>
      </div>`:``;r.innerHTML=`
    <div class="adventure-map-canvas__bg" aria-hidden="true">
      <div class="adventure-map-scenery adventure-map-scenery--${i}" aria-hidden="true">${el(i)}</div>
      <div class="adventure-map-atmosphere" aria-hidden="true"></div>
      <div class="adventure-map-ominous" aria-hidden="true">
        <div class="adventure-map-ominous__sky"></div>
        <div class="adventure-map-ominous__moon" aria-hidden="true"></div>
        <div class="adventure-map-ominous__clouds"></div>
        <div class="adventure-map-ominous__vignette"></div>
        <div class="adventure-map-ominous__fog"></div>
        <div class="adventure-map-ominous__fog adventure-map-ominous__fog--slow"></div>
      </div>
    </div>
    ${u}
    <div class="adventure-map-tower">
      <div class="adventure-map-tower__base" aria-hidden="true"></div>
      <div class="adventure-map-tower__shaft" aria-hidden="true"></div>
      <div class="adventure-map-tower__buttress adventure-map-tower__buttress--left" aria-hidden="true"></div>
      <div class="adventure-map-tower__buttress adventure-map-tower__buttress--right" aria-hidden="true"></div>
      <div class="adventure-map-tiles"></div>
      <div class="adventure-map-tower__mist" aria-hidden="true"></div>
      <div class="adventure-map-tower__beacon" aria-hidden="true"></div>
      <div class="adventure-map-tower__haze" aria-hidden="true"></div>
    </div>`;let d=r.querySelector(`.adventure-map-tiles`),f=r.querySelector(`.adventure-map-tower`),p=ae(Y),m=ie(e),h=Ws();f?.style.setProperty(`--tower-top-ratio`,`0.72`),f?.style.setProperty(`--adventure-map-scale`,String(h)),p.forEach((t,n)=>{let r=Se(e,t.id),o=s(e,t.id),c=t.id===m&&r,l=ue(e,t.id),u=(t.floorInWorld-1)/9,f=1-u*.26,p=f*h,g=(1-u*.1)*h,_=Math.sin((t.floorInWorld-1)*.62)*.32*f*h,v=document.createElement(`button`);v.type=`button`,v.className=`adventure-map-tile`,v.classList.add(`adventure-map-tile--floor-${t.floorInWorld}`),v.style.zIndex=String(n+10),v.style.setProperty(`--floor-scale`,p.toFixed(4)),v.style.setProperty(`--floor-height-scale`,g.toFixed(4)),v.style.setProperty(`--floor-offset-x`,`${_.toFixed(3)}rem`),v.dataset.level=String(t.id),r||v.classList.add(`adventure-map-tile--locked`),o&&v.classList.add(`adventure-map-tile--cleared`),c&&v.classList.add(`adventure-map-tile--next`),t.floorInWorld>=7&&t.floorInWorld<10&&v.classList.add(`adventure-map-tile--rampart`),t.floorInWorld===10&&v.classList.add(`adventure-map-tile--summit`),v.setAttribute(`aria-disabled`,r?`false`:`true`),r||(v.title=`Clear global floor ${t.id-1} to unlock`),v.setAttribute(`aria-label`,`Floor ${t.floorInWorld}: ${t.opponent}, ${t.flavor}`);let y=o?`<span class="adventure-map-tile__stars">${be(l)}</span>`:``,ee=c?`<span class="adventure-map-tile__pawn">${tl(a.accent)}</span>`:``,b=t.floorInWorld===10?`<span class="adventure-map-tile__banner">${nl(i)}</span>`:``,x=t.floorInWorld>1&&t.floorInWorld<10?`<span class="adventure-map-tile__windows" aria-hidden="true"></span>`:``,S=o?`<span class="adventure-map-tile__torch" aria-hidden="true"></span>`:``;v.innerHTML=`
      ${ee}
      ${b}
      <span class="adventure-map-tile__stone" aria-hidden="true">
        <span class="adventure-map-tile__rune"></span>
        <span class="adventure-map-tile__crenel"></span>
        ${t.floorInWorld<=3?`<span class="adventure-map-tile__ivy" aria-hidden="true"></span>`:``}
        ${x}
        ${S}
        <span class="adventure-map-tile__face">
          <span class="adventure-map-tile__num">${t.floorInWorld}</span>
          ${y}
        </span>
        <span class="adventure-map-tile__side adventure-map-tile__side--left"></span>
        <span class="adventure-map-tile__side adventure-map-tile__side--right"></span>
        <span class="adventure-map-tile__moss"></span>
      </span>`,r||(v.disabled=!0),v.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),pl(t.id))}),d?.appendChild(v)});let g=X(`adventure-floor-list`);if(g){g.classList.add(`adventure-floor-list--sr`),g.innerHTML=``;for(let t of p){let n=Se(e,t.id),r=s(e,t.id),i=t.id===m&&n,a=ue(e,t.id),o=document.createElement(`button`);o.type=`button`,o.className=`adventure-floor-row`,n||(o.disabled=!0),r&&o.classList.add(`adventure-floor-row--cleared`),i&&o.classList.add(`adventure-floor-row--next`),o.innerHTML=`
        <span class="adventure-floor-row__main">
          <span class="adventure-floor-row__title">${t.floorInWorld}. ${t.opponent}</span>
          <span class="adventure-floor-row__flavor">${t.flavor}</span>
        </span>
        ${i?`<span class="adventure-floor-row__badge">Next</span>`:``}
        ${a>0?`<span class="adventure-floor-row__stars">${be(a)}</span>`:``}`,o.addEventListener(`click`,()=>pl(t.id)),g.appendChild(o)}}let _=r.querySelector(`.adventure-map-tile--next`);rl(r),_&&requestAnimationFrame(()=>{requestAnimationFrame(()=>_.scrollIntoView({behavior:`smooth`,block:`nearest`}))});let v=g?.querySelector(`.adventure-floor-row--next`);v&&requestAnimationFrame(()=>v.scrollIntoView({behavior:`smooth`,block:`end`})),r.querySelector(`.adventure-challenge-toggle`)?.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.challengeMode=!e.challengeMode,U.adventure=e,w(U),ko(),ho.tap(),al()})}function ol(e){let t=me(e);if(!t||!Se(U.adventure,e))return;Fs=e,Gs();let n=X(`prebattle-title`),i=X(`prebattle-flavor`),a=X(`prebattle-opponent`);n&&(n.textContent=`Tower ${t.worldId} · Floor ${t.floorInWorld}`),i&&(i.textContent=t.flavor||``),a&&(a.textContent=`Loading…`);try{Is=v(U,e),w(U)}catch(e){console.error(`Enemy deck failed`,e),a&&(a.textContent=`Could not build enemy deck. Try again.`);return}a&&(a.textContent=`Review the enemy spell deck, then choose your grimoire below.`);let o=X(`prebattle-gem-hint`);if(o){let n=te(U.adventure,e);o.textContent=(s(U.adventure,e)?`Repeat clear: +${n} gems`:`First clear: +${n} gems`)+(t.worldId===5&&ee(U.adventure)?` · Challenge mode: enemy has an extra rank of pieces`:``)}let c=X(`enemy-deck-preview`);if(c){c.innerHTML=``;try{for(let{def:e,count:t}of ne(Is)){if(!e)continue;let n=document.createElement(`button`);n.type=`button`,n.className=`enemy-deck-spell-btn`,n.title=`View ${e.name}`;let r=document.createElement(`span`);if(r.className=`enemy-deck-spell-btn__name`,r.textContent=e.name,n.appendChild(r),t>1){let e=document.createElement(`span`);e.className=`enemy-deck-spell-btn__count`,e.textContent=`×${t}`,n.appendChild(e)}n.addEventListener(`click`,()=>Pa(e,{meta:t>1?`${t} copies in enemy deck`:`Enemy deck`})),c.appendChild(n)}}catch(e){console.error(`Enemy preview failed`,e),c.innerHTML=`<p class="empty-msg">Enemy deck preview unavailable.</p>`}}C(U)&&w(U);let l=fr(`adventure-deck-select`);if(!l){a&&(a.textContent=`Deck selector missing — hard refresh the page.`);return}l.innerHTML=``;let u=U.decks.filter(e=>r(e.cardIds,U).valid);if(!u.length){let e=document.createElement(`option`);e.value=``,e.textContent=`No complete decks — build one in Decks`,l.appendChild(e),l.disabled=!0,X(`btn-start-adventure`).disabled=!0;return}l.disabled=!1;let d=U.selectedDeckId&&u.some(e=>e.id===U.selectedDeckId)?U.selectedDeckId:u[0].id;for(let e of u){let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,e.id===d&&(t.selected=!0),l.appendChild(t)}U.selectedDeckId=d,X(`btn-start-adventure`).disabled=!1}async function sl(e,t,n,r,i=null,a=!1,s=void 0){let c=t.opponent;Qc(),Is=null,document.querySelectorAll(`.view`).forEach(e=>e.classList.add(`hidden`)),X(`view-match`)?.classList.remove(`hidden`);let l=X(`view-match`);if(!l)return;let{MatchSession:u,getMatchHtml:p}=await Yo();l.innerHTML=p(c);let m=s??(xe(r).id===5&&ee(U.adventure)),g={levelId:r,deckId:e.id,challengeMode:m},_={aiDeckIds:n,opponentName:c,cosmetics:o(U),profile:U,challengeMode:m,buildGameOverActions:({won:e,isTie:t})=>ll(g,{won:e,isTie:t}),onGameOverAction:e=>{ul(e,g,l)}};i&&(_.initialState=i);try{q=new u(e.cardIds,l,()=>{q=null,ar(),yo(),uo(`hub`),l.innerHTML=``,X(`view-match`)?.classList.add(`hidden`),Z(Xn()||`play`),js&&hl(),Ms&&gl()},e=>{let t=f(U,r,e),{gems:n,stars:i,starsGained:a}=t;return U.gems+=n,h(U,`adventure_floors`,1),d(U),w(U),$(),Xs(),r===1&&t.firstTime&&(js=!0,hl()),r===5&&t.firstTime&&(Ms=!0),{message:`+${n} gems! · Best: ${be(i)}`,starsGained:a}},_)}catch(e){throw q=null,l.innerHTML=``,X(`view-match`)?.classList.add(`hidden`),Z(`play`),e}rr({kind:`adventure`,deckId:e.id,deckCardIds:e.cardIds,aiDeckIds:n,opponentName:c,levelId:r,challengeMode:m}),await yo(),uo(`match`),a&&(q.winRewarded=!0),or(q),q.setMessage(``),q.render()}async function cl(){let e=sr();if(!e)return!1;let t=U.decks.find(t=>t.id===e.deckId)||U.decks.find(e=>e.cardIds?.length===30),n=e.levelId?me(e.levelId):null;return!t||t.cardIds.length!==30||!n||!e.aiDeckIds?.length||!await $e(`Resume your adventure match where you left off?`,{title:`Resume match?`,confirmLabel:`Resume`,cancelLabel:`Discard`})?(ir(),!1):(Fs=e.levelId,await sl(t,n,e.aiDeckIds,e.levelId,e.state,e.winRewarded,e.challengeMode),q?.setMessage(`Match resumed — pick up where you left off.`),!0)}function ll({levelId:e},{won:t,isTie:n}){let r=e+1,i=t&&r<=50&&Se(U.adventure,r);if(n)return[{id:`backToAdventure`,label:`Back to Adventure`,primary:!0}];if(t){let e=[];return i?(e.push({id:`nextFloor`,label:`Next floor`,primary:!0}),e.push({id:`retry`,label:`Retry floor`}),e.push({id:`backToAdventure`,label:`Back to Adventure`})):(e.push({id:`backToAdventure`,label:`Back to Adventure`,primary:!0}),e.push({id:`retry`,label:`Retry floor`})),e}return[{id:`retry`,label:`Retry floor`,primary:!0},{id:`backToAdventure`,label:`Back to Adventure`}]}async function ul(e,{levelId:t,deckId:n,challengeMode:r},i){let a=U.decks.find(e=>e.id===n);if(e===`backToAdventure`){q?.onExit?.();return}if(e===`retry`||e===`nextFloor`){let n=e===`nextFloor`?t+1:t,i=me(n);if(!a||a.cardIds.length!==30||!i){q?.onExit?.();return}q?.dispose(),q=null,ar(),await sl(a,i,v(U,n),n,null,!1,e===`retry`?r:void 0)}}function dl(){let e=fr(`adventure-deck-select`)?.value,t=U.decks.find(t=>t.id===e),n=Fs,r=n?me(n):null,i=Is?[...Is]:null;if(!t||t.cardIds.length!==30||!r||!i?.length){let e=X(`prebattle-opponent`);e&&(!t||t.cardIds.length!==30?e.textContent=`Build a complete 30-card deck in the Decks tab, then try again.`:e.textContent=`Could not start battle — close and pick the floor again.`);return}sl(t,r,i,n)}function fl(){if(window.__adventureMapCaptureBound)return;window.__adventureMapCaptureBound=!0;let e=null,t=!1,n=0,r=e=>e.closest?.(`#adventure-map .adventure-map-tile, #adventure-map .adventure-map-pin`),i=e=>e?.closest?.(`.adventure-map-scene`),a=()=>{t=!0,clearTimeout(n),n=setTimeout(()=>{t=!1},280)},o=(e,t)=>{if(!e||e.disabled)return;let n=Number(e.dataset.level);!Number.isFinite(n)||n<1||(t.preventDefault(),t.stopPropagation(),pl(n))};document.addEventListener(`pointerdown`,t=>{if(t.button!==0)return;let n=r(t.target);if(!n||n.disabled)return;let a=i(n);e={pin:n,pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,scrollTop:a?.scrollTop??0,scrollLeft:a?.scrollLeft??0,cancelled:!1}},!0),document.addEventListener(`pointermove`,t=>{if(!e||t.pointerId!==e.pointerId||e.cancelled)return;let n=t.clientX-e.startX,r=t.clientY-e.startY;Math.hypot(n,r)>12&&(e.cancelled=!0);let a=i(e.pin);a&&(Math.abs(a.scrollTop-e.scrollTop)>3&&(e.cancelled=!0),Math.abs(a.scrollLeft-e.scrollLeft)>3&&(e.cancelled=!0))},!0),document.addEventListener(`pointerup`,t=>{if(!e||t.pointerId!==e.pointerId)return;let{pin:n,cancelled:r}=e;if(e=null,r){a();return}o(n,t),a()},!0),document.addEventListener(`pointercancel`,t=>{!e||t.pointerId!==e.pointerId||(e=null,a())},!0),document.addEventListener(`click`,e=>{if(t){e.preventDefault(),e.stopPropagation();return}let n=r(e.target);!n||n.disabled||o(n,e)},!0)}function pl(e){let t=se(U.adventure);if(U.adventure=t,!Se(t,e)){qs(`Locked — beat global floor ${e-1} first, then return here.`,`Floor locked`);return}w(U),ol(e)}function ml(){Us(),window.addEventListener(`orientationchange`,Us),window.addEventListener(`resize`,Us),Js(),Za(),Ga(),wo(),po(),bo(),To(),Fa(),fl(),Hs(),document.querySelector(`.adventure-map-scene`)?.addEventListener(`scroll`,il,{passive:!0});let e;window.addEventListener(`resize`,()=>{clearTimeout(e),e=setTimeout(()=>{if(!document.body.classList.contains(`adventure-active`))return;let e=X(`adventure-map`);e&&rl(e)},120)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Qc()}),document.querySelectorAll(`.tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{ko(),ho.tap(),Z(e.dataset.tab)})}),document.querySelectorAll(`.vault-tab`).forEach(e=>{e.addEventListener(`click`,()=>{tr(),jc(e.dataset.vaultTab)})}),X(`btn-new-deck`)?.addEventListener(`click`,Zc),X(`btn-back-from-edit`)?.addEventListener(`click`,async()=>{await Hc()&&(Uc(),Cc(`list`))}),X(`btn-delete-deck`)?.addEventListener(`click`,async()=>{if(!G||G===`new`)return;let e=U.decks.find(e=>e.id===G);e&&await $e(`Delete "${e.name}"? This cannot be undone.`,{title:`Delete deck?`,confirmLabel:`Delete`,cancelLabel:`Keep`,destructive:!0})&&(de(U,e.id),Uc(),Cc(`list`))});let t=()=>{gs===`edit`&&Jc(),gs===`list`&&qc()};document.querySelectorAll(`.collection-owned-only-toggle`).forEach(e=>{e.addEventListener(`change`,e=>{xs=e.target.checked,uc(),t()})}),document.querySelectorAll(`.btn-reset-collection-filters`).forEach(e=>{e.addEventListener(`click`,()=>{ys=`all`,vs=``,bs=`all`,xs=!0,uc(),t()})}),uc(),pr(),X(`collection-search`)?.addEventListener(`input`,e=>{vs=e.target.value,t()}),fr(`collection-category`)?.addEventListener(`change`,e=>{bs=e.target.value,t()}),fr(`collection-rarity`)?.addEventListener(`change`,e=>{ys=e.target.value,t()}),X(`btn-clear-deck`)?.addEventListener(`click`,()=>{K=[],Jc()}),X(`btn-auto-finish-deck`)?.addEventListener(`click`,Vs),X(`btn-save-deck`)?.addEventListener(`click`,Yc),X(`btn-back-adventure`)?.addEventListener(`click`,Qc),X(`adventure-floor-backdrop`)?.addEventListener(`click`,Qc),X(`btn-start-adventure`)?.addEventListener(`click`,dl),fr(`adventure-deck-select`)?.addEventListener(`change`,e=>{U.selectedDeckId=e.target.value,w(U)});let n=document.getElementById(`auth-modal`),r=document.getElementById(`auth-header-btn`);$s(),Bn(`adventure-help-btn`,`adventure-help-desc`),Bn(`shop-help-btn`,`shop-help-desc`),Bn(`deck-help-btn`,`deck-help-desc`),Ds=sn({onSignIn:()=>Os?.open(`signin`,{forced:!0}),onSignUp:()=>Os?.open(`signup`,{forced:!0}),onGuest:()=>{Jt(),Sl()}}),Os=an({authBtn:r,modal:n,onNewAccount:()=>{U=_e()?pe():T(),bn(U,w)},onSignedIn:()=>{Yt(),U=T(),C(U),yn(U),$(),qc(),Ac(),Ds?.hide(),ec().then(()=>{W===`profile`&&nc(),W===`quests`&&cc(),W===`pvp`&&Es().then(e=>e?.render({resume:!0}))}),Es().then(e=>e?.render({resume:!0})),bl(),xl(),yl(),vl(),J||Z(W)},onSignedOut:()=>{Yt(),Qs(),Q=``,Zs(),ws?.dispose?.(),q=null,ar({clearCheckpoint:!0}),tr(),U=pe(),Xs(),$(),qc(),Ac(),Ds?.show(),Z(`deck`)}}),cr(()=>q),C(U),uc(),Xs(),Cl()}function hl(){if(!js||Ns!=null)return;let e=0,t=()=>{if(Ns=null,e+=1,js){if(Jn()){e<10&&(Ns=window.setTimeout(t,400));return}if(yn(U),yl()){js=!1;return}e<10&&(Ns=window.setTimeout(t,500))}};Ns=window.setTimeout(t,350)}function gl(){if(!Ms||Ps!=null)return;let e=0,t=()=>{if(Ps=null,e+=1,Ms){if(Jn()){e<10&&(Ps=window.setTimeout(t,400));return}if(yn(U),vl()){Ms=!1;return}e<10&&(Ps=window.setTimeout(t,500))}};Ps=window.setTimeout(t,350)}function _l(){return J||!on()||!g(U)||!On(U)?!1:(J=!0,cs().then(({startPvpTutorial:e})=>{e({profile:U,saveProfile:w,onComplete:()=>{J=!1,U=T(),C(U),Xs(),Z(`play`),vl()}})}),!0)}function vl(){return J||!on()||!m(U)||Cn(U)||wn(U)||Dn(U)||On(U)||!An(U)?!1:(J=!0,Z(`play`),cs().then(({startCosmeticsTutorial:e})=>{e({profile:U,saveProfile:w,onComplete:()=>{J=!1,U=T(),C(U),Xs(),Z(`play`)}})}),!0)}function yl(){return J||!on()||!g(U)?!1:(yn(U),Dn(U)?(J=!0,Z(`play`),cs().then(({startQuestsTutorial:e})=>{e({profile:U,saveProfile:w,onComplete:()=>{J=!1,U=T(),C(U),Xs(),_l(),vl()}})}),!0):_l())}function bl(){return J||!on()||!Cn(U)?!1:(J=!0,us().then(({startInteractiveTutorial:e})=>{e({profile:U,saveProfile:w,onComplete:()=>{J=!1,U=T(),C(U),$(),qc(),Ac(),xl()||Z(`deck`),yl(),vl()}})}),!0)}function xl(){return J||!on()||!wn(U)?!1:(J=!0,Z(`deck`),os().then(({startMetaTutorial:e})=>{e({profile:U,saveProfile:w,onComplete:()=>{J=!1,U=T(),C(U),$(),qc(),Ac(),Z(`deck`),yl(),vl()}})}),!0)}async function Sl(){Ds?.hide(),!bl()&&(xl()||yl()||vl()||J||(await cl()||await Z(`deck`),tr(),uo(`hub`)))}async function Cl(){try{if(await Le()){try{let e=await tn();e&&(U=e)}catch(e){console.warn(`Cloud sync on load failed`,e)}C(U),$(),qc(),Ac()}}catch(e){console.warn(`Auth init failed`,e)}if(yn(U),await ec(),ws&&ws.render(),tr(),cn()){Ds?.show();return}await Sl()}ml(),E(async()=>{let{registerSW:e}=await import(`./virtual_pwa-register-CpSsV7JG.js`);return{registerSW:e}},[],import.meta.url).then(({registerSW:e})=>{e({immediate:!0})}),et(),it();export{tr as A,Wt as B,ir as C,rr as D,Xn as E,Sn as F,qe as G,Ct as H,En as I,Tn as L,Bn as M,kn as N,ar as O,xn as P,jn as R,dr as S,$n as T,gt as U,_t as V,$e as W,Ba as _,Po as a,Oa as b,Bo as c,Wo as d,yo as f,Xa as g,H as h,Ro as i,or as j,Jn as k,Io as l,uo as m,qo as n,Fo as o,fo as p,Ao as r,zo as s,Ko as t,Ho as u,Ia as v,Zn as w,gr as x,Pa as y,Xt as z};