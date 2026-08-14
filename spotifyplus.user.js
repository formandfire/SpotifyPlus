// ==UserScript==
// @name         SpotifyPlus Mobile Skin
// @namespace    https://github.com/formandfire/SpotifyPlus
// @version      1.4.8
// @description  Stable mobile skin with app-like SP+ Library, self-healing navigation, full-height panel, corrected bottom-nav active states, clean playlist titles, and native previous/next controls.
// @match        https://open.spotify.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://formandfire.github.io/SpotifyPlus/spotifyplus.user.js
// @downloadURL  https://formandfire.github.io/SpotifyPlus/spotifyplus.user.js
// ==/UserScript==
(() => {
'use strict';
const VERSION='1.4.8',ROOT='spotifyplus-mobile',STYLE='spotifyplus-style';
const LIBKEY='spotifyplus-library-v1',PANEL='spotifyplus-library';
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
html.${ROOT} [data-testid="control-button-skip-back"],html.${ROOT} [data-testid="control-button-skip-forward"]{display:flex!important;visibility:visible!important;opacity:1!important;width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;align-items:center!important;justify-content:center!important;pointer-events:auto!important}
html.${ROOT} [data-spplus-status-nav="1"],html.${ROOT} [data-spplus-status-nav="1"] *{color:#1ed760!important;fill:#1ed760!important;stroke:#1ed760!important}
html.${ROOT} [data-spplus-status-nav="1"]{font-weight:800!important}
html.${ROOT} [data-spplus-nav-active="1"],html.${ROOT} [data-spplus-nav-active="1"] *{color:#fff!important;fill:#fff!important;stroke:#fff!important;opacity:1!important}
html.${ROOT} [data-spplus-nav-inactive="1"],html.${ROOT} [data-spplus-nav-inactive="1"] *{color:#b3b3b3!important;fill:#b3b3b3!important;stroke:#b3b3b3!important;opacity:1!important}
#${PANEL}{position:fixed;left:0;right:0;top:0;bottom:120px;z-index:2147483500;background:#101010;color:#fff;font-family:system-ui,-apple-system,Segoe UI,sans-serif;display:none;overflow:auto;overscroll-behavior:contain}
#${PANEL}.open{display:block}
#${PANEL} .spl-wrap{max-width:720px;margin:auto;padding:18px 16px 28px}
#${PANEL} .spl-head{display:flex;align-items:center;gap:12px;padding:8px 0 16px;position:sticky;top:0;background:#101010;z-index:3}
#${PANEL} .spl-avatar{width:42px;height:42px;border-radius:50%;background:#c77a50;display:grid;place-items:center;font-weight:800;font-size:20px;flex:0 0 auto}
#${PANEL} .spl-head h1{margin:0;flex:1;font-size:30px;line-height:1;font-weight:800}
#${PANEL} .spl-iconbtn{width:46px;height:46px;border:0;background:transparent;color:#fff;font-size:30px;line-height:1;border-radius:50%;display:grid;place-items:center;padding:0}
#${PANEL} .spl-manage{border:1px solid #555;background:#202020;color:#fff;border-radius:18px;padding:8px 12px;font-weight:700;font-size:13px}
#${PANEL} .spl-search{display:none;margin:0 0 12px}
#${PANEL} .spl-search.open{display:block}
#${PANEL} .spl-search input{width:100%;background:#242424;color:#fff;border:0;border-radius:12px;padding:13px 14px;font-size:16px}
#${PANEL} .spl-chips{display:flex;gap:8px;overflow:auto;padding:4px 0 16px;scrollbar-width:none}
#${PANEL} .spl-chips button{border:0;border-radius:22px;background:#292929;color:#fff;padding:10px 16px;font-size:15px;white-space:nowrap}
#${PANEL} .spl-chips button.active{background:#1ed760;color:#07130b}
#${PANEL} .spl-sort{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:750;padding:8px 2px 12px}
#${PANEL} .spl-sort span:first-child{font-size:22px}
#${PANEL} .spl-list{display:flex;flex-direction:column;gap:6px}
#${PANEL} .spl-item{display:grid;grid-template-columns:64px minmax(0,1fr) 40px;gap:14px;align-items:center;padding:6px 0;min-height:76px}
#${PANEL} .spl-art{width:64px;height:64px;border-radius:4px;background:linear-gradient(135deg,#5334d8,#b0f6de);display:grid;place-items:center;font-size:28px;font-weight:800;overflow:hidden}
#${PANEL} .spl-art.artist{border-radius:50%;background:#333}
#${PANEL} .spl-art.album{background:#28507a}
#${PANEL} .spl-art.track{background:#4b2c65}
#${PANEL} .spl-title{font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${PANEL} .spl-meta{font-size:14px;color:#aaa;margin-top:4px;text-transform:capitalize;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${PANEL} .spl-open{min-width:0;cursor:pointer}
#${PANEL} .spl-more{border:0;background:transparent;color:#aaa;font-size:26px;width:40px;height:44px;padding:0}
#${PANEL} .spl-empty{text-align:center;color:#aaa;padding:52px 20px;line-height:1.5}
#${PANEL} .spl-note{font-size:12px;color:#777;padding:18px 0}
`;
function readLib(){try{return JSON.parse(localStorage.getItem(LIBKEY)||'[]')}catch{return[]}}
function writeLib(v){localStorage.setItem(LIBKEY,JSON.stringify(v))}
function parseSpotify(raw){try{const u=new URL(raw,location.href);if(!/(^|\.)spotify\.com$/i.test(u.hostname))return null;const p=u.pathname.split('/').filter(Boolean),types=['playlist','artist','album','track','show','episode'];const i=p.findIndex(x=>types.includes(x));if(i<0||!p[i+1])return null;return{url:`https://open.spotify.com/${p[i]}/${p[i+1]}`,type:p[i],id:p[i+1]}}catch{return null}}
function cleanTitle(){let t=(document.title||'').replace(/\s*[|–-]\s*Spotify\s*$/i,'').trim();t=t.replace(/\s*[-–—]?\s*playlist by .+$/i,'').trim();return t||'Saved Spotify item'}
function saveLink(raw,title){const p=parseSpotify(raw);if(!p)return false;let lib=readLib();const e=lib.find(x=>x.url===p.url);if(e){e.title=title||e.title;e.savedAt=Date.now()}else lib.unshift({...p,title:title||'Saved Spotify item',savedAt:Date.now()});writeLib(lib);renderLibrary();return true}
let filter='all',query='';
function ensureLibrary(){if(document.getElementById(PANEL)||!document.body)return;const el=document.createElement('div');el.id=PANEL;el.innerHTML=`<div class="spl-wrap"><div class="spl-head"><div class="spl-avatar">SP</div><h1>Your Library</h1><button class="spl-iconbtn" id="spl-search-btn" aria-label="Search library">⌕</button><button class="spl-iconbtn" id="spl-add-btn" aria-label="Add to library">＋</button><button class="spl-manage" id="spl-manage">Manage</button></div><div class="spl-search" id="spl-search"><input id="spl-search-input" placeholder="Search your SP+ Library"></div><div class="spl-chips" id="spl-chips"></div><div class="spl-sort"><span>↕</span><span>Recents</span></div><div class="spl-list" id="spl-list"></div><div class="spl-note">SP+ Library is saved locally in this browser. It does not sync with Spotify's account library.</div></div>`;document.body.appendChild(el);el.querySelector('#spl-search-btn').onclick=()=>{const box=el.querySelector('#spl-search');box.classList.toggle('open');if(box.classList.contains('open'))el.querySelector('#spl-search-input').focus()};el.querySelector('#spl-search-input').oninput=e=>{query=e.target.value.toLowerCase();renderLibrary()};el.querySelector('#spl-add-btn').onclick=()=>{const current=parseSpotify(location.href);const suggestion=current?location.href:'';const raw=prompt('Paste a Spotify link, or leave the current Spotify page URL:',suggestion);if(raw===null)return;if(!saveLink(raw,raw===location.href?cleanTitle():'Saved Spotify item'))alert('Open or paste a valid Spotify playlist, artist, album, track, show, or episode link.');};el.querySelector('#spl-manage').onclick=()=>{if(!readLib().length)return;if(confirm('Manage SP+ Library: remove all saved items?')){writeLib([]);renderLibrary()}};renderLibrary()}
function renderLibrary(){const root=document.getElementById(PANEL);if(!root)return;const types=['all','playlist','album','artist','track'];root.querySelector('#spl-chips').innerHTML=types.map(t=>`<button data-f="${t}" class="${filter===t?'active':''}">${t==='all'?'All':t[0].toUpperCase()+t.slice(1)+'s'}</button>`).join('');root.querySelectorAll('#spl-chips button').forEach(b=>b.onclick=()=>{filter=b.dataset.f;renderLibrary()});let lib=readLib();if(filter!=='all')lib=lib.filter(x=>x.type===filter);if(query)lib=lib.filter(x=>(x.title||'').toLowerCase().includes(query));const list=root.querySelector('#spl-list');if(!lib.length){list.innerHTML='<div class="spl-empty">Nothing saved here yet.<br><br>Tap <b>＋</b> to add the current Spotify page or paste a Spotify link.</div>';return}list.innerHTML=lib.map(x=>`<div class="spl-item"><div class="spl-art ${x.type}">${x.type==='playlist'?'♫':x.type==='artist'?'●':x.type==='album'?'◉':'♪'}</div><div class="spl-open"><div class="spl-title"></div><div class="spl-meta">${x.type} • Saved in SP+</div></div><button class="spl-more" aria-label="More">⋮</button></div>`).join('');[...list.querySelectorAll('.spl-item')].forEach((row,i)=>{const x=lib[i];row.querySelector('.spl-title').textContent=x.title;row.querySelector('.spl-open').onclick=()=>{closeLibrary();location.href=x.url};row.querySelector('.spl-more').onclick=()=>{if(confirm(`Remove “${x.title}” from SP+ Library?`)){writeLib(readLib().filter(y=>y.url!==x.url));renderLibrary()}}})}
function findNavs(label){const re=new RegExp(`^${label}$`,'i');return [...document.querySelectorAll('a,button,[role="button"]')].filter(el=>{const txt=(el.textContent||'').trim(),aria=(el.getAttribute('aria-label')||'').trim();return re.test(txt)||re.test(aria)})}
function syncNavState(){const open=document.getElementById(PANEL)?.classList.contains('open');const homes=findNavs('home'),searches=findNavs('search'),libraries=findNavs('your library');for(const el of [...document.querySelectorAll('[data-spplus-nav-active],[data-spplus-nav-inactive]')]){delete el.dataset.spplusNavActive;delete el.dataset.spplusNavInactive}if(open){for(const el of homes)el.dataset.spplusNavInactive='1';for(const el of searches)el.dataset.spplusNavInactive='1';for(const el of libraries)el.dataset.spplusNavActive='1'}}
function openLibrary(){ensureLibrary();document.getElementById(PANEL).classList.add('open');renderLibrary();syncNavState()}
function closeLibrary(){document.getElementById(PANEL)?.classList.remove('open');syncNavState()}
function dismissLibraryPrompt(){const els=[...document.querySelectorAll('button,[role="button"]')],notNow=els.find(e=>/^not now$/i.test((e.textContent||'').trim()));if(!notNow)return;const box=notNow.closest('[role="dialog"]')||notNow.parentElement?.parentElement,text=(box?.textContent||'').toLowerCase();if(text.includes('get app')&&(text.includes('library')||text.includes('spotify app')))notNow.click()}
function wireLibraryNav(){[...document.querySelectorAll('a,button,[role="button"]')].forEach(el=>{const txt=(el.textContent||'').trim(),aria=el.getAttribute('aria-label')||'';if((/^your library$/i.test(txt)||/^your library$/i.test(aria))&&!el.dataset.spLib){el.dataset.spLib='1';el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openLibrary()},true)}})}
function wireExitNav(){[...document.querySelectorAll('a,button,[role="button"]')].forEach(el=>{const txt=(el.textContent||'').trim(),aria=(el.getAttribute('aria-label')||'').trim();if(!(/^(home|search)$/i.test(txt)||/^(home|search)$/i.test(aria))||el.dataset.spExitNav)return;el.dataset.spExitNav='1';el.addEventListener('click',()=>{closeLibrary()},true)})}
function replaceGetAppWithStatus(){const candidates=[...document.querySelectorAll('a,button,[role="button"]')];for(const el of candidates){const txt=(el.textContent||'').trim(),aria=(el.getAttribute('aria-label')||'').trim();if(!(/^get app$/i.test(txt)||/^get app$/i.test(aria)||/^sp\+ v\d/i.test(txt)||/^spotifyplus v\d/i.test(aria)))continue;el.dataset.spplusStatusNav='1';el.removeAttribute('href');el.setAttribute('aria-label',`SpotifyPlus v${VERSION}`);const spans=[...el.querySelectorAll('span')];const label=spans.find(s=>/^get app$/i.test((s.textContent||'').trim())||/^sp\+ v\d/i.test((s.textContent||'').trim()));if(label)label.textContent=`SP+ v${VERSION}`;else if(/^get app$/i.test(txt)||/^sp\+ v\d/i.test(txt))el.textContent=`SP+ v${VERSION}`;if(!el.dataset.spStatusBound){el.dataset.spStatusBound='1';el.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation()},true)}}}
function heal(){if(!document.documentElement.classList.contains(ROOT))document.documentElement.classList.add(ROOT);let s=document.getElementById(STYLE);if(!s){s=document.createElement('style');s.id=STYLE;(document.head||document.documentElement).appendChild(s)}if(s.textContent!==css)s.textContent=css;document.getElementById('spotifyplus-status')?.remove();ensureLibrary();dismissLibraryPrompt();wireLibraryNav();wireExitNav();replaceGetAppWithStatus();syncNavState()}
heal();let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;heal()})}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});const fast=setInterval(heal,500);setTimeout(()=>{clearInterval(fast);setInterval(heal,2000)},15000);window.addEventListener('pageshow',heal);document.addEventListener('visibilitychange',()=>{if(!document.hidden)heal()});
})();