import{c as e}from"./board-4Nr0VGxe.js";var t=`<svg class="turn-clock__svg" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6.25" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.5V8l2.25 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;function n(n=`Opponent`,r={}){let i=String(n).replace(/</g,``),a=r.exitLabel||`← Leave match`,o=!!r.spectator,s=o?String(r.localName||`Red`).replace(/</g,``):`You`,c=o?` match-wrap--spectator`:``,l=o?`<p class="hand-hidden-note">Hands hidden in spectate mode</p>`:``;return`
    <div class="match-wrap match-scene${c}">
      <button type="button" id="btn-leave-match" class="btn-text">${a}</button>
      ${o?`<p class="spectate-banner" role="status">Spectating — use move history below to review plays</p>`:``}
      <div class="game-layout">
        <aside class="panel panel-opponent">
          <div class="player-badge opponent">
            <div class="player-badge__identity">
              <span class="piece-icon black"></span>
              <span class="player-badge__name">${i}</span>
            </div>
            <div id="clock-opp" class="turn-clock" aria-label="Opponent turn timer">
              <span class="turn-clock__icon" aria-hidden="true">${t}</span>
              <span class="turn-clock__time">1:00</span>
            </div>
          </div>
          <p id="enemy-hand-count-label" class="hand-count-label">${o?`Hand hidden`:`0 cards in hand`}</p>
        </aside>
        <section class="board-section">
          <div id="turn-banner" class="turn-banner match-banner">Your turn</div>
          <div id="spell-cast-bar" class="spell-cast-bar hidden">
            <div class="spell-cast-copy">
              <p id="spell-cast-hint" class="spell-cast-hint">Select targets on the board</p>
              <p id="spell-cast-desc" class="spell-cast-desc hidden" aria-hidden="true"></p>
            </div>
            <button type="button" id="btn-cancel-card" class="btn-text">Cancel</button>
          </div>
          <div id="ai-spell-banner" class="ai-spell-banner hidden" role="status" aria-live="assertive">
            <div class="ai-spell-banner__inner">
              <span class="ai-spell-banner__icon" aria-hidden="true">✦</span>
              <div class="ai-spell-banner__copy">
                <p class="ai-spell-banner__label">Enemy spell</p>
                <p id="ai-spell-banner-title" class="ai-spell-banner__title"></p>
                <p id="ai-spell-banner-desc" class="ai-spell-banner__desc"></p>
              </div>
            </div>
          </div>
          <div class="board-wrap">${e()}</div>
          <div id="piece-info" class="piece-info hidden"></div>
        </section>
        <aside class="panel panel-player">
          <div class="player-badge you">
            <div class="player-badge__identity">
              <span class="piece-icon red"></span>
              <span class="player-badge__name">${s}</span>
            </div>
            <div id="clock-you" class="turn-clock" aria-label="Your turn timer">
              <span class="turn-clock__icon" aria-hidden="true">${t}</span>
              <span class="turn-clock__time">1:00</span>
            </div>
          </div>
          <p id="hand-count-label" class="hand-count-label">${o?`Hand hidden`:`0 cards in hand`}</p>
          <div id="hand-red" class="hand spell-hand${o?` hand--spectator-hidden`:``}"></div>
          ${l}
          <button type="button" id="btn-end-cards" class="btn-secondary btn-skip-spell hidden">Skip spell phase</button>
        </aside>
        <footer class="match-log">
          <p id="message" class="match-message" role="log" aria-live="polite"></p>
        </footer>
        <div class="match-history-footer">
          <p id="pvp-history-status" class="pvp-history-status hidden" role="status">Reviewing earlier position</p>
          <div id="pvp-move-history" class="pvp-move-history" aria-label="Move history">
            <button type="button" id="pvp-history-prev" class="pvp-move-history__arrow" aria-label="Previous move" disabled>‹</button>
            <div id="pvp-history-track" class="pvp-move-history__track" role="status"></div>
            <button type="button" id="pvp-history-next" class="pvp-move-history__arrow" aria-label="Next move" disabled>›</button>
          </div>
        </div>
      </div>
      <div id="game-over" class="game-over-overlay hidden">
        <div class="game-over-card">
          <h2 id="game-over-title">Game over</h2>
          <div id="game-over-stars" class="game-over-stars hidden" aria-hidden="true"></div>
          <p id="game-over-star-gain" class="game-over-star-gain hidden"></p>
          <p id="game-over-text"></p>
          <div id="game-over-actions" class="game-over-actions"></div>
        </div>
      </div>
    </div>
  `}export{n as getMatchHtml};