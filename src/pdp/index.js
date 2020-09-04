/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 */

const addOOSAlertToCCPDP = () => {
  const scriptToInject = `for(const a of document.getElementsByClassName("js-unifiedropdown-option")){const b=a.getAttribute("sku-value");b&&!BC.product.skusCollection[b].inventory&&a.classList.add("oos-alert")}`;
  const scriptElem = new HTMLElem("script", null, null, scriptToInject);

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

  targetLocation.append(new WMSLink(productID), new CopySKUButtonPDP());
}
