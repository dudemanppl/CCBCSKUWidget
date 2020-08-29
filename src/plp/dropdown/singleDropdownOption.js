/**
 * Creates single dropdown option
 *
 * @param {object} product Object containing info about an item
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {Element} productListingImg Reference to image of current product listing
 * @param {Element} productListingPrice Reference to the element with pricing information
 */

class PLPSelectorDropdownOption extends HTMLElem {
  constructor(product, currentOption, productListingImg, productListingPrice) {
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

    const priceStr = strToUSD(salePrice);

    const variantPriceStr = `${variantName} (${priceStr})`;

    newPLPSelectorDropdownOption.textContent = variantPriceStr;

    const imgSrcStr = `https://content.${
      onCompetitiveCyclist ? "competitivecyclist" : "backcountry"
    }.com${imageSrc}`;

    /** Sets current option shown to the selected variant, shows small notification that the item was selected */

    newPLPSelectorDropdownOption.onclick = () => {
      /** Changes image source if variant image changes */
      if (productListingImg.src !== imgSrcStr) {
        productListingImg.src = imgSrcStr;
      }
      /** Changes pricing shown if variant pricing changes */
      if (productListingPrice.firstChild.textContent !== priceStr) {
        while (productListingPrice.lastChild)
          productListingPrice.lastChild.remove();

        const pricingSpan = new HTMLElem("span", [
          "ui-pl-pricing__high-price",
          "ui-pl-pricing--price-retail",
          "js-item-price-high",
          "qa-item-price-high",
        ]);

        pricingSpan.textContent = priceStr;

        productListingPrice.appendChild(pricingSpan);
      }

      /** Copies SKU to clipboard */
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
