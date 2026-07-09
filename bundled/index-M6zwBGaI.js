const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./spell-visuals-D4K75gZk.css","./chess-theme-D039pXxE.css","./settings-C2qefs18.css"])))=>i.map(i=>d[i]);
import{n as e,o as t,t as n}from"./cardCatalog-CkqiHXhM.js";import{c as r,i,r as a}from"./deckRules-CoHxIYsM.js";import{A as o,Ct as s,D as c,Dt as l,Et as u,N as d,Ot as f,R as p,St as m,Tt as h,V as g,W as ee,_t as _,a as v,at as y,bt as b,c as x,ct as S,d as C,dt as te,f as w,ft as ne,g as re,gt as ie,ht as ae,i as oe,k as se,kt as ce,l as le,lt as ue,m as T,mt as de,o as fe,ot as pe,p as me,pt as he,r as ge,s as _e,st as ve,t as ye,u as E,ut as be,vt as xe,wt as Se,xt as Ce,yt as we}from"./storage-pWQabooI.js";import{l as Te,p as Ee,r as De}from"./mageTitles-BPvsmJqw.js";import{t as D}from"./preload-helper-CV77j2BA.js";import{_ as Oe,a as ke,c as Ae,d as je,f as Me,h as Ne,l as Pe,m as Fe,o as O,s as Ie,t as Le}from"./auth-HnOlEHDj.js";var Re=Object.defineProperty,ze=(e,t)=>{let n={};for(var r in e)Re(n,r,{get:e[r],enumerable:!0});return t||Re(n,Symbol.toStringTag,{value:`Module`}),n};function Be(){let e=window.visualViewport;return e?Math.max(0,Math.round(e.offsetTop)):0}function Ve(){let e=window.visualViewport;return e?Math.max(0,Math.round(window.innerHeight-e.offsetTop-e.height)):0}function He(){let e=document.documentElement,t=()=>{e.style.setProperty(`--viewport-inset-top`,`${Be()}px`),e.style.setProperty(`--viewport-inset-bottom`,`${Ve()}px`)};t(),window.visualViewport?.addEventListener(`resize`,t),window.visualViewport?.addEventListener(`scroll`,t),window.addEventListener(`resize`,t),window.addEventListener(`orientationchange`,t)}He();var Ue=1100,We=120;function Ge(){let e=document.getElementById(`app-splash`);if(!e||e.classList.contains(`app-splash--hide`))return;e.classList.add(`app-splash--hide`),document.body.classList.remove(`splash-active`);let t=()=>{e.remove()};e.addEventListener(`transitionend`,t,{once:!0}),window.setTimeout(t,600)}function Ke(){Ge()}function qe(){let e=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?We:Ue,t=performance.now(),n=()=>{let n=performance.now()-t,r=Math.max(0,e-n);window.setTimeout(Ge,r)};document.readyState===`interactive`||document.readyState===`complete`?n():document.addEventListener(`DOMContentLoaded`,n,{once:!0})}document.body.classList.add(`splash-active`),qe();var Je=`(max-width: 768px)`,Ye=null;function Xe(){return document.getElementById(`mobile-confirm`)}function Ze(e){let t=Xe();if(!t)return;t.classList.add(`hidden`),document.body.classList.remove(`mobile-confirm-open`);let n=Ye;Ye=null,n?.(e)}function Qe(e,t={}){if(!window.matchMedia(Je).matches)return Promise.resolve(window.confirm(e));let n=Xe();if(!n)return Promise.resolve(window.confirm(e));let{title:r=`Confirm`,confirmLabel:i=`OK`,cancelLabel:a=`Cancel`,destructive:o=!1}=t;return new Promise(t=>{Ye&&Ze(!1),Ye=t,n.querySelector(`#mobile-confirm-title`).textContent=r,n.querySelector(`#mobile-confirm-body`).textContent=e;let s=n.querySelector(`#mobile-confirm-ok`),c=n.querySelector(`#mobile-confirm-cancel`);s.textContent=i,c.textContent=a,s.classList.toggle(`btn-danger`,o),s.classList.toggle(`btn-primary`,!o),n.classList.remove(`hidden`),document.body.classList.add(`mobile-confirm-open`),c.focus()})}function $e(){let e=Xe();!e||e.dataset.bound||(e.dataset.bound=`1`,e.querySelector(`#mobile-confirm-ok`)?.addEventListener(`click`,()=>Ze(!0)),e.querySelector(`#mobile-confirm-cancel`)?.addEventListener(`click`,()=>Ze(!1)),e.querySelector(`[data-mobile-confirm-backdrop]`)?.addEventListener(`click`,()=>Ze(!1)))}var et=`cc_install_banner_dismissed`;function tt(){return window.matchMedia(`(display-mode: standalone)`).matches||window.navigator.standalone===!0}function nt(){let e=window.navigator.userAgent;return/iphone|ipad|ipod/i.test(e)&&!/crios|fxios/i.test(e)}function rt(){if(tt()||localStorage.getItem(et)===`1`)return;let e=document.getElementById(`install-banner`);if(!e)return;let t=null,n=()=>{e.classList.remove(`hidden`),document.body.classList.add(`install-banner-visible`)},r=()=>{e.classList.add(`hidden`),document.body.classList.remove(`install-banner-visible`)};window.addEventListener(`beforeinstallprompt`,r=>{r.preventDefault(),t=r,e.querySelector(`#install-banner-ios-hint`)?.classList.add(`hidden`),e.querySelector(`.install-banner__hint--default`)?.classList.remove(`hidden`),e.querySelector(`#install-banner-btn`)?.classList.remove(`hidden`),n()}),nt()&&(e.querySelector(`#install-banner-ios-hint`)?.classList.remove(`hidden`),e.querySelector(`.install-banner__hint--default`)?.classList.add(`hidden`),e.querySelector(`#install-banner-btn`)?.classList.add(`hidden`),window.setTimeout(n,2500)),e.querySelector(`#install-banner-btn`)?.addEventListener(`click`,async()=>{t&&(t.prompt(),await t.userChoice,t=null,r())}),e.querySelector(`#install-banner-dismiss`)?.addEventListener(`click`,()=>{localStorage.setItem(et,`1`),r()})}var it=[`attack`,`control`,`defense`,`movement`,`trap`,`special`],at={attack:`Attack`,control:`Control`,defense:`Defense`,movement:`Movement`,trap:`Trap`,special:`Special`},ot={aegis:`defense`,anchor:`defense`,backpedal:`control`,backstab:`attack`,backstep:`movement`,barrier:`defense`,bishops_mark:`movement`,blind:`control`,blizzard:`control`,snowball:`control`,berserk:`movement`,bomb:`attack`,shockwave:`control`,plague:`control`,bulwark:`defense`,create_foe:`special`,call_forward:`movement`,chain_lightning:`attack`,clone:`special`,coin_flip:`attack`,collapse:`special`,confusion:`control`,constitution:`defense`,counterspell:`trap`,crown:`special`,cryo_bolt:`attack`,cull:`attack`,darkness:`defense`,dash:`movement`,deep_freeze:`control`,deflect:`trap`,demote:`control`,deport:`movement`,displacement:`movement`,dominion:`special`,duel:`attack`,earthquake:`special`,execution:`attack`,pyromancy:`attack`,fusion:`special`,hibernation:`special`,hostile_swap:`movement`,ignore:`special`,iron_will:`defense`,landmine:`trap`,last_king:`special`,bounty:`special`,link_fate:`special`,last_stand:`trap`,leapfrog:`movement`,long_step:`movement`,magnet:`movement`,nudge:`movement`,offering:`special`,panic:`control`,poison:`attack`,mind_control:`special`,press:`control`,purify:`special`,quick_march:`movement`,quicksand:`trap`,rally:`defense`,recall:`movement`,repel:`movement`,random_teleport:`movement`,retreat:`movement`,revive:`defense`,rooks_mark:`movement`,root:`control`,sacrifice:`attack`,sanctuary:`defense`,scatter:`movement`,shadow_swap:`movement`,sidestep:`movement`,shatter:`attack`,snipe:`attack`,snowball:`control`,stab:`attack`,stall:`defense`,tangle:`control`,teleport:`movement`,trickster:`special`,vengeance:`trap`,ward:`defense`};function st(e){let t=ot[e?.id];if(t)return t;let n=`${e?.id||``} ${e?.effect||``} ${e?.name||``} ${e?.desc||``}`.toLowerCase();return/trap|mine|quicksand|counterspell|vengeance|last.?stand/.test(n)?`trap`:/shield|ward|aegis|sanctuary|barrier|anchor|deflect|stall|iron_will|rally|darkness/.test(n)?`defense`:/move|nudge|teleport|recall|leap|step|displace|swap|scatter|retreat|bishop|rook|overrun|promote|pull|push|shift|earthquake|magnet|repel/.test(n)?`movement`:/freeze|blind|confusion|hex|root|panic|press|silence|paraly|control|cannot play|random|mark|poison|die in \d+ turn/.test(n)?`control`:/\bdestroy\b|\bkills?\b|fireball|bolt|stab|snipe|duel|sacrifice|execution|shatter|cull|lightning/.test(n)?`attack`:`special`}var ct=[{id:`bronze`,name:`Bronze Chest`,cost:25,cards:3,weights:{common:70,uncommon:25,rare:5,epic:0}},{id:`silver`,name:`Silver Chest`,cost:50,cards:5,weights:{common:50,uncommon:35,rare:12,epic:3}},{id:`gold`,name:`Gold Chest`,cost:100,cards:8,weights:{common:32,uncommon:38,rare:22,epic:6,legendary:2}}];function lt(e){let t=Math.random()*100,n=0;for(let r of[`common`,`uncommon`,`rare`,`epic`,`legendary`])if(n+=e[r]||0,t<=n)return r;return`common`}function ut(t){let n=e().filter(e=>e.rarity===t);return n.length?n[Math.floor(Math.random()*n.length)]:e()[0]}function dt(e,t){return ut(lt(t.weights))}function ft(e,n,r={}){let{starRefundChance:i=0}=r;if(oe(e,n.id)<t(n))return ye(e,n.id,1),{...n,duplicate:!1};let a=p[n.rarity]||5;if(i>0&&Math.random()<i){let e=Math.random()<.5?1:2;return{...n,duplicate:!0,starRefund:e}}return{...n,duplicate:!0,gemRefund:a}}function pt(e,t){let n=ct.find(e=>e.id===t);if(!n)return{success:!1,message:`Unknown chest.`};if(e.gems<n.cost)return{success:!1,message:`Not enough gems.`};e.gems-=n.cost;let r=[],i=0;for(let t=0;t<n.cards;t++){let t=ft(e,dt(e,n));r.push(t),t.gemRefund&&(i+=t.gemRefund)}return i&&(e.gems+=i),y(e,`boxes_opened`,1),T(e),{success:!0,pulls:r,chest:n,bonusGems:i}}var mt=[`common`,`uncommon`,`rare`,`epic`,`legendary`];function ht(e,{minPct:t=1}={}){return mt.filter(n=>(e[n]??0)>=t).map(t=>`${e[t]}% ${t}`).join(` · `)}var gt={bronze:{label:`Bronze`,tagline:`Mostly common cards`,accent:`#cd7f32`,glow:`rgba(205, 127, 50, 0.45)`},silver:{label:`Silver`,tagline:`Balanced card mix`,accent:`#a8b8d8`,glow:`rgba(168, 184, 216, 0.5)`},gold:{label:`Gold`,tagline:`Higher rare & epic odds`,accent:`#e8c547`,glow:`rgba(232, 197, 71, 0.55)`}};function _t(e){let t=gt[e]||gt.bronze;return{t,lid:e===`gold`?`#f5e6a8`:e===`silver`?`#e8eef8`:`#d4954a`,body:e===`gold`?`#7a5c12`:e===`silver`?`#4a5568`:`#5c3a1e`,trim:e===`gold`?`#ffe566`:e===`silver`?`#c8d8f0`:t.accent}}function vt(e,t){let{lid:n,body:r,trim:i}=_t(e);return`
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
    </defs>`}function yt(e,t){return`
    <rect x="24" y="58" width="72" height="4" rx="1" fill="url(#${e}-band)" opacity="0.85"/>
    <rect x="24" y="68" width="72" height="3" rx="1" fill="${t}" opacity="0.35"/>
    <circle cx="28" cy="60" r="2" fill="#1a1208"/>
    <circle cx="92" cy="60" r="2" fill="#1a1208"/>
    <circle cx="28" cy="69" r="1.5" fill="#1a1208" opacity="0.8"/>
    <circle cx="92" cy="69" r="1.5" fill="#1a1208" opacity="0.8"/>`}function bt(e,t,n){return`${e===`bronze`?`<path d="M58 30 L60 34 L64 34 L61 37 L62 41 L58 39 L54 41 L55 37 L52 34 L56 34 Z" fill="${t}" opacity="0.7"/>`:`<path d="M60 24 L64 32 L72 32 L66 37 L68 45 L60 40 L52 45 L54 37 L48 32 L56 32 Z" fill="${t}" opacity="0.9" filter="url(#${n}-glow)"/>`}${e===`gold`?`<circle cx="60" cy="32" r="5" fill="url(#${n}-gemFill)" filter="url(#${n}-gemGlow)"/>
         <circle cx="60" cy="32" r="8" fill="none" stroke="${t}" stroke-width="1" opacity="0.6"/>`:e===`silver`?`<rect x="56" y="28" width="8" height="8" rx="1" transform="rotate(45 60 32)" fill="url(#${n}-gemFill)" filter="url(#${n}-gemGlow)"/>`:``}${e===`gold`?`<path d="M34 30 L38 26 M38 30 L34 26 M82 30 L86 26 M86 30 L82 26" stroke="${t}" stroke-width="1" opacity="0.5"/>`:``}`}function xt(e,t,n,r){let i=r?`<g class="chest-stage__interior">
        <rect x="26" y="46" width="68" height="36" rx="2" fill="url(#${e}-inner)" opacity="0"/>
      </g>`:``,a=r?` class="chest-stage__lid"`:``,o=r?` class="chest-stage__body"`:``,s=bt(n,t,e);return`
    ${i}
    <g${o}>
      <rect x="22" y="42" width="76" height="44" rx="5" fill="url(#${e}-body)" stroke="${t}" stroke-width="2"/>
      ${yt(e,t)}
      <rect x="52" y="48" width="16" height="18" rx="3" fill="url(#${e}-band)" stroke="${t}" stroke-width="1"/>
      <circle cx="60" cy="57" r="3.5" fill="#1a1208" stroke="${t}" stroke-width="1"/>
      <ellipse cx="60" cy="55" rx="2" ry="1" fill="${t}" opacity="0.25"/>
    </g>
    <g${a}>
      <path d="M16 42 L60 18 L104 42 Z" fill="url(#${e}-lid)" stroke="${t}" stroke-width="2" filter="url(#${e}-glow)"/>
      <path d="M22 42 L60 22 L98 42" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      ${s}
    </g>`}function St(e){let{trim:t}=_t(e),n=`chestStage-${e}`;return`<svg class="chest-stage-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${vt(e,n)}
    <ellipse class="chest-stage__shadow" cx="60" cy="90" rx="44" ry="9" fill="rgba(0,0,0,0.5)"/>
    ${xt(n,t,e,!0)}
  </svg>`}function Ct(e){let{trim:t}=_t(e),n=`chestCard-${e}`;return`<svg class="chest-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${vt(e,n)}
    <ellipse cx="60" cy="90" rx="44" ry="9" fill="rgba(0,0,0,0.5)"/>
    ${xt(n,t,e,!1)}
  </svg>`}var wt={accent:`#c4b5fd`,glow:`rgba(167, 139, 250, 0.55)`,body:`#2a1848`,bodyHi:`#4c2d7a`,lid:`#6b46c1`,trim:`#e9d5ff`,gold:`#fbbf24`,gemSpell:`#7dd3fc`,gemCosmetic:`#f0abfc`},Tt={accent:`#fde68a`,glow:`rgba(251, 191, 36, 0.6)`,body:`#3d2810`,bodyHi:`#6b4420`,lid:`#b45309`,trim:`#fef3c7`,gold:`#fcd34d`,gemSpell:`#38bdf8`,gemCosmetic:`#e879f9`};function Et(e,t){let{body:n,bodyHi:r,lid:i,trim:a,gold:o,gemSpell:s,gemCosmetic:c,glow:l}=e;return`
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
    </defs>`}function Dt(e,t,n,r,i=1){return`
    <g transform="translate(${e} ${t}) scale(${n})" opacity="${i}">
      <path d="M0 -8 C4 -8 6 -5 6 -2 C6 1 3 2 2 5 L-2 5 C-1 1 2 0 2 -2 C2 -4 0 -5 -2 -5 C-4 -5 -5 -3 -5 -1" fill="none" stroke="${r}" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="0" cy="9" r="2" fill="${r}"/>
    </g>`}function k(e,t,n,r,i=.9){return`<path d="M${e} ${t-n} L${e+n*.28} ${t-n*.28} L${e+n} ${t} L${e+n*.28} ${t+n*.28} L${e} ${t+n} L${e-n*.28} ${t+n*.28} L${e-n} ${t} L${e-n*.28} ${t-n*.28} Z" fill="${r}" opacity="${i}"/>`}function Ot(e,t){let{trim:n,gold:r}=t;return`
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
      ${Dt(60,36,1.1,n,.95)}
      ${k(34,30,4,r,.7)}
      ${k(86,32,3.5,n,.55)}
      ${k(60,18,3,r,.85)}
    </g>`}function kt(e,t){let{trim:n,gold:r}=t;return`
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
      ${Dt(60,30,1.35,n)}
      ${k(24,24,5,r,.9)}
      ${k(96,26,4.5,n,.75)}
      ${k(60,6,4,r,1)}
      ${k(42,14,3,n,.6)}
      ${k(78,14,3,r,.65)}
      ${k(48,86,3.5,r,.8)}
      ${k(72,86,3.5,r,.8)}
    </g>`}function At(e){let t=e===`big`,n=t?Tt:wt,r=t?`mysteryBig`:`mysterySmall`,i=t?kt(r,n):Ot(r,n);return`<svg class="mystery-box-svg ${t?`mystery-box-svg--big`:`mystery-box-svg--small`}" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${Et(n,r)}
    ${i}
  </svg>`}function jt(){return At(`small`)}var Mt={accent:`#fde68a`,glow:`rgba(251, 191, 36, 0.55)`,body:`#2a1a10`,bodyHi:`#4a3020`,lid:`#92400e`,trim:`#fef3c7`,gold:`#fbbf24`,scroll:`#fff7ed`};function Nt(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Pt(e){let t=e.length;return t>12?4.2:t>9?4.8:t>7?5.4:6.2}function Ft(e,t){if(!e)return`<path d="M44 32 H76 M44 36 H72 M44 40 H68" stroke="${t}" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>`;let n=Nt(e);return`<text x="60" y="41" text-anchor="middle" font-size="${Pt(e)}" font-weight="700" fill="${t}" font-family="serif">${n}</text>`}function It(e,t){let{body:n,bodyHi:r,lid:i,trim:a,gold:o,glow:s}=t;return`
    <defs>
      <linearGradient id="${e}-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${r}"/>
        <stop offset="45%" stop-color="${n}"/>
        <stop offset="100%" stop-color="#0c0618"/>
      </linearGradient>
      <linearGradient id="${e}-lid" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${i}"/>
        <stop offset="55%" stop-color="${r}"/>
        <stop offset="100%" stop-color="${n}"/>
      </linearGradient>
      <radialGradient id="${e}-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${s}"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="${e}-inner" cx="50%" cy="35%" r="70%">
        <stop offset="0%" stop-color="${o}" stop-opacity="0.95"/>
        <stop offset="60%" stop-color="${a}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0a0610" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${e}-band" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${o}"/>
        <stop offset="100%" stop-color="${r}"/>
      </linearGradient>
      <filter id="${e}-glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`}function Lt(e,t,{forStage:n=!1,titleDisplay:r=``}={}){let{bodyHi:i,trim:a,gold:o,scroll:s}=t;return`
    ${n?`<g class="chest-stage__interior">
        <rect x="28" y="48" width="64" height="32" rx="3" fill="url(#${e}-inner)" opacity="0"/>
        <circle cx="60" cy="58" r="14" fill="url(#${e}-inner)" opacity="0"/>
      </g>`:``}
    <g${n?` class="chest-stage__body"`:``}>
      <rect x="26" y="48" width="68" height="38" rx="6" fill="url(#${e}-body)" stroke="${a}" stroke-width="2"/>
      <rect x="30" y="58" width="60" height="4" rx="1" fill="url(#${e}-band)" opacity="0.9"/>
      <rect x="52" y="54" width="16" height="16" rx="3" fill="url(#${e}-band)" stroke="${a}" stroke-width="1"/>
      <circle cx="60" cy="62" r="3.5" fill="#1a0f08" stroke="${o}" stroke-width="1"/>
    </g>
    <g${n?` class="chest-stage__lid"`:``}>
      <path d="M18 48 L60 24 L102 48 Z" fill="url(#${e}-lid)" stroke="${a}" stroke-width="2" filter="url(#${e}-glow)"/>
      <rect x="22" y="44" width="76" height="5" rx="1" fill="url(#${e}-band)" opacity="0.75"/>
      <rect x="42" y="28" width="36" height="22" rx="2" fill="${s}" stroke="${o}" stroke-width="1.5" filter="url(#${e}-glow)"/>
      ${Ft(r,i)}
      <text x="60" y="24" text-anchor="middle" font-size="7" font-weight="700" fill="${o}" font-family="serif">T</text>
      ${k(34,30,4,o,.7)}
      ${k(86,32,3.5,a,.55)}
      ${k(60,14,3,o,.85)}
    </g>`}function Rt(e=``){let t=`titleBoxStage`,n=Mt;return`<svg class="chest-stage-svg mystery-box-svg mystery-box-svg--title" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${It(t,n)}
    <ellipse class="chest-stage__shadow" cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${t}-aura)" opacity="0.55"/>
    ${Lt(t,n,{forStage:!0,titleDisplay:e})}
  </svg>`}function zt(){return Bt()}function Bt(){let e=`titleBox`,t=Mt;return`<svg class="mystery-box-svg mystery-box-svg--title" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${It(e,t)}
    <ellipse cx="60" cy="92" rx="40" ry="8" fill="rgba(0,0,0,0.45)"/>
    <circle cx="60" cy="52" r="46" fill="url(#${e}-aura)" opacity="0.55"/>
    <g class="mystery-box-svg__float">
      ${Lt(e,t)}
    </g>
  </svg>`}function Vt(){return jt()}var Ht=.5,Ut=.1,Wt=[{id:`bronze`,name:`Bronze Chest`,cards:3,weights:{common:70,uncommon:25,rare:5,epic:0}},{id:`silver`,name:`Silver Chest`,cards:5,weights:{common:50,uncommon:35,rare:12,epic:3}},{id:`gold`,name:`Gold Chest`,cards:8,weights:{common:32,uncommon:38,rare:22,epic:6,legendary:2}}],Gt=[{id:`bronze`,name:`Bronze Cosmetic Box`,pulls:3,weights:{common:70,uncommon:25,rare:5,epic:0}},{id:`silver`,name:`Silver Cosmetic Box`,pulls:5,weights:{common:50,uncommon:35,rare:12,epic:3}},{id:`gold`,name:`Gold Cosmetic Box`,pulls:8,weights:{common:32,uncommon:38,rare:22,epic:6,legendary:2}}];function Kt(e,{premium:t=!1}={}){let n=Math.random()*100;return t?n>50?e[2]:n>15?e[1]:e[0]:n>70?e[2]:n>35?e[1]:e[0]}function qt(e){if((e.stars??0)<10)return{success:!1,message:`Not enough stars.`};e.stars=(e.stars??0)-10;let t=m(e),n=[],r=[],i=0,a=0;for(let o=0;o<6;o++)if(t&&Math.random()<.5){let t=g(e,Kt(Gt).weights);t&&(r.push(t),t.duplicate&&(i+=t.gemRefund||5))}else{let t=ft(e,dt(e,Kt(Wt)),{starRefundChance:Ut});n.push(t),t.gemRefund&&(i+=t.gemRefund),t.starRefund&&(a+=t.starRefund)}return i&&(e.gems=(e.gems||0)+i),a&&(e.stars=(e.stars??0)+a),y(e,`boxes_opened`,1),T(e),{success:!0,kind:n.length&&r.length?`mixed`:n.length?`card`:`cosmetic`,cardPulls:n,cosPulls:r,bonusGems:i,bonusStars:a,message:`Got ${n.length} spells and ${r.length} cosmetics`}}function Jt(e){if((e.stars??0)<10)return{success:!1,message:`Not enough stars.`};e.stars=(e.stars??0)-10;let t=De.filter(t=>!Te(e,t.id)),n,r=0;if(t.length){let r=t[Math.floor(Math.random()*t.length)];Ee(e,r.id),n={...r,duplicate:!1}}else{let t=De[Math.floor(Math.random()*De.length)];r=3,e.stars=(e.stars??0)+r,n={...t,duplicate:!0,starRefund:r}}return y(e,`boxes_opened`,1),T(e),{success:!0,kind:`title`,pulls:[n],bonusStars:r,message:n.duplicate?`Duplicate ${n.name} — +${r} ★ refunded`:`Unlocked title: ${n.name}`}}var Yt=`arcane_checkers_guest_mode_v1`,Xt=`Sign in to save progress / play PvP`,Zt=`Sign in to save progress`;function Qt(){return $t()&&!O()}function $t(){try{return localStorage.getItem(Yt)===`1`}catch{return!1}}function en(){try{localStorage.setItem(Yt,`1`)}catch{}}function tn(){try{localStorage.removeItem(Yt)}catch{}}var nn=ze({pullCloudProfile:()=>cn,scheduleCloudSave:()=>ln}),rn=null;function an(e){if(!e||typeof e!=`object`)return!0;let t=Object.keys(e);if(t.length===0||t.every(e=>e===`loginEmail`||e===`login_email`||e===`savedAt`))return!0;let n=e.collection&&Object.keys(e.collection).length>0,r=Array.isArray(e.decks)&&e.decks.length>0,i=e.adventure?.cleared,a=(Array.isArray(i)?i.length:Object.keys(i||{}).length)>0,o=typeof e.gems==`number`||typeof e.stars==`number`,s=typeof e.pvpWins==`number`&&e.pvpWins>0||typeof e.spellsPlayed==`number`&&e.spellsPlayed>0;return!(n||r||a||o||s)}function on(e){return w(e),T(e,{bumpTimestamp:!1}),e}function sn(e,t){let n=_e();return!(n!==e&&n!==null||n===null&&$t()&&t&&!an(t))}async function cn(){let e=O();if(!e||!Ae())return null;let t=await ke(e.id),n=C(),r=t?.profile_json,i=sn(e.id,r);if(!r||typeof r!=`object`||an(r)){if(!le(n)&&i)on(n);else if(!le(n)&&!i)return on(me());return C()}if(le(n)||!i){let e={...r};return i&&se(e,n),o(e),on(e)}return(r.savedAt||0)>=(n.savedAt||0)?on(d(n,r)):(se(n,r),T(n),n)}function ln(e){let t=O();!t||!Ae()||(clearTimeout(rn),rn=setTimeout(async()=>{try{await Oe(t.id,{profile_json:e,display_name:t.user_metadata?.display_name||t.email?.split(`@`)[0]})}catch(e){console.warn(`Cloud save failed`,e)}},800))}var un=Le;function dn({authBtn:e,modal:t,onSignedIn:n,onSignedOut:r,onNewAccount:i}){if(!e||!t)return;let a=t.querySelector(`#auth-form`),o=t.querySelector(`#auth-modal-title`),s=t.querySelector(`#auth-toggle-mode`),c=t.querySelector(`#auth-error`),l=t.querySelector(`#auth-username-hint`),u=t.querySelector(`#auth-close`),d=t.querySelector(`.auth-modal-backdrop`),f=a?.querySelector(`button[type="submit"]`),p=`signin`,m=null,h=!1,g=!1;function ee(){a?.querySelectorAll(`.auth-field-signup`).forEach(e=>{e.classList.toggle(`hidden`,p!==`signup`)});let e=a?.querySelector(`#auth-identifier`),t=a?.querySelector(`label[for="auth-identifier"]`);t&&(t.textContent=p===`signup`?`Email`:`Username or email`),e&&(e.placeholder=p===`signup`?`you@email.com`:`username or email`,e.type=p===`signup`?`email`:`text`,e.autocomplete=p===`signup`?`email`:`username`),f&&(f.textContent=p===`signup`?`Create account`:`Sign in`),l&&(l.textContent=``),l?.classList.remove(`auth-username-hint--ok`,`auth-username-hint--bad`)}function _(e){c&&(c.textContent=e||``)}function v(e,t=``){l&&(l.textContent=e||``,l.classList.remove(`auth-username-hint--ok`,`auth-username-hint--bad`),t===`ok`&&l.classList.add(`auth-username-hint--ok`),t===`bad`&&l.classList.add(`auth-username-hint--bad`))}async function y(){if(p!==`signup`)return;let e=a?.querySelector(`#auth-username`)?.value?.trim();if(!e){v(``);return}if(!un.test(e)){v(`3–24 letters, numbers, or underscore`,`bad`);return}if(v(`Checking…`),!await Pe(e)){let t=await Ne(e);v(t?`Taken — try "${t}"`:`That username is taken`,`bad`),t&&l&&(l.dataset.suggestion=t);return}l&&delete l.dataset.suggestion,v(`Available`,`ok`)}function b(e,n={}){if(h=!!n.forced,!Ae()){_(`Add Supabase anon key in js/supabaseConfig.js`),t.classList.remove(`hidden`),u?.classList.toggle(`hidden`,h);return}p=e||p,o&&(o.textContent=p===`signup`?`Create account`:`Sign in`),s&&(s.textContent=p===`signup`?`Already have an account? Sign in`:`Need an account? Sign up`),_(``),ee(),u?.classList.toggle(`hidden`,h),d?.classList.toggle(`auth-modal-backdrop--locked`,h),t.classList.remove(`hidden`)}function x(){h||(t.classList.add(`hidden`),_(``),v(``))}function S(t){if(e){if(!Ae()){e.textContent=`Setup cloud`,e.title=`Configure Supabase`,e.classList.remove(`hidden`),e.hidden=!1;return}t?(e.classList.add(`hidden`),e.hidden=!0):(e.textContent=`Sign in`,e.title=`Sign in or sign up`,e.classList.remove(`hidden`),e.hidden=!1)}}e.addEventListener(`click`,()=>{O()||b(`signin`)}),s?.addEventListener(`click`,e=>{e.preventDefault(),p=p===`signup`?`signin`:`signup`,b(p)}),u?.addEventListener(`click`,x),d?.addEventListener(`click`,()=>{h||x()});let C=a?.querySelector(`#auth-username`);C?.addEventListener(`input`,()=>{clearTimeout(m),m=setTimeout(()=>{y().catch(()=>v(``))},350)}),l?.addEventListener(`click`,()=>{let e=l?.dataset?.suggestion;!e||!C||(C.value=e,delete l.dataset.suggestion,y().catch(()=>{}))}),a?.addEventListener(`submit`,async e=>{e.preventDefault(),_(``);let t=a.querySelector(`#auth-identifier`)?.value?.trim(),r=a.querySelector(`#auth-username`)?.value?.trim(),o=a.querySelector(`#auth-password`)?.value;if(!t||!o){_(p===`signup`?`Email and password required.`:`Username or email and password required.`);return}f&&(f.disabled=!0),g=!0;try{if(p===`signup`){if(!t.includes(`@`)){_(`Use your email address to sign up.`);return}if(!r||!un.test(r)){_(`Choose a username (3–24 letters, numbers, underscore).`);return}let e=r;if(!await Pe(e)){let t=await Ne(e);if(t){_(`"${e}" is taken. Try "${t}" or tap the hint below.`),v(`Tap to use "${t}"`,`bad`),l&&(l.dataset.suggestion=t);return}_(`Username "${e}" is already taken. Pick another.`);return}i?.();let a=(await Fe(t,o,e,e)).session?.user??O();if(a){let r=await ke(a.id),i=r?.profile_json&&typeof r.profile_json==`object`?{...r.profile_json}:{};i.loginEmail=t.toLowerCase();try{await Oe(a.id,{username:e,display_name:e,profile_json:i})}catch(t){if((t?.code||t?.details?.code)===`23505`){let t=await Ne(e);_(t?`Account created but "${e}" was taken. Sign in and change your name to "${t}", or try sign up again with that username.`:`Account created but that username was just taken. Sign in with your email and pick another name in Profile.`),p=`signin`,b(`signin`);return}throw t}try{await cn()}catch(e){console.warn(`Profile sync after signup failed`,e)}n?.(),h=!1,u?.classList.remove(`hidden`),d?.classList.remove(`auth-modal-backdrop--locked`),x();return}_(`Account created. Check your email to confirm, then sign in.`),p=`signin`,b(`signin`);return}await Me(t,o);let e=O();if(!e){_(`Sign-in failed — no session returned. Try again or confirm your email.`);return}try{await cn()}catch(e){console.warn(`Profile sync after sign-in failed`,e)}n?.(),h=!1,u?.classList.remove(`hidden`),d?.classList.remove(`auth-modal-backdrop--locked`),S(e),x()}catch(e){let t=e?.message||`Authentication failed`;if(t.includes(`Database error saving new user`)||t.includes(`username_taken`)||e?.code===`23505`){let e=r&&un.test(r)?await Ne(r):null;t=e?`Sign-up failed (username conflict). Try "${e}" instead.`:`Sign-up failed on the server. Try a different username, or sign in if you already have an account.`}else t.includes(`over_email_send_rate_limit`)||t.includes(`rate limit`)?t=`Too many sign-up attempts. Wait a few minutes or sign in with an existing account.`:t.includes(`User already registered`)&&(t=`That email is already registered. Try Sign in instead.`);t.includes(`Invalid login credentials`)?_(`Wrong email/username or password.`):t.includes(`Email not confirmed`)?_(`Confirm your email first (check inbox), or disable email confirmation in Supabase for testing.`):_(t)}finally{g=!1,f&&(f.disabled=!1)}});let te=!1;return je(async e=>{if(S(e),e){if(te=!0,g)return;try{await cn()}catch(e){console.warn(`Profile sync failed`,e)}n?.(),h=!1,u?.classList.remove(`hidden`),d?.classList.remove(`auth-modal-backdrop--locked`),x()}else te&&(te=!1,r?.())}),Ie().then(S),{open:b,close:x}}function fn(){return!!O()||$t()}function pn({onSignIn:e,onSignUp:t,onGuest:n}){let r=document.getElementById(`auth-gate`);if(!r)return{show:()=>{},hide:()=>{},sync:()=>{}};let i=r.querySelector(`#auth-gate-signin`),a=r.querySelector(`#auth-gate-signup`),o=r.querySelector(`#auth-gate-guest`),s=r.querySelector(`#auth-gate-notice`);i?.addEventListener(`click`,()=>e?.()),a?.addEventListener(`click`,()=>t?.()),o?.addEventListener(`click`,()=>n?.());function c(){Ae()?s&&(s.textContent=`Create an account to sync decks, stars, and collection — or continue as guest to play Adventure on this device.`):s&&(s.textContent=`Cloud sign-in is not configured. Add your Supabase keys in js/supabaseConfig.js.`),r.classList.remove(`hidden`),document.body.classList.add(`auth-gate-active`)}function l(){r.classList.add(`hidden`),document.body.classList.remove(`auth-gate-active`)}function u(){fn()?l():c()}return{show:c,hide:l,sync:u}}function mn(){return Ae()&&!fn()}var hn=`arcane_checkers_tutorial_v1`,gn=`arcane_checkers_interactive_tutorial_v1`,_n=`arcane_checkers_meta_tutorial_v1`,vn=`arcane_checkers_quests_tutorial_v1`,yn=`arcane_checkers_pvp_tutorial_v1`,bn=`arcane_checkers_cosmetics_tutorial_v1`,xn=`arcane_checkers_pending_signup_tutorial_v1`;function Sn(){try{sessionStorage.setItem(xn,`1`)}catch{}}function Cn(){try{sessionStorage.removeItem(xn)}catch{}}function wn(){try{return sessionStorage.getItem(xn)===`1`}catch{return!1}}function Tn(e){if(!e)return;let t=[[gn,e.interactiveTutorialDone||e.tutorialDone],[_n,e.metaTutorialDone||e.tutorialDone],[vn,e.questsTutorialDone],[yn,e.pvpTutorialDone],[bn,e.cosmeticsTutorialDone]];try{for(let[e,n]of t)n?localStorage.setItem(e,`done`):localStorage.getItem(e)===`done`&&localStorage.removeItem(e)}catch{}}function En(e,t){Sn();try{localStorage.removeItem(gn),localStorage.removeItem(_n),localStorage.removeItem(vn),localStorage.removeItem(yn),localStorage.removeItem(bn),localStorage.removeItem(hn)}catch{}e&&(delete e.interactiveTutorialDone,delete e.metaTutorialDone,delete e.questsTutorialDone,delete e.pvpTutorialDone,delete e.cosmeticsTutorialDone,delete e.tutorialDone,t?.(e))}function Dn(e={}){if(Cn(),e.persist){try{localStorage.setItem(gn,`done`)}catch{}e.profile&&(e.profile.interactiveTutorialDone=!0),e.saveProfile?.(e.profile)}}function On(e={}){if(e.persist){try{localStorage.setItem(_n,`done`),localStorage.setItem(hn,`done`)}catch{}e.profile&&(e.profile.metaTutorialDone=!0,e.profile.tutorialDone=!0),e.saveProfile?.(e.profile)}}function kn(e){if(wn())return!0;if(e?.interactiveTutorialDone||e?.tutorialDone)return!1;try{return localStorage.getItem(gn)!==`done`}catch{return!0}}function An(e){if(e?.metaTutorialDone||e?.tutorialDone)return!1;if(!e?.interactiveTutorialDone)try{if(localStorage.getItem(gn)!==`done`)return!1}catch{return!1}try{return localStorage.getItem(_n)!==`done`}catch{return!0}}function jn(e={}){if(e.persist){try{localStorage.setItem(vn,`done`)}catch{}e.profile&&(e.profile.questsTutorialDone=!0),e.saveProfile?.(e.profile)}}function Mn(e={}){if(e.persist){try{localStorage.setItem(yn,`done`)}catch{}e.profile&&(e.profile.pvpTutorialDone=!0),e.saveProfile?.(e.profile)}}function Nn(e){if(e?.questsTutorialDone)return!1;try{return localStorage.getItem(vn)!==`done`}catch{return!0}}function Pn(e){if(e?.pvpTutorialDone)return!1;if(!e?.questsTutorialDone)try{if(localStorage.getItem(vn)!==`done`)return!1}catch{return!1}try{return localStorage.getItem(yn)!==`done`}catch{return!0}}function Fn(e={}){if(e.persist){try{localStorage.setItem(bn,`done`)}catch{}e.profile&&(e.profile.cosmeticsTutorialDone=!0),e.saveProfile?.(e.profile)}}function In(e){if(e?.cosmeticsTutorialDone)return!1;try{return localStorage.getItem(bn)!==`done`}catch{return!0}}function Ln(e){return e instanceof Element?!!e.closest(`#mobile-confirm, #tutorial-meta-overlay, #tutorial-match-overlay, .card-preview-modal`):!1}var Rn=new WeakSet,zn=!1,Bn=null,Vn=null;function Hn(){return document.getElementById(`panel-help-popup`)}function Un(){let e=Hn();!e||e.classList.contains(`hidden`)||(e.classList.add(`hidden`),document.body.classList.remove(`panel-help-open`),Bn&&=(Bn.setAttribute(`aria-expanded`,`false`),Bn.classList.remove(`panel-help-btn--active`),null),Vn&&=(clearTimeout(Vn),null))}function Wn({title:e,bodyHtml:t,triggerBtn:n=null,autoCloseMs:r=0}){let i=Hn();if(!i)return;Un();let a=i.querySelector(`#panel-help-popup-title`),o=i.querySelector(`#panel-help-popup-body`);a&&(a.textContent=e||`Help`),o&&(o.innerHTML=t||``),i.classList.remove(`hidden`),document.body.classList.add(`panel-help-open`),n&&(Bn=n,n.setAttribute(`aria-expanded`,`true`),n.classList.add(`panel-help-btn--active`)),r>0&&(Vn=setTimeout(Un,r)),i.querySelector(`.panel-help-popup__dismiss`)?.focus()}function Gn(){if(zn)return;zn=!0;let e=Hn();e&&(e.querySelectorAll(`[data-panel-help-close]`).forEach(e=>{e.addEventListener(`click`,Un)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&Un()}))}function Kn(e,t){let n=typeof e==`string`?document.getElementById(e):e,r=typeof t==`string`?document.getElementById(t):t;!n||!r||Rn.has(n)||(Rn.add(n),Gn(),n.addEventListener(`click`,e=>{e.stopPropagation();let t=Hn();if(t&&!t.classList.contains(`hidden`)&&Bn===n){Un();return}Wn({title:n.getAttribute(`aria-label`)||`Help`,bodyHtml:r.innerHTML,triggerBtn:n})}))}var qn=`cc_match_checkpoint`,Jn=1440*60*1e3,Yn=null,Xn=!1,Zn=null;function Qn(){return document.body.classList.contains(`match-active`)}function $n(e){if(!e||!(e instanceof Element)||e.closest(`.hidden`))return!1;let t=getComputedStyle(e);return!(t.display===`none`||t.visibility===`hidden`)}function er(){let e=document.querySelector(`#btn-leave-match`);if(!e)return!1;if($n(e))return!0;if(!Qn())return!1;let t=document.getElementById(`view-match`),n=document.getElementById(`view-pvp`);return!!(t?.contains(e)||n?.contains(e))}function tr(e){Yn=e}function nr(){let e=Yn;return Yn=null,e}function rr(){Yn=null}function ir(){Xn=!0}function ar(){let e=Xn;return Xn=!1,e}function or(){let e=document.getElementById(`view-match`);e?.classList.contains(`hidden`)&&e.innerHTML.trim()&&(e.innerHTML=``);let t=document.getElementById(`pvp-match-root`);t&&($n(t.querySelector(`#btn-leave-match`))||t.remove())}function sr(){return!Qn()||er()?!1:(or(),dr({clearCheckpoint:!1}),window.dispatchEvent(new CustomEvent(`cc-match-shell-reconciled`)),!0)}function cr(e){document.querySelector(`.game-shell`)?.classList.toggle(`game-shell--in-match`,e)}function lr(e){Zn=e,document.body.classList.add(`match-active`),cr(!0)}function ur(){try{sessionStorage.removeItem(qn)}catch{}}function dr(e={}){Zn=null,document.body.classList.remove(`match-active`),cr(!1),e.clearCheckpoint&&ur()}function fr(e){if(!(!Zn||!e?.state||Zn.kind!==`adventure`||e.state.gameOver))try{sessionStorage.setItem(qn,JSON.stringify({...Zn,state:e.state,winRewarded:!!e.winRewarded,savedAt:Date.now()}))}catch{}}function pr(){try{let e=sessionStorage.getItem(qn);if(!e)return null;let t=JSON.parse(e);return!t?.state||t.state.gameOver||t.kind!==`adventure`||t.savedAt&&Date.now()-t.savedAt>Jn?(ur(),null):t}catch{return ur(),null}}function mr(e){if(window.__ccMatchVisibilityBound)return;window.__ccMatchVisibilityBound=!0;let t=()=>{let t=e();t&&fr(t)};document.addEventListener(`visibilitychange`,()=>{let n=e();document.hidden?(t(),n?.pauseForBackground?.()):n?.resumeFromBackground?.()}),window.addEventListener(`pagehide`,t)}var hr=new Set;function gr(e){for(let t of hr)t!==e&&t.close()}function _r(e){if(!e||e.dataset.customSelectEnhanced)return e?._customSelectApi??null;e.dataset.customSelectEnhanced=`1`;let t=document.createElement(`div`);t.className=`custom-select`;let n=document.createElement(`button`);n.type=`button`,n.className=`custom-select__trigger select-input`,n.setAttribute(`aria-haspopup`,`listbox`),n.setAttribute(`aria-expanded`,`false`);let r=document.createElement(`span`);r.className=`custom-select__chevron`,r.setAttribute(`aria-hidden`,`true`),r.textContent=`▾`;let i=document.createElement(`span`);i.className=`custom-select__label`;let a=document.createElement(`div`);a.className=`custom-select__list hidden`,a.setAttribute(`role`,`listbox`);let o=e.id;o&&(n.id=o,e.removeAttribute(`id`));let s=e.getAttribute(`aria-label`)?null:document.querySelector(`label[for="${o}"]`)?.id;s?n.setAttribute(`aria-labelledby`,s):e.getAttribute(`aria-label`)&&n.setAttribute(`aria-label`,e.getAttribute(`aria-label`)),e.classList.add(`custom-select__native`),e.tabIndex=-1,e.setAttribute(`aria-hidden`,`true`),e.parentNode.insertBefore(t,e),t.appendChild(e),t.appendChild(n),n.appendChild(i),n.appendChild(r),t.appendChild(a);let c=!1,l=-1;function u(){return[...e.options]}function d(){return e.options[e.selectedIndex]??null}function f(){let r=d();i.textContent=r?.textContent?.trim()||`Select…`,n.disabled=e.disabled,t.classList.toggle(`custom-select--disabled`,e.disabled),a.querySelectorAll(`.custom-select__option`).forEach(t=>{let n=t.dataset.value===e.value;t.classList.toggle(`custom-select__option--selected`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)})}function p(t){let n=Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,t);!n?.set||!n?.get||Object.defineProperty(e,t,{configurable:!0,enumerable:n.enumerable,get(){return n.get.call(this)},set(e){n.set.call(this,e),f()}})}p(`value`),p(`selectedIndex`),p(`disabled`);function m(t){e.disabled||(e.value=t.value,e.dispatchEvent(new Event(`change`,{bubbles:!0})),f(),v())}function h(){a.innerHTML=``;for(let e of u()){let t=document.createElement(`button`);t.type=`button`,t.className=`custom-select__option`,t.setAttribute(`role`,`option`),t.dataset.value=e.value,t.textContent=e.textContent?.trim()||e.value,t.addEventListener(`click`,t=>{t.stopPropagation(),m(e)}),a.appendChild(t)}f()}function g(e){let t=[...a.querySelectorAll(`.custom-select__option`)];t.length&&(l=Math.max(0,Math.min(e,t.length-1)),t.forEach((e,t)=>{e.classList.toggle(`custom-select__option--active`,t===l)}),t[l]?.scrollIntoView({block:`nearest`}))}function ee(){a.classList.remove(`custom-select__list--above`);let e=n.getBoundingClientRect(),t=Math.min(256,window.innerHeight*.5),r=window.innerHeight-e.bottom,i=e.top;r<t*.65&&i>r&&a.classList.add(`custom-select__list--above`)}function _(){c||e.disabled||(gr(b),c=!0,hr.add(b),a.classList.remove(`hidden`),t.classList.add(`custom-select--open`),n.setAttribute(`aria-expanded`,`true`),ee(),g(Math.max(0,e.selectedIndex)),document.addEventListener(`click`,x),document.addEventListener(`keydown`,S))}function v(){c&&(c=!1,hr.delete(b),a.classList.add(`hidden`),t.classList.remove(`custom-select--open`),n.setAttribute(`aria-expanded`,`false`),l=-1,a.querySelectorAll(`.custom-select__option--active`).forEach(e=>{e.classList.remove(`custom-select__option--active`)}),document.removeEventListener(`click`,x),document.removeEventListener(`keydown`,S))}function y(){return c}let b={close:v,rebuild:h,isOpen:y};e._customSelectApi=b,n.addEventListener(`click`,t=>{t.stopPropagation(),!e.disabled&&(c?v():_())}),n.addEventListener(`keydown`,t=>{e.disabled||((t.key===`ArrowDown`||t.key===`ArrowUp`||t.key===`Enter`||t.key===` `)&&(t.preventDefault(),c||_(),t.key===`ArrowDown`&&g(l+1),t.key===`ArrowUp`&&g(l<=0?0:l-1),(t.key===`Enter`||t.key===` `)&&l>=0&&[...a.querySelectorAll(`.custom-select__option`)][l]?.click()),t.key===`Escape`&&v())});let x=e=>{if(!t.isConnected){v();return}t.contains(e.target)||v()},S=e=>{e.key===`Escape`&&v()},C=new MutationObserver(()=>{h()});C.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`disabled`,`value`,`selected`]}),e.addEventListener(`change`,f);let te=e.remove.bind(e);return e.remove=function(){v(),C.disconnect(),te(),t.isConnected&&t.remove()},h(),b}function vr(e){if(!e)return null;let t=typeof e==`string`?document.getElementById(e):e;return t?t.tagName===`SELECT`?t:t.closest(`.custom-select`)?.querySelector(`select.custom-select__native`)??null:null}function yr(e=document){e.querySelectorAll(`select.select-input:not([data-custom-select-enhanced]):not([data-no-custom-select])`).forEach(e=>{_r(e)})}var br={nudge:[`Move your piece 1 square forward-diagonally`],shield_1:[`Shield 1 turn — blocks one capture or spell hit`],shield_2:[`Shield 2 turns — cannot be captured`],forward_bolt:[`Destroy first enemy on forward diagonal (Stab)`],trickster:[`Swap up to 6 random pieces (not on back ranks)`],purify:[`Removes all debuffs from your pieces, including burn and freeze`],chain_lightning:[`Strike adjacent enemies only`,`Up to 2 kills if enemies touch each other`,`Your piece is paralyzed 2 turns`],pyromancy:[`Enemy piece + empty dark square — both burn 2 turns; fire tiles block enemies`,`You cannot cast spells on your next turn`],freeze_1:[`Enemy cannot move on their next turn`],snowball:[`Freeze an enemy piece — cannot move on its owner's next turn`],freeze_2:[`Enemy cannot move on their next turn`],deep_freeze:[`Freeze all enemies on one diagonal through your piece for 2 turns`],retreat_3:[`Backward movement for 3 turns`],bishop_2:[`Diagonal slide over empty dark squares for 2 turns`],rook_2:[`Rank/file slide over empty dark squares for 2 turns`],crown:[`Instantly crown a friendly piece`],swap_friendly:[`Swap two friendly pieces`],quick_march:[`Same piece moves again; either step may capture`],offering:[`Sacrifice a friendly piece`,`Draw 2 cards`,`Cast another spell immediately`],destroy_unshielded:[`Destroy any unshielded enemy`,`You cannot cast spells on your next turn`],revive:[`Requires a captured friendly piece`,`Place on any empty dark square on your side of the board`,`Revived piece cannot capture this turn`],blink_2:[`Teleport within 2 squares`],random_teleport:[`Jump to a random empty dark square`,`Crowned if you land on the back rank`],long_step:[`Epic: leap 2 squares diagonally (no capture)`],dash:[`Move 1 square forward-diagonally`,`Destroy enemy on landing square`],sidestep:[`Skip 2 columns on the same row`],landmine:[`Hidden trap 2 turns — destroys enemy lander`],quicksand:[`Hidden trap — freezes the next piece to land there`],detonate:[`Destroy self + adjacent enemies`],venom:[`Poison — 2 ticks destroys target`],bomb:[`Arm friendly piece`,`On next move: explodes`,`Kills all adjacent pieces`],shockwave:[`Arm friendly piece`,`On next move: paralyzes all adjacent pieces`,`1 turn — does not kill`],plague:[`Infect your piece + adjacent pieces`,`Seed spreads plague on every move`,`All infected die in 2 owner turns`],press:[`Opponent must move again after their normal move on their next turn`,`Extra step cannot capture`],mind_control:[`Convert an enemy man to your color for 2 of your turns`,`Reverts to the enemy afterward`],barrier:[`Place on any dark square`,`Blocks enemies for 2 turn cycles`],vengeance:[`Hidden trap — destroys the next enemy who captures your piece`,`Expires after 2 of your turn cycles if unused`,`Your piece survives 2 turns (blood counters), then dies`],hibernation:[`Sleep 2 turns (immobile)`,`Wake with Awoken Bear mark`,`Extra move every turn after`],fusion:[`Merge two adjacent men into one`,`Gains Awoken Bear mark`,`Extra move every turn after`],root_2:[`Enemy cannot jump/capture next turn`],silence_3:[`Suppress special movement 3 turns`],poison_3:[`Enemy dies in 3 turns — 3-turn poison bar`],deflect_1:[`Hidden trap — spell hit within 2 turns kills closest enemy instead`],last_stand:[`Hidden trap — ultra shield on capture or destroy for 3 turns`,`Expires after 1 of your turn cycles if unused`],clone:[`Your man, then adjacent empty square — copy cannot capture or be taken this turn; dies to freeze/poison/burn/plague`],deport:[`Send an enemy back to its game-start square`,`Destroys any piece already on that square`],bounty:[`Mark an enemy piece`,`When you jump-capture it, draw 2 cards`,`Spell destroys do not count`],link_fate:[`Link two enemies — when one is destroyed, the other dies too`]},xr={instant:[`Instant — no board target`],friendly:[`Target your piece`],enemy:[`Target enemy piece`],empty:[`Target empty dark square`],f_empty:[`Your piece, then destination`],f_f:[`Two friendly pieces`],f_e:[`Your piece, then enemy`],f_e_adj:[`Your piece, then adjacent enemy`],diagonal:[`Your piece, then diagonal strike`],discard_pick:[`Choose a card to discard`],e_e:[`Two enemy pieces`],column:[`Pick a board file (a–h)`]};function Sr(e){let t=[];return br[e.effect]?t.push(...br[e.effect]):e.desc&&t.push(e.desc),xr[e.mode]&&t.push(...xr[e.mode]),(e.rarity===`epic`||e.rarity===`legendary`)&&t.push(`${e.rarity.charAt(0).toUpperCase()+e.rarity.slice(1)} spell`),[...new Set(t)]}function Cr(e){return Sr(e).join(` · `)}var A=70,j=60,wr=A/64,Tr=j/64;function Er(e){return`<g transform="scale(${wr}, ${Tr})">${e}</g>`}function Dr(e){return`<g class="card-motif" opacity="0.98">${e}</g>`}function Or(e,t,n=5,r=.88){return`<circle cx="${e}" cy="${t}" r="${n}" fill="currentColor" opacity="${r}" stroke="#0f172a" stroke-width="0.8"/>`}function kr(e,t,n=4){return`<circle cx="${e}" cy="${t}" r="${n}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.5"/>
    <ellipse cx="${e}" cy="${t+n*.5}" rx="${n*.8}" ry="${n*.3}" fill="currentColor" opacity="0.12"/>`}function Ar(e,t,n=6){return`<path d="M${e-n} ${t-n} L${e+n} ${t+n} M${e+n} ${t-n} L${e-n} ${t+n}" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.4"/>
    <path d="M${e-n} ${t-n} L${e+n} ${t+n} M${e+n} ${t-n} L${e-n} ${t+n}" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`}function jr(e,t,n=5){return`<ellipse cx="${e}" cy="${t+n*.55}" rx="${n*1.1}" ry="${n*.35}" fill="#000" opacity="0.28"/>
    <circle cx="${e}" cy="${t}" r="${n}" fill="#b91c1c" stroke="#450a0a" stroke-width="1.8"/>
    <circle cx="${e}" cy="${t}" r="${n*.82}" fill="#dc2626"/>
  <ellipse cx="${e-n*.28}" cy="${t-n*.32}" rx="${n*.42}" ry="${n*.28}" fill="#fca5a5" opacity="0.55"/>
    <path d="M${e-n*.35} ${t+n*.15} Q${e} ${t+n*.45} ${e+n*.35} ${t+n*.15}" fill="none" stroke="#7f1d1d" stroke-width="1.2" opacity="0.5"/>`}function M(e,t,n=8,r=`#fbbf24`,i=`#b45309`){let a=[];for(let r=0;r<8;r++){let i=r*Math.PI/4-Math.PI/2,o=i+Math.PI/8;a.push([e+Math.cos(i)*n,t+Math.sin(i)*n]),a.push([e+Math.cos(o)*n*.45,t+Math.sin(o)*n*.45])}let o=a.map(([e,t],n)=>`${n===0?`M`:`L`}${e.toFixed(1)} ${t.toFixed(1)}`).join(` `)+` Z`;return`<circle cx="${e}" cy="${t}" r="${n*.55}" fill="${r}" opacity="0.35"/>
    <path d="${o}" fill="${r}" stroke="${i}" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="${e-n*.2}" cy="${t-n*.2}" r="${n*.18}" fill="#fff" opacity="0.35"/>`}function N(e=32,t=56,n=18,r=4){return`<ellipse cx="${e}" cy="${t}" rx="${n+2}" ry="${r+1}" fill="#000" opacity="0.12"/>
    <ellipse cx="${e}" cy="${t}" rx="${n}" ry="${r}" fill="#000" opacity="0.32"/>`}function P(e,t=`#e2e8f0`,n=.55){return e.map(([e,r,i=1])=>{let a=i*2.2;return`<path d="M${e} ${r-a} L${e+a*.3} ${r-a*.3} L${e+a} ${r} L${e+a*.3} ${r+a*.3} L${e} ${r+a} L${e-a*.3} ${r+a*.3} L${e-a} ${r} L${e-a*.3} ${r-a*.3} Z" fill="${t}" opacity="${n}"/>`}).join(``)}function F(e,t,n=5.5){return`${Lr(e,t,n)}
    <ellipse cx="${e-n*.22}" cy="${t-n*.34}" rx="${n*.48}" ry="${n*.32}" fill="#bfdbfe" opacity="0.65"/>
    <circle cx="${e}" cy="${t}" r="${n+2.8}" fill="none" stroke="#60a5fa" stroke-width="1.1" opacity="0.28"/>
    <circle cx="${e}" cy="${t}" r="${n+4.5}" fill="none" stroke="#93c5fd" stroke-width="0.7" opacity="0.15"/>`}function I(e,t,n=5.5){return`${jr(e,t,n)}
    <circle cx="${e}" cy="${t}" r="${n+2.5}" fill="none" stroke="#f87171" stroke-width="1" opacity="0.28"/>
    <path d="M${e-2} ${t-1} L${e} ${t-3} L${e+2} ${t-1}" stroke="#450a0a" stroke-width="1" fill="none" opacity="0.45"/>`}function L(e,t,n=6,r=`#cbd5e1`){return`<circle cx="${e}" cy="${t}" r="${n+4}" fill="${r}" opacity="0.06"/>
    <circle cx="${e}" cy="${t}" r="${n+1}" fill="none" stroke="${r}" stroke-width="2" stroke-dasharray="4 2" opacity="0.55"/>
    <circle cx="${e}" cy="${t}" r="${n}" fill="none" stroke="${r}" stroke-width="1.6" opacity="0.82"/>
    <circle cx="${e}" cy="${t}" r="2.2" fill="${r}" opacity="0.5"/>`}function R(e,t,n,r,i=`#e2e8f0`,a=2.6){let o=n-e,s=r-t,c=Math.hypot(o,s)||1,l=o/c,u=s/c,d=-u,f=l;return`<path d="M${e} ${t} L${n} ${r}" stroke="#0f172a" stroke-width="${a+2}" fill="none" stroke-linecap="round" opacity="0.28"/>
    <path d="M${e} ${t} L${n} ${r}" stroke="${i}" stroke-width="${a}" fill="none" stroke-linecap="round"/>
    <path d="M${n} ${r} L${n-l*7+d*4} ${r-u*7+f*4} M${n} ${r} L${n-l*7-d*4} ${r-u*7-f*4}" stroke="${i}" stroke-width="${a}" fill="none" stroke-linecap="round"/>`}function Mr(e,t,n,r,i=`#93c5fd`,a=2){let o=(e+n)/2,s=(t+r)/2-8;return`<path d="M${e} ${t} Q${o} ${s} ${n} ${r}" stroke="#0f172a" stroke-width="${a+2.4}" fill="none" opacity="0.22"/>
    <path d="M${e} ${t} Q${o} ${s} ${n} ${r}" stroke="${i}" stroke-width="${a+1}" fill="none" opacity="0.28"/>
    <path d="M${e} ${t} Q${o} ${s} ${n} ${r}" stroke="${i}" stroke-width="${a}" fill="none" stroke-linecap="round"/>`}function Nr(e,t,n=`#60a5fa`,r=`#93c5fd`,i=``){let a=i?` filter="url(#${i})"`:``;return`<path d="M${e} ${t-14} L${e+11} ${t-6} L${e+11} ${t+8} C${e+11} ${t+16} ${e} ${t+22} ${e} ${t+22} C${e} ${t+22} ${e-11} ${t+16} ${e-11} ${t+8} L${e-11} ${t-6} Z" fill="${n}" opacity="0.48" stroke="#0f172a" stroke-width="2.2"${a}/>
    <path d="M${e} ${t-14} L${e+11} ${t-6} L${e+11} ${t+8} C${e+11} ${t+16} ${e} ${t+22} ${e} ${t+22} C${e} ${t+22} ${e-11} ${t+16} ${e-11} ${t+8} L${e-11} ${t-6} Z" fill="none" stroke="${r}" stroke-width="1.6"/>
    <path d="M${e} ${t-10} L${e+6} ${t-5} L${e+6} ${t+4} C${e+6} ${t+9} ${e} ${t+13} ${e} ${t+13} C${e} ${t+13} ${e-6} ${t+9} ${e-6} ${t+4} L${e-6} ${t-5} Z" fill="${r}" opacity="0.32"/>
    <path d="M${e-2} ${t-8} L${e+3} ${t-3}" stroke="#fff" stroke-width="1.2" opacity="0.35" stroke-linecap="round"/>`}function Pr(e,t,n=28,r=!0){return`<rect x="${e-n/2}" y="${t-n/2}" width="${n}" height="${n}" rx="3" fill="#1c1917" opacity="0.65" stroke="#57534e" stroke-width="1.6"/>
    <rect x="${e-n/2+3}" y="${t-n/2+3}" width="${n-6}" height="${n-6}" rx="2" fill="#292524" opacity="0.5"/>
    ${r?`<path d="M${e-7} ${t-7} L${e+7} ${t+7} M${e+7} ${t-7} L${e-7} ${t+7}" stroke="#a8a29e" stroke-width="1.4" opacity="0.4"/>`:``}
    <rect x="${e-n/2+2}" y="${t-n/2+2}" width="${n-4}" height="${n-4}" rx="1" fill="none" stroke="#78716c" stroke-width="0.9" opacity="0.35"/>`}function Fr(e,t,n=5,r=`#c4b5fd`){return`<circle cx="${e}" cy="${t}" r="${n+5}" fill="${r}" opacity="0.1"/>
    <circle cx="${e}" cy="${t}" r="${n+2}" fill="none" stroke="${r}" stroke-width="0.8" opacity="0.35"/>
    <path d="M${e} ${t-n} L${e+n*.6} ${t-n*.2} L${e+n} ${t+n*.4} L${e+n*.3} ${t+n} L${e-n*.3} ${t+n} L${e-n} ${t+n*.4} L${e-n*.6} ${t-n*.2} Z" fill="none" stroke="${r}" stroke-width="1.4" opacity="0.72"/>`}function Ir(e,t,n,r){let i=`lg-${e}`;return`<defs>
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
  <rect width="${A}" height="${j}" fill="url(#${i})"/>
  ${Er(r)}`}function z(e,t,n,r){let i=`cm-${e}`,a=`cm-vig-${e}`;return`<defs>
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
  <rect width="${A}" height="${j}" fill="url(#${i})"/>
  <g opacity="0.38">${P([[10,12,.8],[54,8,1],[48,52,.7],[8,44,.9],[32,6,1.2],[58,30,.6]],`#cbd5e1`,.45)}</g>
  <rect width="${A}" height="${j}" fill="url(#${a})"/>
  <g filter="url(#${i}-glow)">${Er(r)}</g>`}function B(e,t,n,r){let i=`uc-${e}`,a=`uc-vig-${e}`;return`<defs>
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
  <rect width="${A}" height="${j}" fill="url(#${i})"/>
  <g opacity="0.5">${P([[12,10,1],[52,14,1.2],[6,36,.8],[58,48,1],[28,8,.9],[44,56,.7]],`#7dd3fc`,.55)}</g>
  <path d="M8 20 C18 14 26 18 32 10 C38 18 46 14 56 20" stroke="#38bdf8" stroke-width="0.8" fill="none" opacity="0.18"/>
  <rect width="${A}" height="${j}" fill="url(#${a})"/>
  <g filter="url(#${i}-glow)">${Er(r)}</g>`}function V(e,t,n,r){let i=`ra-${e}`,a=`ra-vig-${e}`;return`<defs>
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
  <rect width="${A}" height="${j}" fill="url(#${i})"/>
  <g opacity="0.55">${P([[10,8,1.1],[54,12,1.3],[8,50,.9],[56,44,1],[32,4,1.4],[20,28,.8],[48,30,.9]],`#e9d5ff`,.6)}</g>
  <circle cx="32" cy="28" r="22" fill="none" stroke="#c4b5fd" stroke-width="0.6" opacity="0.15"/>
  <circle cx="32" cy="28" r="14" fill="none" stroke="#a78bfa" stroke-width="0.5" opacity="0.12"/>
  <rect width="${A}" height="${j}" fill="url(#${a})"/>
  <g filter="url(#${i}-glow)">${Er(r)}</g>`}function H(e,t,n,r){let i=`ep-${e}`;return`<defs>
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
  <rect width="${A}" height="${j}" fill="url(#${i})"/>
  ${Er(r)}`}function Lr(e,t,n=5){return`<ellipse cx="${e}" cy="${t+n*.55}" rx="${n*1.1}" ry="${n*.35}" fill="#000" opacity="0.28"/>
    <circle cx="${e}" cy="${t}" r="${n}" fill="#1d4ed8" stroke="#1e3a8a" stroke-width="1.8"/>
    <circle cx="${e}" cy="${t}" r="${n*.82}" fill="#2563eb"/>
    <ellipse cx="${e-n*.28}" cy="${t-n*.32}" rx="${n*.42}" ry="${n*.28}" fill="#93c5fd" opacity="0.55"/>
    <path d="M${e-n*.35} ${t+n*.15} Q${e} ${t+n*.45} ${e+n*.35} ${t+n*.15}" fill="none" stroke="#1e40af" stroke-width="1.2" opacity="0.45"/>`}var Rr=new Set(`nudge.backstep.retreat_3.anchor_2.recall.repel.leapfrog.random_teleport.rally.coin_flip.ignore.iron_will.demote.quicksand.create_foe.barrier.panic.swap_friendly.sidestep.press.shield_1.snowball.long_step.shield_2.poison_3.deflect_1.forward_bolt.crown.blink_2.landmine.reverse_only_2.root_2.sacrifice.scatter.mass_nudge.sanctuary_pulse.last_stand.cryo_bolt.collapse.last_king.snipe.dominion.backstab.bomb.berserk.bounty.chain_lightning.clone.confusion.constitution.counterspell.cull.deep_freeze.deport.destroy_unshielded.duel.earthquake.execution.hostile_swap.link_fate.magnet.mind_control.purify.pyromancy.quick_march.revive.shockwave.plague.bishop_2.rook_2.offering.tangle.call_forward.dash.blizzard.bulwark.darkness.fortify.hibernation.vengeance.sanctuary.fusion.chameleon.blind.trickster.displacement`.split(`.`));function zr(e){return Rr.has(e)}function Br(){return`${N(32,54,20,4)}
    ${I(18,52,5.5)}${I(38,52,5.5)}
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#0f172a" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M30 4 C28 12 26 22 28 32 L30 40" stroke="#4b5563" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M28 12 C26 16 27 20 29 24" stroke="#6b7280" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M30 40 L28 54" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round"/>
    <path d="M30 40 L38 48 L32 50 L26 46 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M32 46 L40 52" stroke="#cbd5e1" stroke-width="2.5" stroke-linecap="round"/>
    ${M(32,48,7,`#ef4444`,`#991b1b`)}
    <path d="M14 20 L18 16 M50 18 L54 14" stroke="#fca5a5" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>`}function Vr(){return`${N(32,56,20,4)}
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
    ${M(32,34,12,`#fbbf24`,`#b45309`)}
    ${M(32,34,7,`#fde68a`,`#d97706`)}
    <path d="M12 16 L16 12 M52 18 L56 14 M10 38 L6 42 M54 42 L58 46 M20 8 L24 4" stroke="#fde68a" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>
    <circle cx="14" cy="14" r="2" fill="#fbbf24" opacity="0.6"/><circle cx="54" cy="16" r="1.5" fill="#fde68a" opacity="0.5"/>`}function Hr(){return`${N(32,56,24,5)}
    <circle cx="32" cy="24" r="14" fill="#38bdf8" opacity="0.1"/>
    <path d="M32 2 L24 18 L34 18 L16 50 L38 22 L26 22 L42 2 Z" fill="#e0f2fe" stroke="#1e40af" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M32 2 L24 18 L34 18 L16 50 L38 22 L26 22 L42 2 Z" fill="#7dd3fc" opacity="0.35"/>
    <path d="M38 22 L54 6 L46 24 L60 14 L48 38" fill="none" stroke="#bae6fd" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 22 L54 6 L46 24 L60 14 L48 38" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <path d="M26 18 L8 8 L16 28 L2 20 L14 40" fill="none" stroke="#93c5fd" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26 18 L8 8 L16 28 L2 20" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
    ${I(22,50,4.5)}${I(38,44,4.5)}
    <path d="M22 50 L38 44" stroke="#93c5fd" stroke-width="2.2" stroke-dasharray="3 2" opacity="0.85"/>
    <circle cx="30" cy="49" r="2" fill="#fde047" opacity="0.7"/><circle cx="36" cy="46" r="1.5" fill="#fde047" opacity="0.6"/>
    <path d="M50 6 L53 3 M58 14 L61 11 M8 8 L5 5 M4 22 L1 19" stroke="#7dd3fc" stroke-width="1.8" stroke-linecap="round"/>
    ${P([[48,8,.8],[10,10,.7],[56,20,.9],[6,24,.6]],`#e0f2fe`,.7)}`}function Ur(){return`${N(32,54,18,4)}
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="#6366f1" opacity="0.42" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 10 L44 18 V32 C44 40 32 48 32 48 C32 48 20 40 20 32 V18 Z" fill="none" stroke="#c7d2fe" stroke-width="1.2" opacity="0.7"/>
    <path d="M24 22 L40 38 M40 22 L24 38" stroke="#e0e7ff" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 16 L22 20 M46 14 L42 18 M14 34 L18 30 M50 36 L46 32" stroke="#c7d2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.85"/>
    ${I(32,52,5.5)}
    ${M(32,28,10,`#818cf8`,`#4338ca`)}
    ${M(32,28,5,`#e0e7ff`,`#6366f1`)}
    <path d="M10 24 L14 28 L8 32 M54 26 L50 30 L56 34" stroke="#a5b4fc" stroke-width="1.4" fill="none" opacity="0.7"/>`}function Wr(){return`${N(32,54,18,4)}
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#292524" stroke="#57534e" stroke-width="1.4"/>
    <rect x="38" y="38" width="14" height="14" rx="2" fill="#f97316" opacity="0.4"/>
    <path d="M40 50 C42 46 44 44 46 46" stroke="#ea580c" stroke-width="1.2" fill="none"/>
    ${I(22,48,5)}
    <path d="M14 30 C18 16 24 8 28 16 C30 6 36 2 38 14 C42 4 48 10 50 22 C54 12 58 18 56 30 C60 22 62 28 58 36" fill="#f97316" opacity="0.9" stroke="#c2410c" stroke-width="1"/>
    <path d="M18 32 C22 22 26 18 30 22 C32 16 36 14 40 20 C42 16 46 18 48 26" fill="#fbbf24" opacity="0.95"/>
    <path d="M38 36 C42 28 44 22 48 26 C50 20 54 24 52 32" fill="#fb923c" opacity="0.85"/>
    <path d="M20 34 Q24 38 28 34" stroke="#fde047" stroke-width="1.4" fill="none"/>
    <circle cx="30" cy="22" r="8" fill="#fbbf24" opacity="0.22"/>
    ${P([[16,12,.7],[52,14,.8],[44,8,.6]],`#fde68a`,.65)}`}function Gr(){return`${N(32,54,22,4)}
    <path d="M8 54 H56" stroke="#0f172a" stroke-width="3" opacity="0.25"/>
    <path d="M8 54 H56" stroke="#14532d" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="50" width="44" height="6" rx="1.5" fill="#166534" opacity="0.42" stroke="#14532d" stroke-width="1"/>
    <rect x="12" y="51" width="40" height="3" rx="0.5" fill="#22c55e" opacity="0.2"/>
    ${kr(32,40,7)}
    <path d="M32 46 L32 28" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M32 46 L32 28" stroke="#86efac" stroke-width="2.4" stroke-dasharray="4 3" opacity="0.75"/>
    <circle cx="32" cy="36" r="5" fill="#4ade80" opacity="0.18"/>
    <circle cx="32" cy="30" r="7" fill="#4ade80" opacity="0.14"/>
    ${F(32,22,6)}
    <circle cx="32" cy="22" r="12" fill="#4ade80" opacity="0.15"/>
    <circle cx="32" cy="22" r="16" fill="none" stroke="#86efac" stroke-width="1.4" opacity="0.35"/>
    ${M(32,22,9,`#4ade80`,`#15803d`)}
    <path d="M26 12 L32 4 L38 12" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.3"/>
    <path d="M26 12 L32 4 L38 12" stroke="#bbf7d0" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M18 18 C24 14 28 16 32 12 C36 16 40 14 46 18" stroke="#86efac" stroke-width="1.6" fill="none" opacity="0.55"/>
    ${P([[20,10,.9],[44,12,.8],[32,6,1.1],[14,24,.7],[50,22,.7]],`#bbf7d0`,.65)}`}function Kr(){return`${N(32,56,24,5)}
    <path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M8 8 L56 8 L56 56 L8 56 Z" fill="none" stroke="#78716c" stroke-width="1.6" opacity="0.4"/>
    <path d="M32 12 L28 28 L36 28 Z M32 52 L28 36 L36 36 Z M12 32 L28 28 L28 36 Z M52 32 L36 28 L36 36 Z" fill="#57534e" opacity="0.55" stroke="#44403c" stroke-width="1"/>
    <path d="M24 24 L40 40 M40 24 L24 40" stroke="#0f172a" stroke-width="3.2" stroke-linecap="round" opacity="0.25"/>
    <path d="M26 26 L38 38 M38 26 L26 38" stroke="#a8a29e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M30 30 L34 34 M34 30 L30 34" stroke="#d6d3d1" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
    ${I(16,16,4)}${I(48,16,4)}${I(16,48,4)}${I(48,48,4)}
    ${R(20,20,28,28,`#d6d3d1`,2.2)}${R(44,20,36,28,`#d6d3d1`,2.2)}
    ${R(20,44,28,36,`#d6d3d1`,2.2)}${R(44,44,36,36,`#d6d3d1`,2.2)}
    ${M(32,32,8,`#d6d3d1`,`#78716c`)}
    <circle cx="32" cy="32" r="6" fill="#a8a29e" opacity="0.2"/>
  <path d="M14 54 L18 50 M50 54 L46 50 M54 14 L50 18 M10 14 L14 18" stroke="#d6d3d1" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
    <path d="M8 32 L14 32 M50 32 L56 32 M32 8 L32 14 M32 50 L32 56" stroke="#a8a29e" stroke-width="1.4" stroke-linecap="round" opacity="0.4"/>`}function qr(){return`${N(32,54,22,4)}
    ${I(46,28,5.5)} ${Ar(46,28,6)}
    ${F(18,46,5.5)}
    <path d="M22 42 Q34 8 44 30" stroke="#0f172a" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M22 42 Q34 8 44 30" stroke="#ef4444" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M22 42 Q34 8 44 30" stroke="#fca5a5" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.5" stroke-dasharray="3 2"/>
    ${R(40,32,44,28,`#fde68a`,2.4)}
    <circle cx="18" cy="46" r="10" fill="#ef4444" opacity="0.18"/>
    <circle cx="46" cy="28" r="12" fill="#ef4444" opacity="0.22"/>
    ${M(46,28,7,`#ef4444`,`#991b1b`)}
    <path d="M10 46 C16 38 22 32 30 28" stroke="#fca5a5" stroke-width="1.8" fill="none" opacity="0.55" stroke-dasharray="3 2"/>
    <path d="M14 12 L18 8 M50 10 L46 6 M52 50 L48 54" stroke="#fecaca" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
    ${P([[34,14,.9],[40,20,.7],[28,18,.8]],`#fca5a5`,.6)}`}function Jr(){return`${N(32,56,16,4)}
    ${I(32,52,6)}
    <circle cx="32" cy="52" r="10" fill="#7c3aed" opacity="0.12"/>
    <path d="M14 2 C10 14 8 28 12 38 C14 46 20 50 28 48" fill="#4c1d95" stroke="#0f172a" stroke-width="2.2"/>
    <path d="M14 2 C10 14 8 28 12 38 C14 46 20 50 28 48" fill="#4c1d95" stroke="#2e1065" stroke-width="1.4"/>
    <path d="M28 48 L30 40 L36 42 L38 34 L44 36 L48 28 L54 34" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 48 L30 40 L36 42 L38 34 L44 36 L48 28 L54 34" fill="none" stroke="#1e1b4b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 40 L32 38 L34 40 M36 42 L38 40 L40 42 M44 36 L46 34 L48 36" stroke="#a78bfa" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M16 8 C18 20 20 32 24 40" stroke="#a78bfa" stroke-width="2.4" fill="none" opacity="0.7"/>
    <path d="M46 4 C42 18 40 32 44 42" stroke="#a78bfa" stroke-width="2.4" fill="none" opacity="0.6"/>
    <path d="M24 6 C20 16 18 26 20 34" stroke="#c4b5fd" stroke-width="1.8" fill="none" opacity="0.5"/>
    ${Fr(50,10,4,`#e9d5ff`)}
    ${P([[12,6,.8],[48,8,1],[22,4,.7],[36,44,.9]],`#e9d5ff`,.65)}`}function Yr(){let e=(e,t,n)=>`<g transform="translate(${e}, 40) scale(${t?-1:1}, 1)">
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
    </g>`;return`${N(32,54,22,4)}
    ${e(18,!1,`#dc2626`)}${e(46,!0,`#2563eb`)}
    ${M(32,30,10,`#fbbf24`,`#b45309`)}
    ${M(32,30,5,`#fde68a`,`#d97706`)}
    <path d="M24 26 L40 34 M40 26 L24 34" stroke="#0f172a" stroke-width="2" opacity="0.25"/>
    <path d="M24 26 L40 34 M40 26 L24 34" stroke="#fde68a" stroke-width="1.6" opacity="0.5"/>
    ${P([[32,24,1],[26,20,.7],[38,20,.7]],`#fde68a`,.7)}`}function Xr(){return`${N(36,56,18,4)}
    ${I(42,52,6)}
    <path d="M8 58 L8 28" stroke="#0f172a" stroke-width="6" stroke-linecap="round" opacity="0.3"/>
    <path d="M8 58 L8 28" stroke="#92400e" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M8 28 L8 12 L32 4 L36 20 L28 36 Z" fill="#9ca3af" stroke="#0f172a" stroke-width="2"/>
    <path d="M8 28 L8 12 L32 4 L36 20 L28 36 Z" fill="none" stroke="#64748b" stroke-width="1.2"/>
    <path d="M12 14 L26 8 L30 22 L16 28 Z" fill="#dc2626" opacity="0.85" stroke="#991b1b" stroke-width="1.2"/>
    <path d="M16 12 L22 10 L24 18" stroke="#fca5a5" stroke-width="1" fill="none" opacity="0.5"/>
    ${M(42,50,8,`#ef4444`,`#991b1b`)}
    <path d="M34 40 L44 54" stroke="#0f172a" stroke-width="3" stroke-linecap="round" opacity="0.25"/>
    <path d="M34 40 L44 54" stroke="#dc2626" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
    <circle cx="40" cy="48" r="2.2" fill="#dc2626" opacity="0.85"/>
    <circle cx="36" cy="44" r="1.8" fill="#ef4444" opacity="0.7"/>
    <circle cx="44" cy="52" r="1.5" fill="#b91c1c" opacity="0.6"/>
    ${P([[38,38,.7],[46,46,.6]],`#fca5a5`,.55)}`}function Zr(){return`${N(32,54,22,4)}
    ${F(20,40,5.5)}${I(50,40,5.5)}
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
    ${P([[34,36,.7],[38,44,.6],[32,22,.8]],`#fde68a`,.6)}`}function Qr(){return`${N(32,54,20,4)}
    ${F(32,42,6)}
    <path d="M32 36 L32 22" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 36 L32 22" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L32 10" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 24 L32 10" stroke="#60a5fa" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${R(32,38,32,26,`#93c5fd`,2.4)}
    ${R(32,24,32,12,`#60a5fa`,2.4)}
    <path d="M32 38 L26 34 M32 38 L38 34" stroke="#93c5fd" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M32 24 L26 20 M32 24 L38 20" stroke="#60a5fa" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="48" rx="6" ry="3.5" fill="#1e3a8a" opacity="0.4"/>
    <ellipse cx="40" cy="48" rx="6" ry="3.5" fill="#1e3a8a" opacity="0.4"/>
    <ellipse cx="28" cy="30" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.25"/>
    <ellipse cx="36" cy="18" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.25"/>
    ${L(32,10,5,`#93c5fd`)}
    <text x="38" y="14" font-size="7" fill="#93c5fd" opacity="0.85" font-weight="700">×2</text>
    ${P([[32,8,.8],[20,32,.6],[44,32,.6]],`#bae6fd`,.55)}`}function $r(){return`${N(32,54,22,4)}
    ${F(32,36,6)}
    <circle cx="32" cy="36" r="10" fill="#a78bfa" opacity="0.15"/>
    <circle cx="32" cy="36" r="10" fill="none" stroke="#0f172a" stroke-width="2.8" opacity="0.2"/>
    <circle cx="32" cy="36" r="10" fill="none" stroke="#c4b5fd" stroke-width="2.4" opacity="0.75"/>
    <circle cx="32" cy="36" r="16" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.6"/>
    <circle cx="32" cy="36" r="22" fill="none" stroke="#8b5cf6" stroke-width="1.6" opacity="0.45"/>
    <circle cx="32" cy="36" r="28" fill="none" stroke="#7c3aed" stroke-width="1" opacity="0.25"/>
    ${I(14,28,4)}${I(50,28,4)}${I(14,44,4)}${I(50,44,4)}
    <path d="M14 28 L10 22 M50 28 L54 22 M14 44 L10 50 M50 44 L54 50" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.75"/>
    <path d="M28 18 L32 12 L36 18" stroke="#0f172a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M28 18 L32 12 L36 18" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${M(32,36,6,`#c4b5fd`,`#7c3aed`)}
    ${P([[32,14,.9],[8,36,.7],[56,36,.7]],`#e9d5ff`,.6)}`}function ei(){return`${N(32,54,22,4)}
    ${F(32,36,6)}
    <circle cx="32" cy="36" r="9" fill="#22c55e" opacity="0.18"/>
    <circle cx="32" cy="36" r="9" fill="none" stroke="#86efac" stroke-width="2.2" opacity="0.85"/>
    ${I(14,28,4)}${I(50,28,4)}${I(14,44,4)}${I(50,44,4)}
    <circle cx="14" cy="28" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <circle cx="50" cy="28" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <circle cx="14" cy="44" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <circle cx="50" cy="44" r="5" fill="#22c55e" opacity="0.35" stroke="#86efac" stroke-width="1.6"/>
    <path d="M32 36 L14 28 M32 36 L50 28 M32 36 L14 44 M32 36 L50 44" stroke="#4ade80" stroke-width="1.6" stroke-linecap="round" opacity="0.65"/>
    <text x="28" y="34" font-size="8" fill="#bbf7d0" font-weight="700">☣</text>
    ${P([[32,22,.85],[10,24,.6],[54,24,.6]],`#86efac`,.55)}`}function ti(){return`${N(32,54,22,4)}
    ${I(48,32,6)}
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
    ${P([[22,20,.8],[36,28,.7],[36,36,.7]],`#e9d5ff`,.6)}`}function ni(){return`${N(32,54,18,4)}
    ${I(32,36,6)}
    <circle cx="32" cy="36" r="14" fill="#a78bfa" opacity="0.1"/>
    <path d="M14 14 C24 24 14 34 26 44 C38 34 46 44 50 26 C44 14 34 18 26 12" stroke="#0f172a" stroke-width="3.6" fill="none" opacity="0.2"/>
    <path d="M14 14 C24 24 14 34 26 44 C38 34 46 44 50 26 C44 14 34 18 26 12" stroke="#c4b5fd" stroke-width="2.6" fill="none" opacity="0.8"/>
    <path d="M18 10 C28 18 22 28 32 22" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M42 48 C36 42 30 46 24 40" stroke="#e9d5ff" stroke-width="1.6" fill="none" opacity="0.5" stroke-dasharray="3 2"/>
    <text x="10" y="50" font-size="10" fill="#fde68a" opacity="0.85" font-weight="700">?</text>
    <text x="48" y="16" font-size="8" fill="#c4b5fd" opacity="0.7" font-weight="700">?</text>
    <path d="M24 32 L30 26 M34 32 L40 36 M30 40 L24 46" stroke="#f0e6ff" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
    <path d="M28 20 C32 24 36 20 40 24" stroke="#fde68a" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${P([[16,20,.8],[48,38,.7],[32,10,.9]],`#e9d5ff`,.6)}`}function ri(){return`${N(32,54,20,4)}
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="none" stroke="#a78bfa" stroke-width="1.8" opacity="0.7"/>
    <path d="M32 48 L46 34 L38 26 L52 12 L42 8 L32 22 L22 8 L12 12 L26 26 L18 34 Z" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.45"/>
    ${Fr(32,30,6,`#c4b5fd`)}
    <path d="M22 26 L42 46 M42 26 L22 46" stroke="#0f172a" stroke-width="4" stroke-linecap="round" opacity="0.3"/>
    <path d="M22 26 L42 46 M42 26 L22 46" stroke="#f87171" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M6 8 L20 22 L12 30 L28 46" fill="none" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.2"/>
    <path d="M6 8 L20 22 L12 30 L28 46" fill="none" stroke="#fbbf24" stroke-width="2.8" stroke-linecap="round" opacity="0.7"/>
    <circle cx="6" cy="8" r="5" fill="#fde68a" opacity="0.6" stroke="#b45309" stroke-width="1.2"/>
    ${M(32,36,7,`#a78bfa`,`#4c1d95`)}
    ${P([[14,14,.8],[48,16,.7],[32,8,.9]],`#e9d5ff`,.6)}`}function ii(){return`${N(32,54,22,4)}
    ${F(32,50,5)}
    <path d="M6 58 L58 6" stroke="#0f172a" stroke-width="5" opacity="0.2"/>
    <path d="M6 58 L58 6" stroke="#bae6fd" stroke-width="4" opacity="0.45"/>
    <path d="M6 58 L58 6" stroke="#e0f2fe" stroke-width="1.8" opacity="0.9"/>
    ${I(18,46,4.5)}${I(32,32,4.5)}${I(46,18,4.5)}
    <path d="M16 42 L20 38 M26 28 L30 24 M38 14 L42 10" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M14 40 L18 44 M24 26 L28 30 M36 12 L40 16" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
    <path d="M20 44 L24 40 M34 26 L38 22 M46 12 L50 8" stroke="#38bdf8" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    <text x="48" y="12" font-size="10" fill="#e0f2fe" opacity="0.9">❄</text>
    ${P([[50,10,1],[12,52,.8],[40,20,.7]],`#e0f2fe`,.7)}`}function ai(){return`${N(32,54,22,4)}
    ${F(20,42,5.5)}${I(44,22,5.5)}
    <path d="M26 38 C32 30 38 26 44 26" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M26 38 C32 30 38 26 44 26" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M38 26 L44 26 L41 22 M44 26 L41 30" stroke="#93c5fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 30 C32 38 26 42 20 42" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M38 30 C32 38 26 42 20 42" stroke="#fca5a5" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M26 42 L20 42 L23 38 M20 42 L23 46" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${Mr(24,38,40,26,`#fde68a`,2.2)}
    <path d="M28 34 L36 30" stroke="#fde68a" stroke-width="1.8" stroke-dasharray="3 2" opacity="0.65"/>
    ${L(20,42,5,`#93c5fd`)}${L(44,22,5,`#fca5a5`)}
    ${P([[32,32,.8],[28,28,.6],[36,36,.6]],`#fde68a`,.55)}`}function oi(){return`${N(32,54,22,4)}
    ${F(20,46,4.5)}${F(44,46,4.5)}
    <circle cx="32" cy="24" r="18" fill="#fbbf24" opacity="0.15"/>
    <path d="M32 6 L35 20 H48 L37 28 L40 42 L32 34 L24 42 L27 28 L16 20 H29 Z" fill="#fde68a" opacity="0.82" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 6 L35 20 H48 L37 28 L40 42 L32 34 L24 42 L27 28 L16 20 H29 Z" fill="none" stroke="#f59e0b" stroke-width="1.4"/>
    <path d="M32 14 L34 22 H40 L35 26 L36 34 L32 30 L28 34 L29 26 L24 22 H30 Z" fill="#fff" opacity="0.25"/>
    <path d="M14 38 L18 42 M50 38 L46 42" stroke="#86efac" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M16 32 L20 36 M48 32 L44 36" stroke="#fca5a5" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
    ${M(32,26,8,`#fde68a`,`#d97706`)}
    ${P([[20,12,.9],[44,12,.8],[32,4,1],[14,28,.7],[50,28,.7]],`#fff`,.55)}`}function si(){return`${N(32,56,18,4)}
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
    ${P([[14,10,.7],[50,10,.7],[32,28,.8]],`#fde68a`,.6)}`}function ci(){return`${N(32,54,22,4)}
    ${I(18,36,5.5)}${I(46,36,5.5)}
    <path d="M24 36 H40" stroke="#0f172a" stroke-width="4" opacity="0.2"/>
    <path d="M24 36 H40" stroke="#c4b5fd" stroke-width="3.2"/>
    <circle cx="32" cy="36" r="5" fill="#7c3aed" stroke="#0f172a" stroke-width="1.6"/>
    <circle cx="32" cy="36" r="3" fill="#e9d5ff" opacity="0.6"/>
    <path d="M24 36 C28 28 36 28 40 36 C36 44 28 44 24 36 Z" fill="none" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M24 36 C28 28 36 28 40 36 C36 44 28 44 24 36 Z" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.7"/>
    <path d="M18 36 L12 30 M18 36 L12 42 M46 36 L52 30 M46 36 L52 42" stroke="#f87171" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
    <path d="M22 32 L26 36 L22 40 M42 32 L38 36 L42 40" stroke="#c4b5fd" stroke-width="1.4" fill="none" opacity="0.5"/>
    ${Fr(32,36,4,`#e9d5ff`)}
    ${P([[32,28,.8],[32,44,.7]],`#e9d5ff`,.6)}`}function li(){return`${N(32,54,20,4)}
    ${F(22,38,5.5)}
    <circle cx="42" cy="38" r="6" fill="#2563eb" opacity="0.2" stroke="#93c5fd" stroke-width="2" stroke-dasharray="4 2"/>
    <circle cx="42" cy="38" r="5.5" fill="#2563eb" opacity="0.35" stroke="#0f172a" stroke-width="1.6" stroke-dasharray="3 2"/>
    <ellipse cx="42" cy="38" rx="4.5" ry="4.5" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="3 2"/>
    <ellipse cx="39" cy="35" rx="2.5" ry="1.8" fill="#93c5fd" opacity="0.35"/>
    <path d="M28 38 L36 38" stroke="#0f172a" stroke-width="3" stroke-dasharray="4 3" opacity="0.2"/>
    <path d="M28 38 L36 38" stroke="#fde68a" stroke-width="2.4" stroke-dasharray="4 3" opacity="0.75"/>
    <path d="M42 38 L42 30 M42 38 L42 46 M34 38 L50 38" stroke="#93c5fd" stroke-width="1.6" opacity="0.55"/>
    <circle cx="42" cy="38" r="11" fill="#7c3aed" opacity="0.12"/>
    <circle cx="42" cy="38" r="14" fill="none" stroke="#c4b5fd" stroke-width="0.8" opacity="0.3"/>
    ${P([[36,32,.7],[48,34,.6],[42,28,.8]],`#e9d5ff`,.55)}`}function ui(){return`${N(32,56,18,4)}
    ${F(32,42,6)}
    <path d="M20 12 L24 2 L28 10 L32 0 L36 10 L40 2 L44 12 L44 50 L20 50 Z" fill="#fef3c7" stroke="#0f172a" stroke-width="2"/>
    <path d="M20 12 L24 2 L28 10 L32 0 L36 10 L40 2 L44 12 L44 50 L20 50 Z" fill="none" stroke="#d97706" stroke-width="1.4" opacity="0.85"/>
    <path d="M24 20 H40 M24 28 H40 M24 36 H34" stroke="#92400e" stroke-width="1.4" opacity="0.6"/>
    <path d="M26 22 H38 M26 30 H38" stroke="#fbbf24" stroke-width="0.6" opacity="0.4"/>
    <path d="M20 8 L24 0 L28 8 L32 -2 L36 8 L40 0 L44 8" fill="#fbbf24" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M32 42 L32 28" stroke="#93c5fd" stroke-width="2.4" opacity="0.55"/>
    <path d="M22 36 L32 28 L42 36" fill="#2563eb" opacity="0.42" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M26 34 L32 30 L38 34" fill="#60a5fa" opacity="0.3"/>
    ${Nr(32,36,`#fbbf24`,`#fde68a`)}
    ${P([[24,6,.7],[40,6,.7],[32,16,.8]],`#fde68a`,.55)}`}function di(){let e=(e,t,n)=>{let r=[];for(let i=0;i<5;i++){let a=i*4*Math.PI/5-Math.PI/2,o=a+Math.PI/5;r.push([e+Math.cos(a)*n,t+Math.sin(a)*n]),r.push([e+Math.cos(o)*n*.42,t+Math.sin(o)*n*.42])}return`<polygon points="${r.map(([e,t])=>`${e.toFixed(1)},${t.toFixed(1)}`).join(` `)}" fill="#fde68a" stroke="#b45309" stroke-width="0.8"/>`},t=(e,t,n)=>`
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
  <rect width="${A}" height="${j}" fill="url(#cf-bg)"/>
  ${Er(`<ellipse cx="32" cy="56" rx="20" ry="4" fill="#000" opacity="0.35"/>
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
  ${jr(14,50,3.2)}${Lr(50,50,3.2)}`)}`}function fi(){return`${N(24,54,20,4)}
    ${I(48,20,5.5)}
    <ellipse cx="20" cy="40" rx="14" ry="12" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="2"/>
    <ellipse cx="20" cy="40" rx="14" ry="12" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <ellipse cx="20" cy="40" rx="8" ry="6" fill="#1e1b4b" opacity="0.65"/>
    <circle cx="20" cy="40" r="4" fill="#c4b5fd" opacity="0.75"/>
    <circle cx="20" cy="40" r="2" fill="#f0e6ff"/>
    <path d="M42 24 C34 28 26 34 22 38" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 24 C34 28 26 34 22 38" stroke="#fca5a5" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${R(40,22,24,36,`#fca5a5`,2.4)}
    <path d="M8 52 H32" stroke="#0f172a" stroke-width="2.8" opacity="0.25"/>
    <path d="M8 52 H32" stroke="#78716c" stroke-width="2.2" opacity="0.55"/>
    <rect x="10" y="50" width="20" height="5" rx="1.5" fill="#57534e" opacity="0.5" stroke="#44403c" stroke-width="1"/>
    <text x="12" y="49" font-size="5.5" fill="#d6d3d1" opacity="0.8" font-weight="600">start</text>
    ${P([[18,32,.8],[28,28,.6]],`#e9d5ff`,.55)}`}function pi(){return`${N(28,54,18,4)}
    ${F(22,44,5.5)}
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
    ${P([[30,8,.8],[52,6,.7],[24,28,.6]],`#e9d5ff`,.6)}`}function mi(){return`${N(32,52,22,4)}
    ${I(20,34,5.5)}${I(44,34,5.5)}
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
    ${P([[32,34,.9],[16,14,.7],[48,14,.7]],`#e0f2fe`,.6)}`}function hi(){return`${N(32,54,18,4)}
    ${F(32,48,5.5)}
    <path d="M32 44 L10 22 M32 44 L54 22" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 44 L10 22 M32 44 L54 22" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M14 26 L18 22 M50 26 L46 22" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
    ${Fr(44,16,5,`#e9d5ff`)}
    <text x="40" y="20" font-size="16" fill="#f0e6ff" opacity="0.95">♗</text>
    <circle cx="16" cy="24" r="4" fill="#a78bfa" opacity="0.65" stroke="#0f172a" stroke-width="1.2"/>
    <circle cx="48" cy="24" r="4" fill="#a78bfa" opacity="0.65" stroke="#0f172a" stroke-width="1.2"/>
    ${L(14,22,3,`#c4b5fd`)}${L(50,22,3,`#c4b5fd`)}
    ${P([[12,18,.7],[52,18,.7],[32,36,.6]],`#e9d5ff`,.55)}`}function gi(){return`${N(32,54,18,4)}
    ${F(32,48,5.5)}
    <path d="M32 44 V8 M32 44 H6 M32 44 H58" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 44 V8 M32 44 H6 M32 44 H58" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.85"/>
    <path d="M32 12 V4 M6 44 H2 M58 44 H62" stroke="#e9d5ff" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
    ${Fr(44,16,5,`#e9d5ff`)}
    <text x="40" y="20" font-size="16" fill="#f0e6ff" opacity="0.95">♜</text>
    <rect x="26" y="6" width="12" height="6" rx="1.5" fill="#a78bfa" opacity="0.5" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="28" y="8" width="8" height="2" rx="0.5" fill="#c4b5fd" opacity="0.4"/>
    ${L(32,8,3,`#c4b5fd`)}${L(6,44,3,`#c4b5fd`)}${L(58,44,3,`#c4b5fd`)}
    ${P([[32,6,.7],[4,44,.6],[60,44,.6]],`#e9d5ff`,.55)}`}function _i(){return`${N(30,52,20,4)}
    ${I(46,20,5.5)}
    <circle cx="46" cy="20" r="12" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.2"/>
    <circle cx="46" cy="20" r="12" fill="none" stroke="#fca5a5" stroke-width="1.8" opacity="0.55"/>
    <circle cx="46" cy="20" r="16" fill="#ef4444" opacity="0.1"/>
    <path d="M42 24 C32 30 24 36 18 42" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 24 C32 30 24 36 18 42" stroke="#f87171" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    ${R(40,22,20,40,`#fca5a5`,2.6)}
    ${L(18,42,6,`#93c5fd`)}
    <path d="M50 12 L54 8 M12 48 L8 52" stroke="#e9d5ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
    <path d="M28 32 L36 24" stroke="#fde68a" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.55"/>
    ${P([[36,26,.7],[22,38,.6]],`#fca5a5`,.5)}`}function vi(){return`${N(30,54,18,4)}
    ${F(18,50,5)}
    ${I(44,28,5)}
    ${R(22,46,40,32,`#c4b5fd`,2.8)}
    ${L(42,30,5,`#a78bfa`)}
    ${M(44,28,5,`#ef4444`,`#991b1b`)}
    <path d="M34 36 L46 24" stroke="#fde68a" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.5"/>
    ${P([[38,34,.7]],`#e9d5ff`,.5)}`}function yi(){return`${N(32,54,26,4)}
    <path d="M4 32 H60" stroke="#0f172a" stroke-width="6" opacity="0.15"/>
    <path d="M4 32 H60" stroke="#bae6fd" stroke-width="4.5" opacity="0.4"/>
    <path d="M4 32 H60" stroke="#e0f2fe" stroke-width="2" opacity="0.9"/>
    ${I(16,32,4.5)}${I(32,32,4.5)}${I(48,32,4.5)}
    <path d="M10 22 L14 26 M24 22 L28 26 M38 22 L42 26 M50 22 L54 26" stroke="#e0f2fe" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M12 20 L16 24 M26 20 L30 24 M40 20 L44 24 M52 20 L56 24" stroke="#7dd3fc" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
    <path d="M48 10 L52 6 M54 14 L58 10 M8 16 L4 12 M6 22 L2 18" stroke="#e0f2fe" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    <circle cx="52" cy="8" r="7" fill="#7dd3fc" opacity="0.18"/>
    <text x="50" y="12" font-size="10" fill="#e0f2fe" opacity="0.85">❄</text>
    ${P([[8,10,.8],[56,12,.9],[32,18,.7]],`#e0f2fe`,.65)}`}function bi(){return`${N(32,54,22,4)}
    ${F(14,48,4.5)}${F(32,32,5.5)}${F(50,16,4.5)}
    <path d="M8 52 L56 12" stroke="#0f172a" stroke-width="3" opacity="0.2" stroke-dasharray="5 3"/>
    <path d="M8 52 L56 12" stroke="#c4b5fd" stroke-width="2.2" opacity="0.45" stroke-dasharray="5 3"/>
    <path d="M24 24 L40 40 L24 48 L8 40 Z" fill="#7c3aed" opacity="0.5" stroke="#0f172a" stroke-width="2.2" transform="translate(4, 2)"/>
    <path d="M24 24 L40 40 L24 48 L8 40 Z" fill="none" stroke="#c4b5fd" stroke-width="1.6" transform="translate(4, 2)"/>
    <path d="M28 30 L34 36 M34 30 L28 36" stroke="#f0e6ff" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <circle cx="32" cy="36" r="14" fill="#a78bfa" opacity="0.12"/>
    ${Nr(32,34,`#7c3aed`,`#e9d5ff`)}
    ${P([[20,40,.7],[44,24,.7],[32,28,.8]],`#e9d5ff`,.55)}`}function xi(){return`${N(32,54,24,4)}
    <circle cx="32" cy="32" r="24" fill="#1e1b4b" opacity="0.68" stroke="#0f172a" stroke-width="2.4"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#6d28d9" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="17" fill="#312e81" opacity="0.48"/>
    <circle cx="32" cy="32" r="10" fill="#4c1d95" opacity="0.32"/>
    ${F(32,32,4.5)}${F(22,22,3.5)}${F(42,22,3.5)}${F(22,42,3.5)}${F(42,42,3.5)}
    <path d="M16 16 L48 48 M48 16 L16 48" stroke="#a78bfa" stroke-width="1.2" opacity="0.32"/>
    <circle cx="32" cy="32" r="24" fill="none" stroke="#c4b5fd" stroke-width="1.6" opacity="0.5"/>
    <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" stroke-width="0.8" opacity="0.25"/>
    ${P([[16,10,.7],[48,10,.7],[10,32,.6],[54,32,.6]],`#c4b5fd`,.45)}`}function Si(){return`${N(32,56,16,4)}
    ${F(32,34,6)}
    <circle cx="32" cy="34" r="14" fill="none" stroke="#0f172a" stroke-width="2.8" opacity="0.2"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#a78bfa" stroke-width="2.4" opacity="0.75"/>
    <circle cx="32" cy="34" r="19" fill="none" stroke="#7c3aed" stroke-width="1.8" opacity="0.55"/>
    <circle cx="32" cy="34" r="24" fill="none" stroke="#6d28d9" stroke-width="1.2" opacity="0.35"/>
    <path d="M32 14 L32 20 M32 48 L32 54 M14 34 L20 34 M44 34 L50 34" stroke="#c4b5fd" stroke-width="2" stroke-linecap="round" opacity="0.6"/>
    ${Nr(32,30,`#7c3aed`,`#e9d5ff`)}
    <text x="18" y="54" font-size="7" fill="#ddd6fe" opacity="0.8" font-weight="700">HOLD</text>
    ${P([[32,12,.8],[12,34,.6],[52,34,.6]],`#e9d5ff`,.5)}`}function Ci(){return`${N(32,56,16,4)}
    ${F(32,38,6)}
    <text x="14" y="16" font-size="11" fill="#c4b5fd" opacity="0.85" font-style="italic" font-weight="600">zzz</text>
    <path d="M20 10 C28 6 36 6 44 10" stroke="#a78bfa" stroke-width="2" fill="none" opacity="0.55"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="#fbbf24" opacity="0.88" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="none" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="24" cy="10" r="1.5" fill="#fde68a"/><circle cx="32" cy="6" r="1.5" fill="#fde68a"/><circle cx="40" cy="10" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="52" r="5" fill="#fbbf24" opacity="0.45"/>
    <path d="M24 50 C30 44 34 44 40 50" stroke="#fde68a" stroke-width="2" fill="none" opacity="0.7"/>
    ${M(32,14,5,`#fde68a`,`#b45309`)}
    ${P([[32,4,.8],[18,8,.6],[46,8,.6]],`#fde68a`,.55)}`}function wi(){return`${N(30,54,18,4)}
    ${F(28,36,6)}
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
    ${P([[12,12,.7],[46,18,.6]],`#fca5a5`,.5)}`}function Ti(){return`${N(32,54,20,4)}
    <path d="M32 6 L52 16 V40 L32 52 L12 40 V16 Z" fill="#312e81" opacity="0.55" stroke="#0f172a" stroke-width="2.4"/>
    <path d="M32 6 L52 16 V40 L32 52 L12 40 V16 Z" fill="none" stroke="#a78bfa" stroke-width="1.8"/>
    <path d="M32 10 L48 18 V38 L32 48 L16 38 V18 Z" fill="none" stroke="#c4b5fd" stroke-width="0.9" opacity="0.4"/>
    ${F(32,30,4.5)}${F(22,20,3.5)}${F(42,20,3.5)}${F(22,40,3.5)}${F(42,40,3.5)}
    <path d="M32 10 L35 22 H46 L38 28 L40 40 L32 34 L24 40 L26 28 L18 22 H29 Z" fill="#c4b5fd" opacity="0.55" stroke="#0f172a" stroke-width="1.2"/>
    <path d="M32 10 L35 22 H46 L38 28 L40 40 L32 34 L24 40 L26 28 L18 22 H29 Z" fill="none" stroke="#f0e6ff" stroke-width="0.9"/>
    ${P([[32,8,.8],[14,28,.6],[50,28,.6]],`#e9d5ff`,.5)}`}function Ei(){return`${N(32,54,20,4)}
    ${F(16,42,4.5)}${F(48,42,4.5)}
    <path d="M22 42 C28 32 36 32 42 42" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 42 C28 32 36 32 42 42" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M20 40 L30 28 M44 40 L34 28" stroke="#fbbf24" stroke-width="1.6" opacity="0.55"/>
    ${F(32,30,6)}
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="#fbbf24" opacity="0.88" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 14 L24 6 L28 12 L32 2 L36 12 L40 6 L44 14 L44 22 H20 Z" fill="none" stroke="#b45309" stroke-width="1.2"/>
    <circle cx="24" cy="10" r="1.5" fill="#fde68a"/><circle cx="32" cy="6" r="1.5" fill="#fde68a"/><circle cx="40" cy="10" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="52" r="5" fill="#fbbf24" opacity="0.45"/>
    <path d="M24 50 C30 44 34 44 40 50" stroke="#fde68a" stroke-width="2" fill="none" opacity="0.7"/>
    ${M(32,14,5,`#fde68a`,`#b45309`)}
    ${P([[24,36,.7],[40,36,.7],[32,8,.9]],`#fde68a`,.6)}`}function Di(){return`${N(32,54,18,4)}
    ${F(32,34,6)}
    <ellipse cx="32" cy="18" rx="12" ry="7" fill="#a78bfa" opacity="0.32" stroke="#c4b5fd" stroke-width="1"/>
    <path d="M10 18 L32 34 L54 18" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M10 18 L32 34 L54 18" stroke="#86efac" stroke-width="2.4" fill="none" opacity="0.65"/>
    <path d="M32 6 L32 34 M10 50 L32 34 L54 50" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M32 6 L32 34 M10 50 L32 34 L54 50" stroke="#93c5fd" stroke-width="2.4" fill="none" opacity="0.65"/>
    <path d="M14 14 L32 34 L50 50" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.5" stroke-dasharray="4 2"/>
    <circle cx="10" cy="18" r="4.5" fill="#4ade80" opacity="0.65" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="54" cy="18" r="4.5" fill="#60a5fa" opacity="0.65" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="10" cy="50" r="4.5" fill="#f87171" opacity="0.55" stroke="#0f172a" stroke-width="1.4"/>
    ${P([[32,12,.8],[8,34,.6],[56,34,.6]],`#e9d5ff`,.55)}`}function Oi(){return`${N(32,54,20,4)}
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
    ${P([[46,16,.7],[24,20,.5]],`#c4b5fd`,.45)}`}function ki(){return`${N(32,54,24,4)}
    ${F(12,16,4)}${I(52,16,4)}${F(12,50,4)}${I(52,50,4)}
    <path d="M16 16 L48 50 M52 16 L16 50" stroke="#0f172a" stroke-width="3.2" opacity="0.2"/>
    <path d="M16 16 L48 50 M52 16 L16 50" stroke="#c4b5fd" stroke-width="2.4" opacity="0.65"/>
    <path d="M16 16 L52 16 M12 50 L52 50 M16 16 L16 50 M52 16 L52 50" stroke="#a78bfa" stroke-width="1.4" opacity="0.35" stroke-dasharray="4 2"/>
    ${Fr(32,32,6,`#fde68a`)}
    <text x="26" y="38" font-size="14" fill="#fde68a" opacity="0.95" font-weight="700">✦</text>
    <path d="M20 20 L44 42 M44 20 L20 42" stroke="#e9d5ff" stroke-width="1.6" opacity="0.5"/>
    ${M(32,32,6,`#fde68a`,`#b45309`)}
    ${P([[8,8,.7],[56,8,.7],[8,56,.7],[56,56,.7]],`#fde68a`,.6)}`}function Ai(){return`${N(28,54,18,4)}
    ${F(18,44,5.5)}
    ${L(42,24,6,`#cbd5e1`)}
    ${R(24,40,38,28,`#e2e8f0`,3)}
    <path d="M20 38 C26 32 32 28 36 26" stroke="#0f172a" stroke-width="2.4" fill="none" opacity="0.2"/>
    <path d="M20 38 C26 32 32 28 36 26" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <ellipse cx="36" cy="28" rx="6" ry="3" fill="#64748b" opacity="0.2"/>
    <path d="M12 18 L16 14 M50 12 L54 8" stroke="#cbd5e1" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    ${P([[40,20,.7],[22,36,.5]],`#e2e8f0`,.45)}`}function ji(){return`${N(32,54,16,4)}
    ${F(32,20,5.5)}
    ${L(32,48,6,`#cbd5e1`)}
    ${R(32,26,32,42,`#e2e8f0`,3)}
    <path d="M24 34 C28 40 30 44 32 46" stroke="#0f172a" stroke-width="2.4" fill="none" opacity="0.2"/>
    <path d="M24 34 C28 40 30 44 32 46" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <ellipse cx="32" cy="50" rx="10" ry="3.5" fill="#64748b" opacity="0.28"/>
    <path d="M26 48 L32 54 L38 48" stroke="#94a3b8" stroke-width="1.4" fill="none" opacity="0.35"/>
    ${P([[32,16,.6],[32,44,.5]],`#cbd5e1`,.4)}`}function Mi(){return`${N(32,54,16,4)}
    ${F(32,26,5.5)}
    ${R(32,32,32,50,`#93c5fd`,3)}
    <path d="M22 46 L32 54 L42 46" stroke="#60a5fa" stroke-width="2" fill="none" opacity="0.55"/>
    <text x="42" y="48" font-size="9" fill="#cbd5e1" opacity="0.95" font-weight="700">×3</text>
    <circle cx="32" cy="40" r="12" fill="none" stroke="#0f172a" stroke-width="1.4" opacity="0.15"/>
    <circle cx="32" cy="40" r="12" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.35"/>
    <ellipse cx="32" cy="36" rx="5" ry="2.5" fill="#1e3a8a" opacity="0.2"/>
    <ellipse cx="32" cy="44" rx="6" ry="2.5" fill="#1e3a8a" opacity="0.15"/>
    ${P([[32,22,.6]],`#93c5fd`,.4)}`}function Ni(){return`${N(32,54,20,4)}
    ${F(20,36,4.5)}${F(44,36,4.5)}
    <path d="M32 8 V24 M32 24 C32 34 22 36 22 44 C22 52 32 54 32 54 C32 54 42 52 42 44 C42 36 32 34 32 24 Z" fill="#94a3b8" opacity="0.78" stroke="#0f172a" stroke-width="2"/>
    <path d="M32 8 V24 M32 24 C32 34 22 36 22 44 C22 52 32 54 32 54 C32 54 42 52 42 44 C42 36 32 34 32 24 Z" fill="none" stroke="#e2e8f0" stroke-width="1.6"/>
    <path d="M26 28 L38 28 M28 38 L36 38" stroke="#cbd5e1" stroke-width="1.4" opacity="0.55"/>
    <path d="M16 36 L24 36 M40 36 L48 36" stroke="#64748b" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.4"/>
    <path d="M30 10 L34 10 M32 6 L32 12" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    ${P([[32,6,.7]],`#cbd5e1`,.4)}`}function Pi(){return`${N(32,54,22,4)}
    ${F(32,24,5.5)}
    ${R(32,30,32,46,`#93c5fd`,2.8)}
    <path d="M6 52 H58" stroke="#0f172a" stroke-width="3" opacity="0.2"/>
    <path d="M6 52 H58" stroke="#64748b" stroke-width="2.4" opacity="0.6"/>
    <rect x="8" y="48" width="48" height="7" rx="1.5" fill="#475569" opacity="0.5" stroke="#0f172a" stroke-width="1.2"/>
    <rect x="10" y="50" width="44" height="3" rx="0.5" fill="#64748b" opacity="0.3"/>
    <path d="M12 46 L16 42 M52 46 L48 42" stroke="#94a3b8" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <text x="14" y="47" font-size="5.5" fill="#cbd5e1" opacity="0.85" font-weight="700">BACK ROW</text>
    ${P([[20,40,.5],[44,40,.5]],`#93c5fd`,.4)}`}function Fi(){return`${N(30,54,20,4)}
    ${F(20,36,5)}${I(40,36,5)}
    ${L(54,36,5,`#fca5a5`)}
    ${R(26,36,50,36,`#fde68a`,3)}
    <path d="M32 30 L42 30" stroke="#0f172a" stroke-width="2.4" opacity="0.2"/>
    <path d="M32 30 L42 30" stroke="#fbbf24" stroke-width="1.8" opacity="0.55"/>
    ${M(46,36,5,`#fca5a5`,`#dc2626`)}
    ${P([[48,32,.6]],`#fde68a`,.45)}`}function Ii(){return`${N(28,54,20,4)}
    ${F(12,50,4.5)}${F(28,32,4.5)}
    ${L(46,16,5,`#cbd5e1`)}
    <path d="M16 46 Q30 10 44 20" stroke="#0f172a" stroke-width="4" fill="none" opacity="0.2"/>
    <path d="M16 46 Q30 10 44 20" stroke="#93c5fd" stroke-width="2.8" fill="none"/>
    ${Mr(16,46,44,20,`#93c5fd`,2.6)}
    <path d="M42 18 L46 14 M42 22 L46 26" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <ellipse cx="28" cy="34" rx="7" ry="3.5" fill="#1e3a8a" opacity="0.3"/>
    ${P([[30,14,.8],[20,38,.5]],`#bae6fd`,.5)}`}function Li(){return`${N(32,54,18,4)}
    ${F(32,40,5.5)}
    <path d="M12 14 Q32 2 52 14 Q44 32 32 24 Q20 32 12 14" stroke="#0f172a" stroke-width="3" fill="#7c3aed" fill-opacity="0.15" opacity="0.3"/>
    <path d="M12 14 Q32 2 52 14 Q44 32 32 24 Q20 32 12 14" stroke="#c4b5fd" stroke-width="2.4" fill="#7c3aed" fill-opacity="0.12" opacity="0.7" stroke-dasharray="4 2"/>
    ${L(26,16,5,`#93c5fd`)}${L(44,28,4,`#c4b5fd`)}
    <text x="40" y="18" font-size="14" fill="#fde68a" opacity="0.95" font-weight="700">?</text>
    <path d="M18 10 L22 6 M46 8 L50 4" stroke="#e9d5ff" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
    ${P([[24,12,.8],[48,20,.7],[32,6,.9]],`#e9d5ff`,.55)}`}function Ri(){return`${N(32,54,22,4)}
    ${F(32,30,6)}${F(14,46,4)}${F(50,46,4)}
    <circle cx="32" cy="30" r="22" fill="none" stroke="#0f172a" stroke-width="2" opacity="0.15"/>
    <circle cx="32" cy="30" r="22" fill="none" stroke="#93c5fd" stroke-width="2" opacity="0.5"/>
    <circle cx="32" cy="30" r="16" fill="#2563eb" opacity="0.1"/>
    <path d="M14 46 L24 36 M50 46 L40 36" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M14 46 L24 36 M50 46 L40 36" stroke="#60a5fa" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.65"/>
    <path d="M32 12 L35 20 H42 L36 26 L38 32 L32 28 L26 32 L28 26 L22 20 H29 Z" fill="#60a5fa" opacity="0.28" stroke="#0f172a" stroke-width="1"/>
    <path d="M32 12 L35 20 H42 L36 26 L38 32 L32 28 L26 32 L28 26 L22 20 H29 Z" fill="none" stroke="#93c5fd" stroke-width="0.9"/>
    ${P([[32,10,.8],[16,40,.5],[48,40,.5]],`#93c5fd`,.45)}`}function zi(){return`${N(32,54,16,4)}
    ${F(32,36,6)}
    <circle cx="16" cy="20" r="12" fill="#ef4444" opacity="0.12" stroke="#0f172a" stroke-width="1.8"/>
    <circle cx="16" cy="20" r="12" fill="none" stroke="#f87171" stroke-width="1.6"/>
    <path d="M10 14 L22 26 M22 14 L10 26" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round" opacity="0.3"/>
    <path d="M10 14 L22 26 M22 14 L10 26" stroke="#f87171" stroke-width="2.8" stroke-linecap="round"/>
    <text x="36" y="18" font-size="8" fill="#cbd5e1" opacity="0.9" font-weight="700">SKIP</text>
    <path d="M26 30 L38 30" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.45"/>
    ${P([[16,12,.6]],`#fca5a5`,.4)}`}function Bi(){return`${N(32,54,18,4)}
    ${F(32,34,6)}
    <path d="M12 18 C22 34 16 50 32 50 C48 50 42 34 52 18" stroke="#0f172a" stroke-width="3.2" fill="none" opacity="0.25"/>
    <path d="M12 18 C22 34 16 50 32 50 C48 50 42 34 52 18" stroke="#94a3b8" stroke-width="2.6" fill="none"/>
    <path d="M16 26 L26 36 M48 26 L38 36" stroke="#0f172a" stroke-width="3.4" stroke-linecap="round" opacity="0.25"/>
    <path d="M16 26 L26 36 M48 26 L38 36" stroke="#e2e8f0" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M18 28 L24 34 M46 28 L40 34" stroke="#64748b" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#cbd5e1" stroke-width="1" opacity="0.3"/>
    ${P([[32,20,.7]],`#e2e8f0`,.4)}`}function Vi(){return`${N(32,54,16,4)}
    ${I(32,40,6)}
    <path d="M18 12 L22 2 L26 8 L32 -2 L38 8 L42 2 L46 12 L46 20 H18 Z" fill="#fbbf24" opacity="0.72" stroke="#0f172a" stroke-width="2"/>
    <path d="M18 12 L22 2 L26 8 L32 -2 L38 8 L42 2 L46 12 L46 20 H18 Z" fill="none" stroke="#b45309" stroke-width="1.4"/>
    <path d="M20 14 L44 38 M44 14 L20 38" stroke="#0f172a" stroke-width="3.2" opacity="0.3"/>
    <path d="M20 14 L44 38 M44 14 L20 38" stroke="#fca5a5" stroke-width="2.6" opacity="0.85"/>
    <path d="M26 6 L32 10 L38 6" stroke="#fde68a" stroke-width="1.4" fill="none" opacity="0.55"/>
    ${M(32,26,6,`#fca5a5`,`#dc2626`)}
    ${P([[24,4,.6],[40,4,.6]],`#fde68a`,.45)}`}function Hi(){return`${N(32,54,18,4)}
    ${Pr(32,36,32)}
    <path d="M16 44 C26 34 38 34 48 44 C38 54 26 54 16 44 Z" fill="#a8a29e" opacity="0.62" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M20 40 C28 36 36 36 44 40" stroke="#d6d3d1" stroke-width="1.6" fill="none" opacity="0.55"/>
    <path d="M22 46 C30 42 34 42 42 46" stroke="#78716c" stroke-width="1.4" fill="none" opacity="0.4"/>
    <text x="38" y="16" font-size="10" fill="#d6d3d1" opacity="0.75" font-weight="700">?</text>
    <path d="M24 38 L28 42 M36 38 L32 42" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
    ${P([[30,36,.5]],`#d6d3d1`,.35)}`}function Ui(){return`${N(32,54,16,4)}
    <rect x="16" y="18" width="32" height="32" rx="2.5" fill="#292524" opacity="0.48" stroke="#0f172a" stroke-width="2"/>
    <rect x="16" y="18" width="32" height="32" rx="2.5" fill="none" stroke="#57534e" stroke-width="1.4"/>
    <path d="M18 20 H46 M18 48 H46 M18 20 V48 M46 20 V48" stroke="#78716c" stroke-width="0.8" opacity="0.3"/>
    ${I(32,34,6)}
    <path d="M40 14 L46 8 M42 18 L48 12" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <text x="40" y="16" font-size="12" fill="#fca5a5" opacity="0.95" font-weight="700">+</text>
    ${M(32,34,5,`#ef4444`,`#991b1b`)}
    ${P([[46,10,.7]],`#fca5a5`,.5)}`}function Wi(){return`${N(32,54,16,4)}
    <rect x="18" y="14" width="28" height="36" rx="2.5" fill="#334155" opacity="0.45" stroke="#0f172a" stroke-width="2"/>
    <rect x="18" y="14" width="28" height="36" rx="2.5" fill="none" stroke="#64748b" stroke-width="1.4"/>
    <path d="M22 16 V50 M42 16 V50" stroke="#0f172a" stroke-width="4.2" opacity="0.25"/>
    <path d="M22 16 V50 M42 16 V50" stroke="#cbd5e1" stroke-width="3.4" opacity="0.9"/>
    <path d="M20 22 H46 M20 32 H46 M20 42 H46" stroke="#94a3b8" stroke-width="1.2" opacity="0.45"/>
    <path d="M24 18 L28 22 L24 26 M38 18 L34 22 L38 26" stroke="#e2e8f0" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${P([[32,20,.5],[32,40,.5]],`#cbd5e1`,.35)}`}function Gi(){return`${N(32,54,16,4)}
    ${I(32,22,6)}
    <path d="M24 14 L28 10 M40 14 L36 10" stroke="#fca5a5" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <path d="M26 12 L30 8 M38 12 L34 8" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>
    ${R(32,30,32,50,`#fca5a5`,3)}
    <path d="M24 50 L32 42 L40 50" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M24 50 L32 42 L40 50" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="28" r="12" fill="#ef4444" opacity="0.1"/>
    ${M(32,48,5,`#fca5a5`,`#dc2626`)}
    ${P([[28,16,.6],[36,16,.6]],`#fca5a5`,.45)}`}function Ki(){return`${N(32,54,20,4)}
    ${F(16,34,5.5)}${F(48,34,5.5)}
    <path d="M22 34 L42 34" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 34 L42 34" stroke="#93c5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M42 28 L22 28" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M42 28 L22 28" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M32 22 L32 46" stroke="#fde68a" stroke-width="2" stroke-dasharray="3 2" opacity="0.6"/>
    <circle cx="32" cy="34" r="8" fill="#a78bfa" opacity="0.15" stroke="#c4b5fd" stroke-width="1"/>
    ${Fr(32,34,4,`#c4b5fd`)}
    ${P([[32,30,.7]],`#e9d5ff`,.45)}`}function qi(){return`${N(28,54,18,4)}
    ${F(12,34,5.5)}
    ${L(50,34,6,`#cbd5e1`)}
    ${R(18,34,44,34,`#e2e8f0`,3)}
    <path d="M22 28 L28 34 L22 40" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.2"/>
    <path d="M22 28 L28 34 L22 40" stroke="#94a3b8" stroke-width="1.6" fill="none" opacity="0.45"/>
    <text x="28" y="18" font-size="7" fill="#cbd5e1" opacity="0.7" font-weight="700">×2</text>
    <ellipse cx="28" cy="34" rx="5" ry="2.5" fill="#64748b" opacity="0.2"/>
    ${P([[46,30,.6]],`#e2e8f0`,.4)}`}function Ji(){return`${N(32,54,18,4)}
    ${I(32,28,6)}
    ${R(32,36,32,54,`#fca5a5`,3)}
    <path d="M32 54 L26 46 M32 54 L38 46" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M32 54 L26 46 M32 54 L38 46" stroke="#fca5a5" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M18 54 H46" stroke="#0f172a" stroke-width="2.4" opacity="0.25"/>
    <path d="M18 54 H46" stroke="#64748b" stroke-width="1.8" opacity="0.55"/>
    <path d="M24 46 L28 50 L32 46 L36 50 L40 46" stroke="#f87171" stroke-width="1.4" fill="none" opacity="0.45"/>
    ${M(32,52,5,`#fca5a5`,`#dc2626`)}`}function Yi(){return`${N(32,56,16,4)}
    ${F(32,38,6)}
    ${Nr(32,30,`#60a5fa`,`#93c5fd`)}
    <circle cx="32" cy="32" r="18" fill="none" stroke="#0f172a" stroke-width="1.6" opacity="0.15"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.35"/>
    ${P([[32,18,.7],[20,32,.5],[44,32,.5]],`#bae6fd`,.4)}`}function Xi(){return`${N(32,54,18,4)}
    ${F(32,36,6)}
    <circle cx="16" cy="18" r="10" fill="#e0f2fe" opacity="0.55" stroke="#0f172a" stroke-width="2"/>
    <circle cx="16" cy="18" r="10" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M10 12 L22 24 M22 12 L10 24" stroke="#bae6fd" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>
    <path d="M18 26 L30 34" stroke="#0f172a" stroke-width="2.8" stroke-dasharray="3 2" opacity="0.2"/>
    <path d="M18 26 L30 34" stroke="#bae6fd" stroke-width="2" stroke-dasharray="3 2" opacity="0.7"/>
    <path d="M12 8 L14 4 M18 10 L22 6" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${P([[14,10,.7],[20,22,.5]],`#e0f2fe`,.5)}`}function Zi(){return`${N(30,54,20,4)}
    ${F(14,50,5.5)}
    ${L(50,14,6,`#7dd3fc`)}
    ${R(18,46,46,18,`#bae6fd`,3)}
    <path d="M20 42 L32 30 L40 22" stroke="#0f172a" stroke-width="2" fill="none" opacity="0.2" stroke-dasharray="3 2"/>
    <path d="M20 42 L32 30 L40 22" stroke="#38bdf8" stroke-width="1.6" fill="none" opacity="0.45" stroke-dasharray="3 2"/>
    <ellipse cx="30" cy="36" rx="6" ry="3" fill="#1e3a8a" opacity="0.2"/>
    ${P([[48,12,.7],[24,38,.5]],`#bae6fd`,.45)}`}function Qi(){return`${N(32,56,16,4)}
    ${F(32,38,6)}
    ${Nr(32,28,`#38bdf8`,`#7dd3fc`)}
    <circle cx="32" cy="34" r="20" fill="none" stroke="#0f172a" stroke-width="1.8" opacity="0.15"/>
    <circle cx="32" cy="34" r="20" fill="none" stroke="#bae6fd" stroke-width="1.8" opacity="0.55"/>
    <circle cx="32" cy="34" r="24" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3"/>
    ${P([[32,14,.8],[14,34,.5],[50,34,.5]],`#bae6fd`,.45)}`}function $i(){return`${N(32,54,16,4)}
    ${I(32,34,6)}
    <circle cx="32" cy="16" r="12" fill="#86efac" opacity="0.18" stroke="#0f172a" stroke-width="1.6"/>
    <circle cx="32" cy="16" r="12" fill="none" stroke="#4ade80" stroke-width="1.4"/>
    <path d="M26 8 C30 12 34 12 38 8 M24 14 C32 20 40 14" stroke="#86efac" stroke-width="1.8" fill="none" opacity="0.75"/>
    <path d="M24 48 H40" stroke="#0f172a" stroke-width="3.2" opacity="0.2"/>
    <path d="M24 48 H40" stroke="#4ade80" stroke-width="2.6" opacity="0.65"/>
    <path d="M26 52 H38" stroke="#22c55e" stroke-width="1.8" opacity="0.45"/>
    <circle cx="32" cy="34" r="14" fill="none" stroke="#86efac" stroke-width="1.2" opacity="0.35"/>
    ${P([[32,10,.7],[28,44,.5],[36,44,.5]],`#86efac`,.45)}`}function ea(){return`${N(26,54,16,4)}
    ${F(24,38,5.5)}
    <path d="M24 26 L32 18 V38 C32 46 24 50 24 50 C24 50 16 46 16 38 V22 Z" fill="#38bdf8" opacity="0.42" stroke="#0f172a" stroke-width="2"/>
    <path d="M24 26 L32 18 V38 C32 46 24 50 24 50 C24 50 16 46 16 38 V22 Z" fill="none" stroke="#7dd3fc" stroke-width="1.6"/>
    <path d="M34 24 L54 12" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 24 L54 12" stroke="#fde68a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${I(52,12,4.5)}
    <path d="M36 26 L44 16" stroke="#fbbf24" stroke-width="2" opacity="0.75"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="#4c1d95" opacity="0.55" stroke="#0f172a" stroke-width="1.4"/>
    <path d="M10 14 L14 18 L10 22 L6 18 Z" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
    <text x="8" y="54" font-size="6.5" fill="#cbd5e1" opacity="0.65" font-weight="700">TRAP</text>
    ${P([[48,10,.6]],`#fde68a`,.45)}`}function ta(){return`${N(30,54,18,4)}
    ${F(20,50,4.5)}${I(44,22,5.5)}
    <path d="M24 46 L40 28" stroke="#0f172a" stroke-width="4.2" fill="none" stroke-linecap="round" opacity="0.25"/>
    <path d="M24 46 L40 28" stroke="#fde68a" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 26 L46 16 L42 32 L52 26 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.6"/>
    <path d="M40 24 L44 20" stroke="#fff" stroke-width="1" opacity="0.4"/>
    ${M(42,24,6,`#ef4444`,`#991b1b`)}
    ${P([[42,20,.7]],`#fde68a`,.5)}`}function na(){return`${N(32,56,16,4)}
    ${F(32,40,6)}
    <path d="M18 16 L22 4 L26 10 L32 -2 L38 10 L42 4 L46 16 L46 26 H18 Z" fill="#fbbf24" opacity="0.9" stroke="#0f172a" stroke-width="2"/>
    <path d="M18 16 L22 4 L26 10 L32 -2 L38 10 L42 4 L46 16 L46 26 H18 Z" fill="none" stroke="#b45309" stroke-width="1.4"/>
    <circle cx="22" cy="8" r="1.5" fill="#fde68a"/><circle cx="32" cy="2" r="1.5" fill="#fde68a"/><circle cx="42" cy="8" r="1.5" fill="#fde68a"/>
    <circle cx="32" cy="26" r="12" fill="#fbbf24" opacity="0.2"/>
    <path d="M22 12 L28 8 L32 12 L36 8 L42 12" stroke="#fde68a" stroke-width="1.2" fill="none" opacity="0.55"/>
    <circle cx="32" cy="6" r="4" fill="#fde68a" opacity="0.4"/>
    ${P([[22,4,.7],[32,0,.8],[42,4,.7]],`#fde68a`,.6)}`}function ra(){return`${N(30,54,20,4)}
    ${F(16,48,5)}${I(48,16,4.5)}
    <circle cx="48" cy="16" r="14" fill="#38bdf8" opacity="0.12" stroke="#0f172a" stroke-width="2"/>
    <circle cx="48" cy="16" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.8" opacity="0.65"/>
    <path d="M22 44 L40 22" stroke="#0f172a" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 44 L40 22" stroke="#bae6fd" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="5 3"/>
    <circle cx="48" cy="16" r="4" fill="#38bdf8" opacity="0.8" stroke="#0f172a" stroke-width="1"/>
    <path d="M18 42 L14 46 M50 12 L54 8" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${P([[46,12,.8],[24,40,.5]],`#e0f2fe`,.5)}`}function ia(){return`${N(32,54,16,4)}
    ${Pr(32,36,32)}
    <circle cx="32" cy="36" r="7" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
    <circle cx="32" cy="36" r="5" fill="#b91c1c"/>
    <ellipse cx="30" cy="34" rx="2.5" ry="1.8" fill="#fca5a5" opacity="0.45"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#0f172a" stroke-width="2.8" opacity="0.3"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#fca5a5" stroke-width="2.2"/>
    <path d="M32 26 L32 22 M26 32 L22 30 M38 32 L42 30" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>
    ${P([[32,24,.6]],`#fca5a5`,.4)}`}function aa(){return`${N(32,54,18,4)}
    ${I(32,20,6)}
    ${R(32,28,32,50,`#fca5a5`,3)}
    <path d="M18 52 H46" stroke="#0f172a" stroke-width="2.8" opacity="0.25"/>
    <path d="M18 52 H46" stroke="#64748b" stroke-width="2.2" opacity="0.55"/>
    <path d="M24 48 L32 40 L40 48" stroke="#fca5a5" stroke-width="2" fill="none" opacity="0.65"/>
    <rect x="18" y="50" width="28" height="5" rx="1.5" fill="#475569" opacity="0.42" stroke="#334155" stroke-width="1"/>
    ${P([[32,44,.5]],`#fca5a5`,.4)}`}function oa(){return`${N(32,54,16,4)}
    ${I(32,24,6)}
    <path d="M18 46 C28 34 36 34 46 46" stroke="#0f172a" stroke-width="3" fill="none" opacity="0.2"/>
    <path d="M18 46 C28 34 36 34 46 46" stroke="#86efac" stroke-width="2.4" fill="none" opacity="0.85"/>
    <path d="M20 52 C30 40 34 40 44 52" stroke="#4ade80" stroke-width="2" fill="none" opacity="0.65"/>
    <path d="M24 44 L32 34 L40 44" stroke="#22c55e" stroke-width="1.8" fill="none" opacity="0.6"/>
    <path d="M26 42 L22 50 M38 42 L42 50" stroke="#16a34a" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
  <path d="M28 48 L24 54 M36 48 L40 54" stroke="#86efac" stroke-width="1.4" stroke-linecap="round" opacity="0.35"/>
    ${P([[20,40,.5],[44,40,.5]],`#86efac`,.4)}`}function sa(){return`${N(30,54,20,4)}
    <circle cx="16" cy="44" r="6" fill="#2563eb" opacity="0.28" stroke="#0f172a" stroke-width="1.8" stroke-dasharray="4 2"/>
    <circle cx="16" cy="44" r="6" fill="none" stroke="#93c5fd" stroke-width="1.4" stroke-dasharray="4 2"/>
    ${I(48,22,6)}
    <path d="M22 40 L44 28" stroke="#0f172a" stroke-width="3.2" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 40 L44 28" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M46 18 L54 26 M46 30 L54 22 M42 24 L54 24 M46 18 L46 32" stroke="#0f172a" stroke-width="2.8" stroke-linecap="round" opacity="0.25"/>
    <path d="M46 18 L54 26 M46 30 L54 22 M42 24 L54 24 M46 18 L46 32" stroke="#ef4444" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="16" cy="44" r="10" fill="#dc2626" opacity="0.1"/>
    ${M(48,22,5,`#ef4444`,`#991b1b`)}`}function ca(){return`${N(32,54,18,4)}
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="#475569" opacity="0.55" stroke="#0f172a" stroke-width="1.8"/>
    <rect x="26" y="26" width="12" height="12" rx="1.5" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
    ${F(32,12,3.5)}${I(52,32,3.5)}${F(32,52,3.5)}${I(12,32,3.5)}
    <path d="M32 22 L32 12" stroke="#0f172a" stroke-width="2.8" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M32 22 L32 12" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M38 32 L50 32" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M32 38 L32 48" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M26 32 L14 32" stroke="#bae6fd" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="#0f172a" stroke-width="1.2" opacity="0.15"/>
    <circle cx="32" cy="32" r="16" fill="none" stroke="#7dd3fc" stroke-width="0.9" opacity="0.3"/>
    ${P([[32,8,.6],[56,32,.6],[32,56,.6],[8,32,.6]],`#bae6fd`,.4)}`}function la(){return`${N(26,54,20,4)}
    ${F(12,42,4.5)}${F(30,42,4.5)}
    <path d="M16 38 L8 24" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M16 38 L8 24" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M34 38 L42 24" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M34 38 L42 24" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${L(8,24,4.5,`#7dd3fc`)}${L(42,24,4.5,`#7dd3fc`)}
    <path d="M18 36 L28 36" stroke="#60a5fa" stroke-width="1.6" opacity="0.4"/>
    ${R(14,38,10,26,`#93c5fd`,2.2)}${R(32,38,40,26,`#93c5fd`,2.2)}
    ${P([[8,20,.6],[42,20,.6]],`#bae6fd`,.4)}`}function ua(){return`${N(32,54,22,4)}
    <path d="M4 30 H60" stroke="#0f172a" stroke-width="2.8" opacity="0.18"/>
    <path d="M4 30 H60" stroke="#64748b" stroke-width="2" opacity="0.45" stroke-dasharray="5 3"/>
    <rect x="6" y="30" width="52" height="22" rx="2" fill="#4c1d95" opacity="0.16" stroke="#553c7a" stroke-width="1.2"/>
    <text x="10" y="38" font-size="5" fill="#c4b5fd" opacity="0.8" font-weight="700">YOUR SIDE</text>
    ${kr(44,18,5)}
    ${F(18,48,5)}
    ${L(44,18,5.5,`#a78bfa`)}
    <path d="M22 44 Q34 20 44 18" stroke="#0f172a" stroke-width="3.6" fill="none" stroke-linecap="round" opacity="0.2"/>
    <path d="M22 44 Q34 20 44 18" stroke="#c4b5fd" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-dasharray="5 3"/>
    ${Mr(22,44,44,18,`#a78bfa`,2.4)}
    <circle cx="44" cy="18" r="10" fill="#a78bfa" opacity="0.12" stroke="#0f172a" stroke-width="1.4"/>
    <circle cx="44" cy="18" r="10" fill="none" stroke="#c4b5fd" stroke-width="1.4" opacity="0.55"/>
    <path d="M40 14 L48 22 M48 14 L40 22" stroke="#e9d5ff" stroke-width="1.4" stroke-linecap="round" opacity="0.45"/>
    ${P([[44,10,.75],[30,28,.55],[20,46,.5]],`#e9d5ff`,.5)}`}function da(){return`${N(32,54,24,4)}
    <path d="M4 46 H60" stroke="#0f172a" stroke-width="3" opacity="0.2"/>
    <path d="M4 46 H60" stroke="#64748b" stroke-width="2.6" opacity="0.6"/>
    <rect x="6" y="42" width="52" height="6" rx="1.5" fill="#475569" opacity="0.42" stroke="#334155" stroke-width="1"/>
    ${F(12,44,4)}${F(28,44,4)}${F(44,44,4)}
    <path d="M22 32 L28 38 L22 44 L16 38 Z" fill="#38bdf8" opacity="0.55" stroke="#0f172a" stroke-width="1.6" transform="translate(2, 0)"/>
    <path d="M22 32 L28 38 L22 44 L16 38 Z" fill="none" stroke="#7dd3fc" stroke-width="1.2" transform="translate(2, 0)"/>
    <circle cx="32" cy="36" r="14" fill="none" stroke="#0f172a" stroke-width="1.4" opacity="0.15"/>
    <circle cx="32" cy="36" r="14" fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.35"/>
    <circle cx="32" cy="36" r="20" fill="none" stroke="#38bdf8" stroke-width="0.8" opacity="0.2"/>
    ${P([[32,28,.7],[12,38,.5],[52,38,.5]],`#bae6fd`,.45)}`}function fa(){return`${N(32,56,14,3)}
    ${F(32,34,6)}
    ${Nr(32,28,`#38bdf8`,`#7dd3fc`)}
    <path d="M14 50 L28 36" stroke="#fde68a" stroke-width="2.4" opacity="0.6"/>
    <path d="M12 16 L16 20 L12 24 L8 20 Z" fill="#4c1d95" opacity="0.45" stroke="#a78bfa" stroke-width="1"/>
    <text x="10" y="18" font-size="6" fill="#e9d5ff" opacity="0.55">?</text>`}function pa(){return`${N(30,54,18,3.5)}
    ${I(42,22,5.5)}${F(20,48,4.5)}
    <path d="M24 44 L38 28" stroke="#e0f2fe" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 14 L46 22 L34 22 Z" fill="#7dd3fc" opacity="0.75" stroke="#bae6fd" stroke-width="1"/>
    <path d="M44 12 L48 8 M38 16 L34 12" stroke="#e0f2fe" stroke-width="1.4" stroke-linecap="round" opacity="0.65"/>
    <circle cx="42" cy="22" r="8" fill="#7dd3fc" opacity="0.12"/>`}function ma(){return`${N(32,54,14,3.5)}
    ${Pr(32,36,30,!1)}
    ${Lr(32,34,4)}
    <path d="M20 44 L32 32 L44 44 M22 50 L42 50" stroke="#a8a29e" stroke-width="2.2" opacity="0.7" stroke-linecap="round"/>
    <path d="M26 30 L38 42 M38 30 L26 42" stroke="#78716c" stroke-width="1.6" opacity="0.5"/>
    <path d="M24 38 L28 42 M36 38 L40 42" stroke="#d6d3d1" stroke-width="1.2" stroke-linecap="round" opacity="0.4"/>`}function ha(){return`${N(32,56,14,3)}
    ${F(32,38,7)}
    <path d="M20 16 L24 4 L28 10 L32 0 L36 10 L40 4 L44 16 L44 24 H20 Z" fill="#fbbf24" opacity="0.85" stroke="#b45309" stroke-width="1.4"/>
    ${Nr(32,34,`#38bdf8`,`#7dd3fc`)}
    <circle cx="32" cy="12" r="4" fill="#fde68a" opacity="0.3"/>`}function ga(){return`${N(32,54,20,4)}
    ${F(16,50,4)}${I(50,12,5.5)}
    <path d="M20 46 L46 16" stroke="#fde68a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="12" r="10" fill="none" stroke="#fca5a5" stroke-width="1.6" opacity="0.5"/>
    <circle cx="50" cy="12" r="6" fill="#ef4444" opacity="0.1"/>
    <path d="M44 18 L50 12 L48 22" stroke="#ef4444" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M18 44 L22 40 M46 18 L50 14" stroke="#fbbf24" stroke-width="1.2" stroke-linecap="round" opacity="0.45"/>`}function _a(){return`${N(32,54,18,3.5)}
    ${F(20,26,4.5)}${F(44,26,4.5)}
    <path d="M20 32 L20 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M44 32 L44 50" stroke="#93c5fd" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M20 50 L16 44 M20 50 L24 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M44 50 L40 44 M44 50 L48 44" stroke="#93c5fd" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M16 50 H48" stroke="#64748b" stroke-width="1.4" opacity="0.4"/>
    <circle cx="32" cy="40" r="14" fill="none" stroke="#60a5fa" stroke-width="0.8" opacity="0.2"/>`}var va={nudge:()=>z(`nu`,`#94a3b8`,`#1e293b`,Ai()),backstep:()=>z(`bs`,`#9ca3af`,`#1f2937`,ji()),retreat_3:()=>z(`ret`,`#93c5fd`,`#1e3a5f`,Mi()),leapfrog:()=>z(`lf`,`#94a3b8`,`#1e293b`,Ii()),long_step:()=>B(`ls`,`#7dd3fc`,`#1e3a5f`,Zi()),sidestep:()=>z(`ss`,`#9ca3af`,`#1f2937`,qi()),blink_2:()=>B(`bl`,`#38bdf8`,`#0c4a6e`,ra()),random_teleport:()=>z(`rtp`,`#a78bfa`,`#312e81`,Li()),recall:()=>z(`rc`,`#93c5fd`,`#1e3a5f`,Pi()),repel:()=>z(`rp`,`#94a3b8`,`#1e293b`,Fi()),mass_nudge:()=>B(`mn`,`#7dd3fc`,`#1e3a5f`,la()),displacement:()=>V(`dp`,`#b794f4`,`#553c7a`,ua()),swap_friendly:()=>z(`sw`,`#a78bfa`,`#312e81`,Ki()),dominion:()=>B(`dm`,`#60a5fa`,`#1e3a5f`,_a()),shield_1:()=>z(`s1`,`#60a5fa`,`#1e3a5f`,Yi()),shield_2:()=>B(`s2`,`#38bdf8`,`#0c4a6e`,Qi()),bulwark:()=>V(`bw`,`#b794f4`,`#553c7a`,bi()),barrier:()=>z(`br`,`#94a3b8`,`#1f2937`,Wi()),last_stand:()=>B(`ls`,`#38bdf8`,`#0c4a6e`,fa()),fortify:()=>V(`fo`,`#a78bfa`,`#4c1d95`,Si()),sanctuary_pulse:()=>B(`sp`,`#7dd3fc`,`#1e3a5f`,da()),sanctuary:()=>V(`sa`,`#c4b5fd`,`#4c1d95`,Ti()),deflect_1:()=>B(`df`,`#38bdf8`,`#0c4a6e`,ea()),anchor_2:()=>z(`an`,`#94a3b8`,`#1f2937`,Ni()),iron_will:()=>z(`iw`,`#9ca3af`,`#1f2937`,Bi()),vengeance:()=>V(`vg`,`#9f7aea`,`#3b0764`,wi()),rally:()=>z(`rl`,`#60a5fa`,`#1e3a5f`,Ri()),forward_bolt:()=>B(`fb`,`#fde68a`,`#1e3a5f`,ta()),destroy_unshielded:()=>Ir(`sh`,`#4338ca`,`#1e1b4b`,Ur()),pyromancy:()=>Ir(`py`,`#ea580c`,`#431407`,Wr()),snipe:()=>B(`sn`,`#fde68a`,`#1e3a5f`,ga()),duel:()=>z(`du`,`#d4b896`,`#3d2817`,Yr()),sacrifice:()=>B(`sc`,`#fca5a5`,`#1e3a5f`,sa()),cull:()=>H(`cu`,`#a78bfa`,`#2e1065`,Jr()),execution:()=>H(`ex`,`#6ee7b7`,`#14532d`,Xr()),chain_lightning:()=>Ir(`cl`,`#2563eb`,`#0c1929`,Hr()),backstab:()=>B(`bk`,`#c4a574`,`#2d4a6e`,Br()),cryo_bolt:()=>B(`cb`,`#7dd3fc`,`#0c4a6e`,pa()),bomb:()=>Ir(`bm`,`#f59e0b`,`#78350f`,Vr()),shockwave:()=>H(`sw`,`#c4b5fd`,`#3b1f6e`,$r()),plague:()=>H(`pg`,`#86efac`,`#14532d`,ei()),magnet:()=>H(`mg`,`#6ee7b7`,`#14532d`,Zr()),poison_3:()=>B(`po`,`#86efac`,`#14532d`,$i()),root_2:()=>B(`ro`,`#86efac`,`#14532d`,oa()),panic:()=>z(`pn`,`#fca5a5`,`#1f2937`,Gi()),blizzard:()=>V(`bz`,`#7dd3fc`,`#1e3a5f`,yi()),snowball:()=>z(`sb`,`#bae6fd`,`#0c4a6e`,Xi()),berserk:()=>Ir(`bk`,`#991b1b`,`#450a0a`,qr()),create_foe:()=>z(`cf`,`#78716c`,`#292524`,Ui()),deep_freeze:()=>H(`df`,`#7dd3fc`,`#0c4a6e`,ii()),reverse_only_2:()=>B(`rv`,`#fca5a5`,`#1e3a5f`,aa()),press:()=>z(`pr`,`#fca5a5`,`#1f2937`,Ji()),tangle:()=>V(`tg`,`#93c5fd`,`#312e81`,mi()),blind:()=>V(`bl`,`#a78bfa`,`#4c1d95`,Oi()),confusion:()=>H(`cf`,`#c4b5fd`,`#4c1d95`,ni()),fog_2:()=>Dr(`${Or(32,34,6)}<ellipse cx="32" cy="24" rx="16" ry="8" fill="currentColor" opacity="0.22"/>`),crown:()=>B(`cr`,`#fbbf24`,`#451a03`,na()),demote:()=>z(`dm`,`#fca5a5`,`#1f2937`,Vi()),fusion:()=>V(`fu`,`#8b5cf6`,`#4c1d95`,Ei()),clone:()=>H(`cln`,`#93c5fd`,`#312e81`,li()),chameleon:()=>V(`ch`,`#86efac`,`#312e81`,Di()),hibernation:()=>V(`hi`,`#c4b5fd`,`#4c1d95`,Ci()),quicksand:()=>z(`qs`,`#a8a29e`,`#292524`,Hi()),landmine:()=>B(`lm`,`#78716c`,`#292524`,ia()),collapse:()=>z(`co`,`#78716c`,`#292524`,ma()),darkness:()=>V(`dk`,`#6d28d9`,`#1e1b4b`,xi()),scatter:()=>B(`st`,`#7dd3fc`,`#1e3a5f`,ca()),call_forward:()=>V(`cfw`,`#fca5a5`,`#4c1d95`,_i()),dash:()=>V(`ds`,`#c4b5fd`,`#4c1d95`,vi()),earthquake:()=>Ir(`eq`,`#78716c`,`#292524`,Kr()),coin_flip:()=>di(),ignore:()=>z(`ig`,`#94a3b8`,`#1f2937`,zi()),counterspell:()=>H(`cs`,`#a78bfa`,`#2e1065`,ri()),purify:()=>H(`pu`,`#6ee7b7`,`#14532d`,oi()),trickster:()=>V(`tr`,`#c4b5fd`,`#553c7a`,ki()),offering:()=>V(`of`,`#d8b4fe`,`#553c7a`,pi()),quick_march:()=>H(`qm`,`#60a5fa`,`#1e3a5f`,Qr()),constitution:()=>H(`co`,`#4ade80`,`#14532d`,ui()),last_king:()=>B(`lk`,`#fbbf24`,`#1e3a5f`,ha()),revive:()=>Ir(`rv`,`#15803d`,`#052e16`,Gr()),mind_control:()=>H(`mc`,`#c4b5fd`,`#3b0764`,ti()),bounty:()=>H(`bo`,`#4ade80`,`#14532d`,si()),link_fate:()=>H(`lf`,`#a78bfa`,`#2e1065`,ci()),bishop_2:()=>V(`bp`,`#b794f4`,`#4c1d95`,hi()),rook_2:()=>V(`rk`,`#a78bfa`,`#4c1d95`,gi()),hostile_swap:()=>H(`hs`,`#93c5fd`,`#312e81`,ai()),deport:()=>H(`dp`,`#c4b5fd`,`#1e1b4b`,fi())};function ya(e,t=0){let n=va[e.effect];return n?n(t):null}var ba={movement:{symbol:`↗`,label:`Motion`,anim:`movement`},combat:{symbol:`⚔`,label:`Strike`,anim:`combat`},defense:{symbol:`🛡`,label:`Ward`,anim:`defense`},debuff:{symbol:`❄`,label:`Curse`,anim:`debuff`},transform:{symbol:`✦`,label:`Morph`,anim:`transform`},board:{symbol:`◇`,label:`Terrain`,anim:`board`},crown:{symbol:`♔`,label:`Royal`,anim:`crown`},arcane:{symbol:`✧`,label:`Arcane`,anim:`arcane`}},xa=[[`movement`,[`nudge`,`backstep`,`long_step`,`leapfrog`,`recall`,`teleport`,`random_teleport`,`displacement`,`berserk`,`dash`]],[`combat`,[`stab`,`shatter`,`destroy`,`snipe`,`duel`,`execution`,`cull`,`pyromancy`,`backstab`,`sacrifice`,`chain_lightning`,`cryo`,`bomb`,`magnet`]],[`special`,[`create_foe`,`clone`,`earthquake`]],[`defense`,[`shield`,`ward`,`aegis`,`bulwark`,`stall`,`sanctuary`,`barrier`,`anchor`,`iron_will`,`hibernation`,`constitution`]],[`debuff`,[`root`,`panic`,`backpedal`,`blizzard`,`deep_freeze`,`snowball`,`blind`,`confusion`,`press`,`tangle`,`shockwave`]],[`board`,[`quicksand`,`landmine`,`collapse`,`darkness`,`earthquake`,`scatter`,`call_forward`]],[`meta`,[`counterspell`,`vengeance`,`last_stand`,`purify`,`trickster`,`ignore`,`offering`,`quick_march`,`dominion`,`last_king`,`revive`,`mind_control`]]];function Sa(e){let t=0;for(let n=0;n<e.length;n++)t=(t+e.charCodeAt(n)*41)%360;return t}function Ca(e){let t=0;for(let n=0;n<e.length;n++)t=(t+e.charCodeAt(n)*13)%3;return t}function wa(e){let t=`${e.id} ${e.effect} ${e.name}`.toLowerCase();for(let[e,n]of xa)if(Array.isArray(n)&&n.some(e=>t.includes(e)))return e;return`arcane`}function Ta(e){return`ca${String(e).replace(/[^a-zA-Z0-9]/g,``)}`}function Ea(e,t,n){let r=[[12,18,.35],[48,12,.5],[52,44,.25],[18,50,.4],[38,28,.55]],i=n*4;return r.map(([e,n,r],a)=>`<circle cx="${(e+i+a*7)%56+4}" cy="${(n+i*2+a*5)%52+6}" r="1.2" fill="hsl(${t} 90% 85% / ${r})"/>`).join(``)}function Da(e,t){let n=t,r={movement:`
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
      </g>`};return r[e]||r.arcane}function Oa(e,t,n,r){return ka(e,t,n,r)}function ka(e,t,n,r){let i=Ta(n),a=(t+42)%360,o=Ca(n),s=r&&ya(r,o)||Da(e,o);return r?.effect&&zr(r.effect)&&s?`<svg class="spell-card__svg spell-card__svg--full-bleed" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">${s}</svg>`:`<svg class="spell-card__svg" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
    ${Ea(i,t,o)}
    <g filter="url(#${i}-glow)" color="hsl(${t} 88% 88%)">${s}</g>
  </svg>`}function Aa(e){return e.tiny?`tiny`:e.small?`small`:e.compact?`compact`:`full`}function ja(e){let t=Sr(e);return t.length?`<ul class="spell-card__effects">${t.map(e=>`<li>${Fa(e)}</li>`).join(``)}</ul>`:``}var Ma=new WeakMap;function Na(e){let t=e?.querySelector?.(`.spell-card__name`),n=e?.querySelector?.(`.spell-card__title-frame`);if(!t||!n)return;let r=()=>{t.classList.add(`spell-card__name--fit`),t.style.fontSize=``,t.style.textOverflow=``,t.style.overflow=``;let e=n.clientWidth;if(e<=0)return;let r=parseFloat(getComputedStyle(t).fontSize);if(!r)return;let i=r*.55;for(;t.scrollWidth>e&&r>i;)r-=.5,t.style.fontSize=`${r}px`;t.scrollWidth>e&&(t.style.overflow=`hidden`,t.style.textOverflow=`ellipsis`)};if(r(),requestAnimationFrame(r),!Ma.has(e)&&typeof ResizeObserver<`u`){let t=new ResizeObserver(()=>r());t.observe(n),Ma.set(e,t)}}function Pa(e,t={}){let n=wa(e),r=Sa(e.id),i=ba[n]||ba.arcane,a=Aa(t),o=!(t.hideDesc||t.gallery)&&a!==`tiny`,s=t.showViewFullHint||t.gallery,c=t.button?`button`:`div`,l=document.createElement(c);t.button&&(l.type=`button`);let u=e.rarity===`legendary`?`legendary`:e.rarity;l.className=[`spell-card`,`spell-card--${a}`,`spell-card--anim-${i.anim}`,u,e.rarity===`rare`?`spell-card--rare-fx`:``,e.rarity===`epic`?`spell-card--epic-fx`:``,e.rarity===`legendary`?`spell-card--legendary-fx`:``,e.rarity===`uncommon`?`spell-card--uncommon-fx`:``,e.rarity===`common`?`spell-card--common-fx`:``,`theme-${n}`,t.disabled?`disabled`:``,t.selected?`selected`:``,t.static?`static`:``,t.deal?`spell-card--deal`:``,t.fullDesc?`spell-card--full-desc`:``,t.gallery?`spell-card--gallery`:``].filter(Boolean).join(` `),l.style.setProperty(`--card-hue`,String(r)),l.dataset.cardId=e.id,l.title=Cr(e);let d=e.rarity===`legendary`?`<div class="spell-card__fx spell-card__fx--legendary" aria-hidden="true"></div>`:e.rarity===`epic`?`<div class="spell-card__fx spell-card__fx--epic" aria-hidden="true"></div>`:e.rarity===`rare`?`<div class="spell-card__fx spell-card__fx--rare" aria-hidden="true"></div>`:e.rarity===`uncommon`?`<div class="spell-card__fx spell-card__fx--uncommon" aria-hidden="true"></div>`:e.rarity===`common`?`<div class="spell-card__fx spell-card__fx--common" aria-hidden="true"></div>`:``,f=e?.effect&&zr(e.effect);return l.innerHTML=`
    ${d}
    <div class="spell-card__frame">
      <div class="spell-card__title-frame">
        <h3 class="spell-card__name">${Fa(e.name)}</h3>
      </div>
      <div class="spell-card__art-frame">
        <div class="spell-card__art spell-card__art--animated${f?` spell-card__art--full-bleed`:``}" aria-hidden="true">
          <div class="spell-card__art-shine"></div>
          ${Oa(n,r,e.id,e)}
          <span class="spell-card__sigil spell-card__sigil--effect" aria-hidden="true">${i.symbol}</span>
        </div>
      </div>
      <div class="spell-card__type-frame${s?` spell-card__type-frame--with-hint`:``}">
        <span class="spell-card__rarity">${e.rarity}</span>
        ${s?`<span class="spell-card__view-full">Click to see full card</span>`:``}
        ${t.meta?`<span class="spell-card__meta">${Fa(t.meta)}</span>`:``}
      </div>
      ${o?`<div class="spell-card__text-frame"><p class="spell-card__desc">${Fa(e.desc)}</p></div>`:``}
    </div>
    <div class="spell-card__tooltip" role="tooltip">
      <strong>${Fa(e.name)}</strong>
      ${ja(e)}
    </div>
  `,t.onClick&&l.addEventListener(`click`,n=>t.onClick(n,e)),Na(l),l}function Fa(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Ia(e){return document.getElementById(e)}function La(){let e=Ia(`card-preview-modal`);e&&e.parentElement!==document.body&&document.body.appendChild(e)}function Ra(e){document.body.classList.toggle(`card-preview-open`,e),window.dispatchEvent(new CustomEvent(`card-preview-change`,{detail:{open:e}}))}function za(){Ia(`card-preview-modal`)?.classList.add(`hidden`),Ia(`card-preview-mount`)?.classList.remove(`card-preview-mount--reveal-only`),Ra(!1)}function Ba(e,t={}){La();let n=Ia(`card-preview-modal`),r=Ia(`card-preview-mount`),i=Ia(`card-preview-actions`);if(!(!n||!r||!e)){if(r.innerHTML=``,r.classList.toggle(`card-preview-mount--reveal-only`,!!t.hideDesc),r.appendChild(Pa(e,{static:!0,hideDesc:t.hideDesc})),i){if(i.innerHTML=``,t.meta){let e=document.createElement(`p`);e.className=`card-preview-meta`,e.textContent=t.meta,i.appendChild(e)}let e=document.createElement(`div`);if(e.className=`card-preview-actions-row`,t.onPlay){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary`,n.textContent=`Cast spell`,n.addEventListener(`click`,()=>{za(),t.onPlay()}),e.appendChild(n)}if(t.onAdd){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary`,n.textContent=`Add to deck`,n.disabled=!!t.addDisabled,n.addEventListener(`click`,()=>{t.addDisabled||t.onAdd()}),e.appendChild(n)}if(t.onBuy){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-primary`,n.textContent=t.buyLabel||`Buy copy`,n.disabled=!!t.buyDisabled,n.addEventListener(`click`,()=>{t.buyDisabled||t.onBuy()}),e.appendChild(n)}if(t.onRemove){let n=document.createElement(`button`);n.type=`button`,n.className=`btn-secondary`,n.textContent=`Remove all from deck`,n.addEventListener(`click`,()=>{t.onRemove(),za()}),e.appendChild(n)}e.children.length&&i.appendChild(e)}n.classList.remove(`hidden`),Ra(!0)}}function Va(){Ia(`card-preview-close`)?.addEventListener(`click`,za),Ia(`card-preview-backdrop`)?.addEventListener(`click`,za),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&za()})}function Ha(e,t=`.spell-card`){e&&e.querySelectorAll(t).forEach((e,t)=>{e.classList.add(`spell-card--deal`),e.style.animationDelay=`${t*.1}s`})}function Ua(e){e&&(e.classList.add(`spell-card--rare-burst`),setTimeout(()=>e.classList.remove(`spell-card--rare-burst`),900))}function Wa(e){e&&(e.classList.add(`spell-card--epic-burst`),setTimeout(()=>e.classList.remove(`spell-card--epic-burst`),1200))}function Ga(e){e&&(e.classList.add(`spell-card--legendary-burst`),setTimeout(()=>e.classList.remove(`spell-card--legendary-burst`),1500))}function Ka(e,t){t===`legendary`?Ga(e):t===`epic`?Wa(e):t===`rare`&&Ua(e)}var qa={common:10,uncommon:20,rare:30,epic:40,legendary:50};function Ja(e){return qa[e]??30}function Ya(e,r){let i=oe(e,r);if(i<1)return{success:!1,message:`Get this spell from a chest first.`};let a=n(r);if(!a)return{success:!1,message:`Unknown card.`};let o=t(r);if(i>=o)return{success:!1,message:`You already own the maximum (${o} copies).`};let s=Ja(a.rarity);if(e.gems<s)return{success:!1,message:`Need ${s} gems (${e.gems} available).`};e.gems-=s;let c=ye(e,r,1);return c?{success:!0,cost:s,message:`+1 ${a.name} for ${s} gems (${i+c} owned).`}:(e.gems+=s,T(e),{success:!1,message:`You already own the maximum copies for this rarity.`})}var Xa={deck:`<svg class="nav-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
  </svg>`};function Za(){let e={deck:Xa.deck,chests:Xa.chests,play:Xa.play,pvp:Xa.pvp,quests:Xa.quests};for(let t of document.querySelectorAll(`.game-nav .tab-btn[data-tab]`)){let n=t.querySelector(`.tab-btn__icon`),r=t.dataset.tab;n&&e[r]&&(n.innerHTML=e[r])}}var Qa=`arcaneCheckersSettings_v1`,$a={musicEnabled:!0,musicVolume:.45,sfxEnabled:!0,sfxVolume:.7,hapticsEnabled:!0},eo={...$a};function to(){try{let e=localStorage.getItem(Qa);return e?{...$a,...JSON.parse(e)}:{...$a}}catch{return{...$a}}}function U(){return{...eo}}function no(e){eo={...eo,...e};try{localStorage.setItem(Qa,JSON.stringify(eo))}catch{}return window.dispatchEvent(new CustomEvent(`arcane-settings-changed`,{detail:U()})),U()}function ro(){return eo=to(),U()}var io={hub:`assets/audio/background.m4a`,match:`assets/audio/background.m4a`},ao={tap:`assets/audio/sfx/tap.mp3`,spell:`assets/audio/sfx/spell.mp3`,capture:`assets/audio/sfx/capture.mp3`,win:`assets/audio/sfx/win.mp3`,chest:`assets/audio/sfx/chest.mp3`},oo=null,so=null,co=`hub`,lo=!1;function uo(){return typeof Audio<`u`}function fo(e,t){if(!(!uo()||!U().sfxEnabled))try{let n=new Audio(e);n.volume=Math.max(0,Math.min(1,t*U().sfxVolume)),n.play().catch(()=>{})}catch{}}function po(e){let t=io[e];if(!t||!uo())return null;let n=e===`hub`?oo:so;return n||(n=new Audio(t),n.loop=!0,n.preload=`auto`,e===`hub`?oo=n:so=n),n}function mo(e){e&&(e.volume=Math.max(0,Math.min(1,U().musicVolume)))}function ho(){oo?.pause(),so?.pause()}function go(){lo||!uo()||(lo=!0,[oo,so].forEach(e=>{e&&e.play().then(()=>e.pause()).catch(()=>{})}))}function _o(e){if(co=e,!U().musicEnabled){ho();return}let t=po(`hub`),n=po(`match`);e===`match`?(t?.pause(),n&&(mo(n),n.play().catch(()=>{}))):(n?.pause(),t&&(mo(t),t.play().catch(()=>{})))}function vo(){if(!U().musicEnabled){ho();return}mo(oo),mo(so),_o(co)}function yo(){if(!uo())return;window.addEventListener(`arcane-settings-changed`,()=>vo());let e=()=>{go(),U().musicEnabled&&_o(co),window.removeEventListener(`pointerdown`,e),window.removeEventListener(`keydown`,e)};window.addEventListener(`pointerdown`,e,{once:!0}),window.addEventListener(`keydown`,e,{once:!0})}function bo(e){let t=ao[e];t&&fo(t,1)}var xo={tap:()=>bo(`tap`),spell:()=>bo(`spell`),capture:()=>bo(`capture`),win:()=>bo(`win`),chest:()=>bo(`chest`)},So=null,Co=!1;async function wo(){if(Co)return So;Co=!0;try{let{Capacitor:e}=await D(async()=>{let{Capacitor:e}=await import(`./dist-DM6qMOWp.js`);return{Capacitor:e}},[],import.meta.url);if(!e.isNativePlatform())return null;So=(await D(()=>import(`./esm-TGGH6JYM.js`),[],import.meta.url)).ScreenOrientation}catch{So=null}return So}async function To(){document.body.classList.remove(`orientation-match`),document.body.classList.add(`orientation-portrait`);let e=await wo();if(e)try{await e.lock({orientation:`portrait`})}catch{}}async function Eo(){await To()}var Do=null;function Oo(){return Do||(Do=document.createElement(`div`),Do.id=`network-banner`,Do.className=`network-banner hidden`,Do.setAttribute(`role`,`status`),Do.setAttribute(`aria-live`,`polite`),document.body.appendChild(Do),Do)}function ko(){let e=Oo(),t=!navigator.onLine;e.textContent=t?`No connection — some features need internet`:``,e.classList.toggle(`hidden`,!t)}function Ao(){ko(),window.addEventListener(`online`,ko),window.addEventListener(`offline`,ko)}async function jo(){try{let{Capacitor:e}=await D(async()=>{let{Capacitor:e}=await import(`./dist-DM6qMOWp.js`);return{Capacitor:e}},[],import.meta.url);if(!e.isNativePlatform())return;let{StatusBar:t,Style:n}=await D(async()=>{let{StatusBar:e,Style:t}=await import(`./esm-C-SIlwqj.js`);return{StatusBar:e,Style:t}},[],import.meta.url);await t.setOverlaysWebView({overlay:!0}),await t.setStyle({style:n.Dark}),await t.setBackgroundColor({color:`#080a12`});let{SplashScreen:r}=await D(async()=>{let{SplashScreen:e}=await import(`./esm-Ck_AT-RK.js`);return{SplashScreen:e}},[],import.meta.url);await r.hide()}catch(e){console.warn(`Capacitor init skipped`,e)}}var Mo=null,No=!1;async function Po(){if(No)return Mo;No=!0;try{let{Capacitor:e}=await D(async()=>{let{Capacitor:e}=await import(`./dist-DM6qMOWp.js`);return{Capacitor:e}},[],import.meta.url);if(!e.isNativePlatform())return null;let{Haptics:t,ImpactStyle:n}=await D(async()=>{let{Haptics:e,ImpactStyle:t}=await import(`./esm-D_it6P9V.js`);return{Haptics:e,ImpactStyle:t}},[],import.meta.url);Mo={Haptics:t,ImpactStyle:n}}catch{Mo=null}return Mo}async function Fo(){if(!U().hapticsEnabled)return;let e=await Po();if(e)try{await e.Haptics.impact({style:e.ImpactStyle.Light})}catch{}}var Io={bronze:{label:`Bronze`,tagline:`Same odds as Bronze Chest`,visual:`bronze`,accent:`#c77dff`,glow:`rgba(199, 125, 255, 0.45)`},silver:{label:`Silver`,tagline:`Same odds as Silver Chest`,visual:`silver`,accent:`#7dd3fc`,glow:`rgba(125, 211, 252, 0.5)`},gold:{label:`Gold`,tagline:`Same odds as Gold Chest`,visual:`gold`,accent:`#ffd87a`,glow:`rgba(255, 216, 122, 0.55)`}};function Lo(e){let t=Io[e]||Io.style_crate,n=t.visual;return{tier:t,lid:n===`gold`?`#f0e6c8`:n===`silver`?`#e4ecf8`:`#e8c4f8`,body:n===`gold`?`#5a4518`:n===`silver`?`#3d4a62`:`#4a2860`,trim:t.accent,ribbon:n===`gold`?`#ff9de2`:n===`silver`?`#a5f3fc`:`#d8b4fe`}}function Ro(e,t){let{lid:n,body:r,trim:i,ribbon:a}=Lo(e);return`
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
    </defs>`}function zo(e,t,n){let{trim:r,ribbon:i,tier:a}=Lo(e);return`
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
    </g>`}function Bo(e){let t=`vanityStage-${e}`;return`<svg class="chest-stage-svg vanity-box-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${Ro(e,t)}
    <ellipse class="chest-stage__shadow" cx="60" cy="90" rx="42" ry="8" fill="rgba(0,0,0,0.5)"/>
    ${zo(e,t,!0)}
  </svg>`}function Vo(e){let t=`vanityCard-${e}`;return`<svg class="chest-svg vanity-box-svg" viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${Ro(e,t)}
    <ellipse cx="60" cy="90" rx="42" ry="8" fill="rgba(0,0,0,0.5)"/>
    ${zo(e,t,!1)}
  </svg>`}function Ho(e){let t=Uo[e]||Uo.avatar_default,n=`av-${e.replace(/[^a-z0-9]/gi,``)}`;return`<svg viewBox="0 0 64 64" class="cosmetic-avatar-svg cosmetic-avatar-svg--${e.replace(`avatar_`,``)}" aria-hidden="true">
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
  </svg>`}var Uo={avatar_default:{bg:[`#4a5f7a`,`#1e2a3a`],glow:`#8fa4c4`,svg:`<ellipse cx="32" cy="38" rx="14" ry="16" fill="#2a3548"/>
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
      <circle cx="36" cy="26" r="2" fill="#0a1628"/>`}};function Wo(e){let t={banner_default:`linear-gradient(135deg,#1e2a44,#2d4a6e)`,banner_nebula:`linear-gradient(135deg,#2a1f4e,#6b4fd4 55%,#1a1030)`,banner_crimson:`linear-gradient(135deg,#3a1018,#8b2030 50%,#1a0a10)`,banner_storm:`linear-gradient(135deg,#1a2840,#3d7ab8 45%,#9ad4ff)`,banner_aurora:`linear-gradient(135deg,#0f3d3a,#5ce1e6 40%,#9f7aea 80%,#1a0a20)`,banner_forest:`linear-gradient(135deg,#1a2e0e,#2d5016 50%,#0f1a08)`,banner_sunset:`linear-gradient(135deg,#431407,#c2410c 45%,#fdba74 75%,#1a0a04)`,banner_midnight:`linear-gradient(135deg,#0f172a,#1e3a5f 50%,#020617)`,banner_ocean:`linear-gradient(135deg,#042f2e,#0e7490 45%,#164e63 80%,#020617)`,banner_eclipse:`linear-gradient(135deg,#0a0a0a,#1a1a2e 35%,#fbbf24 50%,#0a0a0a 65%,#312e81)`,banner_sand:`linear-gradient(135deg,#78350f,#d97706 45%,#fcd34d 75%,#451a03)`,banner_mist:`linear-gradient(135deg,#374151,#6b7280 50%,#9ca3af 80%,#1f2937)`,banner_dawn:`linear-gradient(135deg,#4a1942,#ec4899 40%,#fbbf24 70%,#1a0a20)`};return t[e]||t.banner_default}function Go(e){return e===`pieceSkin`?`Piece skin`:e===`frame`?`Frame`:e===`avatar`?`Avatar`:e===`banner`?`Banner`:e}function Ko(e){return`profile-frame profile-frame--${(e||`frame_default`).replace(/^frame_/,``)}`}function qo(e){return(e||`frame_default`).replace(/^frame_/,``),`<div class="cosmetic-frame-preview ${Ko(e)}">
    <div class="cosmetic-frame-preview__inner">${Ho(`avatar_default`)}</div>
  </div>`}function Jo(e,t){return t===`avatar`?Ho(e):t===`frame`?qo(e):t===`banner`?`<div class="cosmetic-preview-banner" style="background:${Wo(e)}"></div>`:t===`pieceSkin`?Yo(e):``}function Yo(e){let t=e.replace(`skin_`,``);return`<div class="cosmetic-skin-preview">
    <span class="piece red piece-skin-${t} king"></span>
    <span class="piece black piece-skin-${t}"></span>
  </div>`}function Xo(e){let t=document.createElement(`article`);t.className=`cosmetic-reveal-card rarity-${e.rarity} cosmetic-reveal-card--${e.type}`,e.duplicate&&t.classList.add(`cosmetic-reveal-card--duplicate`);let n=Jo(e.id,e.type),r=Go(e.type);return t.innerHTML=`
    <div class="cosmetic-reveal-card__frame">
      <span class="cosmetic-reveal-card__rarity">${e.rarity}</span>
      <div class="cosmetic-reveal-card__preview">${n}</div>
      <strong class="cosmetic-reveal-card__name">${e.name}</strong>
      <span class="cosmetic-reveal-card__type">${r}</span>
      ${e.duplicate?`<span class="cosmetic-reveal-card__dup">Duplicate · gems refunded</span>`:`<span class="cosmetic-reveal-card__new">Unlocked!</span>`}
    </div>`,t.style.animationDelay=`0s`,t}function Zo(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Qo(e,t=``){let n=ee(e),r=(t||`P`).charAt(0).toUpperCase(),i=Ho(n.equipped.avatar)||`<span class="profile-avatar-fallback">${Zo(r)}</span>`;return`<span class="profile-avatar-stack header-profile-btn__stack ${Ko(n.equipped.frame)}"><span class="profile-avatar-inner header-profile-btn__inner">${i}</span></span>`}async function $o(e){if(!e)return``;try{return(await ke(e.id))?.username||e.user_metadata?.display_name||e.email?.split(`@`)[0]||``}catch{return e.user_metadata?.display_name||e.email?.split(`@`)[0]||``}}var es=null;function ts(){return es||=Promise.all([D(()=>import(`./match-BbN9I9i-.js`),[],import.meta.url),D(()=>import(`./matchView-DA_2gytX.js`),[],import.meta.url),D(()=>Promise.resolve({}),__vite__mapDeps([0]),import.meta.url),D(()=>Promise.resolve({}),__vite__mapDeps([1]),import.meta.url)]).then(([e,t])=>({MatchSession:e.MatchSession,getMatchHtml:t.getMatchHtml})),es}var ns=null;function rs(){return ns||=Promise.all([D(()=>import(`./pvpUI-VFi6I8S3.js`),[],import.meta.url),D(()=>import(`./pvp-Cy7u52jr.js`),[],import.meta.url)]).then(([e,t])=>({initPvpUI:e.initPvpUI,clearAllWaitingRoomsOnce:t.clearAllWaitingRoomsOnce})),ns}var is=null;function as(){return is||=D(()=>import(`./profileUI-B26RbLWj.js`),[],import.meta.url),is}function os(){is=null}var ss=null;function cs(){return ss||=Promise.all([D(()=>import(`./settingsUI-DzBZHvWP.js`),[],import.meta.url),D(()=>Promise.resolve({}),__vite__mapDeps([2]),import.meta.url)]).then(([e])=>e),ss}var ls=null;function us(){return ls||=Promise.all([D(()=>import(`./chestOpenAnimation-BcDTFHrI.js`),[],import.meta.url),D(()=>import(`./cosmeticOpenAnimation-BQgRu3pV.js`),[],import.meta.url),D(()=>import(`./titleOpenAnimation-CCCQOYMR.js`),[],import.meta.url)]).then(([e,t,n])=>({playChestOpenAnimation:e.playChestOpenAnimation,playCosmeticOpenAnimation:t.playCosmeticOpenAnimation,playTitleOpenAnimation:n.playTitleOpenAnimation})),ls}var ds=null;function fs(){return ds||=D(()=>import(`./tutorialMeta-grd3c5KS.js`),[],import.meta.url),ds}var ps=null;function ms(){return ps||=D(()=>import(`./tutorialUnlocks-BOGFWfV0.js`),[],import.meta.url),ps}var hs=null;function gs(){return hs||=D(()=>import(`./tutorialMatch-Dge8v0Qv.js`),[],import.meta.url),hs}function _s(e,t){fs().then(n=>n.notifyMetaTutorial(e,t))}function vs(e,t){ms().then(n=>n.notifyUnlockTutorial(e,t))}var W;try{W=E()}catch(e){console.error(`Failed to load profile, resetting save:`,e),localStorage.removeItem(`cardCheckersProfile_v7`),localStorage.removeItem(`cardCheckersProfile_v5`),W=E()}var G=`deck`,ys={deck:`Decks`,chests:`Shop`,play:`Play`,pvp:`PvP`,quests:`Quests`,profile:`Profile`,settings:`Settings`},bs=new Set(Object.keys(ys)),xs=`cards`,Ss=`list`,K=null,q=[],Cs=null,ws=``,Ts=`all`,Es=`all`,Ds=!0,Os={legendary:5,epic:4,rare:3,uncommon:2,common:1};function ks(e){return[...e].sort((e,t)=>{let n=Os[e.rarity]??0,r=Os[t.rarity]??0;return n===r?e.name.localeCompare(t.name):r-n})}var J=null,As=null,js=null;function Ms(){return As?Promise.resolve(As):(js||=rs().then(({initPvpUI:e,clearAllWaitingRoomsOnce:t})=>(t(),As=e({root:document.getElementById(`view-pvp`),getProfile:()=>W,openAuthModal:()=>Ps?.open(`signin`,{forced:!0}),onNavigateTab:Z,onOpenDeckEdit:Zc,onPvpViewShown:()=>{G=`pvp`,tc()}}),As)),js)}var Ns=null,Ps=null,Y=!1,Fs=!1,Is=!1,Ls=!1,Rs=!1,zs=null,Bs=null,Vs=null,Hs=1,Us=null;function Ws(e){return Os[e?.rarity]??0}function Gs(e){let t=i(e);return Object.entries(t).map(([e,t])=>({def:n(e),count:t})).filter(e=>e.def).sort((e,t)=>{let n=Ws(t.def)-Ws(e.def);return n===0?e.def.name.localeCompare(t.def.name):n})}function Ks(e){let t=q.indexOf(e);t<0||(q.splice(t,1),tl(),_s(`card-removed-from-deck`,{cardId:e}))}function qs(e){let t=q.length;q=q.filter(t=>t!==e),q.length!==t&&(tl(),_s(`card-removed-from-deck`,{cardId:e}))}function Js(){let n=e().map(e=>({def:e,owned:oe(W,e.id)})).filter(e=>e.owned>0).sort((e,t)=>{let n=Ws(t.def)-Ws(e.def);return n===0?e.def.name.localeCompare(t.def.name):n});q=[];for(let{def:e,owned:r}of n){let n=Math.min(r,t(e));for(let t=0;t<n&&q.length<30;t++)q.push(e.id);if(q.length>=30)break}tl()}var X=e=>document.getElementById(e);function Ys(){let e=document.getElementById(`adventure-prebattle`);e&&e.parentElement!==document.body&&document.body.appendChild(e)}function Xs(){let e=document.querySelector(`nav.game-nav.tabs`);e&&e.parentElement!==document.body&&document.body.appendChild(e)}function Zs(){return window.matchMedia(`(min-width: 1000px) and (max-width: 1400px)`).matches?2.5:window.matchMedia(`(min-width: 600px) and (max-width: 999px)`).matches?1.85:1}function Qs(){Ys(),document.getElementById(`adventure-prebattle`)?.classList.remove(`hidden`),document.body.classList.add(`adventure-floor-open`)}function $s(){document.getElementById(`adventure-prebattle`)?.classList.add(`hidden`),document.body.classList.remove(`adventure-floor-open`)}function ec(e=S,t=`Locked`){Wn({title:t,bodyHtml:e,autoCloseMs:4500})}function tc(){document.body.classList.toggle(`main-tab-active`,bs.has(G)),document.body.classList.toggle(`adventure-active`,G===`play`)}function nc(e,t,n){let r=e.querySelector(`.tab-btn__sign-in-badge`);t?(r||(r=document.createElement(`span`),r.className=`tab-btn__sign-in-badge`,r.setAttribute(`aria-hidden`,`true`),e.appendChild(r)),r.textContent=n,e.classList.add(`tab-btn--sign-in-nudge`)):(r?.remove(),e.classList.remove(`tab-btn--sign-in-nudge`))}function rc(){let e=h(W),t=Qt();for(let n of[`quests`,`pvp`]){let r=document.querySelector(`.tab-btn[data-tab="${n}"]`);if(!r)continue;let i=n===`pvp`?`PvP`:`Quests`,a=!e,o=n===`pvp`?Xt:Zt;r.classList.toggle(`tab-btn--locked`,a),r.setAttribute(`aria-disabled`,a?`true`:`false`),a?(r.title=t?`${l(i)} ${o}.`:l(i),nc(r,t,`Sign in`)):t?(r.title=o,nc(r,n===`pvp`,`Sign in`)):(r.title=``,nc(r,!1))}let n=m(W),r=document.querySelector(`.vault-tab[data-vault-tab="cosmetics"]`);r&&(r.classList.toggle(`vault-tab--locked`,!n),r.title=n?``:pe,r.setAttribute(`aria-disabled`,n?`false`:`true`))}async function Z(e){let t=document.getElementById(`view-match`);if(!(Y&&t&&!t.classList.contains(`hidden`))){if(!Fs&&(e===`quests`||e===`pvp`)&&!h(W)){let t=e===`pvp`?`PvP`:`Quests`,n=Qt(),r=e===`pvp`?Xt:Zt;await Qe(n?`${l(t)}\n\n${r}.`:l(t),{title:`${t} locked`,confirmLabel:`Go to Adventure`,cancelLabel:n?`Sign in`:`Not now`})?(Fs=!0,Z(`play`),Fs=!1):n&&Ps?.open(`signin`,{forced:!0});return}if(sr(),Qn()&&er()){if(e===G)return;if(!(e===`pvp`&&document.getElementById(`pvp-match-root`))){if(!await Qe(`Leave your current match to open ${ys[e]||e}?`,{title:`Leave match?`,confirmLabel:`Leave`,cancelLabel:`Stay`,destructive:!0}))return;tr(e),ir(),document.querySelector(`#btn-leave-match`)?.click();return}}if(Ss===`edit`&&(e!==`deck`||e===`deck`&&G===`deck`)){if(!await Yc())return;Xc()}e!==`deck`&&Ss===`edit`&&(Oc(),document.body.classList.remove(`deck-editing`)),G=e,tc(),bs.has(e)&&Ec(),document.querySelectorAll(`.tab-btn`).forEach(t=>{t.classList.toggle(`active`,t.dataset.tab===e)}),document.querySelectorAll(`.view`).forEach(t=>{t.classList.toggle(`hidden`,t.id!==`view-${e}`)}),_s(`tab-changed`,{tab:e}),vs(`tab-changed`,{tab:e}),e===`chests`&&(Rc(xs),Bc()),e===`deck`&&(Ss=`list`,Ac(`list`)),e===`profile`&&lc(),e===`settings`&&uc(),e===`quests`&&(pc(),hc()),e===`play`&&ol(),e===`pvp`&&Ms().then(e=>e?.render({resume:!0})).catch(e=>{console.error(`[PvP] init failed`,e);let t=document.getElementById(`view-pvp`);t&&!t.innerHTML.trim()&&(t.innerHTML=`<section class="panel game-panel pvp-panel"><p class="pvp-status pvp-status--error">Couldn't load PvP — please reload the page.</p></section>`)}),Qn()||(_o(`hub`),await To())}}var Q=``;function ic(e=Q){e&&(Q=e);let t=document.getElementById(`header-profile-menu`),n=document.getElementById(`header-profile-btn`),r=document.getElementById(`header-username`),i=document.getElementById(`auth-header-btn`),a=!!O();if(i&&(i.classList.toggle(`hidden`,a),i.hidden=a),t&&(t.classList.toggle(`hidden`,!a),t.hidden=!a),r){let e=a&&Q;r.textContent=e?Q:``,r.classList.toggle(`hidden`,!e),r.hidden=!e}n&&a&&(n.innerHTML=Qo(W,Q),n.title=Q?`Account — ${Q}`:`Account menu`)}function ac(){let e=document.getElementById(`header-profile-btn`),t=document.getElementById(`header-profile-dropdown`);!e||!t||(t.classList.add(`hidden`),t.hidden=!0,e.setAttribute(`aria-expanded`,`false`))}function oc(){let e=document.getElementById(`header-profile-menu`),t=document.getElementById(`header-profile-btn`),n=document.getElementById(`header-profile-dropdown`);if(!e||!t||!n)return;let r=e=>{n.classList.toggle(`hidden`,!e),n.hidden=!e,t.setAttribute(`aria-expanded`,e?`true`:`false`)};t.addEventListener(`click`,e=>{e.stopPropagation();let t=!n.hidden;r(!t)}),n.querySelectorAll(`[data-profile-menu-action]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.profileMenuAction;ac(),t===`settings`?Z(`settings`):cc()})}),document.addEventListener(`click`,t=>{n.hidden||e.contains(t.target)||ac()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&!n.hidden&&ac()})}async function sc(){let e=O();if(!e){Q=``,ic();return}Q=await $o(e),ic()}function cc(){ac(),Z(`profile`),vs(`profile-opened`)}async function lc(){let{renderProfileTab:e}=await as(),t=X(`view-profile`);e(W,t,{onGemsChange:gc,onTitleChanged:()=>ic()})}async function uc(){let{renderSettingsTab:e}=await cs();e(X(`view-settings`),{onUsernameChanged:e=>{Q=e,ic(e)}})}var dc=`
  <section class="panel game-panel quests-panel quests-panel--loading" aria-busy="true">
    <p class="quests-status" role="status">Loading quests…</p>
  </section>`,fc=`
  <section class="panel game-panel quests-panel quests-panel--error">
    <p class="quests-status quests-status--error">Couldn't load Quests.</p>
    <p class="quests-status-hint muted">Check your connection and try again, or reload the page.</p>
    <button type="button" class="btn-secondary quests-retry-btn">Try again</button>
  </section>`;function pc(){let e=X(`view-quests`);e&&(e.innerHTML=dc)}function mc(e=X(`view-quests`)){e&&(e.innerHTML=fc,e.querySelector(`.quests-retry-btn`)?.addEventListener(`click`,()=>{os(),pc(),hc()}))}async function hc(){let e=X(`view-quests`);if(e)try{let{renderQuestsTab:t}=await as();t(W,e,{onTitleChanged:()=>ic(),onCurrencyChange:()=>$()})}catch(t){console.error(`[Quests] render failed`,t),mc(e)}}function $(){let e=X(`header-gems`);e&&(e.textContent=String(W.gems??0));let t=X(`header-stars`);t&&(t.textContent=String(W.stars??0)),document.querySelector(`.hud-gems`)?.classList.toggle(`hud-gems--low`,(W.gems??0)<50),document.querySelector(`.hud-stars`)?.classList.toggle(`hud-stars--low`,(W.stars??0)<10)}function gc(){$()}function _c(){document.querySelectorAll(`.collection-owned-only-toggle`).forEach(e=>{e.checked=Ds});for(let e of[`collection-search`]){let t=X(e);t&&(t.value=ws)}for(let e of[`collection-rarity`]){let t=vr(e);t&&(t.value=Ts)}let e=vr(`collection-category`);e&&(e.value=Es)}var vc=`(max-width: 899px)`,yc=`(max-width: 1280px)`,bc=null;function xc(){return window.matchMedia(vc).matches}function Sc(){return document.body.classList.contains(`main-tab-active`)&&!document.body.classList.contains(`match-active`)&&!document.body.classList.contains(`deck-editing`)&&window.matchMedia(yc).matches}function Cc(){return document.querySelector(`.game-main`)}function wc(){let e=Cc();return Sc()&&e?e.scrollTop:window.scrollY||document.documentElement.scrollTop||0}function Tc(e){let t=Cc();if(Sc()&&t){t.scrollTop=e;return}window.scrollTo(0,e)}function Ec(){let e=Cc();if(Sc()&&e){e.scrollTop=0;return}window.scrollTo(0,0)}function Dc(){xc()&&(bc=wc(),document.body.style.position=`fixed`,document.body.style.top=`0`,document.body.style.left=`0`,document.body.style.right=`0`,document.body.style.width=`100%`)}function Oc(){if(bc==null)return;let e=bc;bc=null,document.body.style.position=``,document.body.style.top=``,document.body.style.left=``,document.body.style.right=``,document.body.style.width=``,Tc(e)}function kc(){Ec(),document.documentElement.scrollTop=0,document.body.scrollTop=0,document.querySelector(`.game-shell`)?.scrollTo?.(0,0),Cc()?.scrollTo?.(0,0),document.querySelector(`#view-deck`)?.scrollTo?.(0,0),document.querySelectorAll(`#deck-subview-edit, #deck-subview-edit .deck-editor, #deck-subview-edit .deck-editor__body, #deck-subview-edit .deck-editor__grid, #deck-subview-edit .deck-editor__grid-cards`).forEach(e=>{e.scrollTop=0})}function Ac(e){e!==`edit`&&Oc(),Ss=e,document.body.classList.toggle(`deck-editing`,e===`edit`),X(`deck-subview-list`)?.classList.toggle(`hidden`,e!==`list`),X(`deck-subview-edit`)?.classList.toggle(`hidden`,e!==`edit`),e===`edit`&&(Dc(),w(W),T(W),Ts=`all`,ws=``,Es=`all`,Ds=!0,_c(),qc()),e===`list`&&el(),e===`edit`&&(tl(),kc(),requestAnimationFrame(()=>{kc(),requestAnimationFrame(kc)}))}function jc({id:e,title:t,desc:n,cost:r,variant:i=`mystery`}){let a=(W.stars??0)>=r,o=i===`title`?zt():Vt();return`
    <article class="mystery-box ${i===`title`?`mystery-box--title`:``} ${a?`mystery-box--ready`:`mystery-box--locked`}" data-mystery-id="${e}" role="button" tabindex="0" aria-label="Open ${t} for ${r} stars">
      <div class="mystery-box__glow" aria-hidden="true"></div>
      <div class="mystery-box__visual" aria-hidden="true">${o}</div>
      <h3 class="mystery-box__title">${t}</h3>
      <p class="mystery-box__desc">${n}</p>
      <p class="mystery-box__cost"><span aria-hidden="true">★</span> ${r} stars</p>
      <button type="button" class="btn-primary mystery-box__btn" data-mystery-open="${e}" ${a?``:`disabled`}>
        ${a?`Open for ${r} ★`:`Need more stars`}
      </button>
    </article>`}function Mc(e,t){e.querySelector(`[data-mystery-open]`)?.addEventListener(`click`,e=>{e.stopPropagation(),t()}),e.addEventListener(`click`,t),e.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),t())})}function Nc({bonusGems:e=0,bonusStars:t=0}={}){let n=[];return e&&n.push(`+${e} gem refund`),t&&n.push(`+${t} ★ from duplicates`),n.length?` (${n.join(`, `)})`:``}async function Pc(e,t){let{playChestOpenAnimation:n,playCosmeticOpenAnimation:r,playTitleOpenAnimation:i}=await us();e.kind===`card`?(await n({tier:`silver`,tierLabel:`Mystery Box`,pulls:e.cardPulls}),t&&(t.textContent=`Got ${e.cardPulls.length} spells.${Nc(e)}`)):e.kind===`cosmetic`?(await r({boxId:`silver`,boxLabel:`Mystery Box`,pulls:e.cosPulls}),t&&(t.textContent=e.message+Nc(e))):e.kind===`mixed`?(e.cardPulls.length&&await n({tier:`silver`,tierLabel:`Mystery Box — Spells`,pulls:e.cardPulls}),e.cosPulls.length&&await r({boxId:`silver`,boxLabel:`Mystery Box — Cosmetics`,pulls:e.cosPulls}),t&&(t.textContent=`${e.message}${Nc(e)}`)):e.kind===`title`&&(await i({boxLabel:`Title Box`,pulls:e.pulls}),t&&(t.textContent=e.message))}async function Fc(){let e=X(`mystery-box-log`);if(!((W.stars??0)>=10)){e&&(e.textContent=`Need 10 ★ stars. Clear Adventure floors to earn stars.`,e.classList.add(`chest-log--error`));return}let t=qt(W);if(!t.success){e&&(e.textContent=t.message,e.classList.add(`chest-log--error`));return}T(W),$(),e&&e.classList.remove(`chest-log--error`),X(`mystery-box-list`)?.querySelectorAll(`.mystery-box__btn`).forEach(e=>{e.disabled=!0});try{await Pc(t,e)}catch(n){console.error(`Mystery box animation failed:`,n),e&&(e.textContent=t.message)}Bc({clearPulls:!1}),lc()}async function Ic(){let e=X(`mystery-box-log`);if(!((W.stars??0)>=10)){e&&(e.textContent=`Need 10 ★ stars. Clear Adventure floors to earn stars.`,e.classList.add(`chest-log--error`));return}let t=Jt(W);if(!t.success){e&&(e.textContent=t.message,e.classList.add(`chest-log--error`));return}T(W),$(),e&&e.classList.remove(`chest-log--error`),X(`mystery-box-list`)?.querySelectorAll(`.mystery-box__btn`).forEach(e=>{e.disabled=!0});try{await Pc(t,e)}catch(n){console.error(`Title box animation failed:`,n),e&&(e.textContent=t.message)}Bc({clearPulls:!1}),lc()}function Lc(){let e=X(`mystery-box-list`);if(!e)return;e.innerHTML=`
    ${jc({id:`mystery`,title:`Mystery Box`,desc:`6 random pulls — mix of spells and cosmetics (${Math.round(Ht*100)}% cosmetic per slot when unlocked).`,cost:10})}
    ${jc({id:`title`,title:`Title Box`,desc:`Box-exclusive mage titles only — The Brave, Ruthless, Omnipotent, and more.`,cost:10,variant:`title`})}
  `;let t=e.querySelectorAll(`.mystery-box`);Mc(t[0],()=>Fc()),Mc(t[1],()=>Ic())}function Rc(e){if(!Is&&e===`cosmetics`&&!m(W)){ec(pe,`Cosmetics locked`),Is=!0,Rc(`cards`),Is=!1;return}xs=e,document.querySelectorAll(`.vault-tab`).forEach(t=>{let n=t.dataset.vaultTab===e;t.classList.toggle(`active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`)}),document.querySelectorAll(`.vault-tab-panel`).forEach(t=>{let n=t.id===`vault-tab-${e}`;t.classList.toggle(`hidden`,!n),t.hidden=!n}),vs(`vault-tab-changed`,{tab:e})}function zc(){as().then(({renderCosmeticBoxes:e})=>{e(W,X(`cosmetic-box-list`),{logEl:X(`cosmetic-box-log`),onGemsChange:gc,cosmeticsUnlocked:m(W),onOpened:()=>{G===`profile`&&lc(),G===`quests`&&hc()}})})}function Bc(e={}){let{clearPulls:t=!0}=e;$(),zc(),Lc();let n=X(`chest-list`),r=X(`chest-pulls`);if(r&&t&&(r.innerHTML=``,r.classList.add(`chest-pulls--hidden`),r.classList.remove(`chest-pulls--reveal`)),n){n.innerHTML=``;for(let e of ct){let t=gt[e.id]||gt.bronze,i=W.gems>=e.cost,a=document.createElement(`article`);a.className=`chest-card chest-card--${e.id}${i?``:` chest-card--locked`}`,a.innerHTML=`
      <div class="chest-card__aura" aria-hidden="true"></div>
      <div class="chest-card__visual">${Ct(e.id)}</div>
      <div class="chest-card__body">
        <h3 class="chest-card__name">${e.name}</h3>
        <p class="chest-card__tagline">${ht(e.weights)}</p>
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
    `;let o=a.querySelector(`.chest-open`);o.disabled=!i,o.addEventListener(`click`,async()=>{if(o.disabled)return;let n=pt(W,e.id),i=X(`chest-log`);if(!n.success){i&&(i.textContent=n.message,i.classList.add(`chest-log--error`));return}T(W),$(),o.disabled=!0;let{playChestOpenAnimation:a}=await us();if(await a({tier:e.id,tierLabel:t.label,pulls:n.pulls}),_s(`chest-opened`,{chestId:e.id}),i){let t=n.bonusGems?` (+${n.bonusGems} gems from duplicates)`:``;i.textContent=`Got ${n.pulls.length} spells from ${e.name}.${t}`,i.classList.remove(`chest-log--error`)}if(r){r.classList.remove(`chest-pulls--hidden`),r.classList.add(`chest-pulls--reveal`),r.innerHTML=`<p class="chest-pulls__label">Chest opened</p><div class="chest-pulls__grid"></div>`;let e=r.querySelector(`.chest-pulls__grid`);n.pulls.forEach((t,n)=>{let r=Pa(t,{button:!0,deal:!0,gallery:!0,onClick:()=>Ba(t)});if(r.style.animationDelay=`${n*.12}s`,t.duplicate){r.classList.add(`spell-card--duplicate-pull`);let e=document.createElement(`span`);e.className=`chest-pull-dup-badge`,e.textContent=t.starRefund?`Duplicate · +${t.starRefund} ★`:`Duplicate · +${t.gemRefund} ◆`,r.appendChild(e)}e.appendChild(r),Ka(r,t.rarity)}),Ha(e),r.scrollIntoView({behavior:`smooth`,block:`nearest`})}Bc()}),n.appendChild(a)}}}function Vc(){return ks(e().filter(e=>{if(Es!==`all`&&st(e)!==Es||Ts!==`all`&&e.rarity!==Ts)return!1;if(ws){let t=ws.toLowerCase();if(!e.name.toLowerCase().includes(t)&&!e.desc.toLowerCase().includes(t))return!1}return!(Ds&&oe(W,e.id)<=0)}))}function Hc(e,t){let n=Ya(W,e);return t&&(t.textContent=n.message,t.className=n.success?`deck-status ok`:`deck-status warn`),n.success&&(T(W),$(),Ss===`list`&&el(),Ss===`edit`&&tl()),n}function Uc(e,t){let n=Ya(W,e);return n.success?(T(W),$(),q.push(e),ge(W,e),T(W),tl(),t&&(t.hidden=!1,t.textContent=`Bought and added to deck.`,t.className=`deck-editor__error deck-status ok`),!0):(t&&(t.hidden=!1,t.textContent=n.message,t.className=`deck-editor__error deck-status warn`),!1)}function Wc(e){return a(q,e,W).ok?(q.push(e),ge(W,e),T(W),tl(),_s(`card-added-to-deck`,{cardId:e}),!0):!1}function Gc(e,n,r={}){let{deckEdit:o=!1,statusEl:s=null}=r,c=oe(W,n.id),l=t(n),u=c>=l,d=Ja(n.rarity),f=W.gems>=d&&!u,p=o?a(q,n.id,W):{ok:!1},m=o&&i(q)[n.id]||0,h=q.length<30,g=m<l,ee=c>=1&&c<=m,_=c>=1&&!u,v=o&&!p.ok&&h&&g&&ee&&_,y=()=>Hc(n.id,s),b=()=>{let e=oe(W,n.id),t=o&&i(q)[n.id]||0,r=e>=l,s=W.gems>=d&&!r,c=o?a(q,n.id,W):{ok:!1};Ba(n,{meta:o?`Owned ${e}/${l} · In deck ${t}/${l} · ${r?`max copies`:`${d} gems per copy`}`:`Owned ${e}/${l}${r?` · max copies`:` · ${d} gems per copy`}`,buyLabel:r?`Max copies owned`:`Buy copy (${d} gems)`,buyDisabled:!s||r||e<1,onBuy:()=>{y(),za()},addDisabled:!c.ok,onAdd:o?()=>{Wc(n.id)&&b()}:void 0})};if(o){let t=document.createElement(`div`);t.className=`deck-editor-tile`+(x(W,n.id)?` deck-editor-tile--new`:``);let r=Pa(n,{button:!0,gallery:!0,onClick:()=>b()});r.classList.add(`deck-editor-tile__card`),r.title=`${n.name} — tap for full card`;let i=c>0?`Owned ${c}/${l}`:`Not in collection`,a=document.createElement(`div`);a.className=`deck-editor-tile__meta`,a.innerHTML=`${i} · In deck ${m}/${l}${x(W,n.id)?`<span class="deck-editor-tile__new">New</span>`:``}`,a.addEventListener(`click`,()=>b());let o=document.createElement(`button`);o.type=`button`,o.className=`deck-editor-tile__action`,p.ok?(o.classList.add(`deck-editor-tile__action--add`),o.textContent=`+ Add to deck`,o.addEventListener(`click`,e=>{e.stopPropagation(),Wc(n.id)})):v?(o.classList.add(`deck-editor-tile__action--buy`),o.textContent=f?`Add for ${d} gems`:`Need ${d} gems`,o.disabled=!f,o.addEventListener(`click`,e=>{e.stopPropagation(),Uc(n.id,s)})):(o.classList.add(`deck-editor-tile__action--disabled`),o.disabled=!0,q.length>=30?o.textContent=`Deck full (30/30)`:m>=l?o.textContent=`Max copies in deck`:c<1?o.textContent=`Open Shop chests to unlock`:p.reason?o.textContent=p.reason:o.textContent=`Can't add`),t.append(r,a,o),e.appendChild(t);return}let S=document.createElement(`div`);S.className=`collection-card-wrap`+(c<1?` collection-card-wrap--unowned`:``);let C=Pa(n,{button:!0,compact:!0,disabled:c<1||u,onClick:e=>{if(e.shiftKey||c<1||u){b();return}y()}});C.title=u?`${n.name} — max ${l} copies owned. Tap to view full card.`:c<1?`${n.name} — not owned. Tap to view full card.`:`${n.name} — tap to buy (${d} gems). Shift+click to inspect.`,S.appendChild(C);let te=document.createElement(`span`);te.className=`collection-owned-count`,te.textContent=c>0?`×${c}`:`—`,S.appendChild(te);let w=document.createElement(`span`);w.className=`collection-buy-cost`,w.textContent=u?`MAX`:`${d} ◆`,(!f||u)&&w.classList.add(`collection-buy-cost--cant`),S.appendChild(w),e.appendChild(S)}function Kc(e,t={}){if(!e)return;let{deckEdit:n=!1,statusEl:r=null}=t;e.innerHTML=``;let i=Vc();if(!i.length){e.className=`deck-editor__grid collection-grid`;let t=document.createElement(`p`);t.className=`collection-grid-empty muted`,t.textContent=n?`No spells match your filters. Try “All types”, clear search, or uncheck Owned only.`:`No cards match your filters. Open chests in the Shop to get more spells.`,e.appendChild(t);return}let a=0,o={deckEdit:n,statusEl:r};if(n||Es!==`all`){e.className=`deck-editor__grid collection-grid`;for(let t of i)try{Gc(e,t,o),a+=1}catch(e){console.error(`Failed to render card:`,t?.id,e)}}else{e.className=`deck-editor__grid collection-categories`;let t=Object.fromEntries(it.map(e=>[e,[]]));for(let e of i)t[st(e)].push(e);for(let n of it){let r=t[n];if(!r.length)continue;let i=document.createElement(`section`);i.className=`collection-category-section`,i.dataset.category=n;let s=document.createElement(`h3`);s.className=`collection-category-title`,s.textContent=at[n],i.appendChild(s);let c=document.createElement(`div`);c.className=`collection-grid deck-editor__grid-cards`;for(let e of r)try{Gc(c,e,o),a+=1}catch(t){console.error(`Failed to render card:`,e?.id,t)}i.appendChild(c),e.appendChild(i)}}if(i.length>0&&a===0){e.className=`deck-editor__grid collection-grid`;let t=document.createElement(`p`);t.className=`collection-grid-empty collection-grid-empty--error`,t.textContent=`Spells failed to display. Hard refresh the page (Ctrl+Shift+R).`,e.appendChild(t)}}function qc(){Cs={name:X(`deck-name-input`)?.value?.trim()??``,cardIds:[...q]}}function Jc(){return Cs?(X(`deck-name-input`)?.value?.trim()??``)!==Cs.name||q.length!==Cs.cardIds.length?!0:q.some((e,t)=>e!==Cs.cardIds[t]):!1}async function Yc(){return Jc()?Qe(`Discard unsaved changes to this deck?`,{title:`Unsaved changes`,confirmLabel:`Discard`,cancelLabel:`Keep editing`,destructive:!0}):!0}function Xc(){K=null,q=[],Cs=null}function Zc(e){let t=W.decks.find(t=>t.id===e);if(!t)return;K=t.id,q=[...t.cardIds];let n=X(`deck-name-input`);n&&(n.value=t.name),Ac(`edit`),_s(`deck-edit-opened`,{deckId:e})}function Qc(e){let t=Object.fromEntries(it.map(e=>[e,0]));for(let r of e){let e=n(r);e&&(t[st(e)]+=1)}return t}function $c(e){let t=Qc(e),n=[];for(let e of it){let r=t[e];if(r<=0)continue;let i=at[e];n.push(`<span class="deck-row__cat" title="${Fa(i)}: ${r}"><span class="deck-row__cat-dot deck-row__cat-dot--${e}" aria-hidden="true"></span><span class="deck-row__cat-n">${r}</span></span>`)}return n.length?`<div class="deck-row__cats">${n.join(``)}</div>`:``}function el(){w(W)&&T(W),$();let e=X(`deck-list`);if(!e)return;e.innerHTML=``;let t=X(`deck-list-count`);if(t){let e=W.decks.length;t.textContent=e?`${e} deck${e===1?``:`s`}`:``}if(!W.decks.length){if(w(W)&&T(W),W.decks.length){el();return}e.innerHTML=`
      <div class="deck-list-empty">
        <span class="deck-list-empty__icon" aria-hidden="true">▣</span>
        <p class="deck-list-empty__title">No decks yet</p>
        <p class="deck-list-empty__desc">Tap <strong>New deck</strong> above to build your first 30-card list.</p>
      </div>`;return}for(let t of W.decks){let n=r(t.cardIds,W).valid,i=Math.min(100,Math.round(t.cardIds.length/30*100)),a=document.createElement(`button`);a.type=`button`,a.className=`deck-row deck-row--open${n?` deck-row--ready`:``}`,a.innerHTML=`
      <span class="deck-row__aura" aria-hidden="true"></span>
      <div class="deck-row__top">
        <span class="deck-row__sigil" aria-hidden="true">
          <span class="deck-row__sigil-card"></span>
          <span class="deck-row__sigil-card"></span>
          <span class="deck-row__sigil-card"></span>
        </span>
        <span class="deck-row__badge ${n?`deck-row__badge--ready`:`deck-row__badge--warn`}">${n?`Ready`:`Incomplete`}</span>
      </div>
      <h3 class="deck-row-name">${Fa(t.name)}</h3>
      <div class="deck-row__progress">
        <div class="deck-progress-bar deck-row__progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="30" aria-valuenow="${t.cardIds.length}" aria-label="${Fa(t.name)} progress">
          <div class="deck-progress-fill deck-row__progress-fill${n?` deck-row__progress-fill--ready`:``}" style="width:${i}%"></div>
        </div>
        <span class="deck-row__count">${t.cardIds.length}/30</span>
      </div>
      ${$c(t.cardIds)}
      <div class="deck-row__footer">
        <span class="deck-row-hint">Tap to edit</span>
        <span class="deck-row-chevron" aria-hidden="true">›</span>
      </div>
    `,a.addEventListener(`click`,()=>Zc(t.id)),e.appendChild(a)}}function tl(){$();let e=X(`collection-grid`),t=X(`deck-slots`),n=X(`deck-status`),i=X(`edit-deck-heading`),a=X(`deck-count-badge`),o=X(`deck-progress-bar`);if(!e||!t)return;let s=X(`btn-delete-deck`);s&&(s.hidden=!(K&&K!==`new`&&K!==`deck-starter`)),i&&(i.textContent=K===`new`?`New deck`:`In your deck`);let c=r(q,W),l=`${q.length}/30`;a&&(a.textContent=l,a.classList.toggle(`deck-editor__count--ready`,c.valid));let u=X(`deck-progress-fill`),d=Math.min(100,q.length/30*100);u&&(u.style.width=`${d}%`),o&&(o.hidden=c.valid,c.valid||(o.setAttribute(`aria-valuenow`,String(q.length)),o.setAttribute(`aria-valuemax`,`30`))),n&&(c.valid?(n.textContent=``,n.hidden=!0,n.className=`deck-editor__error deck-status ok`):(n.hidden=!1,n.textContent=c.errors[0]||`${l} — keep adding spells`,n.className=`deck-editor__error deck-status warn`));let f=X(`deck-collection-hint`);f&&(f.hidden=!1,f.innerHTML=q.length>=30?`Deck is full. Remove a card from the strip above, or save when ready.`:`Tap <strong>+ Add to deck</strong> for copies you own. When all owned copies are in the deck, tap <strong>Add for X gems</strong> to buy another.`),Kc(e,{deckEdit:!0,statusEl:n}),t.innerHTML=``;let p=Gs(q);if(!p.length){let e=document.createElement(`p`);e.className=`deck-editor__strip-empty`,e.textContent=`Empty deck — tap + Add to deck below`,t.appendChild(e)}for(let{def:e,count:n}of p){let r=document.createElement(`div`);r.className=`deck-slot-wrap deck-slot-wrap--strip`;let i=Pa(e,{button:!0,tiny:!0,onClick:()=>{Ba(e,{meta:n>1?`${n} copies in deck`:`In your deck`,onRemove:()=>qs(e.id)})}});if(r.appendChild(i),n>1){let e=document.createElement(`span`);e.className=`deck-stack-count`,e.textContent=`×${n}`,r.appendChild(e)}let a=document.createElement(`button`);a.type=`button`,a.className=`deck-slot-remove deck-slot-remove--visible`,a.setAttribute(`aria-label`,`Remove one ${e.name} from deck`),a.textContent=`−`,a.addEventListener(`click`,t=>{t.stopPropagation(),Ks(e.id)}),r.appendChild(a),t.appendChild(r)}}function nl(){let e=X(`deck-name-input`)?.value?.trim()||`My Deck`,t=r(q,W);if(!t.valid){X(`deck-status`).textContent=t.errors.join(` `);return}let n;K&&K!==`new`?(n=W.decks.find(e=>e.id===K),n?(n.name=e,n.cardIds=[...q],n.updatedAt=Date.now()):n=v(e,q)):n=v(e,q),re(W,n),W.selectedDeckId=n.id,T(W),_s(`deck-saved`,{deckId:n.id}),Xc(),Ac(`list`)}function rl(e=[]){let t=`New Deck`,n=new Set(e.map(e=>e.name?.trim()).filter(Boolean));if(!n.has(t))return t;let r=2;for(;n.has(`${t} ${r}`);)r++;return`${t} ${r}`}function il(){K=`new`,q=[];let e=X(`deck-name-input`);e&&(e.value=rl(W.decks)),Ac(`edit`)}function al(){$s(),Vs=null}function ol(){W.adventure=ce(W.adventure),X(`adventure-map-view`)?.classList.remove(`hidden`),al(),Us=null,fl()}function sl(e){let t=ve[e]||ve.verdant,n=`map-${e}`;return`<svg class="adventure-map-scenery-svg" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
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
  </svg>`}function cl(e=`#e8c547`){return`<svg class="adventure-map-tile__pawn-svg" viewBox="0 0 28 36" aria-hidden="true">
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
  </svg>`}function ll(e){let t=ve[e]||ve.verdant;return`<svg class="adventure-map-tile__banner-svg" viewBox="0 0 24 20" aria-hidden="true">
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
  </svg>`}function ul(e){let t=e?.querySelector(`.adventure-map-tower`);if(!e||!t)return;let n=window.matchMedia(`(min-width: 600px) and (max-width: 1400px)`),r=()=>[t,...t.querySelectorAll(`.adventure-map-tile, .adventure-map-tower__base, .adventure-map-tower__mist, .adventure-map-tower__beacon`)],i=()=>{let i=e.getBoundingClientRect(),a=1/0,o=-1/0;for(let e of r()){let t=e.getBoundingClientRect();!t.height&&!t.width||(a=Math.min(a,t.top),o=Math.max(o,t.bottom))}if(!Number.isFinite(a))return;let s=o-a,c=n.matches?Math.max(Math.round(s*.06),24):Math.max(Math.round(s*.12),32),l=parseFloat(getComputedStyle(t).bottom)||0,u=o-i.top,d=Math.ceil(Math.max(u+l,s+c+l)),f=e.closest(`.adventure-map-scene`);if(f&&n.matches&&(d=Math.max(d,f.clientHeight)),e.style.minHeight=`${d}px`,e.style.height=`${d}px`,f){let t=Math.max(0,e.offsetHeight-f.clientHeight);f.scrollTop>t&&(f.scrollTop=t)}};requestAnimationFrame(()=>{i(),requestAnimationFrame(i)})}function dl(){let e=X(`adventure-map`),t=e?.closest(`.adventure-map-scene`);if(!e||!t)return;let n=Math.max(0,e.offsetHeight-t.clientHeight);t.scrollTop>n&&(t.scrollTop=n)}function fl(){$(),rc();let e=ce(W.adventure);W.adventure=e,Hs=e.selectedWorld||1;let t=X(`adventure-world-tabs`);if(t){t.innerHTML=``;let n=we(e);for(let n of ue){let r=u(e,n.id),i=document.createElement(`button`);i.type=`button`,i.className=`adventure-world-shield`,i.dataset.world=String(n.id),n.id===Hs&&i.classList.add(`active`),r||i.classList.add(`adventure-world-shield--locked`),i.disabled=!r,i.innerHTML=`<span class="adventure-world-shield__icon" aria-hidden="true"></span><span class="adventure-world-shield__label">Tower ${n.id}</span>`,i.title=r?n.name:`Clear floor 30 to unlock`,i.addEventListener(`click`,()=>{u(e,n.id)&&(Hs=n.id,e.selectedWorld=n.id,T(W),fl())}),t.appendChild(i)}u(e,Hs)||(Hs=n[0]?.id||1,e.selectedWorld=Hs)}let n=ue.find(e=>e.id===Hs),r=X(`adventure-map`);if(!r)return;let i=n?.theme||`verdant`,a=ve[i]||ve.verdant;r.className=`adventure-map-canvas adventure-map-canvas--${i} adventure-map-canvas--iso`,r.style.setProperty(`--map-accent`,a.accent),r.style.setProperty(`--map-glow`,a.glow),r.style.setProperty(`--map-mist`,a.mist),r.style.setProperty(`--map-stone-light`,a.stoneLight),r.style.setProperty(`--map-stone-mid`,a.stoneMid),r.style.setProperty(`--map-stone-dark`,a.stoneDark),r.style.setProperty(`--map-stone-side`,a.stoneSide),r.style.setProperty(`--map-moss`,a.moss),r.setAttribute(`role`,`group`),r.setAttribute(`aria-label`,`Adventure floor map`);let o=Ce(e),c=b(e),l=Hs===5&&o?`<div class="adventure-map-challenge-corner">
        <div class="adventure-map-ominous__moon" aria-hidden="true"></div>
        <button type="button" class="adventure-challenge-toggle${c?` adventure-challenge-toggle--on`:``}"
          aria-pressed="${c?`true`:`false`}"
          title="Challenge mode: enemy starts with an extra rank of pieces on rank 5">
          <span class="adventure-challenge-toggle__icon" aria-hidden="true">⚔</span>
          <span class="adventure-challenge-toggle__label">Challenge</span>
        </button>
      </div>`:``;r.innerHTML=`
    <div class="adventure-map-canvas__bg" aria-hidden="true">
      <div class="adventure-map-scenery adventure-map-scenery--${i}" aria-hidden="true">${sl(i)}</div>
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
    ${l}
    <div class="adventure-map-tower">
      <div class="adventure-map-tower__base" aria-hidden="true"></div>
      <div class="adventure-map-tower__shaft" aria-hidden="true"></div>
      <div class="adventure-map-tower__buttress adventure-map-tower__buttress--left" aria-hidden="true"></div>
      <div class="adventure-map-tower__buttress adventure-map-tower__buttress--right" aria-hidden="true"></div>
      <div class="adventure-map-tiles"></div>
      <div class="adventure-map-tower__mist" aria-hidden="true"></div>
      <div class="adventure-map-tower__beacon" aria-hidden="true"></div>
      <div class="adventure-map-tower__haze" aria-hidden="true"></div>
    </div>`;let d=r.querySelector(`.adventure-map-tiles`),f=r.querySelector(`.adventure-map-tower`),p=ae(Hs),m=ie(e),h=Zs();f?.style.setProperty(`--tower-top-ratio`,`0.72`),f?.style.setProperty(`--adventure-map-scale`,String(h)),p.forEach((t,n)=>{let r=Se(e,t.id),o=s(e,t.id),c=t.id===m&&r,l=de(e,t.id),u=(t.floorInWorld-1)/9,f=1-u*.26,p=f*h,g=(1-u*.1)*h,ee=Math.sin((t.floorInWorld-1)*.62)*.32*f*h,_=document.createElement(`button`);_.type=`button`,_.className=`adventure-map-tile`,_.classList.add(`adventure-map-tile--floor-${t.floorInWorld}`),_.style.zIndex=String(n+10),_.style.setProperty(`--floor-scale`,p.toFixed(4)),_.style.setProperty(`--floor-height-scale`,g.toFixed(4)),_.style.setProperty(`--floor-offset-x`,`${ee.toFixed(3)}rem`),_.dataset.level=String(t.id),r||_.classList.add(`adventure-map-tile--locked`),o&&_.classList.add(`adventure-map-tile--cleared`),c&&_.classList.add(`adventure-map-tile--next`),t.floorInWorld>=7&&t.floorInWorld<10&&_.classList.add(`adventure-map-tile--rampart`),t.floorInWorld===10&&_.classList.add(`adventure-map-tile--summit`),_.setAttribute(`aria-disabled`,r?`false`:`true`),r||(_.title=`Clear global floor ${t.id-1} to unlock`),_.setAttribute(`aria-label`,`Floor ${t.floorInWorld}: ${t.opponent}, ${t.flavor}`);let v=o?`<span class="adventure-map-tile__stars">${be(l)}</span>`:``,y=c?`<span class="adventure-map-tile__pawn">${cl(a.accent)}</span>`:``,b=t.floorInWorld===10?`<span class="adventure-map-tile__banner">${ll(i)}</span>`:``,x=t.floorInWorld>1&&t.floorInWorld<10?`<span class="adventure-map-tile__windows" aria-hidden="true"></span>`:``,S=o?`<span class="adventure-map-tile__torch" aria-hidden="true"></span>`:``;_.innerHTML=`
      ${y}
      ${b}
      <span class="adventure-map-tile__stone" aria-hidden="true">
        <span class="adventure-map-tile__rune"></span>
        <span class="adventure-map-tile__crenel"></span>
        ${t.floorInWorld<=3?`<span class="adventure-map-tile__ivy" aria-hidden="true"></span>`:``}
        ${x}
        ${S}
        <span class="adventure-map-tile__face">
          <span class="adventure-map-tile__num">${t.floorInWorld}</span>
          ${v}
        </span>
        <span class="adventure-map-tile__side adventure-map-tile__side--left"></span>
        <span class="adventure-map-tile__side adventure-map-tile__side--right"></span>
        <span class="adventure-map-tile__moss"></span>
      </span>`,r||(_.disabled=!0),_.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),bl(t.id))}),d?.appendChild(_)});let g=X(`adventure-floor-list`);if(g){g.classList.add(`adventure-floor-list--sr`),g.innerHTML=``;for(let t of p){let n=Se(e,t.id),r=s(e,t.id),i=t.id===m&&n,a=de(e,t.id),o=document.createElement(`button`);o.type=`button`,o.className=`adventure-floor-row`,n||(o.disabled=!0),r&&o.classList.add(`adventure-floor-row--cleared`),i&&o.classList.add(`adventure-floor-row--next`),o.innerHTML=`
        <span class="adventure-floor-row__main">
          <span class="adventure-floor-row__title">${t.floorInWorld}. ${t.opponent}</span>
          <span class="adventure-floor-row__flavor">${t.flavor}</span>
        </span>
        ${i?`<span class="adventure-floor-row__badge">Next</span>`:``}
        ${a>0?`<span class="adventure-floor-row__stars">${be(a)}</span>`:``}`,o.addEventListener(`click`,()=>bl(t.id)),g.appendChild(o)}}let ee=r.querySelector(`.adventure-map-tile--next`);ul(r),ee&&requestAnimationFrame(()=>{requestAnimationFrame(()=>ee.scrollIntoView({behavior:`smooth`,block:`nearest`}))});let _=g?.querySelector(`.adventure-floor-row--next`);_&&requestAnimationFrame(()=>_.scrollIntoView({behavior:`smooth`,block:`end`})),r.querySelector(`.adventure-challenge-toggle`)?.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.challengeMode=!e.challengeMode,W.adventure=e,T(W),Fo(),xo.tap(),fl()})}function pl(e){let t=he(e);if(!t||!Se(W.adventure,e))return;Vs=e,Qs();let n=X(`prebattle-title`),i=X(`prebattle-flavor`),a=X(`prebattle-opponent`);n&&(n.textContent=`Tower ${t.worldId} · Floor ${t.floorInWorld}`),i&&(i.textContent=t.flavor||``),a&&(a.textContent=`Loading…`);try{Us=_(W,e),T(W)}catch(e){console.error(`Enemy deck failed`,e),a&&(a.textContent=`Could not build enemy deck. Try again.`);return}a&&(a.textContent=`Review the enemy spell deck, then choose your grimoire below.`);let o=X(`prebattle-gem-hint`);if(o){let n=te(W.adventure,e);o.textContent=(s(W.adventure,e)?`Repeat clear: +${n} gems`:`First clear: +${n} gems`)+(t.worldId===5&&b(W.adventure)?` · Challenge mode: enemy has an extra rank of pieces`:``)}let c=X(`enemy-deck-preview`);if(c){c.innerHTML=``;try{for(let{def:e,count:t}of ne(Us)){if(!e)continue;let n=document.createElement(`button`);n.type=`button`,n.className=`enemy-deck-spell-btn`,n.title=`View ${e.name}`;let r=document.createElement(`span`);if(r.className=`enemy-deck-spell-btn__name`,r.textContent=e.name,n.appendChild(r),t>1){let e=document.createElement(`span`);e.className=`enemy-deck-spell-btn__count`,e.textContent=`×${t}`,n.appendChild(e)}n.addEventListener(`click`,()=>Ba(e,{meta:t>1?`${t} copies in enemy deck`:`Enemy deck`})),c.appendChild(n)}}catch(e){console.error(`Enemy preview failed`,e),c.innerHTML=`<p class="empty-msg">Enemy deck preview unavailable.</p>`}}w(W)&&T(W);let l=vr(`adventure-deck-select`);if(!l){a&&(a.textContent=`Deck selector missing — hard refresh the page.`);return}l.innerHTML=``;let u=W.decks.filter(e=>r(e.cardIds,W).valid);if(!u.length){let e=document.createElement(`option`);e.value=``,e.textContent=`No complete decks — build one in Decks`,l.appendChild(e),l.disabled=!0,X(`btn-start-adventure`).disabled=!0;return}l.disabled=!1;let d=W.selectedDeckId&&u.some(e=>e.id===W.selectedDeckId)?W.selectedDeckId:u[0].id;for(let e of u){let t=document.createElement(`option`);t.value=e.id,t.textContent=e.name,e.id===d&&(t.selected=!0),l.appendChild(t)}W.selectedDeckId=d,X(`btn-start-adventure`).disabled=!1}async function ml(e,t,n,r,i=null,a=!1,o=void 0){let s=t.opponent;al(),Us=null,document.querySelectorAll(`.view`).forEach(e=>e.classList.add(`hidden`)),X(`view-match`)?.classList.remove(`hidden`);let l=X(`view-match`);if(!l)return;let{MatchSession:u,getMatchHtml:d}=await ts();l.innerHTML=d(s);let p=o??(xe(r).id===5&&b(W.adventure)),m={levelId:r,deckId:e.id,challengeMode:p},h={aiDeckIds:n,opponentName:s,cosmetics:ee(W),profile:W,challengeMode:p,buildGameOverActions:({won:e,isTie:t})=>gl(m,{won:e,isTie:t}),onGameOverAction:e=>{_l(e,m,l)}};i&&(h.initialState=i);try{J=new u(e.cardIds,l,()=>{J=null,dr(),To(),_o(`hub`),l.innerHTML=``,X(`view-match`)?.classList.add(`hidden`),Z(nr()||`play`),Ls&&Sl(),Rs&&Cl()},e=>{let t=f(W,r,e),{gems:n,stars:i,starsGained:a}=t;return W.gems+=n,y(W,`adventure_floors`,1),c(W),T(W),$(),rc(),r===1&&t.firstTime&&(Ls=!0,Sl()),r===5&&t.firstTime&&(Rs=!0),{message:`+${n} gems! · Best: ${be(i)}`,starsGained:a}},h)}catch(e){throw J=null,l.innerHTML=``,X(`view-match`)?.classList.add(`hidden`),Z(`play`),e}lr({kind:`adventure`,deckId:e.id,deckCardIds:e.cardIds,aiDeckIds:n,opponentName:s,levelId:r,challengeMode:p}),await To(),_o(`match`),a&&(J.winRewarded=!0),fr(J),J.setMessage(``),J.render()}async function hl(){let e=pr();if(!e)return!1;let t=W.decks.find(t=>t.id===e.deckId)||W.decks.find(e=>e.cardIds?.length===30),n=e.levelId?he(e.levelId):null;return!t||t.cardIds.length!==30||!n||!e.aiDeckIds?.length||!await Qe(`Resume your adventure match where you left off?`,{title:`Resume match?`,confirmLabel:`Resume`,cancelLabel:`Discard`})?(ur(),!1):(Vs=e.levelId,await ml(t,n,e.aiDeckIds,e.levelId,e.state,e.winRewarded,e.challengeMode),J?.setMessage(`Match resumed — pick up where you left off.`),!0)}function gl({levelId:e},{won:t,isTie:n}){let r=e+1,i=t&&r<=50&&Se(W.adventure,r);if(n)return[{id:`backToAdventure`,label:`Back to Adventure`,primary:!0}];if(t){let e=[];return i?(e.push({id:`nextFloor`,label:`Next floor`,primary:!0}),e.push({id:`retry`,label:`Retry floor`}),e.push({id:`backToAdventure`,label:`Back to Adventure`})):(e.push({id:`backToAdventure`,label:`Back to Adventure`,primary:!0}),e.push({id:`retry`,label:`Retry floor`})),e}return[{id:`retry`,label:`Retry floor`,primary:!0},{id:`backToAdventure`,label:`Back to Adventure`}]}async function _l(e,{levelId:t,deckId:n,challengeMode:r},i){let a=W.decks.find(e=>e.id===n);if(e===`backToAdventure`){J?.onExit?.();return}if(e===`nextFloor`){let e=t+1;if(!he(e)||!Se(W.adventure,e)){J?.onExit?.();return}J?.dispose(),J=null,dr({clearCheckpoint:!0}),To(),_o(`hub`),i&&(i.innerHTML=``),X(`view-match`)?.classList.add(`hidden`),await Z(`play`),pl(e);return}if(e===`retry`){let e=t,n=he(e);if(!a||a.cardIds.length!==30||!n){J?.onExit?.();return}J?.dispose(),J=null,dr(),await ml(a,n,_(W,e),e,null,!1,r)}}function vl(){let e=vr(`adventure-deck-select`)?.value,t=W.decks.find(t=>t.id===e),n=Vs,r=n?he(n):null,i=Us?[...Us]:null;if(!t||t.cardIds.length!==30||!r||!i?.length){let e=X(`prebattle-opponent`);e&&(!t||t.cardIds.length!==30?e.textContent=`Build a complete 30-card deck in the Decks tab, then try again.`:e.textContent=`Could not start battle — close and pick the floor again.`);return}ml(t,r,i,n)}function yl(){if(window.__adventureMapCaptureBound)return;window.__adventureMapCaptureBound=!0;let e=null,t=!1,n=0,r=e=>e.closest?.(`#adventure-map .adventure-map-tile, #adventure-map .adventure-map-pin`),i=e=>e?.closest?.(`.adventure-map-scene`),a=()=>{t=!0,clearTimeout(n),n=setTimeout(()=>{t=!1},280)},o=(e,t)=>{if(!e||e.disabled)return;let n=Number(e.dataset.level);!Number.isFinite(n)||n<1||(t.preventDefault(),t.stopPropagation(),bl(n))};document.addEventListener(`pointerdown`,t=>{if(t.button!==0)return;let n=r(t.target);if(!n||n.disabled)return;let a=i(n);e={pin:n,pointerId:t.pointerId,startX:t.clientX,startY:t.clientY,scrollTop:a?.scrollTop??0,scrollLeft:a?.scrollLeft??0,cancelled:!1}},!0),document.addEventListener(`pointermove`,t=>{if(!e||t.pointerId!==e.pointerId||e.cancelled)return;let n=t.clientX-e.startX,r=t.clientY-e.startY;Math.hypot(n,r)>12&&(e.cancelled=!0);let a=i(e.pin);a&&(Math.abs(a.scrollTop-e.scrollTop)>3&&(e.cancelled=!0),Math.abs(a.scrollLeft-e.scrollLeft)>3&&(e.cancelled=!0))},!0),document.addEventListener(`pointerup`,t=>{if(!e||t.pointerId!==e.pointerId)return;let{pin:n,cancelled:r}=e;if(e=null,r){a();return}o(n,t),a()},!0),document.addEventListener(`pointercancel`,t=>{!e||t.pointerId!==e.pointerId||(e=null,a())},!0),document.addEventListener(`click`,e=>{if(t){e.preventDefault(),e.stopPropagation();return}let n=r(e.target);!n||n.disabled||o(n,e)},!0)}function bl(e){let t=ce(W.adventure);if(W.adventure=t,!Se(t,e)){ec(`Locked — beat global floor ${e-1} first, then return here.`,`Floor locked`);return}T(W),pl(e)}function xl(){Xs(),window.addEventListener(`orientationchange`,Xs),window.addEventListener(`resize`,Xs),tc(),ro(),Za(),Ao(),yo(),Eo(),jo(),Va(),yl(),Ys(),document.querySelector(`.adventure-map-scene`)?.addEventListener(`scroll`,dl,{passive:!0});let e;window.addEventListener(`resize`,()=>{clearTimeout(e),e=setTimeout(()=>{if(!document.body.classList.contains(`adventure-active`))return;let e=X(`adventure-map`);e&&ul(e)},120)}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&al()}),document.querySelectorAll(`.tab-btn`).forEach(e=>{e.addEventListener(`click`,()=>{Fo(),xo.tap(),Z(e.dataset.tab)})}),document.querySelectorAll(`.vault-tab`).forEach(e=>{e.addEventListener(`click`,()=>{sr(),Rc(e.dataset.vaultTab)})}),X(`btn-new-deck`)?.addEventListener(`click`,il),X(`btn-back-from-edit`)?.addEventListener(`click`,async()=>{await Yc()&&(Xc(),Ac(`list`))}),X(`btn-delete-deck`)?.addEventListener(`click`,async()=>{if(!K||K===`new`)return;let e=W.decks.find(e=>e.id===K);e&&await Qe(`Delete "${e.name}"? This cannot be undone.`,{title:`Delete deck?`,confirmLabel:`Delete`,cancelLabel:`Keep`,destructive:!0})&&(fe(W,e.id),Xc(),Ac(`list`))});let t=()=>{Ss===`edit`&&tl(),Ss===`list`&&el()};document.querySelectorAll(`.collection-owned-only-toggle`).forEach(e=>{e.addEventListener(`change`,e=>{Ds=e.target.checked,_c(),t()})}),document.querySelectorAll(`.btn-reset-collection-filters`).forEach(e=>{e.addEventListener(`click`,()=>{Ts=`all`,ws=``,Es=`all`,Ds=!0,_c(),t()})}),_c(),yr(),X(`collection-search`)?.addEventListener(`input`,e=>{ws=e.target.value,t()}),vr(`collection-category`)?.addEventListener(`change`,e=>{Es=e.target.value,t()}),vr(`collection-rarity`)?.addEventListener(`change`,e=>{Ts=e.target.value,t()}),X(`btn-clear-deck`)?.addEventListener(`click`,()=>{q=[],tl()}),X(`btn-auto-finish-deck`)?.addEventListener(`click`,Js),X(`btn-save-deck`)?.addEventListener(`click`,nl),X(`btn-back-adventure`)?.addEventListener(`click`,al),X(`adventure-floor-backdrop`)?.addEventListener(`click`,al),X(`btn-start-adventure`)?.addEventListener(`click`,vl),vr(`adventure-deck-select`)?.addEventListener(`change`,e=>{W.selectedDeckId=e.target.value,T(W)});let n=document.getElementById(`auth-modal`),r=document.getElementById(`auth-header-btn`);oc(),Kn(`adventure-help-btn`,`adventure-help-desc`),Kn(`shop-help-btn`,`shop-help-desc`),Kn(`deck-help-btn`,`deck-help-desc`),Ns=pn({onSignIn:()=>Ps?.open(`signin`,{forced:!0}),onSignUp:()=>Ps?.open(`signup`,{forced:!0}),onGuest:()=>{en(),kl()}}),Ps=dn({authBtn:r,modal:n,onNewAccount:()=>{W=_e()?me():E(),En(W,T)},onSignedIn:()=>{tn(),W=E(),w(W),Tn(W),$(),el(),Lc(),Ns?.hide(),sc().then(()=>{G===`profile`&&lc(),G===`quests`&&hc(),G===`pvp`&&Ms().then(e=>e?.render({resume:!0}))}),Ms().then(e=>e?.render({resume:!0})),Dl(),Ol(),El(),Tl(),Y||Z(G)},onSignedOut:()=>{tn(),ac(),Q=``,ic(),As?.dispose?.(),J=null,dr({clearCheckpoint:!0}),sr(),W=me(),rc(),$(),el(),Lc(),Ns?.show(),Z(`deck`)}}),mr(()=>J),w(W),_c(),rc(),Al()}function Sl(){if(!Ls||zs!=null)return;let e=0,t=()=>{if(zs=null,e+=1,Ls){if(er()){e<10&&(zs=window.setTimeout(t,400));return}if(Tn(W),El()){Ls=!1;return}e<10&&(zs=window.setTimeout(t,500))}};zs=window.setTimeout(t,350)}function Cl(){if(!Rs||Bs!=null)return;let e=0,t=()=>{if(Bs=null,e+=1,Rs){if(er()){e<10&&(Bs=window.setTimeout(t,400));return}if(Tn(W),Tl()){Rs=!1;return}e<10&&(Bs=window.setTimeout(t,500))}};Bs=window.setTimeout(t,350)}function wl(){return Y||!fn()||!h(W)||!Pn(W)?!1:(Y=!0,ms().then(({startPvpTutorial:e})=>{e({profile:W,saveProfile:T,onComplete:()=>{Y=!1,W=E(),w(W),rc(),Z(`play`),Tl()}})}),!0)}function Tl(){return Y||!fn()||!m(W)||kn(W)||An(W)||Nn(W)||Pn(W)||!In(W)?!1:(Y=!0,Z(`play`),ms().then(({startCosmeticsTutorial:e})=>{e({profile:W,saveProfile:T,onComplete:()=>{Y=!1,W=E(),w(W),rc(),Z(`play`)}})}),!0)}function El(){return Y||!fn()||!h(W)?!1:(Tn(W),Nn(W)?(Y=!0,Z(`play`),ms().then(({startQuestsTutorial:e})=>{e({profile:W,saveProfile:T,onComplete:()=>{Y=!1,W=E(),w(W),rc(),wl(),Tl()}})}),!0):wl())}function Dl(){return Y||!fn()||!kn(W)?!1:(Y=!0,gs().then(({startInteractiveTutorial:e})=>{e({profile:W,saveProfile:T,onComplete:()=>{Y=!1,W=E(),w(W),$(),el(),Lc(),Ol()||Z(`deck`),El(),Tl()}})}),!0)}function Ol(){return Y||!fn()||!An(W)?!1:(Y=!0,Z(`deck`),fs().then(({startMetaTutorial:e})=>{e({profile:W,saveProfile:T,onComplete:()=>{Y=!1,W=E(),w(W),$(),el(),Lc(),Z(`deck`),El(),Tl()}})}),!0)}async function kl(){Ns?.hide(),!Dl()&&(Ol()||El()||Tl()||Y||(await hl()||await Z(`deck`),sr(),_o(`hub`)))}async function Al(){try{if(await Ie()){try{let e=await cn();e&&(W=e)}catch(e){console.warn(`Cloud sync on load failed`,e)}w(W),$(),el(),Lc()}}catch(e){console.warn(`Auth init failed`,e)}if(Tn(W),await sc(),As&&As.render(),sr(),mn()){Ns?.show();return}await kl()}xl(),D(async()=>{let{registerSW:e}=await import(`./virtual_pwa-register-CpSsV7JG.js`);return{registerSW:e}},[],import.meta.url).then(({registerSW:e})=>{e({immediate:!0})}),$e(),rt();export{sr as A,Xt as B,ur as C,lr as D,nr as E,On as F,Qe as G,gt as H,Mn as I,Ke as K,jn as L,Kn as M,Fn as N,dr as O,Dn as P,Ln as R,_r as S,ar as T,St as U,Rt as V,ht as W,Ka as _,Bo as a,Pa as b,Ko as c,Xo as d,To as f,no as g,U as h,Wo as i,fr as j,er as k,Ho as l,_o as m,$o as n,Vo as o,vo as p,Io as r,Go as s,Qo as t,Jo as u,Ha as v,rr as w,Sr as x,Ba as y,nn as z};