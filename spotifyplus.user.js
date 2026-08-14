// ==UserScript==
// @name         SpotifyPlus Mobile Skin
// @namespace    https://github.com/sstevestanislavski/SpotifyPlus
// @version      0.2.0
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
    --sp-touch: 54px;
    --sp-row: 64px;
    --sp-radius: 12px;
  }

  html.${ROOT_CLASS}, html.${ROOT_CLASS} body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }

  html.${ROOT_CLASS} body {
    overscroll-behavior: none;
    -webkit-tap-highlight-color: transparent;
  }

  /* V0.2: turn Spotify's desktop 3-column shell into a phone-friendly 2-column shell. */
  html.${ROOT_CLASS} .Root__top-container {
    grid-template-columns: 64px minmax(0, 1fr) 0px !important;
    column-gap: 6px !important;
  }

  /* Hide the right-side artist/queue panel completely. */
  html.${ROOT_CLASS} .Root__right-sidebar,
  html.${ROOT_CLASS} [data-testid="right-sidebar"],
  html.${ROOT_CLASS} aside[aria-label*="Now playing" i],
  html.${ROOT_CLASS} aside[aria-label*="Queue" i] {
    display: none !important;
    width: 0 !important;
    min-width: 0 !important;
  }

  /* Keep only a narrow icon rail on the left. */
  html.${ROOT_CLASS} .Root__nav-bar,
  html.${ROOT_CLASS} [data-testid="left-sidebar"] {
    width: 64px !important;
    min-width: 64px !important;
    max-width: 64px !important;
    overflow: hidden !important;
  }

  /* Main view gets almost the whole screen. */
  html.${ROOT_CLASS} .Root__main-view,
  html.${ROOT_CLASS} [data-testid="main-view"] {
    width: auto !important;
    min-width: 0 !important;
    max-width: none !important;
  }

  /* Remove desktop side padding that wastes precious phone width. */
  html.${ROOT_CLASS} main [data-testid="playlist-page"],
  html.${ROOT_CLASS} main [data-testid="artist-page"],
  html.${ROOT_CLASS} main [data-testid="album-page"],
  html.${ROOT_CLASS} .contentSpacing {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  /* Track list: bigger rows/text/tap areas. */
  html.${ROOT_CLASS} [data-testid="tracklist-row"] {
    min-height: var(--sp-row) !important;
    border-radius: var(--sp-radius) !important;
    font-size: 16px !important;
  }

  html.${ROOT_CLASS} [data-testid="tracklist-row"] a,
  html.${ROOT_CLASS} [data-testid="tracklist-row"] button {
    min-height: 46px !important;
  }

  /* Make headings and common metadata readable without pinch-zooming. */
  html.${ROOT_CLASS} main h1 { font-size: clamp(34px, 6vw, 58px) !important; }
  html.${ROOT_CLASS} main h2 { font-size: 24px !important; }
  html.${ROOT_CLASS} main p,
  html.${ROOT_CLASS} main span,
  html.${ROOT_CLASS} main a { line-height: 1.35; }

  /* Search and top navigation. */
  html.${ROOT_CLASS} [data-testid="search-input"] {
    min-height: 52px !important;
    font-size: 18px !important;
    border-radius: 14px !important;
  }

  html.${ROOT_CLASS} button,
  html.${ROOT_CLASS} [role="button"] {
    touch-action: manipulation;
  }

  /* Bottom player becomes a large phone control zone. */
  html.${ROOT_CLASS} [data-testid="now-playing-bar"],
  html.${ROOT_CLASS} .Root__now-playing-bar,
  html.${ROOT_CLASS} footer {
    min-height: 112px !important;
  }

  html.${ROOT_CLASS} [data-testid="control-button-playpause"] {
    width: 64px !important;
    height: 64px !important;
    min-width: 64px !important;
    min-height: 64px !important;
  }

  html.${ROOT_CLASS} [data-testid="control-button-skip-back"],
  html.${ROOT_CLASS} [data-testid="control-button-skip-forward"],
  html.${ROOT_CLASS} button[aria-label*="Next" i],
  html.${ROOT_CLASS} button[aria-label*="Previous" i] {
    width: 50px !important;
    height: 50px !important;
    min-width: 50px !important;
    min-height: 50px !important;
  }

  html.${ROOT_CLASS} [data-testid="now-playing-widget"] {
    min-width: 180px !important;
  }

  /* SpotifyPlus toggle */
  #spotifyplus-toggle {
    position: fixed;
    right: 12px;
    top: 78px;
    z-index: 2147483647;
    width: 50px;
    height: 50px;
    border: 0;
    border-radius: 25px;
    background: #1ed760;
    color: #07130b;
    font: 800 13px/1 system-ui, sans-serif;
    box-shadow: 0 5px 18px rgba(0,0,0,.42);
    opacity: .94;
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

  const observer = new MutationObserver(() => ensureToggle());
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
