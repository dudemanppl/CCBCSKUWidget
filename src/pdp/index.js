/**
 * Changes styling of dropdown option to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  /** Product obj from DOM as a string */
  const productObjStr = document.getElementsByClassName(
    "kraken-product-script"
  )[0].textContent;

  /** Parses obj string to JS obj */
  const products = JSON.parse(productObjStr.slice(13, productObjStr.length - 1))
    .skusCollection;

  const dropdownOptions = document.getElementsByClassName(
    "js-unifiedropdown-option"
  );

  /** First element is a placeholder */
  for (let i = 1; i < dropdownOptions.length; i += 1) {
    const dropdownOption = dropdownOptions[i];

    const childSKU = dropdownOption.getAttribute("sku-value");
    const { inventory } = products[childSKU];

    /** When item has no inventory, add OOS alert */
    !inventory && dropdownOption.classList.add("oos-alert");
  }
};

/**
 * Adds WMS/CopySKU buttons to PDP.
 */

const addPDPButtons = () => {
  const cc = onCompetitiveCyclist;
  const productID = document.querySelector(
    '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
  ).value;

  const classList = [
    "btn",
    "btn-reset",
    siteString,
    ...(cc
      ? ["btn--secondary", "buy-box__compare-btn"]
      : ["product-buybox__btn"]),
  ];

  const targetLocation = document.getElementsByClassName(
    cc ? "add-to-cart" : "js-buybox-actions"
  )[0];

  const nodesToAppendPDP = [
    new WMSLink(productID, classList),
    new CopySKUButtonPDP("copy-sku-button", classList),
  ];

  if (cc) {
    addOOSAlertToCCPDP();
  } else {
    /** Adds container around each node on BC to match layout */
    for (let node of nodesToAppendPDP) {
      node = new HTMLElem("div", ["product-buybox__action"]).append(node);
    }
  }

  targetLocation.append(...nodesToAppendPDP);
};

if (onPDP) {
  addPDPButtons();
}
