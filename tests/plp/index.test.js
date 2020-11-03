const {
  runOnAllElemsOfClass,
  deleteAllElemsOfClass,
  fixBCStyling,
  PLPWidgetContainer,
  addPLPSingleWidget,
  addAllPLPWidgets,
  nodeToObservePLP,
} = require('../../src/plp');

const {
  PLPSelectorDropdownContainer,
} = require('../../src/plp/dropdown/container');

const { WMSLink } = require('../../src/shared/index');

const { BCDropdownCaret } = require('../../src/plp/dropdown/BCDropdownCaret');

global.PLPSelectorDropdownContainer = PLPSelectorDropdownContainer;
global.WMSLink = WMSLink;
global.BCDropdownCaret = BCDropdownCaret;

describe('runOnAllElemsOfClass', () => {
  beforeEach(clearBody);

  const replaceClass = () =>
    // eslint-disable-next-line no-return-assign
    runOnAllElemsOfClass('class1', (e) => (e.classList = 'replacement-class'));

  describe('one class', () => {
    const HTMLElemOneClass = () => HTMLElem('div', ['class1']);

    test('should run on one element with one class', () => {
      document.body.append(HTMLElemOneClass());
      replaceClass();

      expect(document.getElementsByClassName('replacement-class')).toHaveLength(
        1
      );
    });

    test('should run on multiple elements with one class', () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemOneClass());
      }
      replaceClass();

      expect(document.getElementsByClassName('replacement-class')).toHaveLength(
        5
      );
    });
  });

  describe('multiple other classes', () => {
    const HTMLElemMultipleClasses = () =>
      HTMLElem('div', ['class1', 'class2', 'class3']);

    test('should run on one element with multiple other classes', () => {
      document.body.append(HTMLElemMultipleClasses());
      replaceClass();

      expect(document.getElementsByClassName('replacement-class')).toHaveLength(
        1
      );
    });

    test('should run on multiple elements with multiple other classes', () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemMultipleClasses());
      }
      replaceClass();

      expect(document.getElementsByClassName('replacement-class')).toHaveLength(
        5
      );
    });
  });
});

describe('deleteAllElemsOfClass', () => {
  beforeEach(clearBody);

  const deleteElems = () => deleteAllElemsOfClass('class1');

  describe('one class', () => {
    const HTMLElemOneClass = () => HTMLElem('div', ['class1']);

    test('should delete one element with one class', () => {
      document.body.append(HTMLElemOneClass());
      deleteElems();

      expect(document.getElementsByClassName('class1')).toHaveLength(0);
    });

    test('should delete multiple elements with one class', () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemOneClass());
      }
      deleteElems();

      expect(document.getElementsByClassName('class1')).toHaveLength(0);
    });
  });

  describe('multiple other classes', () => {
    const HTMLElemMultipleClasses = () =>
      HTMLElem('div', ['class1', 'class2', 'class3']);

    test('should delete one element with multiple other classes', () => {
      document.body.append(HTMLElemMultipleClasses());
      deleteElems();

      expect(document.getElementsByClassName('class1')).toHaveLength(0);
    });

    test('should delete multiple elements with multiple other classes', () => {
      for (let i = 0; i < 5; i += 1) {
        document.body.append(HTMLElemMultipleClasses());
      }
      deleteElems();

      expect(document.getElementsByClassName('class1')).toHaveLength(0);
    });
  });
});

describe('fixBCStyling', () => {
  beforeEach(() => {
    for (let i = 0; i < 5; i += 1) {
      document.body.append(
        HTMLElem('div', ['js-pl-focus-trigger']),
        HTMLElem('div', ['js-pl-color-thumbs']),
        HTMLElem('div', ['js-pl-sizes-wrap']),
        HTMLElem('div', ['js-pl-expandable'])
      );
    }
    fixBCStyling();
  });

  afterEach(clearBody);

  test('should delete elements with class of js-pl-focus-trigger', () => {
    expect(document.getElementsByClassName('js-pl-focus-trigger')).toHaveLength(
      0
    );
  });

  test('should delete elements with class of js-pl-color-thumbs', () => {
    expect(document.getElementsByClassName('js-pl-color-thumbs')).toHaveLength(
      0
    );
  });

  test('should delete elements with class of js-pl-sizes-wrap', () => {
    expect(document.getElementsByClassName('js-pl-sizes-wrap')).toHaveLength(0);
  });

  test('should change styling of elements with class of js-pl-expandable to have a top, right, bottom, and left of 10px', () => {
    const [
      {
        style: { top, right, bottom, left },
      },
    ] = document.getElementsByClassName('js-pl-expandable');

    expect(top).toBe('10px');
    expect(right).toBe('10px');
    expect(bottom).toBe('10px');
    expect(left).toBe('10px');
  });
});

describe('PLPWidgetContainer', () => {
  const productListing = HTMLElem('div');

  const container = PLPWidgetContainer(testSKU, productListing);

  test('should have correct class', () => {
    expect(container.classList[0]).toBe('plp-widget-container');
  });

  test('should be a div element', () => {
    expect(container.tagName).toBe('DIV');
  });

  test('should have two children', () => {
    expect(container.children).toHaveLength(2);
  });

  test('first child should be a PLPSelectorDropdownContainer', () => {
    expect(container.firstChild.classList[0]).toBe('plp-dropdown-container');
  });

  test('second child should be a WMSLink', () => {
    expect([...container.lastChild.classList]).toEqual(
      expect.arrayContaining(['link-to-wms'])
    );
  });
});

describe('addPLPSingleWidget', () => {
  const productListing = mockProductListing();

  addPLPSingleWidget(productListing);

  const widget = productListing.firstChild.firstChild;

  test('should be added to the correct place', () => {
    expect(widget.classList[0]).toBe('plp-widget-container');
  });
});

describe('addAllPLPWidgets', () => {
  beforeEach(() => {
    for (let i = 0; i < 10; i += 1) {
      const mockListingContainer = HTMLElem('div', ['js-product-listing']);
      mockListingContainer.append(mockProductListing());

      document.body.append(mockListingContainer);
    }
  });

  afterEach(clearBody);

  test('should be added to all PLP product listings on Competitive Cyclist', () => {
    addAllPLPWidgets();

    expect(
      document.getElementsByClassName('plp-widget-container')
    ).toHaveLength(10);
  });

  test('should be added to all PLP product listings on Backcountry', () => {
    global.onCompetitiveCyclist = false;
    addAllPLPWidgets();

    expect(
      document.getElementsByClassName('plp-widget-container')
    ).toHaveLength(10);
  });
});

describe('nodeToObservePLP', () => {
  beforeEach(() => {
    document.body.append(
      HTMLElem('div', ['js-inner-body']),
      HTMLElem('div', ['inner-body'])
    );
  });

  afterEach(clearBody);

  test('should return correct node on Competitive Cyclist', () => {
    const node = nodeToObservePLP();

    expect(node.classList[0]).toBe('js-inner-body');
  });

  test('should return correct node on Competitive Cyclist', () => {
    global.onCompetitiveCyclist = false;
    const node = nodeToObservePLP();

    expect(node.classList[0]).toBe('inner-body');
  });
});
