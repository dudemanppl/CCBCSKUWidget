const WMSLinkPDP = (productID) => {
  const newWMSLinkButton = HTMLElem('button', [
    'chakra-button',
    siteString,
    'wms-button-pdp',
  ]);
  const newWMSLink = HTMLElem('a', ['wms-link-pdp'], null, 'Go to WMS');

  newWMSLinkButton.setAttribute('type', 'button');
  newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

  newWMSLinkButton.append(newWMSLink);

  return newWMSLinkButton;
};

if (onPDP) {
  const newCopySKUButton = HTMLElem(
    'button',
    ['chakra-button', siteString, 'copy-sku-button-pdp'],
    null,
    'Copy SKU'
  );

  newCopySKUButton.setAttribute('type', 'button');

  const copySKU = () => {
    navigator.clipboard.writeText(
      currentlySelectedVariantSKU || 'Error copying SKU'
    );
  };

  let currentlySelectedVariantSKU;

  const variantSelector = document.getElementById('buybox-variant-selector');

  const hasDropdown = variantSelector.children.length === 2;

  if (hasDropdown) {
    const variantDropdown = variantSelector.querySelector('ul');

    for (let i = 0; i < variantDropdown.children.length; i += 1) {
      const variant = variantDropdown.children[i];
      const fullSKU = variant.getAttribute('value');

      if (i === 0) {
        currentlySelectedVariantSKU = fullSKU;
      }

      variant.onclick = () => {
        currentlySelectedVariantSKU = fullSKU;
      };
    }

    newCopySKUButton.onclick = copySKU;
  } else {
    let currentlySelectedSize;

    const itemsOfferedElements = document.querySelectorAll(
      '[itemprop="itemOffered"]'
    );

    const items = {};

    for (const item of itemsOfferedElements) {
      const [{ content: variantAndSize }, { content: fullSKU }] = item.children;
      const [variant, size] = variantAndSize.split(`, `);

      items[variant] = { ...items[variant], [size]: fullSKU };
    }
    const sizeSelectorElem = variantSelector.lastChild.lastChild;

    for (const singleSizeSelectWrapper of sizeSelectorElem.children) {
      const { firstChild, lastChild } = singleSizeSelectWrapper;

      const actualSize = firstChild.getAttribute('value');

      const singleSizeSelectElem = lastChild;

      singleSizeSelectElem.onclick = () => {
        currentlySelectedSize = actualSize;
      };
    }

    newCopySKUButton.onclick = () => {
      const colorSelector = variantSelector.firstChild.lastChild;
      const currentlySelectedColor = colorSelector.textContent;

      const fullSKU = items[currentlySelectedColor][currentlySelectedSize];

      currentlySelectedVariantSKU = fullSKU;

      copySKU();
    };
  }

  const PDPTargetLocation = document.getElementById('buybox-variant-selector')
    .nextSibling.nextSibling;

  const parentSKU = document
    .querySelector('[data-id="productId"]')
    .innerText.slice(-7);

  PDPTargetLocation.append(WMSLinkPDP(parentSKU), newCopySKUButton);
}
