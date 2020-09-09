/**
 * Sends request to BC API, returns array with information about given product
 *
 * @async
 * @param {string} productID Product ID to look up item
 * @return {array} Array of objects with item info
 */

const getItemInfo = async (productID) => {
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
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 */

const PLPSelectorDropdown = (productID, currentOption, productListing) => {
  const newPLPSelectorDropdown = HTMLElem("ul", [
    "plp-dropdown-options",
    siteString,
  ]);
  const state = { variantSelected: false };
  let currentlySelectedOptionIdx;

  /**
   * @param {number} selectedIdx Index of currently selected option
   */

  const highlightCurrSelectedOption = (selectedIdx) => {
    const toggleCurrOptionClass = () => {
      newPLPSelectorDropdown.childNodes[
        currentlySelectedOptionIdx
      ].classList.toggle("curr-selected-option");
    };

    if (currentlySelectedOptionIdx >= 0) {
      toggleCurrOptionClass();
    }
    currentlySelectedOptionIdx = selectedIdx;

    toggleCurrOptionClass();
  };

  getItemInfo(productID).then((products) => {
    const productListingImg = productListing.getElementsByTagName("img")[0];
    const productListingPrice = productListing.getElementsByClassName(
      "js-pl-pricing"
    )[0];

    for (let i = 0; i < products.length; i += 1) {
      const currProduct = products[i];

      const product = {
        price: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(currProduct.salePrice),
        SKU: currProduct.id,
        outOfStock: !currProduct.availability.stockLevel,
        variant: currProduct.title,
        imageSrc: currProduct.image.url,
      };

      newPLPSelectorDropdown.append(
        PLPSelectorDropdownOption(
          product,
          state,
          currentOption,
          productListingImg,
          productListingPrice,
          () => highlightCurrSelectedOption(i)
        )
      );
    }
  });

  return newPLPSelectorDropdown;
};
