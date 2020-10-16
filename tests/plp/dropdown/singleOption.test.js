global.onPLP = true;

const {
  updatePricingPLP,
  copySKUPLP,
  addMethodsToPLPSelectorDropdownOption,
  PLPSelectorDropdownOption,
} = require("../../../src/plp/dropdown/singleOption");

describe("updatePricingPLP", () => {
  describe("First invocation", () => {
    const productListingPrice = HTMLElem("div");
    const placeholderChild = HTMLElem("div", null, null, "$10.00");

    productListingPrice.append(placeholderChild);
    const props = { variantSelected: false };

    updatePricingPLP(productListingPrice, props, "$12.00");
    const priceElem = productListingPrice.firstChild;

    test("should have a new child", () => {
      expect(priceElem).not.toBe(placeholderChild);
    });

    test("should have changed variantSelected to be true", () => {
      expect(props.variantSelected).toBe(true);
    });

    test("should have changed the textContent", () => {
      expect(priceElem.textContent).toBe("$12.00");
    });

    test("should only have one child", () => {
      expect(productListingPrice.children).toHaveLength(1);
    });

    test("should be a span", () => {
      expect(priceElem.tagName).toBe("SPAN");
    });

    test("should not have an id", () => {
      expect(priceElem.id).toBeFalsy();
    });
  });

  describe("Subsequent invocations", () => {
    const productListingPrice = HTMLElem("div");
    const placeholderChild = HTMLElem("div", null, null, "$10.00");

    productListingPrice.append(placeholderChild);
    const props = { variantSelected: false };

    updatePricingPLP(productListingPrice, props, "$11.00");
    updatePricingPLP(productListingPrice, props, "$12.00");

    const priceElem = productListingPrice.firstChild;

    test("should have a new child", () => {
      expect(priceElem).not.toBe(placeholderChild);
    });

    test("variantSelected should still be true", () => {
      expect(props.variantSelected).toBe(true);
    });

    test("should have changed the textContent", () => {
      expect(priceElem.textContent).toBe("$12.00");
    });

    test("should only have one child", () => {
      expect(productListingPrice.children).toHaveLength(1);
    });

    test("should be a span", () => {
      expect(priceElem.tagName).toBe("SPAN");
    });

    test("should not have an id", () => {
      expect(priceElem.id).toBeFalsy();
    });
  });
});

describe("copySKUPLP", () => {
  const variant = "testVariant";
  const SKU = "testSKU";
  global.navigator.clipboard = { writeText: jest.fn() };

  describe("Immediately after invocation", () => {
    const currentOption = HTMLElem("div");

    copySKUPLP(currentOption, variant, SKU);

    test("should copy SKU to clipboard", () => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(SKU);
    });

    test("should have added class of 'copy-notif'", () => {
      expect(currentOption.classList[0]).toEqual("copy-notif");
    });

    test("should have textContent of 'SKU Copied!", () => {
      expect(currentOption.textContent).toBe("SKU Copied!");
    });
  });

  describe("After cleanup", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      copySKUPLP(currentOption, variant, SKU);
      jest.runAllTimers();
    });

    const currentOption = HTMLElem("div");

    test("should have removed class of 'copy-notif'", () => {
      expect(currentOption.classList).toHaveLength(0);
    });

    test("should have original textContent", () => {
      expect(currentOption.textContent).toBe(variant);
    });
  });
});

describe("addMethodsToPLPSelectorDropdownOption", () => {
  const product = {
    price: "testPrice",
    SKU: "testSku",
    outOfStock: false,
    variant: "testVariant",
    imageSrc: "testImgSrc",
  };
  const props = { variantSelected: false };

  // const singleOption = PLPSelectorDropdownOption()
});

describe("PLPSelectorDropdownOption", () => {});
