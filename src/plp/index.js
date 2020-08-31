/**
 * Creates main SKU Widget container for PLP
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 */

class PLPWidgetContainer extends HTMLElem {
  constructor(productID, productListing) {
    const newPLPWidgetContainer = super("div", ["plp-widget-container"]);

    newPLPWidgetContainer.append(
      new PLPSelectorDropdownContainer(productID, productListing),
      new WMSLink(productID)
    );

    return newPLPWidgetContainer;
  }
}

/**
 * Adds SKU Widgets to DOM
 */

const addPLPWidgets = () => {
  if (!onCompetitiveCyclist) {
    fixBCPLP();
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
