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
  tagName: keyof HTMLElementTagNameMap;
  /** Classes to add for styling */
  classList?: string[];
  id?: string;
  textContent?: string;
}

/**
 * Creates HTML Element given a tagName, optionally can add classes, ID, and textContent
 */

class HTMLElem {
  newHTMLElem: HTMLElement;

  constructor(options: HTMLElemOptions) {
    this.newHTMLElem = document.createElement(options.tagName);

    this.newHTMLElem.classList.add(...options.classList);
    this.newHTMLElem.id = options.id;
    this.newHTMLElem.textContent = options.textContent;
  }
}

/**
 * Creates a link to WMS inventory page of desired product ID
 */

class WMSLink extends HTMLElem {
  newWMSLink: HTMLAnchorElement;

  constructor(productID: string) {
    const WMSLinkOptions: HTMLElemOptions = {
      tagName: 'a',
      textContent: 'Go to WMS',
      classList: [siteString, 'btn', 'btn-reset', 'link-to-wms'],
    };

    super(WMSLinkOptions);

    this.newWMSLink = <HTMLAnchorElement>this.newHTMLElem;
    this.newWMSLink.setAttribute('type', 'button');
    this.newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;
  }
}

class PDPWMSLink extends WMSLink {
  constructor(productID: string) {
    super(productID);
    this.newWMSLink.classList.add('test');
  }
}

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
