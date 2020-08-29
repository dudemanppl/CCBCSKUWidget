const onCompetitiveCyclist =
  window.location.host === "www.competitivecyclist.com";
const siteString = onCompetitiveCyclist ? "cc" : "bc";
const onPLP = document.getElementsByClassName("search-results").length;
const onPDP = document.getElementsByClassName("js-kraken-pdp-body").length;

/** Changes icon to goat logo when on BC */
chrome.runtime.sendMessage({ onCompetitiveCyclist });

/**
 * Formats number to string with dollar sign and trailing decimals
 *
 * @param {number} num Number to be formatted in to string
 */

const strToUSD = (num) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
};

/**
 * Sends request to BC API, returns obj with information about given product
 *
 * @param {string} productID Product ID to look up item.
 * @return {array} Array of objects with item info.
 */

const getItemInfo = async (productID) => {
  try {
    const site = onCompetitiveCyclist ? "competitivecyclist" : "bcs";

    let res = await fetch(
      `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=${site}`
    );

    res = await res.json();

    return Promise.resolve(await res.products[0].skus);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Runs a function on each element of a given class.
 *
 * @param {string} querySelector HTML element class.
 * @param {function} func Function to be run on each element.
 */

const runOnAllElems = (querySelector, func) => {
  const elems = document.querySelectorAll(querySelector);

  for (const elem of [...elems]) {
    func(elem);
  }
};

/**
 * Forces styling on BC to prevent onhover zoom effect, which sorta messes with the extension. Removes compare option from plp, ditto.
 */

const fixBCPLP = () => {
  const nice = performance.now();

  runOnAllElems(
    ".js-pl-focus-trigger, .js-pl-color-thumbs, .js-pl-sizes-wrap, .js-pl-expandable",
    (elem) => {
      if (elem.classList[1] === "js-pl-expandable") {
        const { style } = elem;

        style.top = "10px";
        style.left = "10px";
        style.right = "10px";
        style.bottom = "10px";
      } else {
        elem.remove();
      }
    }
  );
  console.log(performance.now() - nice);

};

/**
 * Returns new HTML element given a tagName. Options to add id or classes.
 *
 * @param {string} tagName HTML tag name.
 * @param {array} [classList] Array of desired classes to add.
 * @param {string} [id] Id for HTML element.
 * @return {Element} New HTML element with tag name.
 */

class HTMLElem {
  constructor(tagName, classList, id) {
    const newHTMLElem = document.createElement(tagName);

    if (classList) {
      newHTMLElem.classList.add(...classList);
    }

    if (id) {
      newHTMLElem.id = id;
    }

    return newHTMLElem;
  }
}

/**
 * Adds button that links to WMS inventory page of desired product ID
 *
 * @param {string} productID Product ID to check in WMS
 * @param {array} classList Classes to be added to the link
 */

class WMSLink extends HTMLElem {
  constructor(productID, classList) {
    const link = "link-to-wms-";
    const newWMSLink = super(
      "a",
      [...(onPLP ? [link + "plp"] : []), siteString, ...classList],
      onPDP && link + "pdp"
    );
    newWMSLink.setAttribute("type", "button");
    newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;
    newWMSLink.textContent = "Go to WMS";

    return newWMSLink;
  }
}
