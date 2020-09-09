/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  const scriptToInject = () => {
    for (const variant of document.getElementsByClassName(
      "js-unifiedropdown-option"
    )) {
      const SKU = variant.getAttribute("sku-value");
      SKU &&
        !BC.product.skusCollection[SKU].inventory &&
        variant.classList.add("oos-alert");
    }
  };
  
  const scriptElem = HTMLElem("script", null, null, scriptToInject.toString());

  document.head.append(scriptElem);
  scriptElem.remove();
};

/**
 * Adds WMS/CopySKU buttons to PDP.
 */

if (onPDP) {
  const cc = onCompetitiveCyclist;
  const productID = document.querySelector(
    '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
  ).value;

  const targetLocation = document.getElementsByClassName(
    cc ? "add-to-cart" : "js-buybox-actions"
  )[0];

  if (cc) addOOSAlertToCCPDP();

  targetLocation.append(WMSLink(productID), CopySKUButtonPDP());
}
