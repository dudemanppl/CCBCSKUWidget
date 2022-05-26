/**
 * Updates pricing shown on PLP if variant pricing changes
 * @param {Element} productListingPrice Reference to the element with pricing information
 * @param {string} price Sale price of an item
 * @param {number} discount Discount in percentage from MSRP
 */

const updatePricingPLP = (productListingPrice, price, discount) => {
  // updates discount percentage, needs more fleshing out tho 
  
  // const {
  //   nextSibling: { lastChild: discountElem },
  // } = productListingPrice;

  // if (discountElem) {
  //   while (discountElem.lastChild) {
  //     discountElem.lastChild.remove();
  //   }
  //   discountElem.textContent = `${discount}% off`;
  // }

  if (productListingPrice.textContent !== price) {
    /** Removes current elements related to price if variant has not been selected yet */
    while (productListingPrice.lastChild) {
      productListingPrice.lastChild.remove();
    }

    productListingPrice.textContent = price;
  }
};

/**
 *
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {string} variant Name of the variant of the item
 * @param {string} SKU Child SKU of an item
 */

const copySKUPLP = (currentOption, variant, SKU) => {
  /** Copies SKU to clipboard */
  navigator.clipboard.writeText(SKU);
  /** Shows short notification of copy */
  currentOption.classList.toggle('copy-notif');
  currentOption.textContent = 'SKU Copied!';

  setTimeout(() => {
    currentOption.classList.toggle('copy-notif');
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

const singleOptionEventHandlers = (
  PLPSelectorDropdownOption,
  { price, discount, SKU, outOfStock, variant, imageSrc },
  props,
  currentOption,
  [productListingImg, productListingPrice],
  highlightCurrSelectedOption
) => {
  /** Adds OOS alert as necessary */
  if (outOfStock) PLPSelectorDropdownOption.classList.add('oos-alert');

  PLPSelectorDropdownOption.onmouseenter = () => {
    /** Changes image source if variant image changes */
    if (productListingImg.src !== imageSrc) {
      productListingImg.src = imageSrc;
    }
  };

  PLPSelectorDropdownOption.onclick = () => {
    highlightCurrSelectedOption();
    updatePricingPLP(productListingPrice, price, discount);
    copySKUPLP(currentOption, variant, SKU);
    props.variantImgSrc = imageSrc;
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
    'li',
    ['plp-dropdown-option-single'],
    null,
    `${variant} (${price})`
  );

  singleOptionEventHandlers(newPLPSelectorDropdownOption, product, ...params);

  return newPLPSelectorDropdownOption;
};
