/**
 * Creates container for PLP dropdown
 *
 * @param {string} productID Parent SKU to query BC products REST API
 * @param {Element} productListing PLI product listing where widget was added
 */

class PLPSelectorDropdownContainer extends HTMLElem {
  constructor(productID, productListing) {
    const newPLPSelectorDropdownContainer = super("div", [
      "plp-dropdown-container",
      siteString,
    ]);

    const currentOption = new HTMLElem("div", [
      "plp-dropdown-current-option",
      siteString,
    ]);

    currentOption.textContent = "Select option";

    newPLPSelectorDropdownContainer.append(currentOption);

    /** Adds caret to BC PLP dropdown to mimic BC PDP */
    if (!onCompetitiveCyclist) {
      newPLPSelectorDropdownContainer.append(new BCDropdownCaret());
    }

    /** Initializes for future reference */
    let selectorClicked = false;
    let dropdownOptions;

    newPLPSelectorDropdownContainer.onclick = (e) => {
      /** Prevents PDP reroute on CC */
      if (onCompetitiveCyclist) e.stopPropagation();
      /** Element won't be created until it is clicked */
      if (selectorClicked) {
        dropdownOptions.classList.toggle("hidden");
      } else {
        dropdownOptions = new PLPSelectorDropdown(
          productID,
          currentOption,
          productListing.getElementsByTagName("img")[0]
        );

        newPLPSelectorDropdownContainer.append(dropdownOptions);
        selectorClicked = true;
      }

      /** Closes dropdown when cursor leaves a PLP product listing */
      productListing.addEventListener(
        "mouseleave",
        () => dropdownOptions.classList.add("hidden"),
        { once: true }
      );
    };

    return newPLPSelectorDropdownContainer;
  }
}
