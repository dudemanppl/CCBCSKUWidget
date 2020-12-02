/* eslint-disable no-unused-vars */
/** Initializes global variables */

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const onBCActivityPage = !!urlParams.getAll('activity')[0];

const onCompetitiveCyclist =
  window.location.host === 'www.competitivecyclist.com';
const siteString = onCompetitiveCyclist ? 'cc' : 'bc';
const onPLP = document.getElementsByClassName('search-results').length;
const onPDP = document.getElementsByClassName('js-kraken-pdp-body').length;

chrome.runtime.sendMessage({ onCompetitiveCyclist });
