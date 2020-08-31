const onCompetitiveCyclist =
  window.location.host === "www.competitivecyclist.com";
const siteString = onCompetitiveCyclist ? "cc" : "bc";
const onPLP = document.getElementsByClassName("search-results").length;
const onPDP = document.getElementsByClassName("js-kraken-pdp-body").length;

/** Changes icon to goat logo when on BC */
chrome.runtime.sendMessage({ onCompetitiveCyclist });

/**
 * Sends request to BC API, returns array with information about given product
 *
 * @async
 * @param {string} productID Product ID to look up item
 * @return {array} Array of objects with item info
 */

const getItemInfo = async (productID) => {
  try {
    let res = await fetch(
      `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=${
        onCompetitiveCyclist ? "competitivecyclist" : "bcs"
      }`
    );

    res = await res.json();

    return Promise.resolve(await res.products[0].skus);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Runs a function on each element of a given class
 *
 * @param {string} elemClassName HTML element class
 * @callback func
 */

const runOnAllElemsofClass = (elemClassName, func) => {
  const elems = document.getElementsByClassName(elemClassName);

  for (const elem of [...elems]) {
    func(elem);
  }
};

/**
 * Deletes all elements of a given class
 *
 * @param {string} elemClassName HTML element class
 */

const deleteAllElems = (elemClassName) => {
  runOnAllElemsofClass(elemClassName, (elem) => elem.remove());
};

/**
 * Forces styling on BC to prevent onhover zoom effect, which sorta messes with the extension. Removes compare option from plp, ditto
 */

const fixBCPLP = () => {
  deleteAllElems("js-pl-focus-trigger");
  deleteAllElems("js-pl-color-thumbs");
  deleteAllElems("js-pl-sizes-wrap");
  runOnAllElemsofClass("js-pl-expandable", (elem) => {
    const { style } = elem;

    style.top = "10px";
    style.left = "10px";
    style.right = "10px";
    style.bottom = "10px";
  });
};

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
