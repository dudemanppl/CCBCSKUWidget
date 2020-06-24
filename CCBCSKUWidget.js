/**
 * Boolean of if the current URL is Competitive Cyclist or not.
 */

const isCC = window.location.host === "www.competitivecyclist.com";

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
  runOnAllElems("js-pl-expandable", item => {
    const { style } = item;

    style.top = "10px";
    style.left = "10px";
    style.right = "10px";
    style.bottom = "10px";
  });
} else {
  deleteAllElems("js-productcomparison-toggle-wrap");
}

/**
 * Runs function, repeats after certain amount of time.
 *
 * @param {number} time Time in ms until it is toggled back on.
 * @param {function} func1 Function to be run.
 * @param {function} [func2] Function to undo first function
 */

const toggle = (time, func1, func2) => {
  func1();
  /**
   * If second function not specified, assume the first function is a function that toggles.
   */
  setTimeout(func2 ? func2 : func1, time);
};

/**
 * Returns new HTML element given a tagName.
 *
 * @param {string} tagName HTML tag name.
 * @param {string} [id] Id for HTML element.
 * @return {Element} New HTML element with tag name.
 */

class HTMLElem {
  constructor(tagName, id) {
    this.tagName = tagName;
    this.id = id;
  }

  create() {
    const newHTMLElem = document.createElement(this.tagName);

    if (this.id) {
      newHTMLElem.id = this.id;
    }

    return newHTMLElem;
  }
}

/**
 * Returns new div HTML element with optional classnames.
 *
 * @param {string} [id] Id for HTML element.
 * @param {string} [classList] Comma seperated values of desired classes to add.
 * @return {Element} New div HTML element.
 */

class Div extends HTMLElem {
  constructor(id, classList) {
    super("div", id);
    this.classList = classList;
  }

  create() {
    const newDiv = super.create();

    if (this.classList) {
      newDiv.classList.add(this.classList);
    }

    return newDiv;
  }
}

/**
 * Returns new HTML div; has an id of hidden-div
 *
 * @param {string} [text] Optional text to be placed inside.
 * @return {Element} New div HTML element with id
 */

class HiddenDiv extends Div {
  constructor(text) {
    super("hidden-div");
    this.text = text;
  }

  create() {
    const newHiddenDiv = super.create();

    if (this.text) {
      newHiddenDiv.innerHTML = this.text;
    }

    return newHiddenDiv;
  }
}

/**
 * Returns new HTML div; has an id of overlay.
 *
 * @param {string} [text] Optional text inside the overlay.
 * @return {Element} Overlay.
 */

class Overlay extends Div {
  constructor(text) {
    super("overlay");
    this.text = text;
  }

  create() {
    const newOverlay = super.create();
    const hiddenDiv = new HiddenDiv(this.text).create();

    newOverlay.appendChild(hiddenDiv);

    return newOverlay;
  }
}

/**
 * Returns new HTML div; displays product ID, can click to copy to clipboard
 *
 * @param {string} productID Seven letter string from CC/BC catalog.
 * @return {Element} Product ID Button.
 */

class ProductIDButton extends Div {
  constructor(productID) {
    super("product-id-button");
    this.productID = productID;
  }

  create() {
    const newProductIDButton = super.create();
    const overlay = new Overlay("Click to copy").create();

    newProductIDButton.innerHTML = this.productID;
    overlay.appendChild(newProductIDButton);

    overlay.onclick = () => {
      navigator.clipboard.writeText(this.productID);
      toggle(
        60,
        () => (overlay.style.backgroundColor = "black"),
        () => (overlay.style.backgroundColor = null)
      );
      overlay.firstChild.innerHTML = "Copied!";
    };

    // Resets text on hover
    overlay.addEventListener(
      "mouseleave",
      () => (overlay.firstChild.innerHTML = "Click to copy")
    );

    return overlay;
  }
}

/**
 * Returns new HTML div; the main SKU Widget container.
 *
 * @param {string} productID Seven letter string from CC/BC catalog.
 * @return {Element} SKU Widget.
 */

class SKUWidgetContainer extends Div {
  constructor(productID) {
    super("sku-widget-container");
    this.productID = productID;
  }

  create() {
    const newSKUWidgetContainer = super.create();
    const productIDBtn = new ProductIDButton(this.productID).create();

    newSKUWidgetContainer.appendChild(productIDBtn);

    return newSKUWidgetContainer;
  }
}

/**
 * Adds the SKU Widget to each element of a given class.
 *
 * @param {string} elemClassName HTML element class.
 */

const addSKUWidget = elemClassName => {
  runOnAllElems(elemClassName, elem => {
    const productID = elem.getAttribute("data-product-id");
    const SKUWidget = new SKUWidgetContainer(productID).create();
    const targetLocation = isCC
      ? elem.firstChild
      : elem.firstChild.childNodes[2];

    targetLocation.appendChild(SKUWidget);
  });
};

addSKUWidget("js-product-listing");
