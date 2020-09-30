const {
  BCDropdownCaret,
} = require("../../../src/plp/dropdown/BCDropdownCaret");

describe("BCDropdownCaret", () => {
  const caret = BCDropdownCaret();
  const path = caret.firstChild;

  describe("SVG", () => {
    test("should have correct class", () => {
      expect(caret.classList[0]).toBe("bc-dropdown-caret");
    });

    test("should have correct viewbox dimensions", () => {
      expect(caret.getAttribute("viewBox")).toBe("0 0 256 256");
    });
  });

  describe("path", () => {
    test("should be child of SVG element", () => {
      expect(path.parentElement).toBe(caret);
    });

    test("should have correct class", () => {
      expect(path.classList[0]).toBe("caret-path");
    });

    test("should have correct path", () => {
      expect(path.getAttribute("d")).toBe(
        "M203.628 107.72c-5.613 5.9-64.759 63.566-64.759 63.566-3.007 3.149-6.939 4.714-10.87 4.714-3.945 0-7.876-1.567-10.87-4.714 0 0-59.145-57.665-64.773-63.565-5.613-5.9-6-16.501 0-22.812 6.014-6.296 14.386-6.79 21.738 0l53.905 52.908 53.891-52.894c7.365-6.79 15.752-6.296 21.738 0 6.014 6.296 5.641 16.912 0 22.797z"
      );
    });
  });
});
