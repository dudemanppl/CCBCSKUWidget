const {
  fetchJson,
  getItemInfo,
  getVariants,
  usdString,
  formatVariant,
  toggleCurrOptionClass,
  highlightCurrSelectedOption,
} = require('../../../src/plp/dropdown/dropdown');

const createMockDropdown = () => {
  const div = HTMLElem('div');

  div.append(div.cloneNode(), div.cloneNode(), div.cloneNode());

  return div;
};

const getClassesFromMockDropdown = ({
  firstChild: {
    classList: [firstClass],
  },
  lastChild: {
    classList: [lastClass],
  },
}) => [firstClass, lastClass];

describe('fetchJson', () => {
  test('should return http response in json', async () => {
    const testResponse = { test: 'test' };
    fetch.once(JSON.stringify(testResponse));

    const fetchJsonResponse = await fetchJson('http://www.testurl.com');

    expect(fetchJsonResponse).toEqual(testResponse);
  });
});

describe('getItemInfo', () => {
  fetch.mockResponse(({ url }) => Promise.resolve(JSON.stringify(url)));

  describe('Competitive Cyclist', () => {
    test('should be invoked with correct site query', async () => {
      const url = await getItemInfo(testSKU);

      expect(url).toBe(
        'https://api.backcountry.com/v1/products/KSK000I?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=competitivecyclist'
      );
    });
  });

  describe('Backcountry', () => {
    test('should be invoked with correct site query', async () => {
      global.onCompetitiveCyclist = false;
      const url = await getItemInfo(testSKU);

      expect(url).toBe(
        'https://api.backcountry.com/v1/products/KSK000I?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=bcs'
      );
    });
  });
});

describe('getVariants', () => {
  describe('Competitive Cyclist', () => {
    test('should return correct array of variants', async () => {
      global.onCompetitiveCyclist = true;
      fetch.once(JSON.stringify(CCResponse));

      const variants = await getVariants(testSKU);

      expect(variants).toEqual(variantsResponse);
    });
  });

  describe('Backcountry', () => {
    test('should return correct array of variants', async () => {
      global.onCompetitiveCyclist = false;
      fetch.once(JSON.stringify(BCResponse));

      const variants = await getVariants(testSKU);

      expect(variants).toEqual(variantsResponse);
    });
  });
});

describe('usdString', () => {
  const result = usdString(1);

  test('should return a string', () => {
    expect(typeof result).toBe('string');
  });

  test('should have two decimal places', () => {
    expect(result).toBe('$1.00');
  });

  test("should start with '$' character", () => {
    expect(result[0]).toBe('$');
  });
});

describe('formatVariant', () => {
  const [firstVariant] = variantsResponse;
  const result = formatVariant(firstVariant);

  test('should return an object', () => {
    expect(result).toBeInstanceOf(Object);
  });

  test('should have correct keys', () => {
    const correctKeys = ['price', 'SKU', 'outOfStock', 'variant', 'imageSrc'];

    expect(Object.keys(result)).toEqual(correctKeys);
    expect(Object.keys(firstVariant)).not.toEqual(correctKeys);
  });

  test('price property should be formatted string', () => {
    const [{ salePrice }] = variantsResponse;
    const formattedSalePrice = usdString(salePrice);

    expect(result.price).toBe(formattedSalePrice);
    expect(typeof result.price).toBe('string');
  });

  test('SKU property should be a string', () => {
    expect(typeof result.SKU).toBe('string');
  });

  test('outOfStock property should be a boolean', () => {
    expect(typeof result.outOfStock).toBe('boolean');
  });

  test('variant property should be a string', () => {
    expect(typeof result.variant).toBe('string');
  });

  test('imageSrc property should be a string', () => {
    expect(typeof result.imageSrc).toBe('string');
  });

  describe('imageSrc should be correct', () => {
    test('Competitive Cyclist', () => {
      expect(result.imageSrc).toBe(
        'https://content.competitivecyclist.com/images/items/medium/KSK/KSK000I/WHT.jpg'
      );
    });
    test('Backcountry', () => {
      global.onCompetitiveCyclist = false;
      const bcResult = formatVariant(firstVariant);

      expect(bcResult.imageSrc).toBe(
        'https://content.backcountry.com/images/items/medium/KSK/KSK000I/WHT.jpg'
      );
    });
  });
});

describe('toggleCurrOptionClass', () => {
  const mockDropdown = createMockDropdown();
  const state = { currentlySelectedOptionIdx: 0 };

  test("should add 'curr-selected-option' class", () => {
    toggleCurrOptionClass(mockDropdown, state);
    const [firstClass, lastClass] = getClassesFromMockDropdown(mockDropdown);

    expect(firstClass).toBe('curr-selected-option');
    expect(lastClass).toBeUndefined();
  });

  test("should remove 'curr-selected-option' class", () => {
    toggleCurrOptionClass(mockDropdown, state);
    const [firstClass, lastClass] = getClassesFromMockDropdown(mockDropdown);

    expect(firstClass).toBeUndefined();
    expect(lastClass).toBeUndefined();
  });
});

describe('highlightCurrSelectedOption', () => {
  const mockDropdown = createMockDropdown();
  const state = { currentlySelectedOptionIdx: -1 };

  test('should change state to the newly selected index when it has not been invoked before', () => {
    highlightCurrSelectedOption(mockDropdown, state, 0);
    const [firstClass, lastClass] = getClassesFromMockDropdown(mockDropdown);

    expect(state.currentlySelectedOptionIdx).toBe(0);
    expect(firstClass).toBe('curr-selected-option');
    expect(lastClass).toBeUndefined();
  });

  test('should change state to the newly selected index', () => {
    highlightCurrSelectedOption(mockDropdown, state, 2);
    const [firstClass, lastClass] = getClassesFromMockDropdown(mockDropdown);

    expect(state.currentlySelectedOptionIdx).toBe(2);
    expect(firstClass).toBeUndefined();
    expect(lastClass).toBe('curr-selected-option');
  });

  test('should not invoked if same option is selected', () => {
    const toggleCurrOptionClass = jest.fn();
    highlightCurrSelectedOption(mockDropdown, state, 2);
    const [firstClass, lastClass] = getClassesFromMockDropdown(mockDropdown);

    expect(state.currentlySelectedOptionIdx).toBe(2);
    expect(firstClass).toBeUndefined();
    expect(lastClass).toBe('curr-selected-option');
    expect(toggleCurrOptionClass).not.toBeCalled();
  });
});
