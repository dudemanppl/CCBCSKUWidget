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

const copySKUButtonPDP = () => {
  const newCopySKUButton = HTMLElem(
    'button',
    ['chakra-button', siteString, 'copy-sku-button-pdp'],
    null,
    'Copy SKU'
  );

  newCopySKUButton.setAttribute('type', 'button');

  return newCopySKUButton;
};

const getItemsOffered = () => {
  const itemsOfferedElements = document.querySelectorAll(
    '[itemprop="itemOffered"]'
  );

  const items = {};

  for (const item of itemsOfferedElements) {
    const [{ content: variantAndSize }, { content: fullSKU }] = item.children;
    const [variant, size] = variantAndSize.split(`, `);

    items[variant] = { ...items[variant], [size]: fullSKU };
  }

  return items;
};

if (onPDP) {
  let currentlySelectedVariantSKU;

  const newCopySKUButton = copySKUButtonPDP();
  const variantSelector = document.getElementById('buybox-variant-selector');
  const hasDropdown = variantSelector.children.length === 2;

  const copySKU = () => {
    navigator.clipboard.writeText(
      currentlySelectedVariantSKU || 'Error copying SKU'
    );
  };

  if (hasDropdown) {
    const variantDropdown = variantSelector.querySelector('ul');

    for (let i = 0; i < variantDropdown.children.length; i += 1) {
      const variant = variantDropdown.children[i];
      const fullSKU = variant.getAttribute('value');

      // Sets the SKU to be the first variant, which is selected by default
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

    const itemsOffered = getItemsOffered();
    const {
      children: [
        { lastChild: currentlySelectedColorElem },
        colorSelector,
        { lastChild: sizeSelectorWrapper },
      ],
    } = variantSelector;

    // Sets selected size to the only element, which is selected by default
    if (sizeSelectorWrapper.childElementCount === 1) {
      const actualSize =
        sizeSelectorWrapper.firstChild.firstChild.getAttribute('value');

      currentlySelectedSize = actualSize;
    }

    for (const singleSizeSelector of sizeSelectorWrapper.children) {
      const { firstChild, lastChild: singleSizeSelectElem } =
        singleSizeSelector;

      const actualSize = firstChild.getAttribute('value');

      singleSizeSelectElem.onclick = () => {
        currentlySelectedSize = actualSize;
      };
    }

    newCopySKUButton.onclick = () => {
      const currentlySelectedColor = currentlySelectedColorElem.textContent;

      if (!currentlySelectedColor) {
        console.log(colorSelector);
        for (const {
          lastChild: singleColorSelectElem,
        } of colorSelector.children) {
          singleColorSelectElem.classList.add('red-outline');
        }
      } else {
        const fullSKU =
          itemsOffered[currentlySelectedColor][currentlySelectedSize];

        currentlySelectedVariantSKU = fullSKU;

        copySKU();
      }
    };
  }

  const PDPTargetLocation = document.getElementById('buybox-variant-selector')
    .nextSibling.nextSibling;

  const parentSKU = document
    .querySelector('[data-id="productId"]')
    .innerText.slice(-7);

  PDPTargetLocation.append(WMSLinkPDP(parentSKU), newCopySKUButton);
}
