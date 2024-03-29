const onCompetitiveCyclist =
  window.location.host === 'www.competitivecyclist.com';
const siteString = onCompetitiveCyclist ? 'cc' : 'bc';
const pageType = document.getElementById('pageType').content;
const onPLP = pageType.slice(0, 3) === 'plp' || pageType === 'search';
const onPDP = pageType === 'pdp';

/**
 * Returns new HTML element given a tagName. Options to add id or classes.
 *
 * @param {string} tagName HTML tag name
 * @param {?string[]} [classList] Desired classes to add.
 * @param {?string} [id] Id for HTML element
 * @param {?string} [textContent] Text content inside new element
 */

const HTMLElem = (tagName, classList, id, textContent) => {
  const newHTMLElem = document.createElement(tagName);

  if (classList) {
    newHTMLElem.classList.add(...classList);
  }

  if (id) {
    newHTMLElem.id = id;
  }

  if (textContent) {
    newHTMLElem.textContent = textContent;
  }

  return newHTMLElem;
};
