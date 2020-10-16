const {
  fetchJson,
  getItemInfo,
  getVariants,
  usdString,
  formatProduct,
  highlightCurrSelectedOption,
  getProductListingElems,
  PLPSelectorDropdown,
} = require("../../../src/plp/dropdown/dropdown");

global.onCompetitiveCyclist = true;

describe("fetchJson", () => {
  test("should return http response in json", async () => {
    const testResponse = { test: "test" };
    fetch.once(JSON.stringify(testResponse));

    const fetchJsonResponse = await fetchJson("http://www.testurl.com");

    expect(fetchJsonResponse).toEqual(testResponse);
  });
});

describe("getItemInfo", () => {
  fetch.mockResponse(({ url }) => Promise.resolve(JSON.stringify(url)));

  describe("Competitive Cyclist", () => {
    test("should be invoked with correct site query", async () => {
      const url = await getItemInfo("KSK000I");

      expect(url).toBe(
        "https://api.backcountry.com/v1/products/KSK000I?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=competitivecyclist"
      );
    });
  });

  describe("Backcountry", () => {
    test("should be invoked with correct site query", async () => {
      global.onCompetitiveCyclist = false;
      const url = await getItemInfo("KSK000I");

      expect(url).toBe(
        "https://api.backcountry.com/v1/products/KSK000I?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=bcs"
      );
    });
  });
});

describe("getVariants", () => {
  describe("Competitive Cyclist", () => {
    test("should return correct array of variants", async () => {
      global.onCompetitiveCyclist = true;
      fetch.once(JSON.stringify(CCResponse));

      const variants = await getVariants("KSK000I");

      expect(variants).toEqual(variantsResponse);
    });
  });

  describe("Backcountry", () => {
    test("should return correct array of variants", async () => {
      global.onCompetitiveCyclist = false;
      fetch.once(JSON.stringify(BCResponse));

      const variants = await getVariants("KSK000I");

      expect(variants).toEqual(variantsResponse);
    });
  });
});

describe("usdString", () => {
  const result = usdString(1);

  test("should return a string", () => {
    expect(typeof result).toBe("string");
  });

  test("should have two decimal places", () => {
    expect(result).toBe("$1.00");
  });

  test("should start with '$' character", () => {
    expect(result[0]).toBe("$");
  });
});

describe("formatProduct", () => {
  const [firstVariant] = variantsResponse;
  const result = formatProduct(firstVariant);

  test("should return an object", () => {
    expect(result).toBeInstanceOf(Object);
  });

  test("should have correct keys", () => {
    const correctKeys = ["price", "SKU", "outOfStock", "variant", "imageSrc"];

    expect(Object.keys(result)).toEqual(correctKeys);
    expect(Object.keys(firstVariant)).not.toEqual(correctKeys);
  });

  test("price property should be formatted string", () => {
    const [{ salePrice }] = variantsResponse;
    const formattedSalePrice = usdString(salePrice);

    expect(result.price).toBe(formattedSalePrice);
    expect(typeof result.price).toBe("string");
  });

  test("SKU property should be a string", () => {
    expect(typeof result.SKU).toBe("string");
  });

  test("outOfStock property should be a boolean", () => {
    expect(typeof result.outOfStock).toBe("boolean");
  });

  test("variant property should be a string", () => {
    expect(typeof result.variant).toBe("string");
  });

  test("imageSrc property should be a string", () => {
    expect(typeof result.imageSrc).toBe("string");
  });
});

describe('highlightCurrSelectedOption',()=>{
  
})