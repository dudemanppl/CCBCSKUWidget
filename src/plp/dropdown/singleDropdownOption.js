/**
 * Updates pricing shown on PLP if variant pricing changes
 * @param {Element} productListingPrice Reference to the element with pricing information
 * @param {boolean} props.variantSelected Boolean of whether or not an variant has been selected from the current dropdown
 * @param {string} price Sale price of an item
 */

const updatePricing__PLP = (productListingPrice, props, price) => {
  if (
    productListingPrice.firstChild.textContent !== price &&
    !props.variantSelected
  ) {
    /** Removes current elements related to price if variant has not been selected yet */
    while (productListingPrice.lastChild) {
      productListingPrice.lastChild.remove();
    }

    productListingPrice.append(
      HTMLElem("span", classnamesForElem("PLPPrice"), null, price)
    );
    props.variantSelected = true;
  } else {
    productListingPrice.firstChild.textContent = price;
  }
};

/**
 *
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {string} variant Name of the variant of the item
 * @param {string} SKU Child SKU of an item
 */

const copySKU__PLP = (currentOption, variant, SKU) => {
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

/**
 * @param {Element} PLPSelectorDropdownOption Single PLP selector dropdown option
 * @param {object} product Object containing info about an item
 * @param {string} product.price Sale price of an item
 * @param {string} product.SKU Child SKU of an item
 * @param {boolean} product.outOfStock Whether the item is out of stock or not
 * @param {string} product.variant Name of the variant of the item
 * @param {string} product.imageSrc URL of the source of the image of the item
 * @param {object} props Props passed down from parent
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {Element} productListingImg Reference to image of current product listing
 * @param {Element} productListingPrice Reference to the element with pricing information
 * @param {function} highlightCurrSelectedOption Function to change the highlighting of the currently selected variant
 */

const addMethodsToPLPSelectorDropdownOption = (
  PLPSelectorDropdownOption,
  { price, SKU, outOfStock, variant, imageSrc },
  props,
  currentOption,
  [productListingImg, productListingPrice],
  highlightCurrSelectedOption
) => {
  /** Adds OOS alert as necessary*/
  if (outOfStock) PLPSelectorDropdownOption.classList.add("oos-alert");

  PLPSelectorDropdownOption.onmouseenter = () => {
    const newImgSource = `https://content.${
      onCompetitiveCyclist ? "competitivecyclist" : "backcountry"
    }.com${imageSrc}`;

    /** Changes image source if variant image changes */
    if (productListingImg.src !== newImgSource) {
      productListingImg.src = newImgSource;
    }
  };

  PLPSelectorDropdownOption.onclick = () => {
    highlightCurrSelectedOption();
    updatePricing__PLP(productListingPrice, props, price);
    copySKU__PLP(currentOption, variant, SKU);
  };
};

/**
 * Creates single dropdown option
 *
 * @param {Object} product Object containing info about an item
 */

const PLPSelectorDropdownOption = (product, ...params) => {
  const { variant, price } = product;
  const newPLPSelectorDropdownOption = HTMLElem(
    "li",
    ["plp-dropdown-option-single"],
    null,
    `${variant} (${price})`
  );

  addMethodsToPLPSelectorDropdownOption(
    newPLPSelectorDropdownOption,
    product,
    ...params
  );

  return newPLPSelectorDropdownOption;
};
