/**
 * Returns new HTML element given a tagName. Options to add id or classes.
 *
 * @param {string} tagName HTML tag name
 * @param {?array|string} [classList] Desired classes to add.
 * @param {?string} [id] Id for HTML element
 * @param {?string} [textContent] Text content inside new element
 */

const HTMLElem = (
  tagName: string,
  classList?: string[],
  id?: string,
  textContent?: string
) => {
  const newHTMLElem = document.createElement(tagName);

  if (classList) {
    if (Array.isArray(classList)) {
      newHTMLElem.classList.add(...classList);
    } else {
      throw new TypeError('Expected an array');
    }
  }

  if (id) {
    newHTMLElem.id = id;
  }

  if (textContent) {
    newHTMLElem.textContent = textContent;
  }

  return newHTMLElem;
};

/**
 * Creates a button that links to WMS inventory page of desired product ID
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 */

// const WMSLink = (productID) => {
//   const newWMSLink = HTMLElem(
//     'a',
//     classnamesForElem('WMSLink'),
//     null,
//     'Go to WMS'
//   );

//   newWMSLink.setAttribute('type', 'button');
//   newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

//   return newWMSLink;
// };

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

function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
