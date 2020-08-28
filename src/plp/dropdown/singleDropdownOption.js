/**
 * Creates single dropdown option
 *
 * @param {object} product Object containing info about an item
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {Element} productListing PLI product listing where widget was added
 */

class PLPSelectorDropdownOption extends HTMLElem {
  constructor(product, currentOption, productListingImg) {
    const newPLPSelectorDropdownOption = super("li", [
      "plp-dropdown-option-single",
    ]);

    const {
      salePrice,
      id: SKU,
      availability: { stockLevel },
      title: variantName,
      image: { url: imageSrc },
    } = product;

    /** Adds OOS alert as necessary*/

    if (!stockLevel) newPLPSelectorDropdownOption.classList.add("oos-alert");

    const variantPriceStr = `${variantName} (${strToUSD(salePrice)})`;

    newPLPSelectorDropdownOption.textContent = variantPriceStr;

    /** Sets current option shown to the selected variant, shows small notification that the item was selected */

    newPLPSelectorDropdownOption.onclick = () => {
      const imgSrcStr = `https://content.${
        onCompetitiveCyclist ? "competitivecyclist" : "backcountry"
      }.com${imageSrc}`;

      /** Changes image source if variant image changes */
      if (productListingImg.src !== imgSrcStr) {
        productListingImg.src = imgSrcStr;
      }

      navigator.clipboard.writeText(SKU);
      currentOption.classList.add("copy-notif");
      currentOption.textContent = "SKU Copied!";

      setTimeout(() => {
        currentOption.classList.remove("copy-notif");
        currentOption.textContent = variantPriceStr;
      }, 300);
    };

    return newPLPSelectorDropdownOption;
  }
}
