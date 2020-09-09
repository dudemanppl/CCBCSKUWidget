/**
 * Creates a button to copy the full SKU of the selected variant on the PDP
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 */

const CopySKUButtonPDP = () => {
  const newCopySKUButtonPDP = HTMLElem(
    "button",
    [
      ...(onCompetitiveCyclist
        ? ["btn--secondary", "buy-box__compare-btn"]
        : ["product-buybox__btn"]),
      "btn",
      "btn-reset",
      siteString,
    ],
    "copy-sku-button",
    "Copy SKU"
  );

  newCopySKUButtonPDP.setAttribute("type", "button");

  newCopySKUButtonPDP.onmouseleave = ({ currentTarget: button }) => {
    button.textContent = "Copy SKU";
    button.classList.remove("no-variant-selected");
  };

  newCopySKUButtonPDP.onclick = ({ currentTarget: button }) => {
    const SKU = document.getElementsByClassName(
      "js-selected-product-variant"
    )[0].value;

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

  return newCopySKUButtonPDP;
};
