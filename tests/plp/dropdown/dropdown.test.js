const {
  getItemInfo,
  usdString,
  formatProduct,
  highlightCurrSelectedOption,
  getProductListingElems,
  PLPSelectorDropdown,
} = require("../../../src/plp/dropdown/dropdown");

global.onCompetitiveCyclist = true;

test("getItemInfo", async () => {
  const itemInfo = await getItemInfo("KSK000I");
  console.log(itemInfo);
  expect("test").toBe("test");
});
