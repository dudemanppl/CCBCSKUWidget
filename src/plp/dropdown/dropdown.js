/**
 * Sends request to BC API, returns array with information about given product
 *
 * @async
 * @param {string} productID Product ID to look up item
 * @return {array} Array of objects with item info
 */

const getItemInfo = async (productID, { onCompetitiveCyclist }) => {
  try {
    let res = await fetch(
      `https://api.backcountry.com/v1/products/${productID}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=${
        onCompetitiveCyclist ? "competitivecyclist" : "bcs"
      }`
    );

    res = await res.json();

    return Promise.resolve(await res.products[0].skus);
  } catch (err) {
    console.log(err);
  }
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
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 * @return {Element}
 */

const PLPSelectorDropdown = (
  productID,
  currentOption,
  productListing,
  siteInfo
) => {
  const newPLPSelectorDropdown = HTMLElem("ul", [
    "plp-dropdown-options",
    siteInfo.siteString,
  ]);
  const state = { variantSelected: false, currentlySelectedOptionIdx: -1 };

  getItemInfo(productID, siteInfo).then((products) => {
    for (let i = 0; i < products.length; i += 1) {
      newPLPSelectorDropdown.append(
        PLPSelectorDropdownOption(
          formatProduct(products[i]),
          state,
          currentOption,
          getProductListingElems(productListing),
          () => highlightCurrSelectedOption(newPLPSelectorDropdown, i, state),
          siteInfo
        )
      );
    }
  });

  return newPLPSelectorDropdown;
};
