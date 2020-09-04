const cc="www.competitivecyclist.com"===window.location.host,siteString=cc?"cc":"bc",onPLP=document.getElementsByClassName("search-results").length,onPDP=document.getElementsByClassName("js-kraken-pdp-body").length;chrome.runtime.sendMessage({cc});class ab{constructor(a,b,c,d){const e=document.createElement(a);return b&&e.classList.add(...b),c&&(e.id=c),d&&(e.textContent=d),e}}class aa extends ab{constructor(a){const b=super("a",[...(onPDP?["pdp",cc?"btn--secondary":"product-buybox__btn"]:["plp"]),"link-to-wms","btn","btn-reset",siteString],null,"Go to WMS");return b.setAttribute("type","button"),b.href=`https://manager.backcountry.com/manager/admin/item_inventory.html?item_id=${a}`,b}}class ac{constructor(){const a=document.createElementNS("http://www.w3.org/2000/svg","svg");a.classList.add("bc-dropdown-caret"),a.setAttribute("viewBox","0 0 256 256");const b=document.createElementNS("http://www.w3.org/2000/svg","path");return b.setAttribute("d","M203.628 107.72c-5.613 5.9-64.759 63.566-64.759 63.566-3.007 3.149-6.939 4.714-10.87 4.714-3.945 0-7.876-1.567-10.87-4.714 0 0-59.145-57.665-64.773-63.565-5.613-5.9-6-16.501 0-22.812 6.014-6.296 14.386-6.79 21.738 0l53.905 52.908 53.891-52.894c7.365-6.79 15.752-6.296 21.738 0 6.014 6.296 5.641 16.912 0 22.797z"),b.classList.add("caret-path"),a.append(b),a}}class ad extends ab{constructor({price:a,SKU:b,outOfStock:c,variant:d,imageSrc:e},f,g,h,i,j){const k=super("li",["plp-dropdown-option-single"],null,`${d} (${a})`);c&&k.classList.add("oos-alert");const l=`https://content.${cc?"competitivecyclist":"backcountry"}.com${e}`;return k.onmouseenter=()=>{h.src!==l&&(h.src=l)},k.onclick=()=>{if(j(),i.firstChild.textContent!==a&&!f.variantSelected){for(;i.lastChild;)i.lastChild.remove();i.append(new ab("span",["ui-pl-pricing__high-price","ui-pl-pricing--price-retail","js-item-price-high","qa-item-price-high"],null,a)),f.variantSelected=!0}else i.firstChild.textContent=a;navigator.clipboard.writeText(b),g.classList.toggle("copy-notif"),g.textContent="SKU Copied!",setTimeout(()=>{g.classList.toggle("copy-notif"),g.textContent=d},300)},k}}const getItemInfo=async a=>{try{let b=await fetch(`https://api.backcountry.com/v1/products/${a}?fields=skus.availability.stockLevel,skus.title,skus.id,skus.salePrice,skus.image&site=${cc?"competitivecyclist":"bcs"}`);return b=await b.json(),Promise.resolve(await b.products[0].skus)}catch(a){console.log(a)}};class af extends ab{constructor(a,b,c){const d=super("ul",["plp-dropdown-options",siteString]),e={variantSelected:!1};let f;const g=a=>{const b=()=>{d.childNodes[f].classList.toggle("curr-selected-option")};0<=f&&b(),f=a,b()};return getItemInfo(a).then(a=>{const f=c.getElementsByTagName("img")[0],h=c.getElementsByClassName("js-pl-pricing")[0];for(let c=0;c<a.length;c+=1){const i=a[c],j={price:new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(i.salePrice),SKU:i.ID,outOfStock:!i.availability.stockLevel,variant:i.title,imageSrc:i.image.url};d.append(new ad(j,e,b,f,h,()=>g(c)))}}),d}}class ae extends ab{constructor(a,b){const c=super("div",["plp-dropdown-container",siteString]),d=new ab("div",["plp-dropdown-current-option",siteString],null,"Select option");c.append(...[d,...[cc?[]:new ac]]);let f;return c.onclick=c=>{cc&&c.stopPropagation(),f?f.classList.toggle("hidden"):(f=new af(a,d,b),this.append(f))},b.onmouseleave=()=>{f&&f.classList.add("hidden")},c}}const runOnAllElemsofClass=(a,b)=>{const c=[...document.getElementsByClassName(a)];for(const d of c)b(d)},deleteAllElemsOfClass=a=>{runOnAllElemsofClass(a,a=>a.remove())};class ah extends ab{constructor(a,b){const c=super("div",["plp-widget-container"]);return c.append(new ae(a,b),new aa(a)),c}}const addPLPWidgets=()=>{cc||(deleteAllElemsOfClass("js-pl-focus-trigger"),deleteAllElemsOfClass("js-pl-color-thumbs"),deleteAllElemsOfClass("js-pl-sizes-wrap"),runOnAllElemsofClass("js-pl-expandable",({style:a})=>{a.top="10px",a.left="10px",a.right="10px",a.bottom="10px"})),runOnAllElemsofClass("js-pli-wrap",a=>{const b=a.parentElement.getAttribute("data-product-id"),c=a.childNodes[2];c.append(new ah(b,c))})};if(onPLP){addPLPWidgets();const a=document.getElementsByClassName(cc?"js-inner-body":"inner-body")[0];new MutationObserver(()=>{addPLPWidgets()}).observe(a,{childList:!0})}class ag extends ab{constructor(){const a=super("button",[...(cc?["btn--secondary","buy-box__compare-btn"]:["product-buybox__btn"]),"btn","btn-reset",siteString],"copy-sku-button","Copy SKU");return a.setAttribute("type","button"),a.onmouseleave=()=>{this.textContent="Copy SKU",this.classList.remove("no-variant-selected")},a.onclick=()=>{const a=document.getElementsByClassName("js-selected-product-variant")[0].value;a?(navigator.clipboard.writeText(a),this.textContent="Copied!",this.classList.add("flash"),setTimeout(()=>{this.classList.remove("flash")},100)):(this.textContent="Choose Item",this.classList.add("no-variant-selected"))},a}}const addOOSAlertToCCPDP=()=>{const a=new ab("script",null,null,"for(const a of document.getElementsByClassName(\"js-unifiedropdown-option\")){const b=a.getAttribute(\"sku-value\");b&&!BC.product.skusCollection[b].inventory&&a.classList.add(\"oos-alert\")}");document.head.append(a),a.remove()};if(onPDP){const a=cc,b=document.querySelector("[name =\"/atg/commerce/order/purchase/CartModifierFormHandler.productId\"]").value,c=document.getElementsByClassName(a?"add-to-cart":"js-buybox-actions")[0];a&&addOOSAlertToCCPDP(),c.append(new aa(b),new ag)}