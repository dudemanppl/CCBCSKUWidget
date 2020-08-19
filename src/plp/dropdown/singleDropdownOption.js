/**
 * Creates single dropdown option
 *
 * @param {object} product Object containing info about an item
 * @param {Elem} currentOption Reference to HTML elem with the current option chosen
 */

class PLPSelectorDropdownOption extends HTMLElem {
  constructor(product, currentOption) {
    const newPLPSelectorDropdownOption = super("li", [
      "plp-dropdown-option-single",
    ]);

    const {
      salePrice,
      id: SKU,
      availability: { stockLevel },
      title: variantName,
    } = product;

    /** Adds OOS alert as necessary*/

    !stockLevel && newPLPSelectorDropdownOption.classList.add("oos-alert");

    const variantPriceStr = `${variantName} (${strToUSD(salePrice)})`;

    newPLPSelectorDropdownOption.innerText = variantPriceStr;

    /** Sets current option shown to the selected variant, shows small notification that the item was selected */

    newPLPSelectorDropdownOption.onclick = () => {
      navigator.clipboard.writeText(SKU);
      currentOption.classList.add("copy-notif");
      currentOption.innerText = "SKU Copied!";

      setTimeout(() => {
        currentOption.classList.remove("copy-notif");
        currentOption.innerText = variantPriceStr;
      }, 300);
    };

    return newPLPSelectorDropdownOption;
  }
}
