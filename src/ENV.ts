const queryString: string = window.location.search;
const urlParams: URLSearchParams = new URLSearchParams(queryString);

const onBCActivityPage: boolean = !!urlParams.getAll('activity')[0];
const onCompetitiveCyclist: boolean =
  window.location.host === 'www.competitivecyclist.com';

const siteString: string = onCompetitiveCyclist ? 'cc' : 'bc';

const pageType: string = document
  .getElementById('pageType')
  .getAttribute('content')
  .slice(0, 3);

const onPLP: boolean = pageType === 'plp';
const onPDP: boolean = pageType === 'pdp';

export {
  queryString,
  urlParams,
  onBCActivityPage,
  onCompetitiveCyclist,
  siteString,
  onPLP,
  onPDP,
};
