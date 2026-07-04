import{_ as e,a as t,f as n,h as r,i,l as a,m as o,n as s,r as c,s as l}from"./auth-DMlgfqMe.js";import{B as u,W as d,g as f,h as p,p as m}from"./index-zz9huiGM.js";var h=`https://sites.google.com/view/arcane-checkers/home`;function g(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function _(){let e=p();return`
    <div class="settings-panel">
      <section class="settings-group" aria-labelledby="settings-audio-heading">
        <h4 id="settings-audio-heading" class="settings-group__title">Audio</h4>
        <label class="settings-toggle">
          <span class="settings-toggle__label">Music</span>
          <input type="checkbox" id="settings-music" ${e.musicEnabled?`checked`:``} />
          <span class="settings-toggle__track" aria-hidden="true"></span>
        </label>
        <label class="settings-range">
          <span class="settings-range__label">Music volume</span>
          <input type="range" id="settings-music-volume" min="0" max="100" value="${Math.round(e.musicVolume*100)}" />
        </label>
        <label class="settings-toggle">
          <span class="settings-toggle__label">Sound effects</span>
          <input type="checkbox" id="settings-sfx" ${e.sfxEnabled?`checked`:``} />
          <span class="settings-toggle__track" aria-hidden="true"></span>
        </label>
        <label class="settings-range">
          <span class="settings-range__label">SFX volume</span>
          <input type="range" id="settings-sfx-volume" min="0" max="100" value="${Math.round(e.sfxVolume*100)}" />
        </label>
      </section>
      <section class="settings-group" aria-labelledby="settings-haptics-heading">
        <h4 id="settings-haptics-heading" class="settings-group__title">Haptics</h4>
        <label class="settings-toggle">
          <span class="settings-toggle__label">Vibration (mobile app)</span>
          <input type="checkbox" id="settings-haptics" ${e.hapticsEnabled?`checked`:``} />
          <span class="settings-toggle__track" aria-hidden="true"></span>
        </label>
        <p class="settings-hint muted">Haptics work in the native app only.</p>
      </section>
      <p class="settings-credits muted">Music &amp; SFX: royalty-free placeholders. See <code>assets/audio/LICENSES.md</code>.</p>
    </div>`}function v(){return`
    <section class="settings-group" aria-labelledby="settings-legal-heading">
      <h4 id="settings-legal-heading" class="settings-group__title">Legal</h4>
      <p class="settings-legal">
        <a
          class="settings-legal__link"
          href="${h}"
          target="_blank"
          rel="noopener noreferrer"
        >Privacy policy</a>
      </p>
    </section>`}function y({signedIn:e,username:t,email:n}){return e?`
    <div class="profile-account">
      <p class="profile-account__email muted">${g(n)}</p>
      <div class="profile-username-summary">
        <span class="label-sm">Username</span>
        <p id="settings-username-display" class="profile-username-display">${g(t)||`—`}</p>
        <button type="button" class="btn-text profile-username-change" id="settings-username-change">Change username</button>
      </div>
      <div id="settings-username-editor" class="profile-username-editor hidden" hidden>
        <label class="label-sm" for="settings-username">New username</label>
        <div class="profile-username-row">
          <input
            type="text"
            id="settings-username"
            class="input-text"
            autocomplete="username"
            minlength="3"
            maxlength="24"
            pattern="[A-Za-z0-9_]{3,24}"
            value="${g(t)}"
            placeholder="Your in-game name"
          />
          <button type="button" class="btn-primary" id="settings-username-save">Save</button>
        </div>
        <button type="button" class="btn-text profile-username-cancel" id="settings-username-cancel">Cancel</button>
        <p id="settings-username-hint" class="auth-username-hint" aria-live="polite"></p>
        <p id="settings-username-status" class="profile-username-status" role="status"></p>
      </div>
      <button type="button" class="btn-text profile-sign-out" id="settings-sign-out">Sign out</button>
      <div class="profile-delete-account">
        <button type="button" class="btn-text profile-delete-account__btn" id="settings-delete-account">Delete account</button>
        <p class="profile-delete-account__hint muted">Permanently removes your account, cloud save, and username. This cannot be undone.</p>
        <p id="settings-delete-account-status" class="profile-delete-account__status" role="status"></p>
      </div>
    </div>`:`
      <div class="profile-account profile-account--guest">
        <p class="muted">Playing as guest — ${u}.</p>
      </div>`}function b(e){let t=e.querySelector(`#settings-music`),n=e.querySelector(`#settings-music-volume`),r=e.querySelector(`#settings-sfx`),i=e.querySelector(`#settings-sfx-volume`),a=e.querySelector(`#settings-haptics`),o=e=>{f(e),m()};t?.addEventListener(`change`,()=>o({musicEnabled:t.checked})),n?.addEventListener(`input`,()=>o({musicVolume:Number(n.value)/100})),r?.addEventListener(`change`,()=>o({sfxEnabled:r.checked})),i?.addEventListener(`input`,()=>o({sfxVolume:Number(i.value)/100})),a?.addEventListener(`change`,()=>o({hapticsEnabled:a.checked}))}function x(u,{onUsernameChanged:f}={}){if(!u)return;let p=t(),m=l()&&!!p;u.innerHTML=`
    <section class="panel game-panel settings-page-panel">
      <header class="panel-head panel-head--compact">
        <h2 class="panel-head__title">Settings</h2>
        <p class="panel-head__desc">Audio, haptics, and account preferences.</p>
      </header>
      ${_()}
      ${v()}
      <section class="settings-group settings-account-section" aria-labelledby="settings-account-heading">
        <h4 id="settings-account-heading" class="settings-group__title">Account</h4>
        ${y({signedIn:m,username:``,email:p?.email||``})}
      </section>
    </section>
  `,b(u),u.querySelector(`#settings-sign-out`)?.addEventListener(`click`,()=>{n()});let h=u.querySelector(`#settings-delete-account`),g=u.querySelector(`#settings-delete-account-status`);if(h?.addEventListener(`click`,async()=>{if(await d(`This permanently deletes your account, cloud save, decks, and username. You will need a new account to play again.`,{title:`Delete account?`,confirmLabel:`Delete account`,cancelLabel:`Keep account`,destructive:!0})){g.textContent=``,g.classList.remove(`profile-delete-account__status--error`),h.disabled=!0;try{await c()}catch(e){g.textContent=e.message||`Could not delete account`,g.classList.add(`profile-delete-account__status--error`),h.disabled=!1}}}),!m)return;let x=u.querySelector(`#settings-username-display`),S=u.querySelector(`#settings-username-editor`),C=u.querySelector(`#settings-username-change`),w=u.querySelector(`#settings-username-cancel`),T=u.querySelector(`#settings-username`),E=u.querySelector(`#settings-username-hint`),D=u.querySelector(`#settings-username-status`),O=u.querySelector(`#settings-username-save`),k=null,A=``,j=null,M=e=>{x&&(x.textContent=e||`—`)},N=(e,t=``)=>{E&&(E.textContent=e||``,E.classList.remove(`auth-username-hint--ok`,`auth-username-hint--bad`),t===`ok`&&E.classList.add(`auth-username-hint--ok`),t===`bad`&&E.classList.add(`auth-username-hint--bad`))},P=(e,t=!1)=>{D&&(D.textContent=e||``,D.classList.toggle(`profile-username-status--error`,t))},F=()=>{clearTimeout(k),k=setTimeout(async()=>{let t=T?.value?.trim()||``;if(!t){N(``);return}let n=e(t);if(n){N(n,`bad`);return}if(t.toLowerCase()===A.toLowerCase()){N(`Current username`,`ok`);return}N(`Checking…`);try{if(!await a(t,p.id)){let e=await o(t);N(e?`Taken — try "${e}"`:`That username is taken`,`bad`),e&&E&&(E.dataset.suggestion=e);return}E&&delete E.dataset.suggestion,N(`Available`,`ok`)}catch{N(``)}},350)},I=e=>{S?.classList.toggle(`hidden`,!e),S&&(S.hidden=!e),C?.classList.toggle(`hidden`,e),e?(T&&(T.value=A,T.focus(),T.select()),P(``),F()):T&&(T.value=A,N(``),P(``))};E?.addEventListener(`click`,()=>{let e=E?.dataset?.suggestion;!e||!T||(T.value=e,delete E.dataset.suggestion,F())}),T?.addEventListener(`input`,F),C?.addEventListener(`click`,()=>I(!0)),w?.addEventListener(`click`,()=>I(!1)),(async()=>{try{j=await i(p.id),A=j?.username||p.user_metadata?.display_name||``,M(A),f?.(A),T&&A&&(T.value=A);let e=s(j);e.ok||N(e.message,`bad`)}catch(e){console.warn(`Could not load profile username`,e)}})(),O?.addEventListener(`click`,async()=>{let e=T?.value?.trim()||``;P(``),O.disabled=!0;try{let t=s(j);if(!t.ok)throw Error(t.message);let n=await r(e);j=await i(p.id),A=n,M(A),I(!1),f?.(n)}catch(e){P(e.message||`Could not save username`,!0)}finally{O.disabled=!1}})}export{h as PRIVACY_POLICY_URL,b as bindSettingsPanel,x as renderSettingsTab,_ as settingsSectionHtml};