const onCompetitiveCyclist =
  window.location.host === "www.competitivecyclist.com";
const siteString = onCompetitiveCyclist ? "cc" : "bc";
const onPLP = document.getElementsByClassName("search-results").length;
const onPDP = document.getElementsByClassName("js-kraken-pdp-body").length;

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
      `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice&site=${site}`
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
 * @param {string} elemClassName HTML element class.
 * @param {function} func Function to be run on each element.
 */

const runOnAllElems = (elemClassName, func) => {
  const elems = document.getElementsByClassName(elemClassName);

  for (const elem of [...elems]) {
    func(elem);
  }
};

/**
 * Deletes all elements of a given class.
 *
 * @param {string} elemClassName HTML element class.
 */

const deleteAllElems = (elemClassName) => {
  runOnAllElems(elemClassName, (elem) => elem.remove());
};

/**
 * Forces styling on BC to prevent onhover zoom effect, which sorta messes with the extension. Removes compare option from plp, ditto.
 */

if (!onCompetitiveCyclist) {
  deleteAllElems("js-pl-focus-trigger");
  deleteAllElems("js-pl-color-thumbs");
  deleteAllElems("js-pl-sizes-wrap");
  runOnAllElems("js-pl-expandable", (elem) => {
    const { style } = elem;

    style.top = "10px";
    style.left = "10px";
    style.right = "10px";
    style.bottom = "10px";
  });
}

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
    newWMSLink.innerText = "Go to WMS";

    return newWMSLink;
  }
}

/**
 * Creates single dropdown option
 *
 * @param {object} product Object containing info about an item
 * @param {Elem} currentOption Reference to HTML elem with the current option chosen
 */

class PLPSelectorDropdownOption extends HTMLElem {
  constructor(product, currentOption) {
    const newPLPSelectorDropdownOption = super("li", [
      "plp-dropdown-option-single",
    ]);

    const {
      salePrice,
      id: SKU,
      availability: { stockLevel },
      title: variantName,
    } = product;

    /** Adds OOS alert as necessary*/

    !stockLevel && newPLPSelectorDropdownOption.classList.add("oos-alert");

    const variantPriceStr = `${variantName} (${strToUSD(salePrice)})`;

    newPLPSelectorDropdownOption.innerHTML = variantPriceStr;

    /** Sets current option shown to the selected variant, shows small notification that the item was selected */

    newPLPSelectorDropdownOption.onclick = () => {
      navigator.clipboard.writeText(SKU);
      currentOption.classList.add("copy-notif");
      currentOption.innerHTML = "SKU Copied!";

      setTimeout(() => {
        currentOption.classList.remove("copy-notif");
        currentOption.innerHTML = variantPriceStr;
      }, 250);
    };

    return newPLPSelectorDropdownOption;
  }
}

/**
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @param {string} productID Parent SKU to query BC products REST API
 * @param {Elem} currentOption Reference to HTML elem with the current option chosen
 */

class PLPSelectorDropdown extends HTMLElem {
  constructor(productID, currentOption) {
    const newPLPSelectorDropdown = super("ul", [
      "plp-dropdown-options",
      siteString,
    ]);

    getItemInfo(productID).then((products) => {
      for (const product of products) {
        newPLPSelectorDropdown.append(
          new PLPSelectorDropdownOption(product, currentOption)
        );
      }
    });

    return newPLPSelectorDropdown;
  }
}

/**
 * Creates container for PLP dropdown
 *
 * @param {string} productID Parent SKU to query BC products REST API
 */

class PLPSelectorDropdownContainer extends HTMLElem {
  constructor(productID) {
    const newPLPSelectorDropdownContainer = super("div", [
      "plp-dropdown-container",
      siteString,
    ]);

    let requested = false;

    const currentOption = new HTMLElem("div", [
      "plp-dropdown-current-option",
      siteString,
    ]);

    currentOption.innerHTML = "Select options";

    newPLPSelectorDropdownContainer.append(currentOption);

    /** Queries only once the dropdown has been clicked */

    newPLPSelectorDropdownContainer.onclick = () => {
      /** Element won't be created until it is requested */
      if (!requested) {
        newPLPSelectorDropdownContainer.append(
          new PLPSelectorDropdown(productID, currentOption)
        );
        requested = true;
      } else {
        newPLPSelectorDropdownContainer.lastChild.classList.toggle("hidden");
      }

      /** Adds event listener when call stack is clear, seems to be buggy otherwise */
      setTimeout(() => {
        document.addEventListener(
          "click",
          ({ target }) => {
            /** If the target is the dropdownContainer, it already has an event listener to close it */
            if (
              target !== newPLPSelectorDropdownContainer &&
              target !== currentOption
            ) {
              newPLPSelectorDropdownContainer.lastChild.classList.add("hidden");
            }
          },
          /** Removes event listener when fired once */
          { once: true }
        );
      }, 0);
    };

    return newPLPSelectorDropdownContainer;
  }
}

/**
 * Returns new HTML div; the main SKU Widget container.
 *
 * @param {string} productID Seven letter string from CC/BC catalog.
 * @return {Element} SKU Widget.
 */

class PLPWidgetContainer extends HTMLElem {
  constructor(productID) {
    const newPLPWidgetContainer = super("div", ["sku-widget-container"]);

    newPLPWidgetContainer.append(
      new PLPSelectorDropdownContainer(productID),
      new WMSLink(productID, ["btn", "btn-reset"])
    );

    return newPLPWidgetContainer;
  }
}

/**
 * Adds the SKU Widget to each element of a given class.
 *
 */

const addPLPWidgets = () => {
  runOnAllElems("js-product-listing", (elem) => {
    const productID = elem.getAttribute("data-product-id");
    const newPDPWidget = new PLPWidgetContainer(productID);
    const targetLocation = onCompetitiveCyclist
      ? elem.firstChild
      : elem.firstChild.childNodes[2];

    targetLocation.append(newPDPWidget);
  });
};

if (onPLP) {
  addPLPWidgets();

  /** Watches for changes on SPA to rerender PLP widgets */
  const targetNode = document.getElementsByClassName("js-inner-body")[0];
  new MutationObserver(addPLPWidgets).observe(targetNode, { childList: true });
}

/**
 * Creates a button to copy the full SKU of the selected variant on the PDP
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 */

class CopySKUButtonPDP extends HTMLElem {
  constructor(id, classList) {
    const newCopySKUButtonPDP = super("button", classList, id);
    /** Seeing newCopySKUButtonPDP get repeated so many times hurt my eyes  */
    const b = newCopySKUButtonPDP;

    const reset = () => {
      b.innerText = "Copy SKU";
      b.classList.remove("no-variant-selected");
    };

    b.setAttribute("type", "button");
    reset();

    b.addEventListener("mouseenter", () => {
      b.innerText = "Click to copy";
    });

    b.addEventListener("mouseleave", reset);

    b.onclick = () => {
      const SKU = document.getElementsByClassName(
        "js-selected-product-variant"
      )[0].value;

      if (SKU) {
        navigator.clipboard.writeText(SKU);
        b.innerText = "Copied!";
        b.classList.add("flash");

        setTimeout(() => {
          b.classList.remove("flash");
        }, 100);
      } else {
        b.innerText = "Choose Item";
        b.classList.add("no-variant-selected");
      }
    };

    return newCopySKUButtonPDP;
  }
}

/**
 * Changes styling of dropdown option to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  /** Product obj from DOM as a string */
  const productObjStr = document.getElementsByClassName(
    "kraken-product-script"
  )[0].textContent;

  /** Parses obj string to JS obj */
  const products = JSON.parse(productObjStr.slice(13, productObjStr.length - 1))
    .skusCollection;

  const dropdownOptions = document.getElementsByClassName(
    "js-unifiedropdown-option"
  );

  /** First element is a placeholder */
  for (let i = 1; i < dropdownOptions.length; i += 1) {
    const dropdownOption = dropdownOptions[i];

    const childSKU = dropdownOption.getAttribute("sku-value");
    const { inventory } = products[childSKU];

    !inventory && dropdownOption.classList.add("oos-alert");
  }
};

/**
 * Adds WMS/CopySKU buttons to PDP.
 */

const addPDPButtons = () => {
  const cc = onCompetitiveCyclist;
  const productID = document.querySelector(
    '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
  ).value;

  const classList = [
    "btn",
    "btn-reset",
    siteString,
    ...(cc
      ? ["btn--secondary", "buy-box__compare-btn"]
      : ["product-buybox__btn"]),
  ];

  const targetLocation = document.getElementsByClassName(
    cc ? "add-to-cart" : "js-buybox-actions"
  )[0];

  const nodesToAppendPDP = [
    new WMSLink(productID, classList),
    new CopySKUButtonPDP("copy-sku-button", classList),
  ];

  /** Adds container around each node on BC to match layout */
  if (!cc) {
    for (let node of nodesToAppendPDP) {
      node = new HTMLElem("div", ["product-buybox__action"]).append(node);
    }
  } else {
    addOOSAlertToCCPDP();
  }

  targetLocation.append(...nodesToAppendPDP);
};

if (onPDP) {
  addPDPButtons();
}
