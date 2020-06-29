const isCC = window.location.host === "www.competitivecyclist.com";
const isPLP =
  document.getElementsByClassName("ui-ajaxplp").length ||
  document.getElementsByClassName("ui-product-listing-grid");
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
    });

    newButton.onclick = () => {
      newButton.style.backgroundColor = isCC ? "white" : "black";

      setTimeout(() => (newButton.style.backgroundColor = null), 100);

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
 * Returns copy child SKU button on the PDP
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 */

class CopySKUButtonPDP extends Button {
  constructor(id, classList) {
    super(id, classList, "Copy SKU", () => {
      const SKU = isCC
        ? document
            .getElementById("product-variant-select")
            .getAttribute("sku-value")
        : document.getElementsByClassName("js-selected-product-variant")[0]
            .value;

      navigator.clipboard.writeText(SKU);
    });
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
    // console.log(dropdownOption.lastChild);

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
