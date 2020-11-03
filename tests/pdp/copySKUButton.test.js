/* eslint-disable no-undef */
const {
  copySKUButtonOnClick,
  copySKUButtonOnMouseLeave,
  addMethodsToCopySKUButton,
  copySKUButton,
} = require('../../src/pdp/copySKUButton');

describe('copySKUButtonOnClick', () => {
  global.navigator.clipboard = { writeText: jest.fn() };

  describe('with no variant selected', () => {
    const dummySKUElem = HTMLElem('div', ['js-selected-product-variant']);
    document.body.append(dummySKUElem);
    const currentTarget = HTMLElem('div');
    const event = { currentTarget };

    copySKUButtonOnClick(event);

    test('should have correct class added', () => {
      expect(currentTarget.classList[0]).toBe('no-variant-selected');
    });

    test('should have correct text content', () => {
      expect(currentTarget.textContent).toBe('Choose Item');
    });
  });

  describe('with variant selected', () => {
    clearBody();
    const dummySKUElem = HTMLElem('div', ['js-selected-product-variant']);
    dummySKUElem.value = testSKU;
    document.body.append(dummySKUElem);
    const currentTarget = HTMLElem('div');
    const event = { currentTarget };
    jest.useFakeTimers();

    copySKUButtonOnClick(event);

    test('should have correct class added', () => {
      expect(currentTarget.classList[0]).toBe('flash');
    });

    test('should have correct text content', () => {
      expect(currentTarget.textContent).toBe('Copied!');
    });

    test('should have copied SKU to clipboard', () => {
      expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith(
        testSKU
      );
    });

    describe('after cleanup', () => {
      test('should have correct class removed', () => {
        jest.runAllTimers();

        expect([...currentTarget.classList]).toHaveLength(0);
      });

      test('should have correct text content', () => {
        expect(currentTarget.textContent).toBe('Copied!');
      });
    });
  });
});

describe('copySKUButtonOnMouseLeave', () => {
  const copySKUButton = HTMLElem('div');
  copySKUButton.classList.add('no-variant-selected');
  copySKUButton.textContent = '';

  copySKUButtonOnMouseLeave({ currentTarget: copySKUButton });

  test('should have correct text content', () => {
    expect(copySKUButton.textContent).toBe('Copy SKU');
  });

  test('should have correct class removed', () => {
    expect([...copySKUButton.classList]).toHaveLength(0);
  });
});

describe('addMethodsToCopySKUButton', () => {
  const copySKUButton = HTMLElem('div');

  addMethodsToCopySKUButton(copySKUButton);

  test('mouseleave', () => {
    expect(copySKUButton.onmouseleave).toBe(copySKUButtonOnMouseLeave);
  });
  test('onclick', () => {
    expect(copySKUButton.onclick).toBe(copySKUButtonOnClick);
  });
});

describe('copySKUButton', () => {
  const newButton = copySKUButton();

  test('should be a button', () => {
    expect(newButton.tagName).toBe('BUTTON');
  });

  test('should have correct id', () => {
    expect(newButton.id).toBe('copy-sku-button');
  });

  test('should have correct text content', () => {
    expect(newButton.textContent).toBe('Copy SKU');
  });

  test('should have correct type attribute', () => {
    expect(newButton.getAttribute('type')).toBe('button');
  });
});
