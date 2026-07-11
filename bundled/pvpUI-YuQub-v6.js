import"./cardCatalog-AnvdLb5p.js";import{c as e,o as t,s as n,u as r}from"./deckRules-B0ev_ycV.js";import{B as i,E as a,G as o,I as s,K as c,M as l,O as u,V as d,Z as ee,k as f,m as te,ot as ne,q as p}from"./storage-D-VCnmGW.js";import{s as m}from"./mageTitles-BPvsmJqw.js";import{a as h,b as g,c as re,d as ie,o as _,s as ae}from"./auth-C7AK0hyz.js";import{A as oe,B as v,D as se,E as ce,M as le,O as y,S as ue,c as b,f as x,i as de,k as fe,l as S,m as C}from"./index-CgWcA4H6.js";import{t as w}from"./board-BrVclqW3.js";import{MatchSession as pe,isMutualElimination as me,isPvpTerminalBoard as he}from"./match-DkRaWqyx.js";import{getMatchHtml as ge}from"./matchView-DdBk9Y6X.js";import{PVP_MODE_MYSTERY as _e,PVP_MODE_NORMAL as ve,PvpService as ye,clearActivePvpMatchId as T,formatPvpError as E,isMysteryMode as D,matchRowFingerprint as be,probePvpBackend as xe,readActivePvpMatchId as Se,saveActivePvpMatchId as O,shouldApplyPvpRow as Ce,subscribeOpenRooms as we}from"./pvp-D0JQJB01.js";function k(e){let t=e?.code||``,n=String(e?.message||``);return t===`PGRST202`||n.includes(`Could not find the function`)}function A(e){return e?.username&&String(e.username).trim()||e?.display_name&&String(e.display_name).trim()||`Player`}async function Te(e=50){let t=g();if(!t)return[];let n=await t.rpc(`pvp_leaderboard`,{p_limit:e});if(!n.error&&Array.isArray(n.data))return n.data.map((e,t)=>({id:e.id,username:A(e),pvpWins:Math.max(0,Number(e.pvp_wins)||0),rank:t+1}));if(n.error&&!k(n.error))throw n.error;let{data:r,error:i}=await t.from(`profiles`).select(`id, username, display_name, profile_json`).limit(200);if(i)throw i;return(r||[]).map(e=>({id:e.id,username:A(e),pvpWins:f(e.profile_json||{})})).filter(e=>e.pvpWins>0).sort((e,t)=>t.pvpWins-e.pvpWins||e.username.localeCompare(t.username)).slice(0,e).map((e,t)=>({...e,rank:t+1}))}async function Ee(e=20){let t=g(),n=_();if(!t||!n)return[];let{data:r,error:i}=await t.from(`pvp_matches`).select(`id, host_id, guest_id, host_display_name, guest_display_name, turn, match_mode, updated_at, version`).eq(`status`,`active`).not(`guest_id`,`is`,null).order(`updated_at`,{ascending:!1}).limit(e);if(i)throw i;return r||[]}function De(e){let t=g();if(!t)return()=>{};let n=t.channel(`pvp-live-matches`).on(`postgres_changes`,{event:`*`,schema:`public`,table:`pvp_matches`,filter:`status=eq.active`},()=>e?.()).subscribe();return()=>{t.removeChannel(n)}}var j=4e3;function M(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function N(e,{label:t}={}){let{username:n,cosmetics:r}=e,i=r?.equipped||{},a=m({cosmetics:r},{compact:!0});return`
    <article class="pvp-loading__card">
      <div class="profile-showcase pvp-loading__showcase">
        <div class="profile-showcase__banner" style="background:${de(i.banner)}"></div>
        <div class="profile-showcase__hero pvp-loading__hero">
          <div class="profile-avatar-stack ${b(i.frame)}">
            <div class="profile-avatar-inner" aria-hidden="true">${S(i.avatar)}</div>
          </div>
        </div>
      </div>
      <div class="pvp-loading__identity">
        ${t?`<p class="pvp-loading__label">${M(t)}</p>`:``}
        <p class="pvp-loading__name">${M(n)}</p>
        ${a?`<div class="pvp-loading__mage-title">${a}</div>`:``}
      </div>
    </article>`}function Oe(e,t){return e.innerHTML=`
    <div class="pvp-loading" role="dialog" aria-modal="true" aria-labelledby="pvp-loading-status">
      <header class="pvp-loading__header">
        <p id="pvp-loading-status" class="pvp-loading__status">Match starting</p>
        <div class="pvp-loading__progress" aria-hidden="true">
          <span class="pvp-loading__progress-bar"></span>
        </div>
      </header>
      <div class="pvp-loading__arena">
        ${N(t.local,{label:`You`})}
        <div class="pvp-loading__vs" aria-hidden="true"><span>VS</span></div>
        ${N(t.opponent,{label:`Opponent`})}
      </div>
    </div>`,new Promise(e=>{setTimeout(e,j)})}function P(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function ke(e,t,{clickable:n=!1,userId:r=``}={}){let i=e?.equipped||{},a=(t||`P`).charAt(0).toUpperCase(),o=S(i.avatar)||`<span class="profile-avatar-fallback">${P(a)}</span>`,s=`<span class="profile-avatar-stack ${b(i.frame)}"><span class="profile-avatar-inner">${o}</span></span>`;return n&&r?`<button type="button" class="pvp-room-host-profile" data-view-profile="${P(r)}" data-profile-name="${P(t)}" aria-label="View ${P(t)}'s profile">${s}</button>`:`<span class="pvp-room-host-profile pvp-room-host-profile--static" aria-hidden="true">${s}</span>`}function F(e){return`
    <div class="profile-hero-stats public-profile-modal__stats" aria-label="Player statistics">
      ${[{key:`pvp`,label:`PvP wins`,value:e.pvpWins},{key:`adventure`,label:`Floors cleared`,value:e.adventureFloorsCleared},{key:`spells`,label:`Spells played`,value:e.spellsPlayed}].map(e=>`
        <article class="profile-stat-card profile-stat-card--${e.key}">
          <span class="profile-stat-card__label">${P(e.label)}</span>
          <span class="profile-stat-card__value">${e.value}</span>
        </article>`).join(``)}
    </div>`}function Ae({username:e,cosmetics:t,stats:n}){let r=t.equipped||{},i=(e||`P`).charAt(0).toUpperCase(),a=S(r.avatar)||`<span class="profile-avatar-fallback">${P(i)}</span>`,o=m({cosmetics:t},{compact:!1});return`
    <div class="public-profile-modal" role="dialog" aria-modal="true" aria-labelledby="public-profile-title">
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <div class="profile-showcase public-profile-modal__showcase">
          <div class="profile-showcase__banner" style="background:${de(r.banner)}"></div>
          <div class="profile-showcase__hero public-profile-modal__hero">
            <div class="profile-avatar-stack ${b(r.frame)}">
              <div class="profile-avatar-inner" aria-hidden="true">${a}</div>
            </div>
            <div class="public-profile-modal__identity">
              <h2 id="public-profile-title" class="public-profile-modal__name">${P(e)}</h2>
              ${o?`<div class="public-profile-modal__title">${o}</div>`:``}
            </div>
          </div>
        </div>
        ${F(n)}
      </div>
    </div>`}var I=null;function L(){I?.remove(),I=null,document.body.classList.remove(`public-profile-modal-open`)}function R(e){e.querySelectorAll(`[data-close-public-profile]`).forEach(e=>{e.addEventListener(`click`,L)});let t=e=>{e.key===`Escape`&&(L(),document.removeEventListener(`keydown`,t))};document.addEventListener(`keydown`,t)}async function z(e,{fallbackName:t=`Player`}={}){if(!e)return;L();let n=document.createElement(`div`);n.className=`public-profile-modal public-profile-modal--loading`,n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-modal`,`true`),n.setAttribute(`aria-label`,`Loading profile`),n.innerHTML=`
    <div class="public-profile-modal__backdrop"></div>
    <div class="public-profile-modal__dialog panel game-panel">
      <p class="public-profile-modal__loading muted">Loading profile…</p>
    </div>`,document.body.appendChild(n),document.body.classList.add(`public-profile-modal-open`),I=n;try{let r=await h(e),i=r?.profile_json&&typeof r.profile_json==`object`?r.profile_json:{},a=p(i.cosmetics),o=r?.username&&String(r.username).trim()||r?.display_name&&String(r.display_name).trim()||t,s=u({pvpWins:i.pvpWins,adventure:i.adventure,spellsPlayed:i.spellsPlayed});n.remove();let c=document.createElement(`div`);c.innerHTML=Ae({username:o,cosmetics:a,stats:s});let l=c.firstElementChild;document.body.appendChild(l),I=l,R(l)}catch{n.innerHTML=`
      <div class="public-profile-modal__backdrop" data-close-public-profile></div>
      <div class="public-profile-modal__dialog panel game-panel">
        <button type="button" class="auth-modal-close public-profile-modal__close" data-close-public-profile aria-label="Close">×</button>
        <p class="public-profile-modal__loading muted">Could not load this profile.</p>
      </div>`,R(n)}}function je(e){e?.querySelectorAll(`[data-view-profile]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let n=e.getAttribute(`data-view-profile`),r=e.getAttribute(`data-profile-name`)||`Player`;n&&z(n,{fallbackName:r})})})}function B(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function Me(){return`<span class="pvp-mode-badge pvp-mode-badge--mystery">Mystery</span>`}function Ne(e){return D(e)?Me():``}function Pe(e){return`
    <header class="panel-head panel-head--compact">
      <div class="panel-head-title-row">
        <h2 class="panel-head__title">PvP Arena</h2>
        <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How PvP Arena works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
      </div>
      <p id="pvp-help-desc" class="panel-head__desc" hidden>${e}</p>
    </header>`}function V({root:u,getProfile:f,openAuthModal:m,onNavigateTab:g,onPvpViewShown:b,onOpenDeckEdit:de}){if(!u)return{render:()=>{},dispose:()=>{}};function S(){le(u.querySelector(`#pvp-help-btn`),u.querySelector(`#pvp-help-desc`))}let k=null,A=null,j=!1,M=null,N=null,P=null,F=null,Ae=!1,I=!1,L=!1,R=null,z=null,V=`hub`,Fe=null,Ie=null,H=!1,Le=!1;function U(){Fe&&=(clearInterval(Fe),null),Ie?.(),Ie=null}function Re(){return`<button type="button" class="btn-text pvp-back-btn" id="pvp-back-hub">← PvP</button>`}function ze(){u.querySelector(`#pvp-back-hub`)?.addEventListener(`click`,()=>{G(),U(),ft(),!A&&!H&&(k?.dispose(),k=null),V=`hub`,W()})}function Be(){Q(),R=null,H=!1,V=`hub`,W()}function W(e=``,t=!1){if(G(),U(),!re()){u.innerHTML=`
        <section class="panel game-panel pvp-panel">
          ${Pe(`Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.`)}
        </section>`,S();return}u.innerHTML=`
      <section class="panel game-panel pvp-hub-panel">
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">PvP</h2>
            <button type="button" id="pvp-help-btn" class="panel-help-btn" aria-label="How PvP works" aria-expanded="false" aria-controls="pvp-help-desc">?</button>
          </div>
          <p id="pvp-help-desc" class="panel-head__desc" hidden>Tap Arena to host or join matches. Tap Leaderboard for global ranks and live spectating.</p>
        </header>
        <div class="pvp-hub" role="group" aria-label="PvP destinations">
          <button type="button" class="pvp-hub-tile pvp-hub-tile--arena" id="pvp-go-arena">
            <span class="pvp-hub-tile__icon" aria-hidden="true">⚔️</span>
            <span class="pvp-hub-tile__title">Arena</span>
            <span class="pvp-hub-tile__desc">Host or join live matches</span>
          </button>
          <button type="button" class="pvp-hub-tile pvp-hub-tile--leaderboard" id="pvp-go-leaderboard">
            <span class="pvp-hub-tile__icon" aria-hidden="true">🏆</span>
            <span class="pvp-hub-tile__title">Leaderboard</span>
            <span class="pvp-hub-tile__desc">Global ranks &amp; spectate live games</span>
          </button>
        </div>
        ${_()?``:`<p class="pvp-sign-in-nudge">${v}</p>`}
        <p id="pvp-status" class="pvp-status${t?` pvp-status--error`:``}" role="status">${B(e)}</p>
      </section>`,S(),u.querySelector(`#pvp-go-arena`)?.addEventListener(`click`,()=>{if(!_()){m();return}V=`arena`,q()}),u.querySelector(`#pvp-go-leaderboard`)?.addEventListener(`click`,()=>{if(!_()){m();return}V=`leaderboard`,qe()})}function Ve(e,t=!1){let n=u.querySelector(`#pvp-leaderboard-status`);n&&(n.textContent=e,n.classList.toggle(`pvp-status--error`,t))}function He(e){return e===1?`🥇`:e===2?`🥈`:e===3?`🥉`:String(e)}function Ue(e,t){return e.length?e.map(e=>`<li class="pvp-leaderboard-row${e.id===t?` pvp-leaderboard-row--self`:``}">
          <span class="pvp-leaderboard-row__rank">${He(e.rank)}</span>
          <span class="pvp-leaderboard-row__name">${B(e.username)}</span>
          <span class="pvp-leaderboard-row__wins">${e.pvpWins} win${e.pvpWins===1?``:`s`}</span>
        </li>`).join(``):`<li class="pvp-leaderboard-empty">No ranked players yet — win PvP matches to appear here.</li>`}function We(e,t){return e.length?e.map(e=>{let n=B(e.host_display_name?.trim()||`Red`),r=B(e.guest_display_name?.trim()||`Black`),i=e.host_id===t||e.guest_id===t,a=D(e)?Me():``,o=e.turn===w.RED?e.host_display_name?.trim()||`Red`:e.guest_display_name?.trim()||`Black`,s=i?`<span class="pvp-live-match__tag">Your match</span>`:`<button type="button" class="btn-secondary pvp-live-spectate" data-spectate-match="${e.id}">Spectate</button>`;return`<li class="pvp-live-match">
          <div class="pvp-live-match__body">
            <span class="pvp-live-match__players">${n} vs ${r} ${a}</span>
            <span class="pvp-live-match__meta">${B(o)}&apos;s turn</span>
          </div>
          ${s}
        </li>`}).join(``):`<li class="pvp-leaderboard-empty">No live matches right now.</li>`}async function Ge(){let e=u.querySelector(`#pvp-rank-list`),t=u.querySelector(`#pvp-live-list`),n=_();if(!(!e||!t||!n||A||H)&&!Le){Le=!0;try{let[r,i]=await Promise.all([Te(50),Ee(20)]);e.innerHTML=Ue(r,n.id),t.innerHTML=We(i,n.id),t.querySelectorAll(`[data-spectate-match]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-spectate-match`);t&&Je(t)})})}catch(n){let r=`<li class="pvp-leaderboard-empty pvp-open-empty--error">${B(E(n))}</li>`;e.innerHTML=r,t.innerHTML=r}finally{Le=!1}}}function Ke(){U(),Ge(),Fe=setInterval(()=>void Ge(),8e3),Ie=De(()=>void Ge())}function qe(e=``,t=!1){if(G(),!_()){V=`hub`,W();return}u.innerHTML=`
      <section class="panel game-panel pvp-leaderboard-panel">
        ${Re()}
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
        <p id="pvp-leaderboard-status" class="pvp-status${t?` pvp-status--error`:``}" role="status">${B(e)}</p>
      </section>`,S(),ze(),Ke()}async function Je(e){if(!_()){m();return}if(!(A||j||H))try{Ve(`Joining as spectator…`);let t=new ye,n=await t.fetchMatch(e);if(!n||n.status!==`active`||!n.guest_id||!n.state_json){Ve(`That match is no longer live.`,!0),Ge();return}let r=_();if(n.host_id===r.id||n.guest_id===r.id){V=`arena`,$().attachToMatch(n,r.id),O(n.id),j=!0,await Dt(n,{resume:!0});return}U(),k?.dispose(),k=t,k.onMatchRow=Z,k.onError=e=>A?.setMessage(E(e)),k.attachAsSpectator(n),j=!0,await Xe(n)}catch(e){Ve(E(e),!0),j=!1,H=!1}}function Ye(e){if(!A||!H||!e?.state_json||!Ce(e,k,A))return;let t=e.host_display_name?.trim()||`Red`,n=e.guest_display_name?.trim()||`Black`;if(e.status===`finished`){if(A.actionBusy=!1,A.importState(e.state_json),!e.winner_id&&me(e.state_json))A.setMessage(`Match over — tie game.`);else if(e.winner_id){let r=e.winner_id===e.host_id?t:n;A.setMessage(`Match over — ${r} wins.`)}else A.setMessage(`Match over.`);return}A.importState(e.state_json);let r=e.turn===w.RED?t:n;A.setMessage(`${r} is playing…`)}async function Xe(e){if(!e?.state_json||e.status!==`active`){j=!1,H=!1,qe(`That match is no longer live.`,!0);return}H=!0,jt();let t=e.host_display_name?.trim()||`Red`,n=e.guest_display_name?.trim()||`Black`,r=f(),[i,a]=await Promise.all([ut(e.host_id,r),ut(e.guest_id,r)]),o=d(i,e.host_piece_skin),s=d(a,e.guest_piece_skin);u.innerHTML=``;let c=document.createElement(`div`);c.id=`pvp-match-root`,u.appendChild(c),c.innerHTML=ge(n,{exitLabel:`← Leave spectate`,pvp:!0,spectator:!0,localName:t}),k._lastVersion=e.version??0,k._lastAppliedFingerprint=be(e),A=new pe(Array.isArray(e.host_deck_ids)?e.host_deck_ids:e.host_deck_ids||[],c,()=>{A=null,j=!1,H=!1,y(),x(),C(`hub`),k?.dispose(),k=null,V=`leaderboard`,qe()},null,{pvp:!0,spectator:!0,localColor:w.RED,initialState:e.state_json,opponentName:n,cosmetics:o,opponentCosmetics:s,skipCheckpoint:!0}),se({kind:`pvp`}),await x(),C(`match`),A.setMessage(`Spectating ${t} vs ${n}`),A.render(),k.startPolling(1200),j=!1}function G(){N&&=(clearInterval(N),null),P&&=(clearTimeout(P),null),F=null,Ae=!1,I=!1,M?.(),M=null}function K(e=null){e&&(F=e),!P&&(P=setTimeout(()=>{P=null;let e=F;F=null,Qe(e)},300))}function Ze(){G(),K(),N=setInterval(()=>K(),5e3),M=we(()=>K())}function q(e=``,t=!1){let n=_(),i=f(),a=(i.decks||[]).filter(e=>r(e.cardIds,i).valid),o=a.find(e=>e.id===i.selectedDeckId)||a[0];if(G(),!re()){u.innerHTML=`
        <section class="panel game-panel pvp-panel">
          ${Pe(`Add your Supabase <strong>anon</strong> key to <code>js/supabaseConfig.js</code> from
              <a href="https://supabase.com/dashboard/project/xhoskftcrgbsjkmzjscw/settings/api" target="_blank" rel="noopener">API settings</a>, run <code>supabase/schema.sql</code>, then reload.`)}
        </section>`,S();return}if(!n){V=`hub`,W();return}u.innerHTML=`
      <section class="panel game-panel pvp-panel">
        ${Re()}
        ${Pe(`Host a room or join an open match below. Piece skins are shown on the board — matching non-default skins block joins so both sides stay distinct.`)}
        <div class="pvp-setup-row">
          <div class="pvp-setup-field">
            <label class="label-sm" for="pvp-deck-select">Your deck</label>
            <select id="pvp-deck-select" class="select-input">
              ${a.length?a.map(e=>`<option value="${e.id}" ${e.id===o?.id?`selected`:``}>${B(e.name)}</option>`).join(``):`<option value="">No PvP-ready deck — open Decks</option>`}
            </select>
          </div>
          <div class="pvp-setup-field">
            <label class="label-sm" for="pvp-mode-select">Mode</label>
            <select id="pvp-mode-select" class="select-input">
              <option value="${ve}" selected>Normal</option>
              <option value="${_e}">Mystery</option>
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
        <p id="pvp-status" class="pvp-status${t?` pvp-status--error`:``}" role="status">${B(e)}</p>
        <div id="pvp-waiting" class="pvp-waiting hidden"></div>
      </section>`,u.querySelector(`#pvp-host`)?.addEventListener(`click`,()=>void Ot()),ue(u.querySelector(`#pvp-deck-select`)),ue(u.querySelector(`#pvp-mode-select`)),u.querySelector(`#pvp-mode-select`)?.addEventListener(`change`,ot),ot(),S(),ze(),Ze(),xe().then(e=>{if(!e.ok&&e.reason){let t=u.querySelector(`#pvp-status`);t&&!t.textContent&&(t.textContent=e.reason,t.classList.add(`pvp-status--error`));return}e.hint&&console.info(`[PvP]`,e.hint)})}async function Qe(e=null){let t=u.querySelector(`#pvp-your-list`),n=u.querySelector(`#pvp-open-list`),r=_();if(!(!t||!n||!r||A)){if(L){e&&(F=e);return}L=!0;try{let t=k??new ye,[n,r]=await Promise.all([t.listMyWaitingRooms(),t.listOthersWaitingRooms()]),i=n;e&&!n.some(t=>t.id===e.id)&&(i=[e,...n]);let a=await nt([...i,...r]);it(i,r,a),rt(i.length)}catch(e){let r=`<li class="pvp-open-empty pvp-open-empty--error">${B(E(e))}</li>`;t.innerHTML=r,n.innerHTML=r}finally{if(L=!1,F){let e=F;F=null,K(e)}}}}function $e(e){return s[e]?.name||`Classic Disc`}function et(e,t){return t?.get(e.host_id)?.displayName||e.host_display_name||`Player`}function tt(e,t,{clickable:n=!1}={}){let r=et(e,t);return ke(t?.get(e.host_id)?.cosmetics||p(null),r,{clickable:n,userId:e.host_id})}async function nt(e){let t=_(),n=f(),r=[...new Set(e.map(e=>e.host_id).filter(Boolean))],i=new Map;return await Promise.all(r.map(async r=>{if(r===t?.id){i.set(r,{displayName:await Y(),cosmetics:o(n)});return}try{let t=await h(r),n=e.find(e=>e.host_id===r)?.host_display_name,a=t?.username&&String(t.username).trim()||t?.display_name&&String(t.display_name).trim()||n&&String(n).trim()||`Player`,o=t?.profile_json?.cosmetics;i.set(r,{displayName:a,cosmetics:p(o||null)})}catch{let t=e.find(e=>e.host_id===r)?.host_display_name;i.set(r,{displayName:t||`Player`,cosmetics:p(null)})}})),i}function rt(e=0){let t=u.querySelector(`#pvp-host`);if(!t)return;let n=e>0;t.disabled=n,t.title=n?`You already have a room open — cancel it first.`:``,t.setAttribute(`aria-disabled`,n?`true`:`false`)}function it(e,t,n=new Map){let r=u.querySelector(`#pvp-your-list`),a=u.querySelector(`#pvp-open-list`);if(!r||!a)return;let o=c(f()),s=_()?.id;e.length?r.innerHTML=e.map(e=>{let t=et(e,n);return`<li class="pvp-open-item pvp-open-item--mine">
            ${tt(e,n,{clickable:!1})}
            <div class="pvp-open-item__body">
              <span class="pvp-open-item__label">${B(t)} ${Ne(e)}</span>
              <span class="pvp-open-item__meta">${D(e)?`Mystery — waiting for opponent…`:`Waiting for opponent…`}</span>
            </div>
            <button type="button" class="btn-secondary pvp-open-cancel" data-cancel-room="${e.id}">Cancel</button>
          </li>`}).join(``):r.innerHTML=`<li class="pvp-open-empty">No rooms yet — host one above.</li>`,rt(e.length),t.length?a.innerHTML=t.map(e=>{let t=e.host_piece_skin||`skin_classic`,r=ee(t,o),a=$e(t),c=et(e,n),l=tt(e,n,{clickable:e.host_id!==s});return r?`<li class="pvp-open-item pvp-open-item--blocked">
              ${l}
              <div class="pvp-open-join pvp-open-join--disabled" title="${B(i)}">
                <span class="pvp-open-join__name">${B(c)} ${Ne(e)}</span>
                <span class="pvp-open-join__skin">${B(a)} skin — same as yours</span>
              </div>
            </li>`:`<li class="pvp-open-item">
            ${l}
            <button type="button" class="pvp-open-join" data-join-room="${e.id}" data-mystery="${D(e)?`1`:`0`}">
              <span class="pvp-open-join__name">${B(c)} ${Ne(e)}</span>
              <span class="pvp-open-join__skin">${B(a)} skin</span>
              <span class="pvp-open-join__action">${D(e)?`Join Mystery`:`Join match`}</span>
            </button>
          </li>`}).join(``):a.innerHTML=`<li class="pvp-open-empty">${e.length?`No open rooms from other players. Yours is listed above under <strong>Your rooms</strong>.`:`No open rooms from other players.`}</li>`,je(r),je(a),a.querySelectorAll(`[data-join-room]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-join-room`),n=e.getAttribute(`data-mystery`)===`1`;t&&kt(t,{mystery:n})})}),r.querySelectorAll(`[data-cancel-room]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-cancel-room`);t&&Nt(t)})})}function at(){return u.querySelector(`#pvp-mode-select`)?.value||`normal`}function ot(){let e=at()===_e,t=u.querySelector(`#pvp-deck-select`),n=u.querySelector(`#pvp-mode-hint`);t&&(t.disabled=e),n?.classList.toggle(`hidden`,!e)}function J(){let e=f(),t=u.querySelector(`#pvp-deck-select`)?.value||e.selectedDeckId;return e.decks.find(e=>e.id===t)}async function Y(){let e=_();if(!e)return`Player`;try{let t=await h(e.id),n=t?.username||t?.display_name;if(n&&String(n).trim())return String(n).trim()}catch{}return e.user_metadata?.display_name||e.email?.split(`@`)[0]||`Player`}function st(e){let t=k?.localColor===w.RED?e.guest_display_name:e.host_display_name;return t&&String(t).trim()?String(t).trim():`Opponent`}function ct(e){let t=k?.localColor===w.RED?e.host_display_name:e.guest_display_name;return t&&String(t).trim()?String(t).trim():`You`}function lt(e){return k?.localColor===w.RED?e.guest_id:e.host_id}async function ut(e,t){if(!e)return o(t);try{let t=(await h(e))?.profile_json?.cosmetics;if(t)return p(t)}catch{}return o(t)}function X(e,t=!1){let n=u.querySelector(`#pvp-status`);n&&(n.textContent=e,n.classList.toggle(`pvp-status--error`,t))}function dt(){let e=u.querySelector(`#pvp-waiting`);e&&(e.classList.remove(`hidden`),e.innerHTML=`<p class="pvp-wait-hint">Your room is listed under <strong>Your rooms</strong>. Waiting for someone to join…</p>`)}function ft(){let e=u.querySelector(`#pvp-waiting`);e&&(e.classList.add(`hidden`),e.innerHTML=``)}function pt(e){if(!A||!e?.state_json||!Ce(e,k,A))return;let t=e.version??0,n=he(e.state_json,k.localColor),r=e.status===`finished`;(n||r)&&(A.actionBusy=!1);let i=e.turn===k.localColor,a=st(e);if(A.opponentName=a,A.importState(e.state_json)&&(k._lastAppliedFingerprint=be(e),t>(k?._lastVersion??-1)&&(k._lastVersion=t)),!A._gameOverUiShown&&r){if(!e.winner_id&&me(e.state_json))A.showGameOver(`Tie!`,`Both players lost all their pieces.`);else if(e.winner_id){let t=_()?.id===e.winner_id,n=!he(e.state_json,k.localColor);A.showGameOver(t?`Victory!`:`Defeat`,t?n?`Your opponent left the match.`:`You won the match!`:`You lost the match.`)}}A._gameOverUiShown||A.setMessage(i?`Your turn — cast a spell or move.`:`${a} is acting…`)}function Z(e){if(e){if(H&&A){Ye(e);return}if(A?._gameOverUiShown&&R){if(e.status===`active`&&e.state_json&&(e.id===R.localRematchRoomId||e.id===R.opponentRematchRoomId)){xt(e);return}if(e.status===`waiting`&&e.id===R.localRematchRoomId)return;if(e.status===`finished`&&e.id===R.finishedRow?.id){R.finishedRow=e;return}}if(e.status===`waiting`&&k?.role===`host`&&!A?._gameOverUiShown){X(`Your room is open — waiting for an opponent…`),dt(),Ae||(Ae=!0,k.startPolling(4e3)),K();return}if(A&&e.state_json&&(e.status===`active`||e.status===`finished`)){let t=he(e.state_json,k.localColor),n=e.status===`finished`;if(!n&&!Ce(e,k,A))return;if((A.actionBusy||A._syncBusy||A._syncDirty)&&!t&&!n){A.queuePvpRow(e);return}pt(e);return}if(e.status===`active`&&!A&&!j){if(e.state_json){let t=_();t&&At(e,t.id)&&k?.attachToMatch(e,t.id),G(),ft(),I=!1,j=!0,Dt(e).finally(()=>{A||(j=!1)});return}I||(I=!0,k.startPolling(600));return}}}function mt(r){let i=f(),a=D(r),o=k?.localColor;if(a&&r?.state_json&&o){let e=t(r.state_json,o);if(Array.isArray(e)&&e.length===30)return e}let s=o===w.RED?r.host_deck_ids:r.guest_deck_ids,c=a?null:i;if(Array.isArray(s)&&!e(s,c)){if(a){let e=J()?.cardIds;if(e&&n(s,e)){let e=o&&t(r?.state_json,o);return Array.isArray(e)&&e.length===30?e:null}}return s}if(a)return null;let l=J();return l&&!e(l.cardIds,i)?l.cardIds:null}function Q(){z&&=(clearInterval(z),null)}function ht(e,{isTie:t}){if(t)return[{id:`rematch`,label:`Rematch`,primary:!0},{id:`back`,label:`Back to PvP`}];if(e?.opponentRematchRoomId){let t=[{id:`joinRematch`,label:`Join rematch`,primary:!0}];return D(e.finishedRow)||t.push({id:`editDeck`,label:`Edit deck`}),t.push({id:`back`,label:`Back to PvP`}),t}let n=[];return e?.localRematchRoomId?n.push({id:`rematch`,label:`Waiting for opponent…`,primary:!0,disabled:!0}):n.push({id:`rematch`,label:`Rematch`,primary:!0}),D(e?.finishedRow)||n.push({id:`editDeck`,label:`Edit deck`}),n.push({id:`back`,label:`Back to PvP`}),n}function gt(){if(!A?._gameOverUiShown||!R)return;let e=A.root.querySelector(`#game-over-title`)?.textContent||``,t=e.startsWith(`Victory`),n=e.startsWith(`Tie`);A.renderGameOverActions({won:t,isTie:n,stars:0})}function _t(e,t){return!e?.created_at||!t?!0:new Date(e.created_at).getTime()>=t-1e4}async function vt(e,t){return!e||!k?null:(await k.listOthersWaitingRooms()).filter(n=>n.host_id===e&&_t(n,t)).sort((e,t)=>new Date(t.created_at)-new Date(e.created_at))[0]||null}async function yt(e){if(!(!A?._gameOverUiShown||!e||!k))try{if(e.localRematchRoomId){let t=await k.fetchMatch(e.localRematchRoomId);if(t?.status===`active`&&t.state_json){Q(),await xt(t);return}t?.status!==`waiting`&&(e.localRematchRoomId=null)}let t=await vt(e.opponentId,e.matchEndedAt);if(t&&t.id!==e.opponentRematchRoomId){e.opponentRematchRoomId=t.id,gt();let n=A.root.querySelector(`#game-over-text`);n&&(n.textContent=`${e.opponentName} wants a rematch — join when you're ready.`)}}catch{}}function bt(e){Q(),z=setInterval(()=>void yt(e),2e3),yt(e)}async function xt(e){Q(),R=null,A?.dispose(),A=null,j=!0;try{k?.attachToMatch(e),O(e.id),await Dt(e)}finally{A||(j=!1)}}async function St(t,n){let r=D(n.finishedRow);if(!r){let t=e((f().decks.find(e=>e.id===n.deckId)||J())?.cardIds??[],f());if(t){let e=A?.root.querySelector(`#game-over-text`);e&&(e.textContent=t);return}}Q(),n.localRematchRoomId&&n.localRematchRoomId!==t&&(await Nt(n.localRematchRoomId),n.localRematchRoomId=null);let i=r?null:(f().decks.find(e=>e.id===n.deckId)||J())?.cardIds,a=await $().joinRoomById(t,i,await Y(),{guestPieceSkin:c(f())});R=null,await xt(a)}async function Ct(t,{joinOnly:n=!1}={}){if(!(!t||!k))try{let r=n&&t.opponentRematchRoomId?await k.fetchMatch(t.opponentRematchRoomId):await vt(t.opponentId,t.matchEndedAt);if(r?.status===`waiting`&&!r.guest_id){await St(r.id,t);return}if(n)return;let i=D(t.finishedRow);if(!i){let n=e((f().decks.find(e=>e.id===t.deckId)||J())?.cardIds??[],f());if(n){let e=A?.root.querySelector(`#game-over-text`);e&&(e.textContent=n);return}}let a=f().decks.find(e=>e.id===t.deckId)||J(),o=await k.createRoom(i?null:a.cardIds,await Y(),{matchMode:t.finishedRow.match_mode||`normal`,hostPieceSkin:c(f())});t.localRematchRoomId=o.id,t.opponentRematchRoomId=null,k.attachToMatch(o),O(o.id),k.startPolling(2e3),bt(t),gt();let s=A?.root.querySelector(`#game-over-text`);s&&(s.textContent=`Waiting for ${t.opponentName} to join rematch…`)}catch(e){let t=A?.root.querySelector(`#game-over-text`);t&&(t.textContent=E(e,{context:`rematch`}))}}async function wt(e,t){if(e===`back`){Q(),t?.localRematchRoomId&&await Nt(t.localRematchRoomId),R=null,A?.onExit?.();return}if(e===`editDeck`){Q(),t?.localRematchRoomId&&await Nt(t.localRematchRoomId);let e=t?.deckId||f().selectedDeckId;A?.dispose(),A=null,j=!1,R=null,y(),x(),C(`hub`),T(),k?.dispose(),k=null,u.innerHTML=``,g?.(`deck`),e&&de?.(e);return}if(e===`rematch`){await Ct(t);return}e===`joinRematch`&&await Ct(t,{joinOnly:!0})}function Tt(t){if(D(t))return`Mystery deck not ready yet — wait a moment, then try again.`;let n=f(),r=k?.localColor===w.RED?t.host_deck_ids:t.guest_deck_ids;if(Array.isArray(r)){let t=e(r,n);if(t)return t}let i=J();return i?e(i.cardIds,n)||`Deck not ready for PvP — open Decks and fix your deck.`:`No deck selected — open Decks and build a complete 30-card deck.`}function Et(e,t=_()?.id){return e?.host_id&&e.host_id===t?w.RED:e?.guest_id&&e.guest_id===t?w.BLACK:k?.localColor??w.RED}async function Dt(e,{resume:t=!1}={}){let n=f(),r=mt(e);if(!r&&D(e)&&k?.matchId)try{let t=await k.fetchMatch(k.matchId);t&&(e=t,r=mt(e))}catch{}if(!r){j=!1,X(Tt(e),!0),D(e)||q();return}jt();let i=_();i&&At(e,i.id)&&k.attachToMatch(e,i.id);let o=Et(e,i?.id),s=st(e),c=ct(e),[ee,p]=await Promise.all([ut(i?.id,n),ut(lt(e),n)]),m=o===w.RED,h=m?e.host_piece_skin:e.guest_piece_skin,re=m?e.guest_piece_skin:e.host_piece_skin,ie=d(ee,h),ae=d(p,re),oe=n.decks.find(e=>e.id===n.selectedDeckId)||n.decks[0];if(R={finishedRow:e,opponentId:lt(e),opponentName:s,matchEndedAt:null,localRematchRoomId:null,opponentRematchRoomId:null,deckId:oe?.id||n.selectedDeckId},t||await Oe(u,{local:{username:c,cosmetics:ie},opponent:{username:s,cosmetics:ae}}),!k||e.status!==`active`||!e.state_json){j=!1,A||q();return}u.innerHTML=``;let v=document.createElement(`div`);v.id=`pvp-match-root`,u.appendChild(v),v.innerHTML=ge(s,{exitLabel:`← Leave PvP`,pvp:!0}),k._lastVersion=e.version??0,k._lastAppliedFingerprint=be(e);try{A=new pe(r,v,()=>{A=null,j=!1,Q(),R=null,y(),x(),C(`hub`),T(),k?.dispose(),k=null;let e=ce();e?g?.(e):Be()},null,{pvp:!0,localColor:o,initialState:e.state_json,opponentName:s,cosmetics:ie,opponentCosmetics:ae,onStateSync:async e=>{let t=k._lastVersion,n=await k.pushState(e,t);if(n){k._lastVersion=n.version,k._lastAppliedFingerprint=be(n);return}let r=await k.fetchMatch(k.matchId);r&&Z(r)},onPvpForfeit:async()=>{if(!k||A?._gameOverUiShown)return;let t=lt(e);t&&await k.finishMatch(t)},onPvpWin:async t=>{let n=_();if(n){if(t===null)await k.finishMatch(null);else{if(t){let e=f();l(e),ne(e,`pvp_wins`,1),a(e),te(e)}let r=t?n.id:o===w.RED?e.guest_id:e.host_id;r&&await k.finishMatch(r)}if(R){try{let e=await k.fetchMatch(k.matchId);e&&(R.finishedRow=e)}catch{}R.matchEndedAt=new Date(R.finishedRow?.updated_at||Date.now()).getTime(),bt(R)}}},onPvpPendingRow:e=>pt(e),buildGameOverActions:({won:e,isTie:t})=>ht(R,{won:e,isTie:t}),onGameOverAction:e=>{wt(e,R)},onPvpSyncError:e=>{A?._gameOverUiShown||A.setMessage(E(e,{context:`sync`}))}})}catch(e){throw A=null,j=!1,v.remove(),q(),e}se({kind:`pvp`}),await x(),C(`match`),A.setMessage(t?`Match resumed — pick up where you left off.`:D(e)?o===e.turn?`Mystery Mode — your turn with a random deck!`:`${s} is thinking…`:o===e.turn?`Your turn — cast a spell or move.`:`${s} is thinking…`),A.render(),O(e.id),k.startPolling(800),j=!1}function $(){return k||(k=new ye,k.onMatchRow=Z,k.onError=e=>X(E(e),!0)),k}async function Ot(){if(!_()){m();return}let t=at(),n=t===_e,r=J();if(!n){let t=e(r?.cardIds??[],f());if(t){X(t,!0);return}}k?.dispose(),k=null;try{X(n?`Opening Mystery room…`:`Opening your room…`);let e=await $().createRoom(n?null:r.cardIds,await Y(),{matchMode:t,hostPieceSkin:c(f())}),i=await nt([e]);it([e],[],i),X(n?`Mystery room open — waiting under Your rooms.`:`Room open — waiting under Your rooms.`),O(e.id),Z(e),K(e)}catch(e){X(E(e),!0),k?.dispose(),k=null}}async function kt(t,{mystery:n=!1}={}){if(!_()){m();return}if(!n){let t=e(J()?.cardIds??[],f());if(t){X(t,!0);return}}k?.dispose(),k=null;try{X(n?`Joining Mystery match…`:`Joining match…`),G();let e=$(),r=n?null:J().cardIds,i=c(f()),a=await e.joinRoomById(t,r,await Y(),{guestPieceSkin:i});O(a.id),Z(a)}catch(e){X(E(e),!0),k?.dispose(),k=null,Ze()}}function At(e,t){return e?.host_id===t||e?.guest_id===t}function jt(){document.querySelectorAll(`.tab-btn`).forEach(e=>{e.classList.toggle(`active`,e.dataset.tab===`pvp`)}),document.querySelectorAll(`.view`).forEach(e=>{e.classList.toggle(`hidden`,e.id!==`view-pvp`)}),b?.()}async function Mt(){if(A||j)return!1;let e=_();if(!e||!re())return!1;let t=$(),n=null,r=Se();if(r)try{let i=await t.fetchMatch(r);i&&At(i,e.id)&&i.status!==`finished`?n=i:T()}catch{T()}if(!n)try{n=await t.listActiveMatchForUser()}catch(e){return X(E(e),!0),!1}if(n?.status===`active`){if(V=`arena`,jt(),!n.state_json)return t.attachToMatch(n,e.id),O(n.id),t.startPolling(800),!0;G(),ft(),t.attachToMatch(n,e.id),j=!0;try{return await Dt(n,{resume:!0}),!!A}finally{A||(j=!1)}}if(!k?.matchId)try{let n=await t.listMyWaitingRooms();if(n.length){V=`arena`,jt();let r=n[0];return t.attachToMatch({...r,status:`waiting`},e.id),O(r.id),Z(r),K(r),!0}}catch{}return!1}async function Nt(e){if(!e&&k?.matchId&&(e=k.matchId),e)try{X(`Cancelling room…`),await(k??new ye).cancelRoom(e),k?.matchId===e&&(k.dispose(),k=null,T()),ft(),X(``),K()}catch(e){X(E(e),!0)}}function Pt(){return!A||j||fe()?!1:(A=null,y({clearCheckpoint:!1}),u.querySelector(`#pvp-match-root`)?.remove(),!0)}function Ft({resume:e=!1}={}){Pt(),!(j||u.querySelector(`.pvp-loading`))&&(A||(V===`arena`?q():V===`leaderboard`?qe():W(),e&&Mt()))}let It=()=>{!u||u.classList.contains(`hidden`)||Ft({resume:!0})};window.addEventListener(`cc-match-shell-reconciled`,It);let Lt=null,Rt=ie(e=>{if(A||j)return;let t=e?.id??null;t!==Lt&&(Lt=t,Ft({resume:!!t}))});return ae().then(e=>{Lt=e?.id??null,Ft({resume:!!e})}),{render:Ft,tryResume:Mt,dispose(){Rt(),window.removeEventListener(`cc-match-shell-reconciled`,It),G(),U(),Q(),R=null,A=null,H=!1,V=`hub`,T(),k?.dispose(),k=null,y({clearCheckpoint:!0}),oe()}}}export{V as initPvpUI};