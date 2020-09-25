const {
  HTMLElem,
  WMSLink,
  classnamesForElem,
} = require("../../src/shared/index");

const onCC = { onCompetitiveCyclist: true, siteString: "cc" };
const onBC = { onCompetitiveCyclist: false, siteString: "bc" };

describe("HTMLElem", () => {
  describe("empty element", () => {
    const emptyDiv = HTMLElem("div");

    test("should create an HTML Element", () => {
      expect(emptyDiv).toBeInstanceOf(HTMLElement);
    });

    test("should not have any classes", () => {
      expect([...emptyDiv.classList]).toStrictEqual([]);
    });

    test("should not have an ID", () => {
      expect(emptyDiv.id).toBeFalsy();
    });

    test("should not have any text", () => {
      expect(emptyDiv.textContent).toBeFalsy();
    });
  });

  describe("element with single class", () => {
    const singleClassDiv = HTMLElem("div", ["class1"]);

    test("should create an HTML Element", () => {
      expect(singleClassDiv).toBeInstanceOf(HTMLElement);
    });

    test("should have one class", () => {
      expect([...singleClassDiv.classList]).toStrictEqual(["class1"]);
    });

    test("should not have an ID", () => {
      expect(singleClassDiv.id).toBeFalsy();
    });

    test("should not have any text", () => {
      expect(singleClassDiv.textContent).toBeFalsy();
    });
  });

  describe("element with multiple classes", () => {
    const multipleClassDiv = HTMLElem("div", ["class1", "class2"]);

    test("should create an HTML Element", () => {
      expect(multipleClassDiv).toBeInstanceOf(HTMLElement);
    });

    test("should have multiple classes", () => {
      expect([...multipleClassDiv.classList]).toStrictEqual([
        "class1",
        "class2",
      ]);
    });

    test("should not have an ID", () => {
      expect(multipleClassDiv.id).toBeFalsy();
    });

    test("should not have any text", () => {
      expect(multipleClassDiv.textContent).toBeFalsy();
    });
  });

  describe("element with id", () => {
    const divWithId = HTMLElem("div", null, "id");

    test("should create an HTML Element", () => {
      expect(divWithId).toBeInstanceOf(HTMLElement);
    });

    test("should not have any classes", () => {
      expect([...divWithId.classList]).toStrictEqual([]);
    });

    test("should have an ID", () => {
      expect(divWithId.id).toBe("id");
    });

    test("should not have any text", () => {
      expect(divWithId.textContent).toBeFalsy();
    });
  });

  describe("element with text", () => {
    const divWithId = HTMLElem("div", null, null, "text");

    test("should create an HTML Element", () => {
      expect(divWithId).toBeInstanceOf(HTMLElement);
    });

    test("should not have any classes", () => {
      expect([...divWithId.classList]).toStrictEqual([]);
    });

    test("should not have an ID", () => {
      expect(divWithId.id).toBeFalsy();
    });

    test("should have text", () => {
      expect(divWithId.textContent).toBe("text");
    });
  });

  describe("element with multiple classes, id, and text", () => {
    const divWithId = HTMLElem("div", ["class1", "class2"], "id", "text");

    test("should create an HTML Element", () => {
      expect(divWithId).toBeInstanceOf(HTMLElement);
    });

    test("should have multiple classes", () => {
      expect([...divWithId.classList]).toStrictEqual(["class1", "class2"]);
    });

    test("should have an ID", () => {
      expect(divWithId.id).toBe("id");
    });

    test("should have text", () => {
      expect(divWithId.textContent).toBe("text");
    });
  });
});

describe("WMSLink", () => {
  describe("PDP", () => {
    const onPDP = true;

    describe("Competitive Cyclist", () => {
      const CCPDPWMSLink = WMSLink("KSK000I", {
        ...onCC,
        onPDP,
      });

      test("should be an anchor element", () => {
        expect(CCPDPWMSLink.tagName).toBe("A");
      });

      test("should be a button", () => {
        expect(CCPDPWMSLink.type).toBe("button");
      });

      test("should have correct classes", () => {
        expect([...CCPDPWMSLink.classList]).toStrictEqual([
          "cc",
          "btn",
          "btn-reset",
          "pdp",
          "btn--secondary",
          "link-to-wms",
        ]);
      });

      test("should have text content of 'Go to WMS'", () => {
        expect(CCPDPWMSLink.textContent).toBe("Go to WMS");
      });

    });

    describe("Backcountry", () => {
      const BCPDPWMSLink = WMSLink("KSK000I", {
        ...onBC,
        onPDP,
      });

      test("should be an anchor element", () => {
        expect(BCPDPWMSLink.tagName).toBe("A");
      });

      test("should be a button", () => {
        expect(BCPDPWMSLink.type).toBe("button");
      });

      test("should have correct classes", () => {
        expect([...BCPDPWMSLink.classList]).toStrictEqual([
          "bc",
          "btn",
          "btn-reset",
          "pdp",
          "product-buybox__btn",
          "link-to-wms",
        ]);
      });

      test("should have text content of 'Go to WMS'", () => {
        expect(BCPDPWMSLink.textContent).toBe("Go to WMS");
      });
    });
  });

  describe("PLP", () => {
    const onPDP = false;

    describe("Competitive Cyclist", () => {
      const CCPLPWMSLink = WMSLink("KSK000I", {
        ...onCC,
        onPDP,
      });

      test("should be an anchor element", () => {
        expect(CCPLPWMSLink.tagName).toBe("A");
      });

      test("should be a button", () => {
        expect(CCPLPWMSLink.type).toBe("button");
      });

      test("should have correct classes", () => {
        expect([...CCPLPWMSLink.classList]).toStrictEqual([
          "cc",
          "btn",
          "btn-reset",
          "plp",
          "link-to-wms",
        ]);
      });

      test("should have text content of 'Go to WMS'", () => {
        expect(CCPLPWMSLink.textContent).toBe("Go to WMS");
      });
    });

    describe("Backcountry", () => {
      const BCPLPWMSLink = WMSLink("KSK000I", {
        ...onBC,
        onPDP,
      });

      test("should be an anchor element", () => {
        expect(BCPLPWMSLink.tagName).toBe("A");
      });

      test("should be a button", () => {
        expect(BCPLPWMSLink.type).toBe("button");
      });

      test("should have correct classes", () => {
        expect([...BCPLPWMSLink.classList]).toStrictEqual([
          "bc",
          "btn",
          "btn-reset",
          "plp",
          "link-to-wms",
        ]);
      });

      test("should have text content of 'Go to WMS'", () => {
        expect(BCPLPWMSLink.textContent).toBe("Go to WMS");
      });
    });
  });
});

describe("classnamesForElem", () => {
  describe("PDP", () => {
    const onPDP = true;
    describe("Competitive Cyclist", () => {
      describe("WMSLink", () => {
        const CCPDPWMSLinkClassnames = classnamesForElem("WMSLink", {
          ...onCC,
          onPDP,
        });

        test("should return an array", () => {
          expect(CCPDPWMSLinkClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(CCPDPWMSLinkClassnames).toStrictEqual([
            "cc",
            "btn",
            "btn-reset",
            "pdp",
            "btn--secondary",
            "link-to-wms",
          ]);
        });
      });

      describe("CopySKUButton", () => {
        const CCPDPCopySKUClassnames = classnamesForElem("CopySKUButton", {
          ...onCC,
          onPDP,
        });

        test("should return an array", () => {
          expect(CCPDPCopySKUClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(CCPDPCopySKUClassnames).toStrictEqual([
            "cc",
            "btn",
            "btn-reset",
            "pdp",
            "btn--secondary",
          ]);
        });
      });
    });

    describe("Backcountry", () => {
      describe("WMSLink", () => {
        const BCPDPWMSLinkClassnames = classnamesForElem("WMSLink", {
          ...onBC,
          onPDP,
        });

        test("should return an array", () => {
          expect(BCPDPWMSLinkClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(BCPDPWMSLinkClassnames).toStrictEqual([
            "bc",
            "btn",
            "btn-reset",
            "pdp",
            "product-buybox__btn",
            "link-to-wms",
          ]);
        });
      });
      describe("CopySKUButton", () => {
        const BCPDPCopySKUClassnames = classnamesForElem("CopySKUButton", {
          ...onBC,
          onPDP,
        });

        test("should return an array", () => {
          expect(BCPDPCopySKUClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(BCPDPCopySKUClassnames).toStrictEqual([
            "bc",
            "btn",
            "btn-reset",
            "pdp",
            "product-buybox__btn",
          ]);
        });
      });
    });
  });

  describe("PLP", () => {
    const onPDP = false;

    describe("Competitive Cyclist", () => {
      describe("WMSLink", () => {
        const CCPDPWMSLinkClassnames = classnamesForElem("WMSLink", {
          ...onCC,
          onPDP,
        });

        test("should return an array", () => {
          expect(CCPDPWMSLinkClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(CCPDPWMSLinkClassnames).toStrictEqual([
            "cc",
            "btn",
            "btn-reset",
            "plp",
            "link-to-wms",
          ]);
        });
      });

      describe("PLPPrice", () => {
        const CCPDPCopySKUClassnames = classnamesForElem("PLPPrice", {
          ...onCC,
          onPDP,
        });

        test("should return an array", () => {
          expect(CCPDPCopySKUClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(CCPDPCopySKUClassnames).toStrictEqual([
            "cc",
            "ui-pl-pricing__high-price",
            "ui-pl-pricing--price-retail",
            "js-item-price-high",
            "qa-item-price-high",
          ]);
        });
      });
    });

    describe("Backcountry", () => {
      describe("WMSLink", () => {
        const BCPDPWMSLinkClassnames = classnamesForElem("WMSLink", {
          ...onBC,
          onPDP,
        });

        test("should return an array", () => {
          expect(BCPDPWMSLinkClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(BCPDPWMSLinkClassnames).toStrictEqual([
            "bc",
            "btn",
            "btn-reset",
            "plp",
            "link-to-wms",
          ]);
        });
      });

      describe("PLPPrice", () => {
        const BCPDPCopySKUClassnames = classnamesForElem("PLPPrice", {
          ...onBC,
          onPDP,
        });

        test("should return an array", () => {
          expect(BCPDPCopySKUClassnames).toBeInstanceOf(Array);
        });

        test("should return correct classes", () => {
          expect(BCPDPCopySKUClassnames).toStrictEqual([
            "bc",
            "ui-pl-pricing__high-price",
            "ui-pl-pricing--price-retail",
            "js-item-price-high",
            "qa-item-price-high",
          ]);
        });
      });
    });
  });
});
