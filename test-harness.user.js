// ==UserScript==
// @name         SpotifyPlus Test Harness
// @namespace    https://github.com/formandfire/SpotifyPlus
// @version      1.0.0
// @description  Loads a selected historical SpotifyPlus build for regression testing.
// @match        https://open.spotify.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==
(() => {
'use strict';
const BUILDS={
  '0.8':'8890c1c9cf3e5785663b08da80aa1101a49ba543',
  '0.9':'aec0efbd7982f721dfba85ee4602120609628f2e',
  '1.4.7':'2e9b88913fcdd20997922f3821cd3d99731f40a9'
};
const KEY='spotifyplus-test-build';
const params=new URLSearchParams(location.search);
const requested=params.get('spplus_test');
if(requested&&BUILDS[requested]) localStorage.setItem(KEY,requested);
const version=(requested&&BUILDS[requested])?requested:(localStorage.getItem(KEY)||'1.4.7');
const sha=BUILDS[version]||BUILDS['1.4.7'];
const url=`https://raw.githubusercontent.com/formandfire/SpotifyPlus/${sha}/spotifyplus.user.js`;
GM_xmlhttpRequest({
  method:'GET',url,
  onload:r=>{
    if(r.status<200||r.status>=300){alert(`SP+ Test Harness could not load v${version}.`);return;}
    try{(0,eval)(`${r.responseText}\n//# sourceURL=spotifyplus-v${version}.js`);}catch(e){console.error('SpotifyPlus Test Harness',e);alert(`SP+ v${version} failed to start. Check the browser console.`);}
  },
  onerror:()=>alert(`SP+ Test Harness could not load v${version}.`)
});
})();