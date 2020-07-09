const isCC = window.location.host === "www.competitivecyclist.com";
const isPLP =
  document.getElementsByClassName("ui-ajaxplp").length ||
  document.getElementsByClassName("ui-product-listing-grid").length;
const isPDP = document.getElementsByClassName("js-kraken-pdp-body").length;

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

const deleteAllElems = elemClassName => {
  runOnAllElems(elemClassName, elem => elem.remove());
};

/**
 * Forces styling on BC to prevent onhover zoom effect, which sorta messes with the extension. Removes compare option from plp, ditto.
 */

if (!isCC) {
  deleteAllElems("js-pl-focus-trigger");
  deleteAllElems("js-pl-color-thumbs");
  deleteAllElems("js-pl-sizes-wrap");
  runOnAllElems("js-pl-expandable", elem => {
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
      newHTMLElem.classList.add(...this.classList);
    }

    return newHTMLElem;
  }
}

/**
 * Returns new button with hover and click effects
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 * @param {string} text Desired text of the button.
 * @param {function} func Function to be invoked on click.
 */

class Button extends HTMLElem {
  constructor(id, classList, text, textOnHover, textOnClick, func) {
    super("button", id, classList);
    this.text = text;
    this.textOnHover = textOnHover;
    this.textOnClick = textOnClick;
    this.func = func;
  }

  create() {
    const newButton = super.create();
    const { style } = newButton;
    const backgroundColor = isCC ? "white" : "black";

    newButton.setAttribute("type", "button");
    newButton.innerHTML = this.text;

    newButton.addEventListener("mouseenter", () => {
      newButton.innerHTML = this.textOnHover;
    });

    newButton.addEventListener("mouseleave", () => {
      newButton.innerHTML = this.text;
      newButton.removeAttribute("style");
    });

    newButton.onclick = () => {
      style.backgroundColor = backgroundColor;

      setTimeout(() => (style.backgroundColor = null), 100);

      newButton.innerHTML = this.textOnClick;

      this.func();
    };

    return newButton;
  }
}

/**
 * Runs callback given a fulfilled promise of the stock level, title, child SKU, and price of an item given a product ID
 *
 * @param {string} productID Product ID to look up item.
 * @param {function} func Callback to make use of obj with item info.
 */

const getItemInfo = async (productID, func) => {
  try {
    const site = isCC ? "competitivecyclist" : "bcs";

    const res = await fetch(
      `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice&site=${site}`
    );

    const json = await res.json();
    func(json);
  } catch (err) {
    console.log(err);
  }
};

getItemInfo("GIR003E", ({ products }) => {
  console.log(products[0].skus);
});

/**
 * Returns copy product id (parent SKU) button for the PLP
 *
 * @param {string} productID Product ID to be copied to clipboard.
 */

class CopyProductIDButtonPLP extends Button {
  constructor(productID) {
    super(
      "product-id-button",
      ["btn-reset", "btn"],
      "Get SKUs",
      "Get SKUs",
      "Checking...",
      () => navigator.clipboard.writeText(productID)
    );
  }

  create() {
    return super.create();
  }
}

/**
 * Returns new HTML div; the main SKU Widget container.
 *
 * @param {string} productID Seven letter string from CC/BC catalog.
 * @return {Element} SKU Widget.
 */

class SKUWidgetContainer extends HTMLElem {
  constructor(productID) {
    super("div", "sku-widget-container");
    this.productID = productID;
  }

  create() {
    const newSKUWidgetContainer = super.create();

    const newCopyProductIDButtonPLP = new CopyProductIDButtonPLP(
      this.productID
    ).create();

    newSKUWidgetContainer.appendChild(newCopyProductIDButtonPLP);

    return newSKUWidgetContainer;
  }
}

/**
 * Adds the SKU Widget to each element of a given class.
 *
 */

const addSKUWidget = () => {
  runOnAllElems("js-product-listing", elem => {
    const productID = elem.getAttribute("data-product-id");
    const SKUWidget = new SKUWidgetContainer(productID).create();
    const targetLocation = isCC
      ? elem.firstChild
      : elem.firstChild.childNodes[2];

    targetLocation.appendChild(SKUWidget);
  });
};

if (isPLP) {
  addSKUWidget();
}

/**
 *  Checks to see if a varient is selected
 */

const SKUButtonValidator = () => {
  const SKUButton = document.getElementById(
    `add-sku-button-${isCC ? "cc" : "bc"}`
  );

  const { style } = SKUButton;

  const SKU = isCC
    ? document
        .getElementById("product-variant-select")
        .getAttribute("sku-value")
    : document.getElementsByClassName("js-selected-product-variant")[0].value;

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

class CopySKUButtonPDP extends Button {
  constructor(id, classList) {
    super(
      id,
      classList,
      "Copy SKU",
      "Click to copy",
      "Copied!",
      SKUButtonValidator
    );
  }

  create() {
    return super.create();
  }
}

/**
 * Changes the "add to wishlist" button to read "OOS" when item is out of stock
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

  const OOSButton = document.getElementsByClassName("js-add-to-wishlist")[0];

  /** First element is a placeholder */
  for (let i = 1; i < dropdownOptions.length; i += 1) {
    const dropdownOption = dropdownOptions[i];

    const childSKU = dropdownOption.getAttribute("sku-value");
    const stockLevel = products[childSKU].inventory;

    if (!stockLevel) {
      const OOS = new HTMLElem("div", "oos-alert", [
        "ui-basedropdown-option-value",
        "ui-unifiedropdown-option-value",
      ]).create();

      OOS.innerHTML = "OOS";

      dropdownOption.appendChild(OOS);
      dropdownOption.style.backgroundColor = "lightgrey";
    }

    dropdownOption.onclick = () => {
      OOSButton.innerHTML = stockLevel ? "save for later" : "OOS";
    };
  }
};

/**
 * Adds CopySKUButton elem to PDP.
 */

const addCopySKUButtonPDP = () => {
  const id = `add-sku-button-${isCC ? "cc" : "bc"}`;

  const classList = isCC
    ? ["btn", "btn--secondary"]
    : ["btn-reset", "product-buybox__btn"];

  const targetLocation = document.getElementsByClassName(
    isCC ? "add-to-cart" : "js-buybox-actions"
  )[0];

  const newCopySKUButtonPDP = new CopySKUButtonPDP(id, classList).create();

  if (isCC) {
    addOOSAlertToCC();
    targetLocation.appendChild(newCopySKUButtonPDP);
  } else {
    /* Adds container to BC to mimic layout of original buttons */
    const container = new HTMLElem("div", null, [
      "product-buybox__action",
    ]).create();

    container.appendChild(newCopySKUButtonPDP);

    targetLocation.appendChild(container);
  }
};

/**
 * Adds link to get to interchange with current product to check stock.
 */

const addICLinkPDP = () => {
  const target = document.getElementsByClassName("product-sku__id")[0];
  const parentSKU = target.lastChild.innerHTML;

  const linkToIC = new HTMLElem("a", "link-to-ic").create();

  linkToIC.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${parentSKU}`;
  linkToIC.innerText = "Click to go to IC";

  target.appendChild(linkToIC);
};

if (isPDP) {
  addCopySKUButtonPDP();
  if (isCC) {
    addICLinkPDP();
  }
}
