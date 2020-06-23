const copyToClipboard = str => {
  navigator.clipboard.writeText(str);
};

const toggleStyle = (elem, targetStyle, styleToChangeTo, time = 0) => {
  const originalStyle = elem.style[targetStyle];

  elem.style[targetStyle] = styleToChangeTo;
  setTimeout(() => {
    elem.style[targetStyle] = originalStyle;
  }, time);
};

const smallAlertConfirmation = alertText => {
  const smallAlert = document.createElement("div");
  const { style } = smallAlert;

  style.cssText = `
      display: flex;
//       position: absolute;
       top: 0;
//       left: 0;
//       z-index: 1;
      height: 100%;
      width: 100%;
      background-color: black;
  `;

  smallAlert.innerHTML = alertText;

  return smallAlert;
};

const SKUWidget = SKU => {
  const SKUElem = document.createElement("div");
  const alertElem = smallAlertConfirmation("test");
  const { style } = SKUElem;

  style.cssText = `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  `;

  SKUElem.innerHTML = SKU;
  SKUElem.appendChild(alertElem);

  SKUElem.onclick = () => {
    copyToClipboard(SKU);
    toggleStyle(alertElem, "display", "flex", 1000);
  };

  return SKUElem;
};

const allItemsOnPage = document.getElementsByClassName("results")[0]
  .firstElementChild.childNodes;

allItemsOnPage.forEach(item => {
  const SKU = item.getAttribute("data-product-id");
  const SKUElem = SKUWidget(SKU);

  item.appendChild(SKUElem);
});
