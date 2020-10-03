const fetchJson = async (url) => {
  const response = await fetch(url);

  return await response.json();
};

const getItemInfo = async (productID) => {
  return await fetchJson(
    `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=${
      onCompetitiveCyclist ? "competitivecyclist" : "bcs"
    }`
  );
};

/**
 * Returns array of variants for a product id
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @return {array}
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

const usdString = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);

/**
 * Formats a product to be more easily usable
 *
 * @param {object} product Original product to take values from
 * @return {object}
 */

const formatProduct = ({
  salePrice,
  id,
  availability: { stockLevel },
  title,
  image: { url },
}) => {
  return {
    price: usdString(salePrice),
    SKU: id,
    outOfStock: !stockLevel,
    variant: title,
    imageSrc: url,
  };
};

/**
 * Highlights the currently selected option on a PLP dropdown
 *
 * @param {Element} PLPSelectorDropdown
 * @param {number} selectedIdx Index of currently selected option
 * @param {object} state Current state of parent component
 * @param {number} state.currentlySelectedOptionIdx Index of the currently selected option
 */

const highlightCurrSelectedOption = (
  PLPSelectorDropdown,
  selectedIdx,
  state
) => {
  const toggleCurrOptionClass = () => {
    PLPSelectorDropdown.childNodes[
      state.currentlySelectedOptionIdx
    ].classList.toggle("curr-selected-option");
  };

  if (state.currentlySelectedOptionIdx >= 0) {
    toggleCurrOptionClass();
  }

  state.currentlySelectedOptionIdx = selectedIdx;
  toggleCurrOptionClass();
};

/**
 * Returns tuple of elements with price and image to pass to event handlers
 *
 * @param {Element} productListing PLI product listing where widget was added
 * @return {array}
 */

const getProductListingElems = (productListing) => {
  const [productListingImg] = productListing.getElementsByTagName("img");
  const [productListingPrice] = productListing.getElementsByClassName(
    "js-pl-pricing"
  );

  return [productListingImg, productListingPrice];
};

/**
 *
 * @param {object} product Object containing info about an item
 * @param {number} index Index of the current item
 * @param {Element} currentOption Reference to HTML elem with the current option chosen
 * @param {Element} productListing PLI product listing where widget was
 * @param {Object} state Observable properties that control behavior of component
 * @param {Element} PLPSelectorDropdownOption Single PLP selector dropdown option
 */

const addSingleDropdownOption = (
  product,
  index,
  currentOption,
  productListing,
  state,
  PLPSelectorDropdown
) => {
  PLPSelectorDropdown.append(
    PLPSelectorDropdownOption(
      formatProduct(product),
      state,
      currentOption,
      getProductListingElems(productListing),
      () => highlightCurrSelectedOption(PLPSelectorDropdown, index, state)
    )
  );
};

/**
 * Adds all options to the dropdown
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 */

const addAllDropdownOptions = (productID, ...args) => {
  getVariants(productID).then((variants) => {
    for (let i = 0; i < variants.length; i += 1) {
      addSingleDropdownOption(variants[i], i, ...args);
    }
  });
};

/**
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @return {Element}
 */

const PLPSelectorDropdown = (...args) => {
  const newPLPSelectorDropdown = HTMLElem("ul", [
    "plp-dropdown-options",
    siteString,
  ]);
  const state = { variantSelected: false, currentlySelectedOptionIdx: -1 };

  addAllDropdownOptions(...args, state, newPLPSelectorDropdown);

  return newPLPSelectorDropdown;
};

//removeIf(production)
module.exports = {
  getItemInfo,
  usdString,
  formatProduct,
  highlightCurrSelectedOption,
  getProductListingElems,
  PLPSelectorDropdown,
};
//endRemoveIf(production)
