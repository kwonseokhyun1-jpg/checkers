import{q as e}from"./storage-D61OLkcg.js";import{a as t,c as n,f as r,o as i}from"./auth-12TAJw7y.js";import{M as a,V as o}from"./index-D_mqVEai.js";import{n as s,r as c}from"./userProfileModal-Cxqk74sU.js";function l(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function u(e){return e?.username&&String(e.username).trim()||e?.display_name&&String(e.display_name).trim()||`Player`}function d(e){return Array.isArray(e.friends)||(e.friends=[]),e.friends=[...new Set(e.friends.filter(e=>typeof e==`string`&&e.length>0))],e.friends}function f({root:f,getProfile:p,saveProfile:m,openAuthModal:h}){if(!f)return{render:()=>{}};let g=null,_=[];function v(e,t=!1){let n=f.querySelector(`#social-status`);n&&(n.textContent=e,n.classList.toggle(`pvp-status--error`,t))}function y(e){return d(p()).includes(e)}function b(e){let t=i();if(!t){h();return}if(!e||e===t.id)return;let n=p(),r=d(n);r.includes(e)||(n.friends=[...r,e],m(n),v(`Friend added.`),C(),S())}function x(e){let t=p();t.friends=d(t).filter(t=>t!==e),m(t),v(`Friend removed.`),C(),S()}function S(){let t=f.querySelector(`#social-search-results`);if(!t)return;let n=i();if(!_.length){t.innerHTML=`<li class="social-empty">Search by username to find players.</li>`;return}t.innerHTML=_.map(t=>{let r=u(t),i=s(e(t.profile_json?.cosmetics),r,{clickable:!0,userId:t.id}),a=n?.id===t.id,o=y(t.id),c=``;return c=a?`<span class="social-tag">You</span>`:o?`<button type="button" class="btn-text social-remove-btn" data-remove-friend="${l(t.id)}">Remove</button>`:`<button type="button" class="btn-secondary social-add-btn" data-add-friend="${l(t.id)}">Add friend</button>`,`<li class="social-player-row">
          ${i}
          <div class="social-player-row__body">
            <span class="social-player-row__name">${l(r)}</span>
            <span class="social-player-row__handle">@${l(t.username||`player`)}</span>
          </div>
          ${c}
        </li>`}).join(``),t.querySelectorAll(`[data-add-friend]`).forEach(e=>{e.addEventListener(`click`,()=>b(e.getAttribute(`data-add-friend`)))}),t.querySelectorAll(`[data-remove-friend]`).forEach(e=>{e.addEventListener(`click`,()=>x(e.getAttribute(`data-remove-friend`)))}),t.querySelectorAll(`[data-view-profile]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let n=e.getAttribute(`data-view-profile`),r=e.getAttribute(`data-profile-name`)||`Player`;n&&c(n,{fallbackName:r})})})}async function C(){let n=f.querySelector(`#social-friends-list`);if(!n)return;let r=i(),a=d(p());if(!r){n.innerHTML=`<li class="social-empty">Sign in to add friends.</li>`;return}if(!a.length){n.innerHTML=`<li class="social-empty">No friends yet — search above to add players.</li>`;return}n.innerHTML=`<li class="social-empty">Loading friends…</li>`;try{let r=(await Promise.all(a.map(e=>t(e)))).filter(Boolean);if(!r.length){n.innerHTML=`<li class="social-empty">No friends found.</li>`;return}n.innerHTML=r.map(t=>{let n=u(t);return`<li class="social-player-row">
            ${s(e(t.profile_json?.cosmetics),n,{clickable:!0,userId:t.id})}
            <div class="social-player-row__body">
              <span class="social-player-row__name">${l(n)}</span>
              <span class="social-player-row__handle">@${l(t.username||`player`)}</span>
            </div>
            <button type="button" class="btn-text social-view-btn" data-view-friend="${l(t.id)}" data-friend-name="${l(n)}">Profile</button>
            <button type="button" class="btn-text social-remove-btn" data-remove-friend="${l(t.id)}">Remove</button>
          </li>`}).join(``),n.querySelectorAll(`[data-remove-friend]`).forEach(e=>{e.addEventListener(`click`,()=>x(e.getAttribute(`data-remove-friend`)))}),n.querySelectorAll(`[data-view-friend]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-view-friend`),n=e.getAttribute(`data-friend-name`)||`Player`;t&&c(t,{fallbackName:n})})}),n.querySelectorAll(`[data-view-profile]`).forEach(e=>{e.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation();let n=e.getAttribute(`data-view-profile`),r=e.getAttribute(`data-profile-name`)||`Player`;n&&c(n,{fallbackName:r})})})}catch{n.innerHTML=`<li class="social-empty social-empty--error">Could not load friends.</li>`}}async function w(e){let t=String(e||``).trim();if(t.length<2){_=[],S(),v(``);return}if(!i()){v(`Sign in to search players.`,!0);return}if(!n()){v(`Social features need Supabase — check your config.`,!0);return}v(`Searching…`);try{_=await r(t,12),S(),v(_.length?``:`No players matched that username.`)}catch(e){_=[],S(),v(e?.message||`Search failed.`,!0)}}function T(){a(f.querySelector(`#social-help-btn`),f.querySelector(`#social-help-desc`));let e=f.querySelector(`#social-search-input`);e?.addEventListener(`input`,()=>{clearTimeout(g),g=setTimeout(()=>void w(e.value),320)}),e?.addEventListener(`keydown`,t=>{t.key===`Enter`&&(t.preventDefault(),clearTimeout(g),w(e.value))}),f.querySelector(`#social-search-btn`)?.addEventListener(`click`,()=>{w(e?.value||``)})}function E(){f.innerHTML=`
      <section class="panel game-panel social-panel">
        <header class="panel-head panel-head--compact">
          <div class="panel-head-title-row">
            <h2 class="panel-head__title">Social</h2>
            <button type="button" id="social-help-btn" class="panel-help-btn" aria-label="How Social works" aria-expanded="false" aria-controls="social-help-desc">?</button>
          </div>
          <p id="social-help-desc" class="panel-head__desc" hidden>Search players by username, add them as friends, and view their public profiles.</p>
        </header>
        ${i()?``:`<p class="social-sign-in-nudge">${l(o)}</p>`}
        <div class="social-search">
          <label class="social-search__label" for="social-search-input">Find players</label>
          <div class="social-search__row">
            <input type="search" id="social-search-input" class="input-text social-search__input" placeholder="Username…" aria-label="Search by username" autocomplete="off" />
            <button type="button" id="social-search-btn" class="btn-secondary social-search__btn">Search</button>
          </div>
        </div>
        <p id="social-status" class="pvp-status social-status" role="status"></p>
        <h3 class="social-section-title">Search results</h3>
        <ul id="social-search-results" class="social-player-list" aria-live="polite"></ul>
        <h3 class="social-section-title">Friends</h3>
        <ul id="social-friends-list" class="social-player-list" aria-live="polite"></ul>
      </section>`,T(),_=[],S(),C()}return{render:E}}export{f as initSocialUI};