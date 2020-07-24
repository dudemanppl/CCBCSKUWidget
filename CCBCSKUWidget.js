const onCompetitiveCyclist =
  window.location.host === "www.competitivecyclist.com";
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
 * Runs callback given a fulfilled promise of the stock level, title, child SKU, and price of an item given a product ID
 *
 * @param {string} productID Product ID to look up item.
 * @return {array} Array of objects with item info.
 */

const getItemInfo = async (productID) => {
  try {
    const site = onCompetitiveCyclist ? "competitivecyclist" : "bcs";

    const res = await fetch(
      `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice&site=${site}`
    );

    const json = await res.json();

    return Promise.resolve(json.products[0].skus);
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
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 * @return {Element} New HTML element with tag name.
 */

class HTMLElem {
  constructor(tagName, id, classList) {
    this.tagName = tagName;
    this.id = id;
    this.classList = classList;
  }

  create() {
    const newHTMLElem = document.createElement(this.tagName);

    if (this.id) {
      newHTMLElem.id = this.id;
    }

    if (this.classList) {
      if (Array.isArray(this.classList)) {
        newHTMLElem.classList.add(...this.classList);
      } else {
        newHTMLElem.classList.add(this.classList);
      }
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
    super("a", null, [`link-to-wms-${onPLP ? "plp" : "pdp"}`, ...classList]);
    this.productID = productID;
  }

  create() {
    const newWMSLink = super.create();

    newWMSLink.setAttribute("type", "button");

    newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${this.productID}`;

    newWMSLink.innerText = "Click to go to WMS";

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
  constructor(product, currentOption, p) {
    super("li", null, ["plp-dropdown-option-single"]);
    this.product = product;
    this.currentOption = currentOption;
    this.p = p;
  }

  create() {
    const newPLPSelectorDropdownOption = super.create();

    const {
      salePrice,
      id: SKU,
      availability: { stockLevel },
      title: variantName,
    } = this.product;

    const price = strToUSD(salePrice);

    /** Adds OOS alert to dropdown option */

    !stockLevel && newPLPSelectorDropdownOption.classList.add("oos-alert");

    const variantPriceStr = `${variantName} (${price})`;

    newPLPSelectorDropdownOption.innerHTML = variantPriceStr;

    /** Sets current option shown to the selected variant, shows small notification that the item was selected */

    newPLPSelectorDropdownOption.onclick = () => {
      const priceLocation = this.currentOption.parentElement.parentElement
        .parentElement.childNodes[2].childNodes[3].firstChild;

      /** Deletes price range  or sets price to reflect price of currently selected variant */
      if (!this.p.deleted) {
        const priceLocationParent = priceLocation.parentElement;
        const clonedNode = priceLocation.cloneNode();
        clonedNode.innerHTML = price;

        priceLocation.remove();

        priceLocationParent.insertBefore(
          clonedNode,
          priceLocationParent.lastChild
        );

        this.p.deleted = true;
      } else {
        priceLocation.innerHTML = price;
      }

      navigator.clipboard.writeText(SKU);
      this.currentOption.classList.add("flash");

      this.currentOption.innerHTML = "SKU Copied!";

      setTimeout(() => {
        this.currentOption.classList.remove("flash");
      }, 100);

      setTimeout(() => {
        this.currentOption.innerHTML = variantPriceStr;
      }, 500);
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
    super("ul", null, "plp-dropdown-options");
    this.productID = productID;
    this.currentOption = currentOption;
  }

  async create() {
    const newPLPSelectorDropdown = super.create();
    const allProducts = await getItemInfo(this.productID);

    /** obj doesn't lose reference when being passed down, bootleg state management */
    const price = { deleted: false };

    for (const product of allProducts) {
      const newPLPSelectorDropdownOption = new PLPSelectorDropdownOption(
        product,
        this.currentOption,
        price
      ).create();

      newPLPSelectorDropdown.appendChild(newPLPSelectorDropdownOption);
    }

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
    super("div", null, "plp-dropdown-container");
    this.productID = productID;
    this.requested = false;
  }

  create() {
    const newPLPSelectorDropdownContainer = super.create();
    const currentOption = new HTMLElem(
      "div",
      null,
      "plp-dropdown-current-option"
    ).create();

    currentOption.innerHTML = "Select options";

    newPLPSelectorDropdownContainer.appendChild(currentOption);

    /** Queries only once the dropdown has been clicked */

    currentOption.onclick = async () => {
      if (!this.requested) {
        const newSelectorDropdown = await new PLPSelectorDropdown(
          this.productID,
          currentOption
        ).create();

        newPLPSelectorDropdownContainer.appendChild(newSelectorDropdown);

        this.requested = true;
      } else {
        newPLPSelectorDropdownContainer.lastChild.classList.toggle("hidden");
      }

      /** Adds event listener when call stack is clear */
      setTimeout(() => {
        document.addEventListener(
          "click",
          (e) => {
            /** If the target is the currentOption, it already has an event listener to close it */
            if (e.target !== currentOption) {
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
    super("div", null, "sku-widget-container");
    this.productID = productID;
  }

  create() {
    const newPLPWidgetContainer = super.create();

    const selectorDropdown = new PLPSelectorDropdownContainer(
      this.productID
    ).create();

    newPLPWidgetContainer.appendChild(selectorDropdown);
    WMSLink("plp", newPLPWidgetContainer, this.productID);

    return newPLPWidgetContainer;
  }
}

class PLPWidgetRefreshButton extends HTMLElem {
  constructor() {
    super("div", "plp-widget-refresh-button", ["btn", "btn-reset"]);
  }

  create() {
    const newPLPWidgetRefreshButton = super.create();

    newPLPWidgetRefreshButton.innerHTML = "Add SKU Widgets";

    newPLPWidgetRefreshButton.onclick = () => {
      document.getElementById("plp-widget-refresh-button").remove();
      deleteAllElems("sku-widget-container");
      addPLPWidgets();
    };

    return newPLPWidgetRefreshButton;
  }
}

/**
 * Adds the SKU Widget to each element of a given class.
 *
 */

const addPLPWidgets = () => {
  runOnAllElems("js-product-listing", (elem) => {
    const productID = elem.getAttribute("data-product-id");
    const SKUWidget = new PLPWidgetContainer(productID).create();
    const targetLocation = onCompetitiveCyclist
      ? elem.firstChild
      : elem.firstChild.childNodes[2];

    targetLocation.appendChild(SKUWidget);
  });

  const refreshButtonTarget = document.getElementsByClassName(
    "header-bottom-search"
  )[0];

  const newPLPWidgetRefreshButton = new PLPWidgetRefreshButton().create();

  refreshButtonTarget.insertBefore(
    newPLPWidgetRefreshButton,
    refreshButtonTarget.firstChild
  );
};

if (onPLP) {
  addPLPWidgets();
}

/**
 *  Checks to see if a variant is selected
 */

const SKUButtonValidator = () => {
  const SKUButton = document.getElementById(
    `copy-sku-button-${onCompetitiveCyclist ? "cc" : "bc"}`
  );

  const { style } = SKUButton;

  const SKU = document.getElementsByClassName("js-selected-product-variant")[0]
    .value;

  if (SKU) {
    navigator.clipboard.writeText(SKU);
  } else {
    SKUButton.innerText = "Choose Item";
    style.color = "red";
    style.backgroundColor = "white";
  }
};

/**
 * Returns copy child SKU button on the PDP
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 */

class CopySKUButtonPDP extends HTMLElem {
  constructor(id, classList) {
    super("button", id, [
      ...classList,
      onCompetitiveCyclist ? "buy-box__compare-btn" : null,
    ]);
  }

  create() {
    const newButton = super.create();
    const { style } = newButton;
    const backgroundColor = onCompetitiveCyclist ? "white" : "black";

    newButton.setAttribute("type", "button");
    newButton.innerHTML = "Copy SKU";

    newButton.addEventListener("mouseenter", () => {
      newButton.innerHTML = "Click to copy";
    });

    newButton.addEventListener("mouseleave", () => {
      newButton.innerHTML = "Copy SKU";
      newButton.removeAttribute("style");
    });

    newButton.onclick = () => {
      style.backgroundColor = backgroundColor;

      setTimeout(() => (style.backgroundColor = null), 100);

      newButton.innerHTML = "Copied!";

      SKUButtonValidator();
    };
    return newButton;
  }
}

/**
 * Changes styling of dropdown option to reflect OOS status
 */

const addOOSAlertToCC = () => {
  const productObjStr = document.getElementsByClassName(
    "kraken-product-script"
  )[0].textContent;

  const products = JSON.parse(productObjStr.slice(13, productObjStr.length - 1))
    .skusCollection;

  const dropdownOptions = document.getElementsByClassName(
    "js-unifiedropdown-option"
  );

  /** First element is a placeholder */
  for (let i = 1; i < dropdownOptions.length; i += 1) {
    const dropdownOption = dropdownOptions[i];

    const childSKU = dropdownOption.getAttribute("sku-value");
    const stockLevel = products[childSKU].inventory;

    !stockLevel && dropdownOption.classList.add("oos-alert");
  }
};

/**
 * Adds CopySKUButton elem to PDP.
 */

const addPDPButtons = () => {
  const cc = onCompetitiveCyclist;
  const id = `copy-sku-button-${cc ? "cc" : "bc"}`;
  const productID = document.querySelector("b").innerHTML;

  const classList = [
    "btn",
    "btn-reset",
    ...(cc ? ["btn--secondary"] : ["product-buybox__btn"]),
  ];

  const targetLocation = document.getElementsByClassName(
    cc ? "add-to-cart" : "js-buybox-actions"
  )[0];

  const newCopySKUButtonPDP = new CopySKUButtonPDP(id, classList).create();
  const newWMSLink = new WMSLink(productID, classList).create();

  if (cc) {
    addOOSAlertToCC();
    targetLocation.appendChild(newCopySKUButtonPDP);
    targetLocation.appendChild(newWMSLink);
  } else {
    /* Adds container to BC to mimic layout of original buttons */
    const container = new HTMLElem("div", null, [
      "product-buybox__action",
    ]).create();

    container.appendChild(newCopySKUButtonPDP);

    targetLocation.appendChild(container);
  }
};

if (onPDP) {
  addPDPButtons();
}
