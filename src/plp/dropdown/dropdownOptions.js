/**
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 */

class PLPSelectorDropdown extends HTMLElem {
  constructor(productID, currentOption, productListing) {
    const newPLPSelectorDropdown = super("ul", [
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

    const productListingImg = productListing.getElementsByTagName("img")[0];
    const productListingPrice = productListing.getElementsByClassName(
      "js-pl-pricing"
    )[0];

    getItemInfo(productID).then((products) => {
      for (let i = 0; i < products.length; i += 1) {
        const product = products[i];

        newPLPSelectorDropdown.append(
          new PLPSelectorDropdownOption(
            {
              price: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              }).format(product.salePrice),
              SKU: product.ID,
              outOfStock: !product.availability.stockLevel,
              variant: product.title,
              imageSrc: product.image.url,
            },
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
  }
}
