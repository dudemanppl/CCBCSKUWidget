const onCompetitiveCyclist =
  window.location.host === 'www.competitivecyclist.com';
const siteString = onCompetitiveCyclist ? 'cc' : 'bc';
const onPLP = document.getElementById('pageType').content.slice(0, 3) === 'plp';
const onPDP = document.getElementById('pageType').content === 'pdp';
