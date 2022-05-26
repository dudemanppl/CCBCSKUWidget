/**
 * Creates a button that links to WMS inventory page of desired product ID
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 */

 const WMSLinkPDP = (productID) => {
  const newWMSLinkPDP = HTMLElem(
    'a',
    ['btn', 'btn-reset', 'plp', 'link-to-wms', siteString],
    null,
    'Go to WMS'
  );

  newWMSLinkPDP.setAttribute('type', 'button');
  newWMSLinkPDP.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

  return newWMSLinkPDP;
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
    WMSLinkPDP(productID)
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
