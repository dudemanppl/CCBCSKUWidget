/**
 * Creates single dropdown option
 *
 * @param {object} product Object containing info about an item
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {Element} productListingImg Reference to image of current product listing
 * @param {Element} productListingPrice Reference to the element with pricing information
 */

class PLPSelectorDropdownOption extends HTMLElem {
  constructor(
    {
      salePrice,
      id: SKU,
      availability: { stockLevel },
      title: variantName,
      image: { url: imageSrc },
    },
    currentOption,
    productListingImg,
    productListingPrice,
    idx,
    highlightCurrSelectedOption
  ) {
    const priceStr = strToUSD(salePrice);
    const variantPriceStr = `${variantName} (${priceStr})`;

    const newPLPSelectorDropdownOption = super(
      "li",
      ["plp-dropdown-option-single"],
      null,
      variantPriceStr
    );

    /** Adds OOS alert as necessary*/

    if (!stockLevel) newPLPSelectorDropdownOption.classList.add("oos-alert");

    const newImgSource = window.location.origin + imageSrc;

    newPLPSelectorDropdownOption.addEventListener("mouseenter", () => {
      /** Changes image source if variant image changes */
      if (productListingImg.src !== newImgSource) {
        productListingImg.src = newImgSource;
      }
    });

    newPLPSelectorDropdownOption.onclick = () => {
      highlightCurrSelectedOption(idx);
      /** Changes pricing shown if variant pricing changes */
      if (productListingPrice.firstChild.textContent !== priceStr) {
        /** Removes current elements related to price */
        while (productListingPrice.lastChild) {
          productListingPrice.lastChild.remove();
        }

        const priceElem = new HTMLElem(
          "span",
          [
            "ui-pl-pricing__high-price",
            "ui-pl-pricing--price-retail",
            "js-item-price-high",
            "qa-item-price-high",
          ],
          null,
          priceStr
        );

        productListingPrice.append(priceElem);
      }

      /** Copies SKU to clipboard */
      navigator.clipboard.writeText(SKU);
      /** Shows short notification of copy */
      currentOption.classList.toggle("copy-notif");
      currentOption.textContent = "SKU Copied!";

      setTimeout(() => {
        currentOption.classList.toggle("copy-notif");
        currentOption.textContent = variantPriceStr;
      }, 300);
    };

    return newPLPSelectorDropdownOption;
  }
}
