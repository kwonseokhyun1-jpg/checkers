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
          <div class="hand-label">Enemy hand</div>
          <div id="hand-black" class="hand hand-hidden"></div>
        </aside>
        <section class="board-section">
          <div id="turn-banner" class="turn-banner match-banner">Your turn</div>
          <div id="spell-cast-bar" class="spell-cast-bar hidden">
            <div id="spell-cast-preview" class="spell-cast-preview"></div>
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
          <p id="message" class="match-message"></p>
          <div id="piece-info" class="piece-info hidden"></div>
        </section>
        <aside class="panel panel-player">
          <div class="player-badge you"><span class="piece-icon red"></span> You</div>
          <div class="hand-label">Your hand <span id="deck-pile-count" class="deck-pile-count"></span></div>
          <div id="hand-red" class="hand spell-hand"></div>
          <button type="button" id="btn-end-cards" class="btn-secondary">End spell phase</button>
        </aside>
      </div>
      <div id="game-over" class="game-over-overlay hidden">
        <div class="game-over-card">
          <h2 id="game-over-title">Game over</h2>
          <div id="game-over-stars" class="game-over-stars hidden" aria-hidden="true"></div>
          <p id="game-over-text"></p>
          <button id="btn-restart-match" type="button" class="btn-primary">Back</button>
        </div>
      </div>
    </div>
  `;
}
