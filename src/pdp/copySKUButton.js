/**
 * Creates a button to copy the full SKU of the selected variant on the PDP
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 */

class CopySKUButtonPDP extends HTMLElem {
  constructor() {
    const newCopySKUButtonPDP = super(
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

    newCopySKUButtonPDP.onmouseleave = () => {
      this.textContent = "Copy SKU";
      this.classList.remove("no-variant-selected");
    };

    newCopySKUButtonPDP.onclick = () => {
      const SKU = document.getElementsByClassName(
        "js-selected-product-variant"
      )[0].value;

      if (SKU) {
        navigator.clipboard.writeText(SKU);
        this.textContent = "Copied!";
        this.classList.add("flash");

        setTimeout(() => {
          this.classList.remove("flash");
        }, 100);
      } else {
        this.textContent = "Choose Item";
        this.classList.add("no-variant-selected");
      }
    };

    return newCopySKUButtonPDP;
  }
}
