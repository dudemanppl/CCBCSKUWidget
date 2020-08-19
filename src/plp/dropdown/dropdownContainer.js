/**
 * Creates container for PLP dropdown
 *
 * @param {string} productID Parent SKU to query BC products REST API
 */

class PLPSelectorDropdownContainer extends HTMLElem {
  constructor(productID) {
    const newPLPSelectorDropdownContainer = super("div", [
      "plp-dropdown-container",
      siteString,
    ]);

    let selectorClicked = false;
    let dropdownOptions;

    const closeDropdown = ({ target }) => {
      const firstClass = target.classList[0];
      /** If the target is within the dropout container, it already has an event listener to close it */
      const validTarget =
        target !== currentOption &&
        firstClass !== "caret-path" &&
        firstClass !== "bc-dropdown-caret";

      validTarget && dropdownOptions.classList.add("hidden");
    };

    const currentOption = new HTMLElem("div", [
      "plp-dropdown-current-option",
      siteString,
    ]);

    currentOption.innerText = "Select option";

    newPLPSelectorDropdownContainer.append(currentOption);

    if (!onCompetitiveCyclist) {
      newPLPSelectorDropdownContainer.append(new BCDropdownCaret());
    }

    newPLPSelectorDropdownContainer.onclick = () => {
      /** Element won't be created until it is clicked */
      if (!selectorClicked) {
        dropdownOptions = new PLPSelectorDropdown(productID, currentOption);
        newPLPSelectorDropdownContainer.append(dropdownOptions);
        selectorClicked = true;
      } else {
        dropdownOptions.classList.toggle("hidden");
      }

      document.addEventListener(
        "click",
        closeDropdown,
        /** Removes event listener when fired once */
        { once: true }
      );

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
