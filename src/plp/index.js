/**
 * Returns new HTML div; the main SKU Widget container.
 *
 * @param {string} productID Seven letter string from CC/BC catalog.
 * @param {Element} productListing PLI product listing where widget was added
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
  if (!onCompetitiveCyclist) {
    fixBCPLP();
  }
  runOnAllElems(".js-pli-wrap", (productListing) => {
    const productID = productListing.parentElement.getAttribute(
      "data-product-id"
    );

    const targetLocation = productListing.childNodes[2];
    const newPDPWidget = new PLPWidgetContainer(productID, targetLocation);

    targetLocation.append(newPDPWidget);
  });
};

if (onPLP) {
  addPLPWidgets();

  /** Watches for changes on SPA to rerender PLP widgets */
  const targetNode = document.getElementsByClassName(
    onCompetitiveCyclist ? "js-inner-body" : "inner-body"
  )[0];

  new MutationObserver(() => {
    const nice = performance.now();

    /** Removes zoom-on-hover effect on BC */
    addPLPWidgets();
  }).observe(targetNode, { childList: true });
}
