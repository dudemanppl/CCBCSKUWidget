import { onCompetitiveCyclist, siteString } from './ENV';

chrome.runtime.sendMessage({ onCompetitiveCyclist });

export interface HTMLElemOptions {
  tagName: keyof HTMLElementTagNameMap;
  /** Classes to add for styling */
  classList?: string[];
  id?: string;
  textContent?: string;
}

interface ComponentOptions {
  /** Additional classes to be added to a component */
  additionalClasses?: string[];
}

/**
 * Creates HTML Element given a tagName, optionally can add classes, ID, and textContent
 */

export class HTMLElem {
  HTMLElem: HTMLElement;

  constructor(options: HTMLElemOptions) {
    this.HTMLElem = document.createElement(options.tagName);

    this.HTMLElem.classList.add(...options.classList);
    this.HTMLElem.id = options.id;
    this.HTMLElem.textContent = options.textContent;
  }
}

/**
 * Creates a link to WMS inventory page of desired product ID
 */

export class WMSLink extends HTMLElem {
  WMSLink: HTMLAnchorElement;

  constructor(productID: string) {
    const WMSLinkOptions: HTMLElemOptions = {
      tagName: 'a',
      textContent: 'Go to WMS',
      classList: [siteString, 'btn', 'btn-reset', 'link-to-wms'],
    };

    super(WMSLinkOptions);

    this.WMSLink = <HTMLAnchorElement>this.HTMLElem;

    this.WMSLink.setAttribute('type', 'button');
    this.WMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;
  }
}

export class PDPWMSLink extends WMSLink {
  PDPWMSLink: HTMLAnchorElement;

  constructor(productID: string) {
    const componentOptions = <ComponentOptions>{
      additionalClasses: [
        'pdp',
        onCompetitiveCyclist ? 'btn--secondary' : 'product-buybox__btn',
      ],
    };

    super(productID);

    this.PDPWMSLink = <HTMLAnchorElement>this.WMSLink;
    this.PDPWMSLink.classList.add(...componentOptions.additionalClasses);
  }
}

export class PLPWMSLink extends WMSLink {
  PLPWMSLink: HTMLAnchorElement;

  constructor(productID: string) {
    const componentOptions = <ComponentOptions>{
      additionalClasses: ['plp'],
    };

    super(productID);

    this.PLPWMSLink = <HTMLAnchorElement>this.WMSLink;
    this.PLPWMSLink.classList.add(...componentOptions.additionalClasses);
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
