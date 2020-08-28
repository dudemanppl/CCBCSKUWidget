/**
 * Creates a button to copy the full SKU of the selected variant on the PDP
 *
 * @param {string} [id] Id for HTML element.
 * @param {array} [classList] Array of desired classes to add.
 */

class CopySKUButtonPDP extends HTMLElem {
  constructor(id, classList) {
    const newCopySKUButtonPDP = super("button", classList, id);
    /** Seeing newCopySKUButtonPDP get repeated so many times hurt my eyes  */
    const b = newCopySKUButtonPDP;

    const reset = () => {
      b.textContent = "Copy SKU";
      b.classList.remove("no-variant-selected");
    };

    b.setAttribute("type", "button");
    reset();

    b.addEventListener("mouseleave", reset);

    b.onclick = () => {
      const SKU = document.getElementsByClassName(
        "js-selected-product-variant"
      )[0].value;

      if (SKU) {
        navigator.clipboard.writeText(SKU);
        b.textContent = "Copied!";
        b.classList.add("flash");

        setTimeout(() => {
          b.classList.remove("flash");
        }, 100);
      } else {
        b.textContent = "Choose Item";
        b.classList.add("no-variant-selected");
      }
    };

    return newCopySKUButtonPDP;
  }
}
