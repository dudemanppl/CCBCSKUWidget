/**
 * Runs a function on each element of a given class
 *
 * @param {string} elemClassName HTML element class
 * @callback func
 */

const runOnAllElemsofClass = (elemClassName, func) => {
  const elems = [...document.getElementsByClassName(elemClassName)];

  for (const elem of elems) {
    func(elem);
  }
};

/**
 * Deletes all elements of a given class
 *
 * @param {string} elemClassName HTML element class
 */

const deleteAllElemsOfClass = (elemClassName) => {
  runOnAllElemsofClass(elemClassName, (elem) => elem.remove());
};

/**
 * Creates main SKU Widget container for PLP
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 */

const PLPWidgetContainer = (productID, productListing) => {
  const newPLPWidgetContainer = HTMLElem("div", ["plp-widget-container"]);

  newPLPWidgetContainer.append(
    PLPSelectorDropdownContainer(productID, productListing),
    WMSLink(productID)
  );

  return newPLPWidgetContainer;
};

/**
 * Adds SKU Widgets to DOM
 */

const addPLPWidgets = () => {
  if (!onCompetitiveCyclist) {
    /**
     * Forces styling on BC to prevent onhover zoom effect, which sorta messes with the extension.
     */

    deleteAllElemsOfClass("js-pl-focus-trigger");
    deleteAllElemsOfClass("js-pl-color-thumbs");
    deleteAllElemsOfClass("js-pl-sizes-wrap");
    runOnAllElemsofClass("js-pl-expandable", ({ style }) => {
      style.top = "10px";
      style.left = "10px";
      style.right = "10px";
      style.bottom = "10px";
    });
  }

  runOnAllElemsofClass("js-pli-wrap", (productListing) => {
    const productID = productListing.parentElement.getAttribute(
      "data-product-id"
    );
    const targetLocation = productListing.childNodes[2];

    targetLocation.append(new PLPWidgetContainer(productID, targetLocation));
  });
};

if (onPLP) {
  addPLPWidgets();

  /** Watches for changes on SPA to rerender PLP widgets */
  const targetNode = document.getElementsByClassName(
    onCompetitiveCyclist ? "js-inner-body" : "inner-body"
  )[0];

  new MutationObserver(() => {
    addPLPWidgets();
  }).observe(targetNode, { childList: true });
}
