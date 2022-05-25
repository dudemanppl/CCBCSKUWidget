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

/**
 * Creates a button that links to WMS inventory page of desired product ID
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 */

const WMSLink = (productID) => {
  const newWMSLink = HTMLElem(
    'a',
    ['btn', 'btn-reset', 'plp', 'link-to-wms', siteString],
    null,
    'Go to WMS'
  );

  newWMSLink.setAttribute('type', 'button');
  newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

  return newWMSLink;
};
