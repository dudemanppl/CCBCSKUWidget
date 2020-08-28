/**
 * Creates container for PLP dropdown
 *
 * @param {string} productID Parent SKU to query BC products REST API
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

    currentOption.innerText = "Select option";

    newPLPSelectorDropdownContainer.append(currentOption);

    /** Adds caret to BC PLP dropdown to mimic BC PDP */
    if (!onCompetitiveCyclist) {
      newPLPSelectorDropdownContainer.append(new BCDropdownCaret());
    }

    /** Initializes for future reference */
    let selectorClicked = false;
    let dropdownOptions;

    /** Initializes invalid targets here so it won't be created every click */
    const invalidTargetsToCloseDropdown = new Set([
      newPLPSelectorDropdownContainer,
      ...newPLPSelectorDropdownContainer.childNodes,
    ]);

    const closeDropdown = ({ target }) => {
      if (!invalidTargetsToCloseDropdown.has(target))
        dropdownOptions.classList.add("hidden");
    };

    newPLPSelectorDropdownContainer.onclick = () => {
      /** Element won't be created until it is clicked */
      if (selectorClicked) {
        dropdownOptions.classList.toggle("hidden");
      } else {
        dropdownOptions = new PLPSelectorDropdown(productID, currentOption, productListing);
        newPLPSelectorDropdownContainer.append(dropdownOptions);
        selectorClicked = true;
      }

      /** Adds event listener when dropdown is rendered/shows up */
      setTimeout(() => {
        document.addEventListener(
          "click",
          closeDropdown,
          /** Removes event listener when fired once */
          { once: true }
        );
      }, 0);

      /** Closes dropdown when mouse leaves a PLP listing on BC */
      if (!onCompetitiveCyclist) {
        const targetNode =
          newPLPSelectorDropdownContainer.parentElement.parentElement
            .parentElement.parentElement;

        targetNode.addEventListener(
          "mouseleave",
          () => dropdownOptions.classList.add("hidden"),
          { once: true }
        );
      }
    };

    return newPLPSelectorDropdownContainer;
  }
}
