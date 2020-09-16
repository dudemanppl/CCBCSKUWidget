const copySKUButtonPDPOnClick = ({ currentTarget: button }) => {
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

const copySKUButtonPDPOnMouseLeave = ({ currentTarget: button }) => {
  button.textContent = "Copy SKU";
  button.classList.remove("no-variant-selected");
};

const addMethodsToCopySKUButtonPDP = (copySKUButtonPDP) => {
  copySKUButtonPDP.onmouseleave = copySKUButtonPDPOnMouseLeave;
  copySKUButtonPDP.onclick = copySKUButtonPDPOnClick;
};

/**
 * Creates a button to copy the full SKU of the selected variant on the PDP
 *
 * @returns {Element}
 */

const copySKUButtonPDP = () => {
  const newCopySKUButtonPDP = HTMLElem(
    "button",
    classnamesForElem("CopySKUButtonPDP"),
    "copy-sku-button",
    "Copy SKU"
  );
  newCopySKUButtonPDP.setAttribute("type", "button");

  addMethodsToCopySKUButtonPDP(newCopySKUButtonPDP);

  return newCopySKUButtonPDP;
};
