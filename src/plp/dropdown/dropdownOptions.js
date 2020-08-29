/**
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @param {string} productID Parent SKU to query BC products REST API
 * @param {Element} productListing PLI product listing where widget was added
 */

class PLPSelectorDropdown extends HTMLElem {
  constructor(productID, currentOption, productListing) {
    const newPLPSelectorDropdown = super("ul", [
      "plp-dropdown-options",
      siteString,
    ]);

    let currentlySelectedOptionIdx;

    /**
     * @param {number} selectedIdx Index of currently selected option
     */
    
    const highlightCurrSelectedOption = (selectedIdx) => {
      const currOption = () =>
        newPLPSelectorDropdown.childNodes[currentlySelectedOptionIdx];

      if (currentlySelectedOptionIdx >= 0) {
        currOption().classList.toggle("curr-selected-option");
      }
      currentlySelectedOptionIdx = selectedIdx;

      currOption().classList.toggle("curr-selected-option");
    };

    const productListingImg = productListing.getElementsByTagName("img")[0];
    const productListingPrice = productListing.getElementsByClassName(
      "js-pl-pricing"
    )[0];

    getItemInfo(productID).then((products) => {
      for (let i = 0; i < products.length; i += 1) {
        const product = products[i];

        newPLPSelectorDropdown.append(
          new PLPSelectorDropdownOption(
            product,
            currentOption,
            productListingImg,
            productListingPrice,
            i,
            highlightCurrSelectedOption
          )
        );
      }
    });

    return newPLPSelectorDropdown;
  }
}
