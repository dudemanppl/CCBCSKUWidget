require('jest-fetch-mock').enableMocks();

const { HTMLElem, classnamesForElem } = require('../src/shared/index');

global.HTMLElem = HTMLElem;

global.classnamesForElem = classnamesForElem;

global.onCompetitiveCyclist = true;
global.siteString = 'cc';
global.onPLP = false;
global.onPDP = false;

global.clearBody = () => {
  document.body.innerHTML = '';
  global.onCompetitiveCyclist = true;
};

global.mockProductListing = (SKU = testSKU) => {
  const productListing = HTMLElem('div');
  productListing.setAttribute('data-product-id', SKU);
  productListing.append(HTMLElem('div'));

  return productListing;
};

global.mockDropdownContainer = () => {
  const mockDropdownContainer = HTMLElem('div');
  mockDropdownContainer.append(HTMLElem('div', ['plp-dropdown-options']));

  return mockDropdownContainer;
};

global.testSKU = 'KSK000I';

global.testFullSKU = 'KSK000I-WHT-S';

global.testVariant = 'White1, S';

global.variantsResponse = [
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/WHT.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-WHT-S',
    availability: {
      stockLevel: 6,
    },
    title: 'White1, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/WHI.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-WHI-S',
    availability: {
      stockLevel: 4,
    },
    title: 'White/Red, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/WHIA.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-WHIA-M',
    availability: {
      stockLevel: 1,
    },
    title: 'White/Lime, M',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/RED.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-RED-S',
    availability: {
      stockLevel: 3,
    },
    title: 'Red, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/RED.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-RED-M',
    availability: {
      stockLevel: 3,
    },
    title: 'Red, M',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/PINBL.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-PINBL-S',
    availability: {
      stockLevel: 2,
    },
    title: 'Pink/Navy Blue, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/PINBL.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-PINBL-L',
    availability: {
      stockLevel: 1,
    },
    title: 'Pink/Navy Blue, L',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/MAT.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-MAT-S',
    availability: {
      stockLevel: 5,
    },
    title: 'Matte Black, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/MAT.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-MAT-M',
    availability: {
      stockLevel: 32,
    },
    title: 'Matte Black, M',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/LIM.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-LIM-S',
    availability: {
      stockLevel: 4,
    },
    title: 'Lime, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/LIM.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-LIM-M',
    availability: {
      stockLevel: 6,
    },
    title: 'Lime, M',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/LIM.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-LIM-L',
    availability: {
      stockLevel: 1,
    },
    title: 'Lime, L',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/LTBLA.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-LTBLA-S',
    availability: {
      stockLevel: 3,
    },
    title: 'Light Blue, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BLMAT.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BLMAT-S',
    availability: {
      stockLevel: 3,
    },
    title: 'Blue Matte, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BLMAT.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BLMAT-M',
    availability: {
      stockLevel: 12,
    },
    title: 'Blue Matte, M',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BKW.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BKW-S',
    availability: {
      stockLevel: 3,
    },
    title: 'Black/White, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BLA.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BLA-S',
    availability: {
      stockLevel: 10,
    },
    title: 'Black/Red, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BLAA.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BLAA-S',
    availability: {
      stockLevel: 5,
    },
    title: 'Black/Lime, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BLAA.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BLAA-M',
    availability: {
      stockLevel: 9,
    },
    title: 'Black/Lime, M',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BLAA.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BLAA-L',
    availability: {
      stockLevel: 1,
    },
    title: 'Black/Lime, L',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/LTBL.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-LTBL-S',
    availability: {
      stockLevel: 2,
    },
    title: 'Black/Blue, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BKBK.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BKBK-S',
    availability: {
      stockLevel: 1,
    },
    title: 'Black/Black, S',
  },
  {
    image: {
      url: '/images/items/medium/KSK/KSK000I/BKBK.jpg',
    },
    salePrice: 299.95,
    id: 'KSK000I-BKBK-M',
    availability: {
      stockLevel: 10,
    },
    title: 'Black/Black, M',
  },
];

const metadata = {
  found: 1,
  time: 2,
  productSummary: {
    KSK000I: {
      salePrice: {
        min: 299.95,
        max: 299.95,
      },
    },
  },
};

const products = [
  {
    skus: global.variantsResponse,
    id: 'KSK000I',
  },
];

global.BCResponse = {
  metadata,
  products,
};

global.CCResponse = {
  metadata,
  products,
};

global.CCResponse.products[0].description =
  "<p>While the cyclists at Team Sky are more renowned for their legs than their brains, the latter do occasionally play a significant role in cycling. Case in point is Stannard's surgical dismantling of an apparently invincible Ettix-Quickstep at Omloop. Given that cycling is often equal parts cunning and strength, the pros at Sky rely on Kask's Protone Helmet to keep their strategic organ in top shape so it can effectively direct their energies when frantic finales send all the blood rushing to the legs.</p>\n\n<p>Tactical engines like Stannard's are protected by an in-mold construction of a polycarbonate shell bonded with an EPS foam body, all of which is built on a frame designed to let the helmet absorb impact while still maintaining enough structural integrity to see you safely through the duration of a crash.</p>\n\n<p>While safety is a helmet's first (and usually last) job, there are certain benchmarks that today's industry expects top-end protectives to meet. The current frontrunner in this category is aerodynamics, and the Kask ran the Protone through the expected wind-tunnel paces in order to design a model that dodges the wind whether you're head-on in the drops or in virtually any other cycling posture imaginable.</p>\n\n<p>The second consideration is cooling, and unlike many of its competitors, the Protone doesn't sacrifice ventilation for aerodynamics. In addition to the immediately obvious vents and rear exhaust port, the Protone incorporates Coolmax padding. Coolmax padding equates to more efficient moisture transfer and evaporation to complement your body's natural cooling process. They're also odor-resistant, removable, and contribute to the comfortable, personalized fit of the floating Octo Fit cradle and corresponding ECO Chinstrap.</p>";

global.formattedProduct = {
  price: '$299.95',
  SKU: 'KSK000I-WHT-S',
  outOfStock: false,
  variant: 'White1, S',
  imageSrc: '/images/items/medium/KSK/KSK000I/WHT.jpg',
};
