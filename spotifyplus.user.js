// ==UserScript==
// @name         SpotifyPlus Mobile Skin
// @namespace    https://github.com/sstevestanislavski/SpotifyPlus
// @version      0.8.0
// @description  Phone-friendly skin for Spotify Web with a local SP+ Library.
// @match        https://open.spotify.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://sstevestanislavski.github.io/SpotifyPlus/spotifyplus.user.js
// @downloadURL  https://sstevestanislavski.github.io/SpotifyPlus/spotifyplus.user.js
// ==/UserScript==
(() => {
'use strict';
const VERSION='0.8',ROOT='spotifyplus-mobile',STYLE='spotifyplus-style',BADGE='spotifyplus-status';
const LIBKEY='spotifyplus-library-v1',OVERLAY='spotifyplus-library';
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
html.${ROOT} [data-testid="tracklist-row"]{min-height:var(--sp-row)!important;border-radius:var(--sp-radius)!important;font-size:16px!important}
html.${ROOT} [data-testid="tracklist-row"] a,html.${ROOT} [data-testid="tracklist-row"] button{min-height:46px!important}
html.${ROOT} [data-testid="search-input"]{min-height:52px!important;font-size:18px!important;border-radius:14px!important}
html.${ROOT} button,html.${ROOT} [role="button"]{touch-action:manipulation}
html.${ROOT} a[href*="/premium" i],html.${ROOT} button[aria-label*="premium" i]{opacity:.48!important}
html.${ROOT} [data-testid*="premium" i]{opacity:.55!important;max-height:150px!important;overflow:auto!important}
html.${ROOT} [data-testid="now-playing-bar"],html.${ROOT} .Root__now-playing-bar{min-height:104px!important;margin:0 10px 10px!important;border-radius:14px!important;overflow:hidden!important}
html.${ROOT} footer{min-height:112px!important}
html.${ROOT} [data-testid="control-button-playpause"]{width:64px!important;height:64px!important;min-width:64px!important;min-height:64px!important}
#${BADGE}{position:fixed;right:12px;top:76px;z-index:2147483647;background:#1ed760;color:#07130b;border-radius:18px;padding:8px 11px;font:800 12px/1 system-ui,sans-serif;box-shadow:0 3px 12px rgba(0,0,0,.35);pointer-events:none;opacity:.92;white-space:nowrap}
#${OVERLAY}{position:fixed;inset:0;z-index:2147483600;background:#101010;color:#fff;font-family:system-ui,-apple-system,Segoe UI,sans-serif;display:none;overflow:auto;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}
#${OVERLAY}.open{display:block}
#${OVERLAY} .splib-wrap{max-width:720px;margin:0 auto;padding:18px 16px 150px}
#${OVERLAY} .splib-head{display:flex;align-items:center;gap:12px;position:sticky;top:0;background:#101010;padding:8px 0 14px;z-index:2}
#${OVERLAY} .splib-head h1{font-size:28px;margin:0;flex:1}
#${OVERLAY} .splib-close,#${OVERLAY} button{border:0;color:#fff;background:#242424;border-radius:14px;min-height:46px;padding:10px 14px;font:700 15px/1.15 system-ui}
#${OVERLAY} .splib-close{font-size:24px;width:48px;padding:0}
#${OVERLAY} .splib-primary{background:#1ed760;color:#07130b!important}
#${OVERLAY} .splib-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0 14px}
#${OVERLAY} .splib-add{display:flex;gap:8px;margin-bottom:14px}
#${OVERLAY} .splib-add input{min-width:0;flex:1;background:#202020;color:#fff;border:1px solid #383838;border-radius:14px;padding:13px;font-size:16px}
#${OVERLAY} .splib-filters{display:flex;gap:8px;overflow:auto;padding-bottom:10px;scrollbar-width:none}
#${OVERLAY} .splib-filters button{min-height:38px;padding:8px 13px;white-space:nowrap;font-size:14px}
#${OVERLAY} .splib-filters button.active{background:#1ed760;color:#07130b}
#${OVERLAY} .splib-empty{color:#aaa;text-align:center;padding:48px 22px;line-height:1.5}
#${OVERLAY} .splib-item{display:grid;grid-template-columns:48px minmax(0,1fr) 42px;gap:12px;align-items:center;background:#1b1b1b;border-radius:15px;padding:10px;margin:9px 0}
#${OVERLAY} .splib-icon{width:48px;height:48px;border-radius:10px;display:grid;place-items:center;background:#2b2b2b;font-size:22px}
#${OVERLAY} .splib-title{font-size:16px;font-weight:750;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${OVERLAY} .splib-meta{font-size:13px;color:#aaa;margin-top:3px;text-transform:capitalize}
#${OVERLAY} .splib-open{cursor:pointer;min-width:0}
#${OVERLAY} .splib-remove{width:42px;height:42px;padding:0;border-radius:21px;color:#bbb;font-size:20px}
#${OVERLAY} .splib-note{font-size:13px;color:#888;line-height:1.4;margin:12px 2px}
`;
function readLib(){try{return JSON.parse(localStorage.getItem(LIBKEY)||'[]')}catch{return[]}}
function writeLib(v){localStorage.setItem(LIBKEY,JSON.stringify(v))}
function parseSpotify(raw){try{const u=new URL(raw,location.href);if(!/(^|\.)spotify\.com$/i.test(u.hostname))return null;const p=u.pathname.split('/').filter(Boolean);const types=['playlist','artist','album','track','show','episode'];const i=p.findIndex(x=>types.includes(x));if(i<0||!p[i+1])return null;return{url:`https://open.spotify.com/${p[i]}/${p[i+1]}`,type:p[i],id:p[i+1]}}catch{return null}}
function cleanTitle(){let t=(document.title||'').replace(/\s*[|–-]\s*Spotify\s*$/i,'').trim();return t||'Saved Spotify item'}
function iconFor(t){return({playlist:'♫',artist:'●',album:'◉',track:'♪',show:'◌',episode:'▶'})[t]||'♫'}
function saveLink(raw,title){const p=parseSpotify(raw);if(!p)return false;let lib=readLib();const existing=lib.find(x=>x.url===p.url);if(existing){existing.title=title||existing.title;existing.savedAt=Date.now()}else lib.unshift({...p,title:title||'Saved Spotify item',savedAt:Date.now()});writeLib(lib);renderLibrary();return true}
let filter='all';
function ensureLibrary(){if(document.getElementById(OVERLAY))return;const el=document.createElement('div');el.id=OVERLAY;el.innerHTML=`<div class="splib-wrap"><div class="splib-head"><button class="splib-close" aria-label="Close">‹</button><h1>Your Library <span style="color:#1ed760">SP+</span></h1></div><div class="splib-actions"><button class="splib-primary" id="splib-save-current">+ Save current page</button><button id="splib-clear">Manage</button></div><div class="splib-add"><input id="splib-url" inputmode="url" placeholder="Paste Spotify link"><button id="splib-add-btn">Add</button></div><div class="splib-filters" id="splib-filters"></div><div id="splib-list"></div><div class="splib-note">Saved only in this browser on this device. SpotifyPlus does not read or sync your Spotify account library.</div></div>`;document.body.appendChild(el);
el.querySelector('.splib-close').onclick=closeLibrary;
el.querySelector('#splib-save-current').onclick=()=>{if(!saveLink(location.href,cleanTitle()))alert('Open a Spotify playlist, artist, album, track, show, or episode first.');};
el.querySelector('#splib-add-btn').onclick=()=>{const inp=el.querySelector('#splib-url');if(saveLink(inp.value,inp.value)){inp.value=''}else alert('Paste a valid open.spotify.com link.');};
el.querySelector('#splib-url').addEventListener('keydown',e=>{if(e.key==='Enter')el.querySelector('#splib-add-btn').click()});
el.querySelector('#splib-clear').onclick=()=>{if(confirm('Remove all items from your SP+ Library?')){writeLib([]);renderLibrary()}};
renderLibrary();}
function renderLibrary(){const root=document.getElementById(OVERLAY);if(!root)return;const lib=readLib();const types=['all','playlist','artist','album','track'];const fs=root.querySelector('#splib-filters');fs.innerHTML=types.map(t=>`<button data-f="${t}" class="${filter===t?'active':''}">${t==='all'?'All':t[0].toUpperCase()+t.slice(1)+'s'}</button>`).join('');fs.querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.f;renderLibrary()});const shown=filter==='all'?lib:lib.filter(x=>x.type===filter);const list=root.querySelector('#splib-list');if(!shown.length){list.innerHTML='<div class="splib-empty">Your SP+ Library is empty.<br><br>Open something you like in Spotify and tap <b>Save current page</b>.</div>';return}list.innerHTML=shown.map(x=>`<div class="splib-item" data-url="${x.url}"><div class="splib-icon">${iconFor(x.type)}</div><div class="splib-open"><div class="splib-title"></div><div class="splib-meta">${x.type}</div></div><button class="splib-remove" aria-label="Remove">×</button></div>`).join('');[...list.querySelectorAll('.splib-item')].forEach((row,i)=>{const x=shown[i];row.querySelector('.splib-title').textContent=x.title;row.querySelector('.splib-open').onclick=()=>{closeLibrary();location.href=x.url};row.querySelector('.splib-remove').onclick=()=>{writeLib(readLib().filter(y=>y.url!==x.url));renderLibrary()}})}
function openLibrary(){ensureLibrary();document.getElementById(OVERLAY).classList.add('open');renderLibrary();document.body.style.overflow='hidden'}
function closeLibrary(){document.getElementById(OVERLAY)?.classList.remove('open');document.body.style.overflow=''}
function dismissAppPrompt(){const els=[...document.querySelectorAll('button,[role="button"]')];const notNow=els.find(e=>/^not now$/i.test((e.textContent||'').trim()));if(!notNow)return;const box=notNow.closest('[role="dialog"]')||notNow.parentElement?.parentElement;const text=(box?.textContent||'').toLowerCase();if(text.includes('get app')&&(text.includes('library')||text.includes('spotify app')))notNow.click()}
function wireLibraryNav(){[...document.querySelectorAll('a,button,[role="button"]')].forEach(el=>{const txt=(el.textContent||'').trim();const aria=el.getAttribute('aria-label')||'';if((/^your library$/i.test(txt)||/^your library$/i.test(aria))&&!el.dataset.spLib){el.dataset.spLib='1';el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openLibrary()},true)}})}
function install(){document.documentElement.classList.add(ROOT);let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;document.documentElement.appendChild(s)}s.textContent=css;if(document.body&&!document.getElementById(BADGE)){const b=document.createElement('div');b.id=BADGE;b.textContent=`SP+ v${VERSION}`;b.title='SpotifyPlus mobile skin is running';document.body.appendChild(b)}ensureLibrary();dismissAppPrompt();wireLibraryNav()}
install();new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();