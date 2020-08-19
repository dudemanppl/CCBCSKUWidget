/**
 * Creates variant selector dropdown on PLP with price and stock information
 *
 * @param {string} productID Parent SKU to query BC products REST API
 * @param {Elem} currentOption Reference to HTML elem with the current option chosen
 */

class PLPSelectorDropdown extends HTMLElem {
  constructor(productID, currentOption) {
    const newPLPSelectorDropdown = super("ul", [
      "plp-dropdown-options",
      siteString,
    ]);

    getItemInfo(productID).then((products) => {
      for (const product of products) {
        newPLPSelectorDropdown.append(
          new PLPSelectorDropdownOption(product, currentOption)
        );
      }
    });

    return newPLPSelectorDropdown;
  }
}
