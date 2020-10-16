/**
 * Runs a function on each element of a given class
 *
 * @param {string} elemClassName HTML element class
 * @callback func
 */

const runOnAllElemsOfClass = (elemClassName, func) => {
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
  runOnAllElemsOfClass(elemClassName, (elem) => elem.remove());
};

/**
 * Forces styling on BC to prevent onhover zoom effect, which sorta messes with the extension.
 */

const fixBCStyling = () => {
  deleteAllElemsOfClass("js-pl-focus-trigger");
  deleteAllElemsOfClass("js-pl-color-thumbs");
  deleteAllElemsOfClass("js-pl-sizes-wrap");
  runOnAllElemsOfClass("js-pl-expandable", ({ style }) => {
    style.top = "10px";
    style.right = "10px";
    style.bottom = "10px";
    style.left = "10px";
  });
};

/**
 * Creates main SKU Widget container for PLP
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLP product listing where widget was added
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
 * Adds single widget to the PLP
 *
 * @param {Element} productListing PLP product listing
 */

const addPLPSingleWidget = (productListing) => {
  const productID = productListing.getAttribute("data-product-id");
  const targetLocation = productListing.firstChild;

  targetLocation.append(PLPWidgetContainer(productID, targetLocation));
};

/**
 * Adds all widgets to DOM
 */

const addAllPLPWidgets = () => {
  if (!onCompetitiveCyclist) {
    fixBCStyling();
  }
  runOnAllElemsOfClass("js-product-listing", (productListing) =>
    addPLPSingleWidget(productListing)
  );
};

/**
 * @return {Element} Node to observe for changes on the PLP
 */

const nodeToObservePLP = () => {
  const [nodeToObserve] = document.getElementsByClassName(
    onCompetitiveCyclist ? "js-inner-body" : "inner-body"
  );

  return nodeToObserve;
};

if (onPLP) {
  addAllPLPWidgets();

  /** Watches for changes on SPA to rerender PLP widgets */
  new MutationObserver(() => addAllPLPWidgets()).observe(nodeToObservePLP(), {
    childList: true,
  });
}

//removeIf(production)
module.exports = {
  runOnAllElemsOfClass,
  deleteAllElemsOfClass,
  fixBCStyling,
  PLPWidgetContainer,
  addPLPSingleWidget,
  addAllPLPWidgets,
  nodeToObservePLP,
};
//endRemoveIf(production)
