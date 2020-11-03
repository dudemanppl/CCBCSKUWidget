const {
  copySKUButtonOnClick,
  copySKUButtonOnMouseLeave,
  addMethodsToCopySKUButton,
  copySKUButton,
} = require("../../src/pdp/copySKUButton");

describe("copySKUButtonOnClick", () => {
  const dummySKUElem = HTMLElem("div", ["js-selected-product-variant"]);
  document.body.append(dummySKUElem)
  // dummySKUElem.value = testSKU;
 

  describe("with no variant selected", () => {
    const currentTarget = HTMLElem("div");
    const event = { currentTarget };

    copySKUButtonOnClick(event);

    test('should have correct class added', ()=>{
      expect(currentTarget.classList[0]).toBe('no-variant-selected')
    })

    test('should have correct text content', ()=>{
      expect(currentTarget.textContent).toBe('Choose Item')
    })
  });
});

describe("copySKUButtonOnMouseLeave", () => {});

describe("addMethodsToCopySKUButton", () => {});

describe("copySKUButton", () => {});
