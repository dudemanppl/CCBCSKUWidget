/**
 * Creates container for PLP dropdown
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 */

const PLPSelectorDropdownContainer = (productID, productListing) => {
  const newPLPSelectorDropdownContainer = HTMLElem("div", [
    "plp-dropdown-container",
    siteString,
  ]);

  const currentOption = HTMLElem(
    "div",
    ["plp-dropdown-current-option", siteString],
    null,
    "Select option"
  );

  newPLPSelectorDropdownContainer.append(
    ...[
      currentOption,
      /** Adds caret to BC PLP dropdown to mimic BC PDP */
      ...[!onCompetitiveCyclist ? BCDropdownCaret() : []],
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
      dropdownOptions = PLPSelectorDropdown(
        productID,
        currentOption,
        productListing
      );

      newPLPSelectorDropdownContainer.append(dropdownOptions);
    }
  };

  /** Closes dropdown when cursor leaves a PLP product listing */
  productListing.onmouseleave = () => {
    if (dropdownOptions) {
      dropdownOptions.classList.add("hidden");
    }
  };

  return newPLPSelectorDropdownContainer;
};
