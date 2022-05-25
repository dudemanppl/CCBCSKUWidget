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
  const imgSrc = productListing.querySelector('img').src;
  const sliceStart = onCompetitiveCyclist ? 60 : 53;
  const sliceIndexs = [sliceStart, sliceStart + 7];

  const productID = imgSrc.slice(...sliceIndexs);

  const targetLocation = productListing.lastChild;

  targetLocation.append(PLPWidgetContainer(productID, targetLocation));
};

/**
 * Adds all widgets to DOM
 */

const addAllPLPWidgets = () => {
  const PLPItems = document.querySelectorAll('[data-id="productListingItems"]');

  for (const productListing of PLPItems) {
    addPLPSingleWidget(productListing);
  }
};

if (onPLP) {
  addAllPLPWidgets();

  const nodeToObservePLP = document.querySelector('[data-id="productsWrap"]');

  /** Watches for changes on SPA to rerender PLP widgets */
  new MutationObserver(() => addAllPLPWidgets()).observe(nodeToObservePLP, {
    childList: true,
  });
}
