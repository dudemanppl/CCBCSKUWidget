const {
  runOnAllElemsOfClass,
  deleteAllElemsOfClass,
  CCNewTabFix,
  fixBCStyling,
  PLPWidgetContainer,
  addPLPSingleWidget,
  addAllPLPWidgets,
  nodeToObservePLP,
} = require("../../src/plp/index");

const { HTMLElem } = require("../../src/shared/index");

const clearBody = () => (document.body.innerHTML = "");

describe("runOnAllElemsOfClass", () => {
  beforeEach(clearBody);

  const replaceClass = () =>
    runOnAllElemsOfClass("class1", (e) => (e.classList = "replacement-class"));

  describe("one class", () => {
    const HTMLElemOneClass = () => HTMLElem("div", ["class1"]);

    test("should run on one element with one class", () => {
      document.body.append(HTMLElemOneClass());
      replaceClass();

      expect(document.getElementsByClassName("replacement-class")).toHaveLength(
        1
      );
    });

    test("should run on multiple elements with one class", () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemOneClass());
      }
      replaceClass();

      expect(document.getElementsByClassName("replacement-class")).toHaveLength(
        5
      );
    });
  });

  describe("multiple other classes", () => {
    const HTMLElemMultipleClasses = () =>
      HTMLElem("div", ["class1", "class2", "class3"]);

    test("should run on one element with multiple other classes", () => {
      document.body.append(HTMLElemMultipleClasses());
      replaceClass();

      expect(document.getElementsByClassName("replacement-class")).toHaveLength(
        1
      );
    });

    test("should run on multiple elements with multiple other classes", () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemMultipleClasses());
      }
      replaceClass();

      expect(document.getElementsByClassName("replacement-class")).toHaveLength(
        5
      );
    });
  });
});

describe("deleteAllElemsOfClass", () => {
  beforeEach(clearBody);

  const deleteElems = () => deleteAllElemsOfClass("class1");

  describe("one class", () => {
    const HTMLElemOneClass = () => HTMLElem("div", ["class1"]);

    test("should delete one element with one class", () => {
      document.body.append(HTMLElemOneClass());
      deleteElems();

      expect(document.getElementsByClassName("class1")).toHaveLength(0);
    });

    test("should delete multiple elements with one class", () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemOneClass());
      }
      deleteElems();

      expect(document.getElementsByClassName("class1")).toHaveLength(0);
    });
  });

  describe("multiple other classes", () => {
    const HTMLElemMultipleClasses = () =>
      HTMLElem("div", ["class1", "class2", "class3"]);

    test("should delete one element with multiple other classes", () => {
      document.body.append(HTMLElemMultipleClasses());
      deleteElems();

      expect(document.getElementsByClassName("class1")).toHaveLength(0);
    });

    test("should delete multiple elements with multiple other classes", () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemMultipleClasses());
      }
      deleteElems();

      expect(document.getElementsByClassName("class1")).toHaveLength(0);
    });
  });
});

describe("fixBCStyling", () => {
  beforeEach(() => {
    for (let i = 0; i < 5; i += 1) {
      document.body.append(
        HTMLElem("div", ["js-pl-focus-trigger"]),
        HTMLElem("div", ["js-pl-color-thumbs"]),
        HTMLElem("div", ["js-pl-sizes-wrap"]),
        HTMLElem("div", ["js-pl-expandable"])
      );
    }
  });

  afterEach(clearBody);

  test("should delete elements with class of js-pl-focus-trigger", () => {
    fixBCStyling();
    expect(document.getElementsByClassName("js-pl-focus-trigger")).toHaveLength(
      0
    );
  });

  test("should delete elements with class of js-pl-color-thumbs", () => {
    fixBCStyling();
    expect(document.getElementsByClassName("js-pl-color-thumbs")).toHaveLength(
      0
    );
  });

  test("should delete elements with class of js-pl-sizes-wrap", () => {
    fixBCStyling();
    expect(document.getElementsByClassName("js-pl-sizes-wrap")).toHaveLength(0);
  });

  // describe("should change styling of elements with class of js-pl-expandable to have a top, right, bottom, and left of 10px", () => {
  //   fixBCStyling();
  //   console.log(document.getElementsByClassName("js-pl-expandable")[0].style);

  //   describe.each(["top", "right", "bottom", "left"])("", (position) => {
  //     test(`${position} should be 10px`, () => {
  //       const offset = document.getElementsByClassName("js-pl-expandable")[0]
  //         .style[position];

  //       expect(offset).toBe("10px");
  //     });
  //   });
  // });
});
describe("CCNewTabFix", () => {
  test("nice", () => {});
});
describe("PLPWidgetContainer", () => {
  test("nice", () => {});
});
describe("addPLPSingleWidget", () => {
  test("nice", () => {});
});
describe("addAllPLPWidgets", () => {
  test("nice", () => {});
});
describe("nodeToObservePLP", () => {
  test("nice", () => {});
});
