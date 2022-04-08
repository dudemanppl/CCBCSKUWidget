/**
 * Returns boolean of whether or not the dropdown has been opened for a particular item
 *
 * @param {Element} target Location to check if the PLP dropdown has been previously opened
 * @return {boolean}
 */

const PLPDropdownOpened = ({ classList: [firstClass] }) => {
  return firstClass === 'plp-dropdown-options';
};

/**
 * @param {Event} event From event handler
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element[]} productListingElems Tuple of elements with price and image
 * @param {object} state Data about the component
 */

const openPLPDropdownOptions = async (
  { currentTarget },
  productID,
  productListingElems,
  state
) => {
  const { firstChild: currSelectedVariant, lastChild } = currentTarget;

  if (PLPDropdownOpened(lastChild)) {
    lastChild.classList.toggle('hidden');
  } else {
    /** Element won't be created until it is clicked */
    const placeholderDropdown = HTMLElem('UL', [
      'plp-dropdown-options',
      'hidden',
      siteString,
    ]);

    currentTarget.append(placeholderDropdown);

    placeholderDropdown.replaceWith(
      await PLPSelectorDropdown(
        productID,
        currSelectedVariant,
        productListingElems,
        state
      )
    );
  }
};

/**
 * @param {Element} PLPDropdownOptions
 */

const closePLPDropdownOptions = (PLPDropdownOptions) => {
  PLPDropdownOptions.classList.add('hidden');
};

/**
 * Returns tuple of elements with price and image to pass to event handlers
 *
 * @param {Element} productListing PLI product listing where widget was added
 * @return {array}
 */

const productListingElems = (productListing) => {
  const [productListingImg] = productListing.getElementsByTagName('img');
  const [productListingPrice] =
    productListing.getElementsByClassName('ui-pl-pricing');

  const productListingElems = [productListingImg, productListingPrice];

  return productListingElems;
};

/**
 * Opens and closes the dropdown options on PLP
 *
 * @param {string} productID Parent SKU for item from CC/BC catalog
 * @param {Element} productListing PLI product listing where widget was added
 * @param {Element} PLPSelectorDropdownContainer
 * @param {object} state Data about the component
 */

const dropdownContainerEventHandlers = (
  productID,
  productListing,
  PLPSelectorDropdownContainer,
  state
) => {
  const [productListingImg, productListingPrice] =
    productListingElems(productListing);

  PLPSelectorDropdownContainer.onclick = (event) =>
    openPLPDropdownOptions(
      event,
      productID,
      [productListingImg, productListingPrice],
      state
    );

  productListing.onmouseleave = () => {
    if (state.variantImgSrc) {
      productListingImg.src = state.variantImgSrc;
    }

    const [PLPSelectorDropdownContainer] =
      productListing.getElementsByClassName('plp-dropdown-options');

    PLPSelectorDropdownContainer &&
      closePLPDropdownOptions(PLPSelectorDropdownContainer);
  };
};

/**
 * Creates element that lists the currently selected variant
 * @return {Element}
 */

const PLPDropdownCurrSelectedVariant = () => {
  return HTMLElem(
    'div',
    ['plp-dropdown-curr-selected-variant', siteString],
    null,
    'Select option'
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
  const newPLPSelectorDropdownContainer = HTMLElem('div', [
    'plp-dropdown-container',
    siteString,
  ]);

  const state = {
    variantSelected: false,
    currentlySelectedOptionIdx: -1,
    variantImgSrc: null,
  };

  newPLPSelectorDropdownContainer.append(
    PLPDropdownCurrSelectedVariant(),
    dropdownCaret()
  );

  dropdownContainerEventHandlers(
    productID,
    productListing,
    newPLPSelectorDropdownContainer,
    state
  );

  return newPLPSelectorDropdownContainer;
};

// removeIf(production)
module.exports = {
  PLPDropdownOpened,
  openPLPDropdownOptions,
  closePLPDropdownOptions,
  productListingElems,
  dropdownContainerEventHandlers,
  PLPDropdownCurrSelectedVariant,
  PLPSelectorDropdownContainer,
};
// endRemoveIf(production)
