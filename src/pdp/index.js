/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  const scriptToInject = `
    for (const variant of document.getElementsByClassName(
      "js-unifiedropdown-option"
    )) {
      const SKU = variant.getAttribute("sku-value");
      SKU &&
        !BC.product.skusCollection[SKU].inventory &&
        variant.classList.add("oos-alert");
    }`;

  const scriptElem = HTMLElem("script", null, null, scriptToInject);

  document.head.append(scriptElem);
  scriptElem.remove();
};

const [PDPTargetLocation] = document.getElementsByClassName(
  onCompetitiveCyclist ? "add-to-cart" : "js-buybox-actions"
);

const PDPProductID = document.querySelector(
  '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
).value;

/**
 * Adds WMS/CopySKU buttons to PDP.
 */

if (onPDP) {
  if (onCompetitiveCyclist) addOOSAlertToCCPDP();

  PDPTargetLocation.append(WMSLink(PDPProductID), copySKUButtonPDP());
}
