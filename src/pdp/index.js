/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 *
 * ONLY WORKS IN WINDOW CONTEXT
 */

const addOOSAlertToCCPDP = () => {
  for (const dropdownOption of document.getElementsByClassName(
    'js-unifiedropdown-option'
  )) {
    const SKU = dropdownOption.getAttribute('sku-value');

    if (SKU && !BC.product.skusCollection[SKU].inventory) {
      dropdownOption.classList.add('oos-alert');
    }
  }
};

/**
 * @param {function} func Anonymous ES6 function with no args
 * @return {string}
 */

const anonFuncToStr = (func) => func.toString().slice(5, -1);

/**
 * Invokes an anonymous function that requires window context then removes traces of it
 *
 * @param {function} func Anonymous ES6 function with no args
 */

const invokeFuncInWindow = (func) => {
  const scriptElem = HTMLElem('script', null, null, anonFuncToStr(func));

  document.head.append(scriptElem);
  scriptElem.remove();
};

/**
 * @return {Element} Target location to add PDP buttons to
 */

const PDPTargetLocation = () => {
  const [targetLocation] = document.getElementsByClassName(
    onCompetitiveCyclist ? 'add-to-cart' : 'js-buybox-actions'
  );

  return targetLocation;
};

/**
 * @return {string} Parent SKU of the PDP shown
 */

const PDPProductID = () => {
  const { value: productID } = document.querySelector(
    '[name ="/atg/commerce/order/purchase/CartModifierFormHandler.productId"]'
  );

  return productID;
};

if (onPDP) {
  if (onCompetitiveCyclist) invokeFuncInWindow(addOOSAlertToCCPDP);

  PDPTargetLocation().append(WMSLink(PDPProductID()), copySKUButton());
}
