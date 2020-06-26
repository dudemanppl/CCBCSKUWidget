const c = className => {
  return document.getElementsByClassName(className);
};

const isCC = window.location.host === "www.competitivecyclist.com";
const isPLP = c("ui-product-listing-grid").length || c("ui-ajaxplp").length;
const isPDP = c("js-kraken-pdp-body").length;

/**
 * Runs a function on each element of a given class.
 *
 * @param {string} elemClassName HTML element class.
 * @param {function} func Function to be run on each element.
 */

const runOnAllElems = (elemClassName, func) => {
  const elems = c(elemClassName);

  for (const elem of [...elems]) {
    func(elem);
  }
};

/**
 * Deletes all elements of a given class.
 *
 * @param {string} elemClassNames HTML element class.
 */

const deleteAllElems = ([...elemClassNames]) => {
  for (const elemClassName of elemClassNames) {
    runOnAllElems(elemClassName, elem => elem.remove());
  }
};

/**
 * Forces styling on BC PLP to prevent onhover zoom effect, which sorta messes with the extension.
 */

const forceStyles = () => {
  if (!isCC) {
    deleteAllElems([
      "js-pl-focus-trigger",
      "js-pl-color-thumbs",
      "js-pl-sizes-wrap",
      "js-pl-sizes-wrap",
    ]);

    runOnAllElems("js-pl-expandable", elem => {
      const { style } = elem;

      style.top = "10px";
      style.left = "10px";
      style.right = "10px";
      style.bottom = "10px";
    });
  }
};

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
  constructor(id, classList, text, func) {
    super("button", id, classList);
    this.text = text;
    this.func = func;
  }

  create() {
    const newButton = super.create();

    newButton.setAttribute("type", "button");
    newButton.innerHTML = this.text;

    newButton.addEventListener("mouseenter", () => {
      newButton.innerHTML = "Click to copy";
    });

    newButton.addEventListener("mouseleave", () => {
      newButton.innerHTML = this.text;
      newButton.removeAttribute("style");
    });

    newButton.onclick = () => {
      newButton.style.backgroundColor = isCC ? "white" : "black";

      setTimeout(() => newButton.removeAttribute("style"), 100);

      newButton.innerHTML = "Copied!";

      this.func();
    };

    return newButton;
  }
}

/**
 * Returns copy product id (parent SKU) button for the PLP
 *
 * @param {string} productID Product ID to be copied to clipboard.
 */

class CopyProductIDButtonPLP extends Button {
  constructor(productID) {
    super("product-id-button", ["btn-reset", "btn"], productID, () =>
      navigator.clipboard.writeText(productID)
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
 * Adds the SKU widget to each item of the PLP and forces styling
 *
 */

const addSKUWidgetPLP = () => {
  if (isCC) deleteAllElems("js-productcomparison-toggle-wrap");

  forceStyles();
  runOnAllElems("js-product-listing", elem => {
    const productID = elem.getAttribute("data-product-id");
    const SKUWidget = new SKUWidgetContainer(productID).create();
    const targetLocation = isCC
      ? elem.firstChild
      : elem.firstChild.childNodes[2];

    targetLocation.appendChild(SKUWidget);
  });
};

isPLP && addSKUWidgetPLP();

/**
 * Copies current item variant to clipboard, otherwise changes styling of a given element.
 *
 * @param {string} id Id of elem to target.
 */

const copyCurrVariant = id => {
  const SKU = isCC
    ? document
        .getElementById("product-variant-select")
        .getAttribute("sku-value")
    : c("js-selected-product-variant")[0].value;

  if (SKU) {
    navigator.clipboard.writeText(SKU);
  } else {
    const elem = document.getElementById(id);
    const { style } = elem;

    style.backgroundColor = isCC ? "white" : "black";
    style.color = "red";
    elem.innerHTML = "Select a variant!";
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
    super(id, classList, "Copy SKU", () => copyCurrVariant(id));
  }

  create() {
    return super.create();
  }
}

/**
 * Adds OOS alert on item dropdown when item is out of stock on CC.
 */

const addOOSAlertToCC = () => {
  const variantsObjStr = c("kraken-product-script")[0].textContent;

  const variants = JSON.parse(
    variantsObjStr.slice(13, variantsObjStr.length - 1)
  ).skusCollection;

  const dropdownOptions = c("js-unifiedropdown-option");

  /** First element is a placeholder, so skip that. */
  for (let i = 1; i < dropdownOptions.length; i += 1) {
    const dropdownOption = dropdownOptions[i];

    const childSKU = dropdownOption.getAttribute("sku-value");
    const stockLevel = variants[childSKU].inventory;

    /** Add OOS alert to dropdown option if no stock. */
    if (!stockLevel) {
      const OOSAlert = new HTMLElem("div", "oos-alert", [
        "ui-basedropdown-option-value",
        "ui-unifiedropdown-option-value",
      ]).create();

      OOSAlert.innerHTML = "OOS";

      dropdownOption.appendChild(OOSAlert);
      dropdownOption.style.backgroundColor = "lightgrey";
    }
  }
};

/**
 * Adds SKU widget to the PDP.
 */

const addSKUWidgetPDP = () => {
  if (isCC) deleteAllElems("js-productcomparison-toggle-wrap");

  const id = `add-sku-button-${isCC ? "cc" : "bc"}`;

  const classList = isCC
    ? ["btn", "btn--secondary"]
    : ["btn-reset", "product-buybox__btn"];

  const targetLocation = c(isCC ? "add-to-cart" : "js-buybox-actions")[0];

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

isPDP && addSKUWidgetPDP();
