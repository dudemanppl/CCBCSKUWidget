const WMSLinkPDP = (productID) => {
  const newWMSLinkButton = HTMLElem('button', ['chakra-button', 'css-n74rjt', 'wms-button-pdp']);
  const newWMSLink = HTMLElem('a', ['wms-link-pdp'], null, 'Go to WMS');

  newWMSLinkButton.setAttribute('type', 'button');
  newWMSLink.href = `https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${productID}`;

  newWMSLinkButton.append(newWMSLink);

  return newWMSLinkButton;
};

if (onPDP) {
  const PDPTargetLocation = document.getElementById('buybox-variant-selector')
    .nextSibling.nextSibling;

  const parentSKU = document
    .querySelector('[data-id="productId"]')
    .innerText.slice(-7);

  PDPTargetLocation.append(WMSLinkPDP(parentSKU));
}
