/**
 * Creates single dropdown option
 *
 * @param {Object} product Object containing info about an item
 * @param {string} product.price Sale price of an item
 * @param {string} product.SKU Child SKU of an item
 * @param {boolean} product.outOfStock Whether the item is out of stock or not
 * @param {string} product.variant Name of the variant of the item
 * @param {string} product.imageSrc URL of the source of the image of the item
 * @param {boolean} variantSelected Boolean of whether or not an variant has been selected from the current dropdown
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {Element} productListingImg Reference to image of current product listing
 * @param {Element} productListingPrice Reference to the element with pricing information
 * @param {function} highlightCurrSelectedOption Function to change the highlighting of the currently selected variant
 */

class PLPSelectorDropdownOption extends HTMLElem {
  constructor(
    { price, SKU, outOfStock, variant, imageSrc },
    props,
    currentOption,
    productListingImg,
    productListingPrice,
    highlightCurrSelectedOption
  ) {
    const newPLPSelectorDropdownOption = super(
      "li",
      ["plp-dropdown-option-single"],
      null,
      `${variant} (${price})`
    );

    /** Adds OOS alert as necessary*/

    if (outOfStock) newPLPSelectorDropdownOption.classList.add("oos-alert");

    const newImgSource = `https://content.${
      onCompetitiveCyclist ? "competitivecyclist" : "backcountry"
    }.com${imageSrc}`;

    newPLPSelectorDropdownOption.onmouseenter = () => {
      /** Changes image source if variant image changes */
      if (productListingImg.src !== newImgSource) {
        productListingImg.src = newImgSource;
      }
    };

    newPLPSelectorDropdownOption.onclick = () => {
      highlightCurrSelectedOption();
      /** Updates pricing shown if variant pricing changes */
      if (productListingPrice.firstChild.textContent !== price) {
        /** Removes current elements related to price if variant has not been selected yet */
        if (!props.variantSelected) {
          while (productListingPrice.lastChild) {
            productListingPrice.lastChild.remove();
          }
          productListingPrice.append(
            new HTMLElem(
              "span",
              [
                "ui-pl-pricing__high-price",
                "ui-pl-pricing--price-retail",
                "js-item-price-high",
                "qa-item-price-high",
              ],
              null,
              price
            )
          );
          props.variantSelected = true;
        } else {
          productListingPrice.firstChild.textContent = price;
        }
      }

      /** Copies SKU to clipboard */
      navigator.clipboard.writeText(SKU);
      /** Shows short notification of copy */
      currentOption.classList.toggle("copy-notif");
      currentOption.textContent = "SKU Copied!";

      setTimeout(() => {
        currentOption.classList.toggle("copy-notif");
        currentOption.textContent = variant;
      }, 300);
    };

    return newPLPSelectorDropdownOption;
  }
}
