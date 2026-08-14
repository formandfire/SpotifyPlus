// ==UserScript==
// @name         SpotifyPlus Mobile Skin
// @namespace    https://github.com/sstevestanislavski/SpotifyPlus
// @version      0.5.0
// @description  Phone-friendly skin for Spotify Web. Layout only; Spotify handles playback.
// @match        https://open.spotify.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://sstevestanislavski.github.io/SpotifyPlus/spotifyplus.user.js
// @downloadURL  https://sstevestanislavski.github.io/SpotifyPlus/spotifyplus.user.js
// ==/UserScript==

(() => {
'use strict';
const VERSION='0.5', ROOT='spotifyplus-mobile', STYLE='spotifyplus-style', BADGE='spotifyplus-status';
const css=`
html.${ROOT}{--sp-row:62px;--sp-radius:12px}
html.${ROOT},html.${ROOT} body{overflow-x:hidden!important;max-width:100vw!important}
html.${ROOT} body{overscroll-behavior:none;-webkit-tap-highlight-color:transparent}
html.${ROOT} .Root__top-container{grid-template-columns:0 minmax(0,1fr) 0!important;column-gap:0!important}
html.${ROOT} .Root__right-sidebar,html.${ROOT} [data-testid="right-sidebar"],html.${ROOT} aside[aria-label*="Now playing" i],html.${ROOT} aside[aria-label*="Queue" i]{display:none!important;width:0!important;min-width:0!important}
html.${ROOT} .Root__nav-bar,html.${ROOT} [data-testid="left-sidebar"]{display:none!important;width:0!important;min-width:0!important}
html.${ROOT} .Root__main-view,html.${ROOT} [data-testid="main-view"]{width:100%!important;min-width:0!important;max-width:none!important}
html.${ROOT} .contentSpacing{padding-left:16px!important;padding-right:16px!important}
html.${ROOT} main{padding-bottom:170px!important}
html.${ROOT} main section{margin-bottom:14px!important}
html.${ROOT} main h1{font-size:clamp(32px,8vw,48px)!important;line-height:1.05!important;margin-bottom:14px!important}
html.${ROOT} main h2{font-size:22px!important;line-height:1.15!important;margin-top:20px!important;margin-bottom:12px!important}
html.${ROOT} main p,html.${ROOT} main span,html.${ROOT} main a{line-height:1.32}
html.${ROOT} [data-testid="home-page"] header,html.${ROOT} [data-testid="home-page"] [data-testid="topbar-content"]{min-height:0!important;padding-bottom:8px!important}
html.${ROOT} [data-testid="home-page"] .contentSpacing:first-child{padding-top:12px!important}
html.${ROOT} [data-testid="tracklist-row"]{min-height:var(--sp-row)!important;border-radius:var(--sp-radius)!important;font-size:16px!important}
html.${ROOT} [data-testid="tracklist-row"] a,html.${ROOT} [data-testid="tracklist-row"] button{min-height:46px!important}
html.${ROOT} [data-testid="search-input"]{min-height:52px!important;font-size:18px!important;border-radius:14px!important}
html.${ROOT} button,html.${ROOT} [role="button"]{touch-action:manipulation}
html.${ROOT} a[href*="/premium" i],html.${ROOT} button[aria-label*="premium" i]{opacity:.48!important}
html.${ROOT} [data-testid*="premium" i]{opacity:.55!important;max-height:150px!important;overflow:auto!important}
html.${ROOT} [data-testid="now-playing-bar"],html.${ROOT} .Root__now-playing-bar{min-height:104px!important;margin:0 10px 10px!important;border-radius:14px!important;overflow:hidden!important}
html.${ROOT} footer{min-height:112px!important}
html.${ROOT} [data-testid="control-button-playpause"]{width:64px!important;height:64px!important;min-width:64px!important;min-height:64px!important}
html.${ROOT} [data-testid="control-button-skip-back"],html.${ROOT} [data-testid="control-button-skip-forward"],html.${ROOT} button[aria-label*="Next" i],html.${ROOT} button[aria-label*="Previous" i]{width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important}
html.${ROOT} [data-testid="now-playing-widget"]{min-width:180px!important}
#${BADGE}{position:fixed;right:12px;top:76px;z-index:2147483647;background:#1ed760;color:#07130b;border:0;border-radius:18px;padding:8px 11px;font:800 12px/1 system-ui,sans-serif;box-shadow:0 3px 12px rgba(0,0,0,.35);pointer-events:none;opacity:.92;white-space:nowrap}
`;
function install(){
 document.documentElement.classList.add(ROOT);
 let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.documentElement.appendChild(s)}s.textContent=css;
 if(document.body&&!document.getElementById(BADGE)){const b=document.createElement('div');b.id=BADGE;b.textContent=`SP+ v${VERSION}`;b.title='SpotifyPlus mobile skin is running';document.body.appendChild(b)}
}
install();
new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();
