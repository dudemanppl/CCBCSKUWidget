const queryString: string = window.location.search;
const urlParams: URLSearchParams = new URLSearchParams(queryString);

const onBCActivityPage: boolean = !!urlParams.getAll('activity')[0];
const onCompetitiveCyclist: boolean =
  window.location.host === 'www.competitivecyclist.com';

const siteString: string = onCompetitiveCyclist ? 'cc' : 'bc';
const onPLP: boolean = Boolean(
  document.getElementsByClassName('search-results').length
);
const onPDP: boolean = Boolean(
  document.getElementsByClassName('js-kraken-pdp-body').length
);

export {
  queryString,
  urlParams,
  onBCActivityPage,
  onCompetitiveCyclist,
  siteString,
  onPLP,
  onPDP,
};
