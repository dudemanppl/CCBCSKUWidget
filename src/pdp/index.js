/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  const scriptToInject = `for(const a of document.getElementsByClassName("js-unifiedropdown-option")){const b=a.getAttribute("sku-value");b&&!BC.product.skusCollection[b].inventory&&a.classList.add("oos-alert")}`;

  const scriptElem = HTMLElem("script", null, null, scriptToInject);

  document.head.append(scriptElem);
  scriptElem.remove();
};

const PDPTargetLocation = () =>
  document.getElementsByClassName(
    onCompetitiveCyclist ? "add-to-cart" : "js-buybox-actions"
  )[0];

const PDPProductID = () =>
  document.querySelector(
    '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
  ).value;

/**
 * Adds WMS/CopySKU buttons to PDP.
 */

if (onPDP) {
  if (onCompetitiveCyclist) addOOSAlertToCCPDP();

  PDPTargetLocation().append(WMSLink(PDPProductID()), copySKUButton());
}
