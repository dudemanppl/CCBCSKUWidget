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

    getItemInfo(productID).then((products) => {
      for (const product of products) {
        newPLPSelectorDropdown.append(
          new PLPSelectorDropdownOption(product, currentOption, productListing)
        );
      }
    });

    return newPLPSelectorDropdown;
  }
}
