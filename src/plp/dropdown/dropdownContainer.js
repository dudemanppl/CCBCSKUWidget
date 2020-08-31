/**
 * Creates container for PLP dropdown
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 */

class PLPSelectorDropdownContainer extends HTMLElem {
  constructor(productID, productListing) {
    const newPLPSelectorDropdownContainer = super("div", [
      "plp-dropdown-container",
      siteString,
    ]);

    const currentOption = new HTMLElem(
      "div",
      ["plp-dropdown-current-option", siteString],
      null,
      "Select option"
    );

    newPLPSelectorDropdownContainer.append(
      ...[
        currentOption,
        /** Adds caret to BC PLP dropdown to mimic BC PDP */
        ...[!onCompetitiveCyclist ? new BCDropdownCaret() : []],
      ]
    );

    let dropdownOptions;

    newPLPSelectorDropdownContainer.onclick = (e) => {
      /** Prevents PDP reroute on CC */
      if (onCompetitiveCyclist) e.stopPropagation();

      if (dropdownOptions) {
        dropdownOptions.classList.toggle("hidden");
      } else {
        /** Element won't be created until it is clicked */
        dropdownOptions = new PLPSelectorDropdown(
          productID,
          currentOption,
          productListing
        );

        this.append(dropdownOptions);
      }
    };

    /** Closes dropdown when cursor leaves a PLP product listing */
    productListing.onmouseleave = () => {
      if (dropdownOptions) {
        dropdownOptions.classList.add("hidden");
      }
    };

    return newPLPSelectorDropdownContainer;
  }
}
