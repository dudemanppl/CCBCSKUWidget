const {
  addOOSAlertToCCPDP,
  anonFuncToStr,
  invokeFuncInWindow,
  PDPTargetLocation,
  PDPProductID,
} = require('../../src/pdp/index');

describe('addOOSAlertToCCPDP', () => {
  beforeEach(() => {
    const dropdown = HTMLElem('div', ['js-unifiedropdown-option']);
    dropdown.setAttribute('sku-value', testSKU);

    document.body.append(dropdown);
  });

  afterEach(clearBody);

  test('should not add class when in stock', () => {
    global.BC = {
      product: { skusCollection: { testSKU: { inventory: 2 } } },
    };
    const [dropdown] = document.getElementsByClassName(
      'js-unifiedropdown-option'
    );

    expect(dropdown.classList[1]).toBeUndefined();
  });

  test('should add class when item is out of stock', () => {
    global.BC = {
      product: { skusCollection: { testSKU: { inventory: 0 } } },
    };
    const [dropdown] = document.getElementsByClassName(
      'js-unifiedropdown-option'
    );

    expect(dropdown.classList[1]).toBe('oos-alert');
  });
});

describe('anonFuncToStr', () => {});

describe('invokeFuncInWindow', () => {});

describe('PDPTargetLocation', () => {});

describe('PDPProductID', () => {});
