// ==UserScript==
// @name         SpotifyPlus Mobile Skin
// @namespace    https://github.com/sstevestanislavski/SpotifyPlus
// @version      0.1.0
// @description  Phone-friendly skin for Spotify Web. Changes layout only; Spotify handles playback.
// @match        https://open.spotify.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://sstevestanislavski.github.io/SpotifyPlus/spotifyplus.user.js
// @downloadURL  https://sstevestanislavski.github.io/SpotifyPlus/spotifyplus.user.js
// ==/UserScript==

(() => {
  'use strict';

  const KEY = 'spotifyplus-enabled';
  const ROOT_CLASS = 'spotifyplus-mobile';
  const STYLE_ID = 'spotifyplus-style';

  const css = `
  html.${ROOT_CLASS} {
    --sp-touch: 52px;
    --sp-row: 58px;
    --sp-radius: 12px;
  }

  html.${ROOT_CLASS} body {
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* Reliable Spotify test-id targets first; broad fallbacks second. */
  html.${ROOT_CLASS} [data-testid="tracklist-row"] {
    min-height: var(--sp-row) !important;
    border-radius: var(--sp-radius) !important;
  }

  html.${ROOT_CLASS} [data-testid="tracklist-row"] a,
  html.${ROOT_CLASS} [data-testid="tracklist-row"] button {
    min-height: 44px !important;
  }

  html.${ROOT_CLASS} [data-testid="control-button-playpause"] {
    width: 58px !important;
    height: 58px !important;
    min-width: 58px !important;
    min-height: 58px !important;
  }

  html.${ROOT_CLASS} [data-testid="control-button-skip-back"],
  html.${ROOT_CLASS} [data-testid="control-button-skip-forward"] {
    width: 48px !important;
    height: 48px !important;
    min-width: 48px !important;
    min-height: 48px !important;
  }

  html.${ROOT_CLASS} [data-testid="now-playing-widget"] {
    min-width: 220px !important;
  }

  html.${ROOT_CLASS} [data-testid="search-input"] {
    min-height: 50px !important;
    font-size: 18px !important;
    border-radius: 14px !important;
  }

  html.${ROOT_CLASS} button,
  html.${ROOT_CLASS} [role="button"] {
    touch-action: manipulation;
  }

  /* Spotify's bottom player: make the whole zone easier to hit on a phone. */
  html.${ROOT_CLASS} [data-testid="now-playing-bar"],
  html.${ROOT_CLASS} footer {
    min-height: 104px !important;
  }

  /* Larger common icon buttons without blowing up compact menu controls. */
  html.${ROOT_CLASS} button[aria-label*="Play" i],
  html.${ROOT_CLASS} button[aria-label*="Pause" i],
  html.${ROOT_CLASS} button[aria-label*="Next" i],
  html.${ROOT_CLASS} button[aria-label*="Previous" i],
  html.${ROOT_CLASS} button[aria-label*="Skip" i] {
    min-width: 48px !important;
    min-height: 48px !important;
  }

  /* Give desktop-mode Spotify a little more breathing room for touch. */
  html.${ROOT_CLASS} main a,
  html.${ROOT_CLASS} main button {
    scroll-margin: 110px;
  }

  /* SpotifyPlus toggle */
  #spotifyplus-toggle {
    position: fixed;
    right: 10px;
    top: 76px;
    z-index: 2147483647;
    width: 48px;
    height: 48px;
    border: 0;
    border-radius: 24px;
    background: #1ed760;
    color: #07130b;
    font: 800 13px/1 system-ui, sans-serif;
    box-shadow: 0 5px 18px rgba(0,0,0,.42);
    opacity: .92;
  }

  #spotifyplus-toggle[data-off="true"] {
    background: #404040;
    color: white;
  }
  `;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  function enabled() {
    return localStorage.getItem(KEY) !== '0';
  }

  function apply(on) {
    document.documentElement.classList.toggle(ROOT_CLASS, on);
    localStorage.setItem(KEY, on ? '1' : '0');
    const btn = document.getElementById('spotifyplus-toggle');
    if (btn) {
      btn.dataset.off = on ? 'false' : 'true';
      btn.textContent = on ? 'SP+' : 'SP';
      btn.title = on ? 'SpotifyPlus is ON' : 'SpotifyPlus is OFF';
    }
  }

  function ensureToggle() {
    if (!document.body || document.getElementById('spotifyplus-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'spotifyplus-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle SpotifyPlus mobile skin');
    btn.addEventListener('click', () => apply(!document.documentElement.classList.contains(ROOT_CLASS)));
    document.body.appendChild(btn);
    apply(enabled());
  }

  ensureStyle();
  apply(enabled());
  ensureToggle();

  // Spotify is a single-page app and rebuilds parts of the DOM frequently.
  const observer = new MutationObserver(() => ensureToggle());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
