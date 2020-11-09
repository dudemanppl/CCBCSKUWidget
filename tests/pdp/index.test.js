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
    dropdown.setAttribute('sku-value', testFullSKU);

    document.body.append(dropdown);
  });

  afterEach(clearBody);

  test('should not add class when in stock', () => {
    global.BC = {
      product: { skusCollection: { 'KSK000I-WHT-S': { inventory: 2 } } },
    };
    const [dropdown] = document.getElementsByClassName(
      'js-unifiedropdown-option'
    );

    addOOSAlertToCCPDP();

    expect([...dropdown.classList]).not.toEqual(
      expect.arrayContaining(['oos-alert'])
    );
  });

  test('should add class when item is out of stock', () => {
    global.BC = {
      product: { skusCollection: { 'KSK000I-WHT-S': { inventory: 0 } } },
    };
    const [dropdown] = document.getElementsByClassName(
      'js-unifiedropdown-option'
    );

    addOOSAlertToCCPDP();

    expect([...dropdown.classList]).toEqual(
      expect.arrayContaining(['oos-alert'])
    );
  });
});

describe('anonFuncToStr', () => {
  const func = () => 'nice';

  test('should return function contents as a string', () => {
    const str = anonFuncToStr(func);

    expect(str).toBe(` 'nice`);
  });
});

describe('invokeFuncInWindow', () => {
  global.mockFn = jest.fn();
  /** Usually takes a function, but Jest is linting while testing? */
  const anonFunc = `()=>{mockFn()}`;

  test('should invoke function given', () => {
    invokeFuncInWindow(anonFunc);
    expect(global.mockFn).toHaveBeenCalled();
  });
});

describe('PDPTargetLocation', () => {
  describe('should return correct element', () => {
    const [ccTarget, bcTarget] = [
      HTMLElem('div', ['add-to-cart']),
      HTMLElem('div', ['js-buybox-actions']),
    ];
    beforeEach(() => {
      document.body.append(ccTarget, bcTarget);
    });
    afterEach(clearBody);

    test('Competitive Cyclist', () => {
      expect(PDPTargetLocation()).toBe(ccTarget);
    });

    test('Backcountry', () => {
      global.onCompetitiveCyclist = false;
      expect(PDPTargetLocation()).toBe(bcTarget);
    });
  });
});

describe('PDPProductID', () => {
  const mockPDPProdIDElem = HTMLElem('input');
  mockPDPProdIDElem.value = testFullSKU;
  mockPDPProdIDElem.setAttribute(
    'name',
    '/atg/commerce/order/purchase/CartModifierFormHandler.productId'
  );

  test('should return correct product ID', () => {
    document.body.append(mockPDPProdIDElem);
    expect(PDPProductID()).toBe(testFullSKU);
  });
});
