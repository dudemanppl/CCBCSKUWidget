/**
 * Returns new HTML div; the main SKU Widget container.
 *
 * @param {string} productID Seven letter string from CC/BC catalog.
 * @return {Element} SKU Widget.
 */

class PLPWidgetContainer extends HTMLElem {
  constructor(productID, productListing) {
    const newPLPWidgetContainer = super("div", ["plp-widget-container"]);

    newPLPWidgetContainer.append(
      new PLPSelectorDropdownContainer(productID, productListing),
      new WMSLink(productID, ["btn", "btn-reset"])
    );

    return newPLPWidgetContainer;
  }
}

/**
 * Adds the SKU Widget to each element of a given class.
 *
 */

const addPLPWidgets = () => {
  runOnAllElems("js-pli-wrap", (productListing) => {
    const productID = productListing.parentElement.getAttribute(
      "data-product-id"
    );

    const newPDPWidget = new PLPWidgetContainer(productID, productListing);

    const targetLocation = onCompetitiveCyclist
      ? productListing
      : productListing.childNodes[2];

    targetLocation.append(newPDPWidget);
  });
};

if (onPLP) {
  if (!onCompetitiveCyclist) {
    fixBCPLP();
  }

  addPLPWidgets();

  /** Watches for changes on SPA to rerender PLP widgets */
  const targetNode = document.getElementsByClassName(
    onCompetitiveCyclist ? "js-inner-body" : "inner-body"
  )[0];

  new MutationObserver(() => {
    /** Removes zoom-on-hover effect on BC */
    !onCompetitiveCyclist && fixBCPLP();
    addPLPWidgets();
  }).observe(targetNode, { childList: true });
}
