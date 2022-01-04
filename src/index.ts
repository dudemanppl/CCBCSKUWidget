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

chrome.runtime.sendMessage({ onCompetitiveCyclist });

interface HTMLElemOptions {
  /** Classes to add for styling */
  classList?: string[];
  id?: string;
  textContent?: string;
}

/**
 * Creates HTML Element given a tagName, optionally can add classes, ID, and textContent
 */

const HTMLElem = <TagName extends keyof HTMLElementTagNameMap>(
  tagName: TagName,
  options: HTMLElemOptions
): HTMLElement => {
  const newHTMLElem = <HTMLElement>document.createElement(tagName);

  newHTMLElem.classList.add(...options.classList);
  newHTMLElem.id = options.id;
  newHTMLElem.textContent = options.textContent;

  return newHTMLElem;
};

/**
 * Creates a link to WMS inventory page of desired product ID
 */

const WMSLink = (productID: string): HTMLAnchorElement => {
  const WMSLinkOptions: HTMLElemOptions = {
    textContent: 'Go to WMS',
    classList: [siteString, 'btn', 'btn-reset'],
  };
  const newWMSLink = <HTMLAnchorElement>HTMLElem('a', WMSLinkOptions);

  newWMSLink.setAttribute('type', 'button');
  newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

  return newWMSLink;
};

// const classnamesForElem = (elem) => {
//   const classnames = [siteString];

//   const add = (...classes) => {
//     classnames.push(...classes);
//   };

//   if (elem === 'WMSLink' || elem === 'CopySKUButton') {
//     add('btn', 'btn-reset');
//     if (onPDP) {
//       add('pdp');
//       if (onCompetitiveCyclist) {
//         add('btn--secondary');
//       } else {
//         add('product-buybox__btn');
//       }
//     } else {
//       add('plp');
//     }
//   }

//   if (elem === 'WMSLink') {
//     add('link-to-wms');
//   }

//   if (elem === 'PLPPrice') {
//     add(
//       'ui-pl-pricing__high-price',
//       'ui-pl-pricing--price-retail',
//       'js-item-price-high',
//       'qa-item-price-high'
//     );
//   }

//   return classnames;
// };
