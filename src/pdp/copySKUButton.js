const copySKUButtonOnClick = ({ currentTarget: copySKUButton }) => {
  const SKU = document.getElementsByClassName("js-selected-product-variant")[0]
    .value;

  if (SKU) {
    navigator.clipboard.writeText(SKU);
    copySKUButton.textContent = "Copied!";
    copySKUButton.classList.add("flash");

    setTimeout(() => {
      copySKUButton.classList.remove("flash");
    }, 100);
  } else {
    copySKUButton.textContent = "Choose Item";
    copySKUButton.classList.add("no-variant-selected");
  }
};

const copySKUButtonOnMouseLeave = ({ currentTarget: copySKUButton }) => {
  copySKUButton.textContent = "Copy SKU";
  copySKUButton.classList.remove("no-variant-selected");
};

const addMethodsToCopySKUButton = (copySKUButton) => {
  copySKUButton.onmouseleave = copySKUButtonOnMouseLeave;
  copySKUButton.onclick = copySKUButtonOnClick;
};

/**
 * Creates a button to copy the full SKU of the selected variant on the PDP
 *
 * @returns {Element}
 */

const copySKUButton = (siteInfo) => {
  const newCopySKUButton = HTMLElem(
    "button",
    classnamesForElem("CopySKUButton", siteInfo),
    "copy-sku-button",
    "Copy SKU"
  );
  newCopySKUButton.setAttribute("type", "button");

  addMethodsToCopySKUButton(newCopySKUButton);

  return newCopySKUButton;
};
