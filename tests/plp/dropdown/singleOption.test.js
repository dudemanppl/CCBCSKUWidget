global.onPLP = true;

// const {
//   highlightCurrSelectedOption,
// } = require("../../../src/plp/dropdown/dropdown");
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
    updatePricingPLP(productListingPrice, props, "$11.00");

    const priceElem = productListingPrice.firstChild;

    test("should have a new child", () => {
      expect(priceElem).not.toBe(placeholderChild);
    });

    test("variantSelected should still be true", () => {
      expect(props.variantSelected).toBe(true);
    });

    test("should have changed the textContent", () => {
      expect(priceElem.textContent).toBe("$11.00");
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
  const mockDropdownOption = (productListingImg, outOfStock = true) => {
    const PLPSelectorDropdownOption = HTMLElem("div");
    const props = { variantSelected: false };
    const currentOption = HTMLElem("div");
    const productListingPrice = HTMLElem("div");
    const highlightCurrSelectedOption = jest.fn();

    addMethodsToPLPSelectorDropdownOption(
      PLPSelectorDropdownOption,
      { ...formattedProduct, outOfStock },
      props,
      currentOption,
      [productListingImg, productListingPrice],
      highlightCurrSelectedOption
    );

    PLPSelectorDropdownOption.onclick = jest.fn();

    return PLPSelectorDropdownOption;
  };

  describe("out of stock alert", () => {
    test("should add 'oos-alert' class when variant is out of stock", () => {
      const dropdownOption = mockDropdownOption(HTMLElem("img"));

      expect(dropdownOption.classList[0]).toBe("oos-alert");
    });

    test("should not add 'oos-alert' class when variant is in stock", () => {
      const dropdownOption = mockDropdownOption(HTMLElem("img"), false);

      expect(dropdownOption.classList).toHaveLength(0);
    });
  });

  describe("mouse enter handling", () => {
    describe("Competitive Cyclist", () => {
      const productListingImg = HTMLElem("img");
      const dropdownOption = mockDropdownOption(productListingImg);
      dropdownOption.dispatchEvent(new MouseEvent("mouseenter"));

      test("should get correct image source", () => {
        expect(productListingImg.src).toBe(
          "https://content.competitivecyclist.com/images/items/medium/KSK/KSK000I/WHT.jpg"
        );
      });
    });

    describe("Backcountry", () => {
      global.onCompetitiveCyclist = false;
      const productListingImg = HTMLElem("img");
      const dropdownOption = mockDropdownOption(productListingImg);
      dropdownOption.dispatchEvent(new MouseEvent("mouseenter"));

      test("should get correct image source", () => {
        expect(productListingImg.src).toBe(
          "https://content.backcountry.com/images/items/medium/KSK/KSK000I/WHT.jpg"
        );
      });
    });
  });

  test("mouse click handling", () => {
    const dropdownOption = mockDropdownOption(HTMLElem("img"));
    dropdownOption.click();

    expect(dropdownOption.onclick).toHaveBeenCalled();
  });
});

describe("PLPSelectorDropdownOption", () => {
  const otherParams = [
    { variantSelected: false },
    HTMLElem("div"),
    [HTMLElem("div"), HTMLElem("div")],
    jest.fn(),
  ];

  const dropdownOption = PLPSelectorDropdownOption(
    formattedProduct,
    ...otherParams
  );

  test("should show correct variant and price", () => {
    expect(dropdownOption.textContent).toBe("White1, S ($299.95)");
  });

  test("should be a list item", () => {
    expect(dropdownOption.tagName).toBe("LI");
  });

  test("should have correct className", () => {
    expect(dropdownOption.classList[0]).toBe("plp-dropdown-option-single");
  });
});
