/**
 * Returns JSON response of HTTP get request
 *
 * @param {string} url URL to send request to
 * @return {Object}
 */

const fetchJson = async (url) => {
  const response = await fetch(url);
  const json = response.json();

  return json;
};

/**
 * Returns item information for a product ID from CC/BC catalog
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @return {Object}
 */

const getItemInfo = async (productID) => {
  const url = `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=${
    onCompetitiveCyclist ? 'competitivecyclist' : 'bcs'
  }`;
  const itemInfo = await fetchJson(url);

  return itemInfo;
};

/**
 * Returns array of variants for a product id
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @return {Object[]}
 */

const getVariants = async (productID) => {
  const itemInfo = await getItemInfo(productID);

  const {
    products: [{ skus: variants }],
  } = itemInfo;

  return variants;
};

/**
 * Formats number in to string in form of $xx.xx
 *
 * @param {number} num
 * @return {string} In form of $xx.xx
 */

const usdString = (num) => {
  const usdString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(num);

  return usdString;
};

/**
 * Formats a product to be more easily usable
 *
 * @param {Object} product Original product to take values from
 * @return {Object}
 */

const formatVariant = ({
  salePrice,
  id,
  availability: { stockLevel },
  title,
  image: { url },
}) => {
  const formattedVariant = {
    price: usdString(salePrice),
    SKU: id,
    outOfStock: !stockLevel,
    variant: title,
    imageSrc: url,
  };

  return formattedVariant;
};

/**
 * Toggles classname of given element to highlight/unhighlight it
 *
 * @param {Element} PLPSelectorDropdown
 * @param {Object} state Current state of parent component
 * @param {number} state.currentlySelectedOptionIdx Index of the currently selected option
 */

const toggleCurrOptionClass = (PLPSelectorDropdown, state) => {
  PLPSelectorDropdown.childNodes[
    state.currentlySelectedOptionIdx
  ].classList.toggle('curr-selected-option');
};

/**
 * Highlights the selected option on a PLP dropdown
 *
 * @param {number} newlySelectectedIdx Index of newly selected option
 */

/**
 * Highlights the selected option on a PLP dropdown
 *
 * @param {Element} PLPSelectorDropdown
 * @param {Object} state
 * @param {number} newlySelectectedIdx Index of newly selected option
 */

const highlightCurrSelectedOption = (
  PLPSelectorDropdown,
  state,
  newlySelectectedIdx
) => {
  if (newlySelectectedIdx !== state.currentlySelectedOptionIdx) {
    if (state.currentlySelectedOptionIdx >= 0) {
      toggleCurrOptionClass(PLPSelectorDropdown, state);
    }

    state.currentlySelectedOptionIdx = newlySelectectedIdx;
    toggleCurrOptionClass(PLPSelectorDropdown, state);
  }
};

/**
 * Returns tuple of elements with price and image to pass to event handlers
 *
 * @param {Element} productListing PLI product listing where widget was added
 * @return {array}
 */

const productListingElems = (productListing) => {
  const [productListingImg] = productListing.getElementsByTagName('img');
  const [productListingPrice] = productListing.getElementsByClassName(
    'js-pl-pricing'
  );

  const productListingElems = [productListingImg, productListingPrice];

  return productListingElems;
};

/**
 * Adds all options to the dropdown
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 */

/* istanbul ignore next */

const dropdownOptions = async (
  productID,
  currentOption,
  productListing,
  state,
  PLPSelectorDropdown
) => {
  const variants = await getVariants(productID);

  const dropdownOptions = variants.map((variant, index) =>
    PLPSelectorDropdownOption(
      formatVariant(variant),
      state,
      currentOption,
      productListingElems(productListing),
      () => highlightCurrSelectedOption(PLPSelectorDropdown, state, index)
    )
  );

  return dropdownOptions;
};

/**
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @return {Element}
 */

/* istanbul ignore next */
const PLPSelectorDropdown = async (...args) => {
  const newPLPSelectorDropdown = HTMLElem('ul', [
    'plp-dropdown-options',
    siteString,
  ]);

  const state = { variantSelected: false, currentlySelectedOptionIdx: -1 };

  const options = await dropdownOptions(...args, state, newPLPSelectorDropdown);

  newPLPSelectorDropdown.append(...options);

  return newPLPSelectorDropdown;
};

// removeIf(production)
module.exports = {
  fetchJson,
  getItemInfo,
  getVariants,
  usdString,
  formatVariant,
  toggleCurrOptionClass,
  highlightCurrSelectedOption,
  productListingElems,
  PLPSelectorDropdown,
};
// endRemoveIf(production)
