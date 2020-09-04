const onCompetitiveCyclist =
  window.location.host === "www.competitivecyclist.com";
const siteString = onCompetitiveCyclist ? "cc" : "bc";
const onPLP = document.getElementsByClassName("search-results").length;
const onPDP = document.getElementsByClassName("js-kraken-pdp-body").length;

/** Changes icon to goat logo when on BC */
chrome.runtime.sendMessage({ onCompetitiveCyclist });

/**
 * Returns new HTML element given a tagName. Options to add id or classes.
 *
 * @param {string} tagName HTML tag name
 * @param {?array} [classList] Array of desired classes to add.
 * @param {?string} [id] Id for HTML element
 * @param {?string} [textContent] Text content inside new element
 */

class HTMLElem {
  constructor(tagName, classList, id, textContent) {
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
  }
}

/**
 * Creates a button that links to WMS inventory page of desired product ID
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 */

class WMSLink extends HTMLElem {
  constructor(productID) {
    const newWMSLink = super(
      "a",
      [
        ...(onPDP
          ? [
              "pdp",
              onCompetitiveCyclist ? "btn--secondary" : "product-buybox__btn",
            ]
          : ["plp"]),
        "link-to-wms",
        "btn",
        "btn-reset",
        siteString,
      ],
      null,
      "Go to WMS"
    );
    newWMSLink.setAttribute("type", "button");
    newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

    return newWMSLink;
  }
}
