const {
  PLPDropdownOpened,
  openPLPDropdownOptions,
  closePLPDropdownOptions,
  handleDropdownOptions,
  PLPDropdownCurrentOption,
  PLPSelectorDropdownContainer,
} = require('../../../src/plp/dropdown/container');

const { PLPSelectorDropdown } = require('../../../src/plp/dropdown/dropdown');

const {
  PLPSelectorDropdownOption,
} = require('../../../src/plp/dropdown/singleOption');

const {
  BCDropdownCaret,
} = require('../../../src/plp/dropdown/BCDropdownCaret');

global.PLPSelectorDropdown = PLPSelectorDropdown;
global.PLPSelectorDropdownOption = PLPSelectorDropdownOption;
global.BCDropdownCaret = BCDropdownCaret;

describe('PLPDropdownOpened', () => {
  test('should return true when dropdown has been opened', () => {
    const mockElem = HTMLElem('div', ['plp-dropdown-options']);

    expect(PLPDropdownOpened(mockElem)).toBeTruthy();
  });

  test('should return false when dropdown has not been opened', () => {
    const mockElem = HTMLElem('div', ['random-whatever-class']);

    expect(PLPDropdownOpened(mockElem)).toBeFalsy();
  });
});

describe('openPLPDropdownOptions', () => {
  const currentTarget = HTMLElem('div');
  currentTarget.append(HTMLElem('div'));
  const event = { currentTarget };
  const productListing = mockProductListing();

  describe('first invocation', () => {
    test('should add dropdown to the target', async () => {
      fetch.once(JSON.stringify(CCResponse));
      await openPLPDropdownOptions(event, testSKU, productListing);

      expect(currentTarget.lastChild.classList[0]).toBe('plp-dropdown-options');
    });
  });

  describe('subsequent invocations', () => {
    test('should close the opened dropdown', async () => {
      await openPLPDropdownOptions(event, testSKU, productListing);

      expect([...currentTarget.lastChild.classList]).toEqual(
        expect.arrayContaining(['hidden'])
      );
    });

    test('should open the closed dropdown', async () => {
      await openPLPDropdownOptions(event, testSKU, productListing);

      expect([...currentTarget.lastChild.classList]).not.toEqual(
        expect.arrayContaining(['hidden'])
      );
    });
  });
});

describe('closePLPDropdownOptions', () => {
  test('should close the opened dropdown', () => {
    const mockContainer = mockDropdownContainer();

    closePLPDropdownOptions(mockContainer);

    expect([...mockContainer.lastChild.classList]).toEqual(
      expect.arrayContaining(['hidden'])
    );
  });

  test('should not close the dropdown if not open', () => {
    const mockContainer = mockDropdownContainer();
    mockContainer.lastChild.classList = ['random-class'];

    closePLPDropdownOptions(mockContainer);

    expect([...mockContainer.lastChild.classList]).not.toEqual(
      expect.arrayContaining(['hidden'])
    );
  });
});

describe('handleDropdownOptions', () => {
  const productListing = mockProductListing();
  const PLPSelectorDropdownContainer = mockDropdownContainer();

  test('should have added event handlers', () => {
    expect(PLPSelectorDropdownContainer.onclick).toBeFalsy();
    expect(productListing.onmouseleave).toBeFalsy();

    handleDropdownOptions(
      testSKU,
      productListing,
      PLPSelectorDropdownContainer
    );

    expect(PLPSelectorDropdownContainer.onclick).toBeTruthy();
    expect(productListing.onmouseleave).toBeTruthy();
  });

  test('should handle click event on dropdown container', () => {
    PLPSelectorDropdownContainer.click();

    expect(PLPSelectorDropdownContainer.lastChild.classList[0]).toBe(
      'plp-dropdown-options'
    );
  });

  test('should handle mouse event on product listing', () => {
    productListing.dispatchEvent(new MouseEvent('mouseleave'));

    expect([...PLPSelectorDropdownContainer.lastChild.classList]).toEqual(
      expect.arrayContaining(['hidden'])
    );
  });
});

describe('PLPDropdownCurrentOption', () => {
  describe('Competitive Cyclist', () => {
    const ccCurrentOption = PLPDropdownCurrentOption();

    test('should be a div element', () => {
      expect(ccCurrentOption.tagName).toBe('DIV');
    });

    test('should have correct classes', () => {
      expect([...ccCurrentOption.classList]).toEqual([
        'plp-dropdown-current-option',
        'cc',
      ]);
    });

    test('should have correct inner text', () => {
      expect(ccCurrentOption.textContent).toBe('Select option');
    });
  });

  describe('Backcountry', () => {
    test('should have correct classes', () => {
      global.siteString = 'bc';
      const bcCurrentOption = PLPDropdownCurrentOption();

      expect([...bcCurrentOption.classList]).toEqual([
        'plp-dropdown-current-option',
        'bc',
      ]);
      global.siteString = 'cc';
    });
  });
});

describe('PLPSelectorDropdownContainer', () => {
  describe('Competitive Cyclist', () => {
    const ccDropdownContainer = PLPSelectorDropdownContainer(
      testSKU,
      mockProductListing()
    );

    const { firstChild, lastChild } = ccDropdownContainer;

    test('should be a div element', () => {
      expect(ccDropdownContainer.tagName).toBe('DIV');
    });

    test('should have correct classes', () => {
      expect([...ccDropdownContainer.classList]).toEqual([
        'plp-dropdown-container',
        'cc',
      ]);
    });

    test('should have correct children', () => {
      const currentOption = PLPDropdownCurrentOption();

      expect(firstChild).toEqual(currentOption);
      expect(lastChild).not.toBe(currentOption);
    });
  });

  describe('Backcountry', () => {
    global.siteString = 'bc';
    global.onCompetitiveCyclist = false;
    const bcDropdownContainer = PLPSelectorDropdownContainer(
      testSKU,
      mockProductListing()
    );

    const { firstChild, lastChild } = bcDropdownContainer;

    test('should be a div element', () => {
      expect(bcDropdownContainer.tagName).toBe('DIV');
    });

    test('should have correct classes', () => {
      expect([...bcDropdownContainer.classList]).toEqual([
        'plp-dropdown-container',
        'bc',
      ]);
    });

    test('should have correct children', () => {
      global.siteString = 'bc';
      const currentOption = PLPDropdownCurrentOption();
      const caret = BCDropdownCaret();

      expect(firstChild).toEqual(currentOption);
      expect(lastChild).toEqual(caret);
    });
  });

  global.siteString = 'cc';
  global.onCompetitiveCyclist = true;
});