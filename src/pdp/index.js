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
    let [variant, size] = variantAndSize.split(`, `);

    // Fix for frames/bikes having cm, which isn't shown on the front end size selector
    if (size.endsWith('cm')) {
      const sizeWithoutCM = size.substring(0, size.length - 2);

      size = sizeWithoutCM;
    }

    items[variant] = { ...items[variant], [size]: fullSKU };
  }

  return items;
};

const iterateThroughChildren = (element, cb, options) => {
  for (const child of element.children) {
    cb(child, options);
  }
};

const changeStylingOfLastChild = (
  { lastChild },
  options = { add: true, classes: [] }
) => {
  if (options.add === false) {
    lastChild.classList.remove(...options.classes);
  } else {
    lastChild.classList.add(...options.classes);
  }
};

const addRedOutline = (parentContainer) => {
  iterateThroughChildren(parentContainer, changeStylingOfLastChild, {
    classes: ['red-outline'],
  });
};

const addRemoveRedOutlineClickListener = (parentContainer) => {
  parentContainer.addEventListener(
    'click',
    () => {
      iterateThroughChildren(parentContainer, changeStylingOfLastChild, {
        add: false,
        classes: ['red-outline'],
      });
    },
    { once: true }
  );
};

if (onPDP) {
  let currentlySelectedVariantSKU;

  const newCopySKUButton = copySKUButtonPDP();
  const variantSelector = document.getElementById('buybox-variant-selector');
  const hasSingleDropdown = variantSelector.querySelector(
    '[data-id="singleDropdown"]'
  );
  const hasColorTile = variantSelector.querySelector('[data-id="colorTile"]');

  const copySKU = () => {
    navigator.clipboard.writeText(
      currentlySelectedVariantSKU || 'Error copying SKU'
    );

    newCopySKUButton.textContent = 'Copied!';
  };

  newCopySKUButton.onmouseleave = () => {
    newCopySKUButton.textContent = 'Copy SKU';
  };

  if (hasSingleDropdown) {
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
  } else if (hasColorTile) {
    let currentlySelectedSize;

    const itemsOffered = getItemsOffered();

    const [
      { lastChild: currentlySelectedColorElem },
      colorSelector,
      { lastChild: sizeSelectorWrapper },
    ] = variantSelector.children;

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
        addRedOutline(colorSelector);
        addRemoveRedOutlineClickListener(colorSelector);

        newCopySKUButton.textContent = 'Select a Color';
      } else if (!currentlySelectedSize) {
        addRedOutline(sizeSelectorWrapper);
        addRemoveRedOutlineClickListener(sizeSelectorWrapper);

        newCopySKUButton.textContent = 'Select a Size';
      } else {
        const fullSKU =
          itemsOffered[currentlySelectedColor][currentlySelectedSize];

        currentlySelectedVariantSKU = fullSKU;

        copySKU();
      }
    };
  } else {
    const itemsOffered = getItemsOffered();

    const colorElem = variantSelector.querySelector(
      '[data-id="productColorDropdown"]'
    ).firstChild.firstChild;

    const sizeElem = variantSelector.querySelector(
      '[data-id="productSizeDropdown"]'
    ).firstChild;

    newCopySKUButton.onclick = () => {
      const currentlySelectedColor = colorElem.innerText;
      const currentlySelectedSize = sizeElem.innerText;

      const fullSKU =
        itemsOffered[currentlySelectedColor][currentlySelectedSize];

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
