/**
 * Returns boolean of whether or not the dropdown has been opened for a particular item
 *
 * @param {Element} target Location to check if the PLP dropdown has been previously opened
 * @return {boolean}
 */

const PLPDropdownOpened = (target) => {
  const [elementClass] = target.classList;
  return elementClass === "plp-dropdown-options";
};

/**
 * @param {Event} event From event handler
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was
 */

const openPLPDropdownOptions = (event, productID, productListing) => {
  const { currentTarget } = event;
  const { firstChild: currentOption, lastChild } = currentTarget;

  if (PLPDropdownOpened(lastChild)) {
    lastChild.classList.toggle("hidden");
  } else {
    /** Element won't be created until it is clicked */
    currentTarget.append(
      PLPSelectorDropdown(productID, currentOption, productListing)
    );
  }
};
/**
 * @param {Element} PLPSelectorDropdownContainer
 */

const closePLPDropdownOptions = (PLPSelectorDropdownContainer) => {
  const { lastChild } = PLPSelectorDropdownContainer;

  if (PLPDropdownOpened(lastChild)) {
    lastChild.classList.add("hidden");
  }
};

/**
 * Opens and closes the dropdown options on PLP
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 * @param {Element} PLPSelectorDropdownContainer
 */

const handleDropdownOptions = (
  productID,
  productListing,
  PLPSelectorDropdownContainer
) => {
  /** Initialize with no value to return a falsy value */

  PLPSelectorDropdownContainer.onclick = (event) =>
    openPLPDropdownOptions(event, productID, productListing);

  productListing.onmouseleave = () =>
    closePLPDropdownOptions(PLPSelectorDropdownContainer);
};

/**
 * @return {Element}
 */
const PLPDropdownCurrentOption = (siteString) => {
  return HTMLElem(
    "div",
    ["plp-dropdown-current-option", siteString],
    null,
    "Select option"
  );
};

/**
 * Creates container for PLP variant selector
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 * @return {Element}
 */

const PLPSelectorDropdownContainer = (productID, productListing) => {
  const newPLPSelectorDropdownContainer = HTMLElem("div", [
    "plp-dropdown-container",
    siteString,
  ]);

  newPLPSelectorDropdownContainer.append(PLPDropdownCurrentOption(siteString));
  /** Adds caret to BC PLP dropdown to mimic BC PDP */
  if (!onCompetitiveCyclist) {
    newPLPSelectorDropdownContainer.append(BCDropdownCaret());
  }

  handleDropdownOptions(
    productID,
    productListing,
    newPLPSelectorDropdownContainer
  );

  return newPLPSelectorDropdownContainer;
};
