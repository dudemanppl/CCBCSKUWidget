import { HTMLElem, HTMLElemOptions } from '../../index';

/**
 * Changes styling of dropdown options to reflect OOS status on CC PDP
 *
 * ONLY WORKS IN WINDOW CONTEXT
 */

// const addOOSAlertToCCPDP = () => {
//   for (const dropdownOption: HTMLElement of document.getElementsByClassName(
//     'js-unifiedropdown-option'
//   )) {
//     const SKU: string = dropdownOption.getAttribute('sku-value');

//     if (SKU && !BC.product.skusCollection[SKU].inventory) {
//       dropdownOption.classList.add('oos-alert');
//     }
//   }
// };

class ScriptElem extends HTMLElem {
  ScriptElem: HTMLScriptElement;

  constructor(func: Function) {
    const scriptElemOptions: HTMLElemOptions = {
      tagName: 'script',
    };

    super(scriptElemOptions);

    const functionAsString: string = this.anonFuncToStr(func);

    this.ScriptElem = <HTMLScriptElement>this.HTMLElem;
    this.ScriptElem.textContent = functionAsString;
  }

  /**
   * @param {function} func Minified anonymous ES6 function with no args
   * @return {string}
   */

  anonFuncToStr(func: Function): string {
    return func.toString().slice(5, -1);
  }
}

const invokeFuncInWindow = (func: Function) => {
  const scriptElem: HTMLScriptElement = new ScriptElem(func);

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

/* istanbul ignore next */
if (onPDP) {
  if (onCompetitiveCyclist) invokeFuncInWindow(addOOSAlertToCCPDP);

  PDPTargetLocation().append(WMSLink(PDPProductID()), copySKUButton());
}

// removeIf(production)
module.exports = {
  addOOSAlertToCCPDP,
  anonFuncToStr,
  invokeFuncInWindow,
  PDPTargetLocation,
  PDPProductID,
};
// endRemoveIf(production)
