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
  deleteAllElemsOfClass('ui-pl-info');
  deleteAllElemsOfClass('js-pl-color-thumbs');
  deleteAllElemsOfClass('js-pl-sizes-wrap');
};

/**
 * Creates main SKU Widget container for PLP
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLP product listing where widget was added
 */

const PLPWidgetContainer = (productID, productListing) => {
  const newPLPWidgetContainer = HTMLElem('div', [
    'plp-widget-container',
    siteString,
  ]);

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
  const productID = productListing.getAttribute('data-product-id');
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
  runOnAllElemsOfClass(
    onBCActivityPage ? 'ui-product-listing' : 'js-product-listing',
    addPLPSingleWidget
  );
};

/**
 * @return {Element} Node to observe for changes on the PLP
 */

const nodeToObservePLP = () => {
  const [nodeToObserve] = document.getElementsByClassName(
    onCompetitiveCyclist
      ? 'js-inner-body'
      : onBCActivityPage
      ? 'product-listing__wrapper'
      : 'inner-body'
  );

  return nodeToObserve;
};

/* istanbul ignore next */
if (onPLP || onBCActivityPage) {
  addAllPLPWidgets();

  /** Watches for changes on SPA to rerender PLP widgets */
  new MutationObserver(() => addAllPLPWidgets()).observe(nodeToObservePLP(), {
    childList: true,
  });
}

// removeIf(production)
module.exports = {
  runOnAllElemsOfClass,
  deleteAllElemsOfClass,
  fixBCStyling,
  PLPWidgetContainer,
  addPLPSingleWidget,
  addAllPLPWidgets,
  nodeToObservePLP,
};
// endRemoveIf(production)
