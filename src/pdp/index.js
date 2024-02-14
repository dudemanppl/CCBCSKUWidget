const WMSLinkPDP = (productID) => {
  const newWMSLinkButton = HTMLElem('button', [
    'chakra-button',
    siteString,
    'wms-button-pdp',
  ]);
  const newWMSLink = HTMLElem('a', ['wms-link-pdp'], null, 'Go to WMS');

  newWMSLinkButton.setAttribute('type', 'button');
  newWMSLink.href = `https://manager.backcountry-apps.com/manager/admin/item_inventory.html?item_id=${productID}`;

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

  const copySKU = () => {
    navigator.clipboard.writeText(
      currentlySelectedVariantSKU || 'Error copying SKU'
    );

    newCopySKUButton.textContent = 'Copied!';
  };

  newCopySKUButton.onmouseleave = () => {
    newCopySKUButton.textContent = 'Copy SKU';
  };

  const sizeSelectorWrapper = document.getElementById('buybox-variant-selector')
    .lastElementChild.lastChild;

  newCopySKUButton.onclick = () => {
    const currentlySelectedSize = !JSON.parse(
      document.querySelector('#__NEXT_DATA__').innerText
    ).props.pageProps.product.selectedSize;

    if (!currentlySelectedSize) {
      addRedOutline(sizeSelectorWrapper);
      addRemoveRedOutlineClickListener(sizeSelectorWrapper);

      newCopySKUButton.textContent = 'Select a Size';
    } else {
      const fullSKU = JSON.parse(
        document.querySelector('#__NEXT_DATA__').innerText
      ).props.pageProps.product.selectedSku;
      currentlySelectedVariantSKU = fullSKU;

      copySKU();
    }
  };

  // props.pagerops.product

  const PDPTargetLocation = document.getElementById('buybox-variant-selector')
    .nextSibling.nextSibling;

  const parentSKU = document
    .querySelector('[data-id="productId"]')
    .innerText.slice(-7);

  PDPTargetLocation.append(WMSLinkPDP(parentSKU), newCopySKUButton);
}
