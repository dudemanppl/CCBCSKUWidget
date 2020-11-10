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
    imageSrc: `https://content.${
      onCompetitiveCyclist ? 'competitivecyclist' : 'backcountry'
    }.com${url}`,
  };

  return formattedVariant;
};

/**
 * Toggles classname of given element to highlight/unhighlight it
 *
 * @param {Element} PLPSelectorDropdown
 * @param {object} state Data about the component
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
 * @param {object} state Data about the component
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
 *  Adds all options to the dropdown
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} currSelectedVariant Element that shows the currently selected variant
 * @param {Element[]} productListingElems Tuple of elements with price and image
 * @param {object} state Data about the component
 * @param {Element} PLPSelectorDropdown
 */

/* istanbul ignore next */
const dropdownOptions = async (
  productID,
  currSelectedVariant,
  productListingElems,
  state,
  PLPSelectorDropdown
) => {
  const variants = await getVariants(productID);

  const newDropdownOptions = variants.map((variant, index) =>
    PLPSelectorDropdownOption(
      formatVariant(variant),
      state,
      currSelectedVariant,
      productListingElems,
      () => highlightCurrSelectedOption(PLPSelectorDropdown, state, index)
    )
  );

  return newDropdownOptions;
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

  const options = await dropdownOptions(...args, newPLPSelectorDropdown);

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
  PLPSelectorDropdown,
};
// endRemoveIf(production)
