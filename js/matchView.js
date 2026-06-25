import { boardFrameHtml } from "./board.js";

export function getMatchHtml(opponentName = "Opponent", options = {}) {
  const safe = String(opponentName).replace(/</g, "");
  const exitLabel = options.exitLabel || "← Leave match";
  return `
    <div class="match-wrap match-scene">
      <button type="button" id="btn-leave-match" class="btn-text">${exitLabel}</button>
      <div class="game-layout">
        <aside class="panel panel-opponent">
          <div class="player-badge opponent"><span class="piece-icon black"></span> ${safe}</div>
          <p id="enemy-hand-count-label" class="hand-count-label">0 cards in hand</p>
        </aside>
        <section class="board-section">
          <div id="turn-banner" class="turn-banner match-banner">Your turn</div>
          <div id="spell-cast-bar" class="spell-cast-bar hidden">
            <div class="spell-cast-copy">
              <p id="spell-cast-hint" class="spell-cast-hint">Select targets on the board</p>
              <button type="button" id="btn-cancel-card" class="btn-text">Cancel spell</button>
            </div>
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
          ${boardFrameHtml()}
          <div id="pvp-move-history" class="pvp-move-history" aria-label="Move history">
            <button type="button" id="pvp-history-prev" class="pvp-move-history__arrow" aria-label="Previous move" disabled>‹</button>
            <div id="pvp-history-track" class="pvp-move-history__track" role="list"></div>
            <button type="button" id="pvp-history-next" class="pvp-move-history__arrow" aria-label="Next move" disabled>›</button>
          </div>
          <p id="pvp-history-status" class="pvp-history-status hidden" role="status">Reviewing earlier position</p>
          <div id="piece-info" class="piece-info hidden"></div>
        </section>
        <aside class="panel panel-player">
          <div class="player-badge you"><span class="piece-icon red"></span> You</div>
          <p id="hand-count-label" class="hand-count-label">0 cards in hand</p>
          <div id="hand-red" class="hand spell-hand"></div>
          <button type="button" id="btn-end-cards" class="btn-secondary">End spell phase</button>
        </aside>
        <footer class="match-log">
          <p id="message" class="match-message" role="log" aria-live="polite"></p>
        </footer>
      </div>
      <div id="game-over" class="game-over-overlay hidden">
        <div class="game-over-card">
          <h2 id="game-over-title">Game over</h2>
          <div id="game-over-stars" class="game-over-stars hidden" aria-hidden="true"></div>
          <p id="game-over-star-gain" class="game-over-star-gain hidden"></p>
          <p id="game-over-text"></p>
          <button id="btn-restart-match" type="button" class="btn-primary">Back</button>
        </div>
      </div>
    </div>
  `;
}
