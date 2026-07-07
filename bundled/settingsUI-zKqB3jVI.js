import{a as e,c as t,g as n,h as r,i,n as a,o,p as s,r as c,u as l,v as u,y as d}from"./auth-BdIidoag.js";import{B as f,W as p,g as m,h,p as g}from"./index-b5rlHXyL.js";var _=`https://sites.google.com/view/arcane-checkers/home`;function v(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function y(){let e=h();return`
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
    </div>`}function b(){return`
    <section class="settings-group" aria-labelledby="settings-legal-heading">
      <h4 id="settings-legal-heading" class="settings-group__title">Legal</h4>
      <p class="settings-legal">
        <a
          class="settings-legal__link"
          href="${_}"
          target="_blank"
          rel="noopener noreferrer"
        >Privacy policy</a>
      </p>
    </section>`}function x({signedIn:e,username:t,email:n}){return e?`
    <div class="profile-account">
      <p class="profile-account__email muted">${v(n)}</p>
      <div class="profile-username-summary">
        <span class="label-sm">Username</span>
        <p id="settings-username-display" class="profile-username-display">${v(t)||`—`}</p>
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
            value="${v(t)}"
            placeholder="Your in-game name"
          />
          <button type="button" class="btn-primary" id="settings-username-save">Save</button>
        </div>
        <button type="button" class="btn-text profile-username-cancel" id="settings-username-cancel">Cancel</button>
        <p id="settings-username-hint" class="auth-username-hint" aria-live="polite"></p>
        <p id="settings-username-status" class="profile-username-status" role="status"></p>
      </div>
      <div class="profile-password-summary">
        <span class="label-sm">Password</span>
        <button type="button" class="btn-text profile-password-change" id="settings-password-change">Change password</button>
        <p id="settings-password-feedback" class="profile-username-status" role="status"></p>
      </div>
      <div id="settings-password-editor" class="profile-password-editor hidden" hidden>
        <label class="label-sm" for="settings-password-current">Current password</label>
        <input
          type="password"
          id="settings-password-current"
          class="input-text"
          autocomplete="current-password"
          minlength="6"
        />
        <label class="label-sm" for="settings-password-new">New password</label>
        <input
          type="password"
          id="settings-password-new"
          class="input-text"
          autocomplete="new-password"
          minlength="6"
        />
        <label class="label-sm" for="settings-password-confirm">Confirm new password</label>
        <input
          type="password"
          id="settings-password-confirm"
          class="input-text"
          autocomplete="new-password"
          minlength="6"
        />
        <div class="profile-password-actions">
          <button type="button" class="btn-primary" id="settings-password-save">Update password</button>
          <button type="button" class="btn-text profile-password-cancel" id="settings-password-cancel">Cancel</button>
        </div>
        <p id="settings-password-status" class="profile-username-status" role="status"></p>
      </div>
      <button type="button" class="btn-text profile-sign-out" id="settings-sign-out">Sign out</button>
      <div class="profile-delete-account">
        <button type="button" class="btn-text profile-delete-account__btn" id="settings-delete-account">Delete account</button>
        <p class="profile-delete-account__hint muted">Permanently removes your account, cloud save, and username. This cannot be undone.</p>
        <p id="settings-delete-account-status" class="profile-delete-account__status" role="status"></p>
      </div>
    </div>`:`
      <div class="profile-account profile-account--guest">
        <p class="muted">Playing as guest — ${f}.</p>
      </div>`}function S(e){let t=e.querySelector(`#settings-music`),n=e.querySelector(`#settings-music-volume`),r=e.querySelector(`#settings-sfx`),i=e.querySelector(`#settings-sfx-volume`),a=e.querySelector(`#settings-haptics`),o=e=>{m(e),g()};t?.addEventListener(`change`,()=>o({musicEnabled:t.checked})),n?.addEventListener(`input`,()=>o({musicVolume:Number(n.value)/100})),r?.addEventListener(`change`,()=>o({sfxEnabled:r.checked})),i?.addEventListener(`input`,()=>o({sfxVolume:Number(i.value)/100})),a?.addEventListener(`change`,()=>o({hapticsEnabled:a.checked}))}function C(f,{onUsernameChanged:m}={}){if(!f)return;let h=o(),g=t()&&!!h;f.innerHTML=`
    <section class="panel game-panel settings-page-panel">
      <header class="panel-head panel-head--compact">
        <h2 class="panel-head__title">Settings</h2>
        <p class="panel-head__desc">Audio, haptics, and account preferences.</p>
      </header>
      ${y()}
      ${b()}
      <section class="settings-group settings-account-section" aria-labelledby="settings-account-heading">
        <h4 id="settings-account-heading" class="settings-group__title">Account</h4>
        ${x({signedIn:g,username:``,email:h?.email||``})}
      </section>
    </section>
  `,S(f),f.querySelector(`#settings-sign-out`)?.addEventListener(`click`,()=>{s()});let _=f.querySelector(`#settings-delete-account`),v=f.querySelector(`#settings-delete-account-status`);if(_?.addEventListener(`click`,async()=>{if(await p(`This permanently deletes your account, cloud save, decks, and username. You will need a new account to play again.`,{title:`Delete account?`,confirmLabel:`Delete account`,cancelLabel:`Keep account`,destructive:!0})){v.textContent=``,v.classList.remove(`profile-delete-account__status--error`),_.disabled=!0;try{await i()}catch(e){v.textContent=e.message||`Could not delete account`,v.classList.add(`profile-delete-account__status--error`),_.disabled=!1}}}),!g)return;let C=f.querySelector(`#settings-username-display`),w=f.querySelector(`#settings-username-editor`),T=f.querySelector(`#settings-username-change`),E=f.querySelector(`#settings-username-cancel`),D=f.querySelector(`#settings-username`),O=f.querySelector(`#settings-username-hint`),k=f.querySelector(`#settings-username-status`),A=f.querySelector(`#settings-username-save`),j=null,M=``,N=null,P=e=>{C&&(C.textContent=e||`—`)},F=(e,t=``)=>{O&&(O.textContent=e||``,O.classList.remove(`auth-username-hint--ok`,`auth-username-hint--bad`),t===`ok`&&O.classList.add(`auth-username-hint--ok`),t===`bad`&&O.classList.add(`auth-username-hint--bad`))},I=(e,t=!1)=>{k&&(k.textContent=e||``,k.classList.toggle(`profile-username-status--error`,t))},L=()=>{clearTimeout(j),j=setTimeout(async()=>{let e=D?.value?.trim()||``;if(!e){F(``);return}let t=d(e);if(t){F(t,`bad`);return}if(e.toLowerCase()===M.toLowerCase()){F(`Current username`,`ok`);return}F(`Checking…`);try{if(!await l(e,h.id)){let t=await r(e);F(t?`Taken — try "${t}"`:`That username is taken`,`bad`),t&&O&&(O.dataset.suggestion=t);return}O&&delete O.dataset.suggestion,F(`Available`,`ok`)}catch{F(``)}},350)},R=e=>{w?.classList.toggle(`hidden`,!e),w&&(w.hidden=!e),T?.classList.toggle(`hidden`,e),e?(D&&(D.value=M,D.focus(),D.select()),I(``),L()):D&&(D.value=M,F(``),I(``))};O?.addEventListener(`click`,()=>{let e=O?.dataset?.suggestion;!e||!D||(D.value=e,delete O.dataset.suggestion,L())}),D?.addEventListener(`input`,L),T?.addEventListener(`click`,()=>R(!0)),E?.addEventListener(`click`,()=>R(!1)),(async()=>{try{N=await e(h.id),M=N?.username||h.user_metadata?.display_name||``,P(M),m?.(M),D&&M&&(D.value=M);let t=a(N);t.ok||F(t.message,`bad`)}catch(e){console.warn(`Could not load profile username`,e)}})(),A?.addEventListener(`click`,async()=>{let t=D?.value?.trim()||``;I(``),A.disabled=!0;try{let r=a(N);if(!r.ok)throw Error(r.message);let i=await n(t);N=await e(h.id),M=i,P(M),R(!1),m?.(i)}catch(e){I(e.message||`Could not save username`,!0)}finally{A.disabled=!1}});let z=f.querySelector(`#settings-password-editor`),B=f.querySelector(`#settings-password-change`),V=f.querySelector(`#settings-password-cancel`),H=f.querySelector(`#settings-password-current`),U=f.querySelector(`#settings-password-new`),W=f.querySelector(`#settings-password-confirm`),G=f.querySelector(`#settings-password-save`),K=f.querySelector(`#settings-password-status`),q=f.querySelector(`#settings-password-feedback`),J=(e,t=!1)=>{K&&(K.textContent=e||``,K.classList.toggle(`profile-username-status--error`,t))},Y=(e,t=!1)=>{q&&(q.textContent=e||``,q.classList.toggle(`profile-username-status--error`,t))},X=()=>{H&&(H.value=``),U&&(U.value=``),W&&(W.value=``)},Z=e=>{z?.classList.toggle(`hidden`,!e),z&&(z.hidden=!e),B?.classList.toggle(`hidden`,e),e?(X(),J(``),H?.focus()):(X(),J(``))};B?.addEventListener(`click`,()=>{Y(``),Z(!0)}),V?.addEventListener(`click`,()=>Z(!1)),G?.addEventListener(`click`,async()=>{let e=H?.value||``,t=U?.value||``,n=W?.value||``;J(``),Y(``);let r=u(t);if(r){J(r,!0);return}if(t!==n){J(`New passwords do not match.`,!0);return}G.disabled=!0;try{await c(e,t),Z(!1),Y(`Password updated.`)}catch(e){J(e.message||`Could not update password`,!0)}finally{G.disabled=!1}})}export{_ as PRIVACY_POLICY_URL,S as bindSettingsPanel,C as renderSettingsTab,y as settingsSectionHtml};