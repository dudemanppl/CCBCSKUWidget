/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  const scriptToInject = `
    for (const dropdownOption of document.getElementsByClassName(
      "js-unifiedropdown-option"
    )) {
      const SKU = dropdownOption.getAttribute("sku-value");

      /** Adds OOS alert as necessary */
      if (SKU) {
        !BC.product.skusCollection[SKU].inventory &&
          dropdownOption.classList.add("oos-alert");
      }
    }
  `;
  const scriptElem = new HTMLElem("script", null, null, scriptToInject);

  document.head.append(scriptElem);
  scriptElem.remove();
};

/**
 * Adds WMS/CopySKU buttons to PDP.
 */

const addPDPButtons = () => {
  const cc = onCompetitiveCyclist;
  const productID = document.querySelector(
    '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
  ).value;

  const targetLocation = document.getElementsByClassName(
    cc ? "add-to-cart" : "js-buybox-actions"
  )[0];

  const nodesToAppendPDP = [new WMSLink(productID), new CopySKUButtonPDP()];

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
