const isCC = window.location.host === "www.competitivecyclist.com";
const isPLP = document.getElementsByClassName("ui-ajaxplp").length;
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
} else {
  deleteAllElems("js-productcomparison-toggle-wrap");
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
 * Returns new button
 */

class Button extends HTMLElem {
  constructor(id, classList, originalText, func) {
    super("button", id, classList);
    this.originalText = originalText;
    this.func = func;
  }

  create() {
    const newButton = super.create();

    newButton.setAttribute("type", "button");
    newButton.innerHTML = this.originalText;

    newButton.addEventListener("mouseenter", () => {
      newButton.innerHTML = "Click to copy";
    });

    newButton.addEventListener("mouseleave", () => {
      newButton.innerHTML = this.originalText;
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

isPLP && addSKUWidget();

class CopySKUButtonPDP extends Button {
  constructor(id, classList) {
    super(id, classList, "Copy SKU", () =>
      navigator.clipboard.writeText(
        isCC
          ? document
              .getElementById("product-variant-select")
              .getAttribute("sku-value")
          : document.querySelector('[itemprop="productID"]').content
      )
    );
  }

  create() {
    return super.create();
  }
}

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
    targetLocation.appendChild(newCopySKUButtonPDP);
  } else {
    /**
     * Adds container to BC to mimic layout of original buttons
     */

    const container = new HTMLElem("div", null, [
      "product-buybox__action",
    ]).create();

    container.appendChild(newCopySKUButtonPDP);

    targetLocation.appendChild(container);
  }
};

isPDP && addCopySKUButtonPDP();
