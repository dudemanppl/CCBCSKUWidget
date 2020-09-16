const copySKUButtonOnClick = ({ currentTarget: button }) => {
  const SKU = document.getElementsByClassName("js-selected-product-variant")[0]
    .value;

  if (SKU) {
    navigator.clipboard.writeText(SKU);
    button.textContent = "Copied!";
    button.classList.add("flash");

    setTimeout(() => {
      button.classList.remove("flash");
    }, 100);
  } else {
    button.textContent = "Choose Item";
    button.classList.add("no-variant-selected");
  }
};

const copySKUButtonOnMouseLeave = ({ currentTarget: button }) => {
  button.textContent = "Copy SKU";
  button.classList.remove("no-variant-selected");
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

const copySKUButton = () => {
  const newCopySKUButton = HTMLElem(
    "button",
    classnamesForElem("CopySKUButton"),
    "copy-sku-button",
    "Copy SKU"
  );
  newCopySKUButton.setAttribute("type", "button");

  addMethodsToCopySKUButton(newCopySKUButton);

  return newCopySKUButton;
};
