/* eslint-disable no-unused-vars */
/** Initializes global variables */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const onBCActivityPage = !!urlParams.getAll('activity')[0];

const onCompetitiveCyclist =
  window.location.host === 'www.competitivecyclist.com';
const siteString = onCompetitiveCyclist ? 'cc' : 'bc';
const onPLP = document.getElementById('pageType').content.slice(0, 3) === 'plp';
const onPDP = document.getElementById('pageType').content === 'pdp';

chrome.runtime.sendMessage({ onCompetitiveCyclist });
