/** Initializes global variables */

const onCompetitiveCyclist =
  window.location.host === "www.competitivecyclist.com";
const siteString = onCompetitiveCyclist ? "cc" : "bc";
const onPLP = document.getElementsByClassName("search-results").length;
const onPDP = document.getElementsByClassName("js-kraken-pdp-body").length;

chrome.runtime.sendMessage({ onCompetitiveCyclist });
