let productList;
let bonusPoints = 0;
let stockInfo;
let itemCount;
let lastSelectedProduct;
let productSelector;
let addToCartButton;
let totalAmount = 0;
const PRODUCT_ONE = 'p1';
const PRODUCT_TWO = 'p2';
const PRODUCT_THREE = 'p3';
const PRODUCT_FOUR = 'p4';
const PRODUCT_FIVE = `p5`;
let cartDisplay;
function main() {
  var root;
  let header;
  let gridContainer;
  let leftColumn;
  let selectorContainer;
  let rightColumn;
  let manualToggle;
  let manualOverlay;
  let manualColumn;
  let lightningDelay;
  totalAmount = 0;
  itemCount = 0;
  lastSelectedProduct = null;
  productList = [
    {
      id: PRODUCT_ONE,
      name: '버그 없애는 키보드',
      price: 10000,
      originalPrice: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_TWO,
      name: '생산성 폭발 마우스',
      price: 20000,
      originalPrice: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_THREE,
      name: '거북목 탈출 모니터암',
      price: 30000,
      originalPrice: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FOUR,
      name: '에러 방지 노트북 파우치',
      price: 15000,
      originalPrice: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_FIVE,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      price: 25000,
      originalPrice: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ];
  var root = document.getElementById('app');
  header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = /* HTML */ `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  gridContainer = document.createElement('div');
  leftColumn = document.createElement('div');
  leftColumn['className'] = 'bg-white border border-gray-200 p-8 overflow-y-auto';
  selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';
  productSelector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';
  addToCartButton = document.createElement('button');
  stockInfo = document.createElement('div');
  addToCartButton.id = 'add-to-cart';
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';
  addToCartButton.innerHTML = 'Add to Cart';
  addToCartButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addToCartButton);
  selectorContainer.appendChild(stockInfo);
  leftColumn.appendChild(selectorContainer);
  cartDisplay = document.createElement('div');
  leftColumn.appendChild(cartDisplay);
  cartDisplay.id = 'cart-items';
  rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = /* HTML */ `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
    <div class="flex-1 flex flex-col">
      <div id="summary-details" class="space-y-3"></div>
      <div class="mt-auto">
        <div id="discount-info" class="mb-4"></div>
        <div id="cart-total" class="pt-5 border-t border-white/10">
          <div class="flex justify-between items-baseline">
            <span class="text-sm uppercase tracking-wider">Total</span>
            <div class="text-2xl tracking-tight">₩0</div>
          </div>
          <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
        </div>
        <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
          <div class="flex items-center gap-2">
            <span class="text-2xs">🎉</span>
            <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
          </div>
        </div>
      </div>
    </div>
    <button
      class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30"
    >
      Proceed to Checkout
    </button>
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br />
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
  cartTotalElement = rightColumn.querySelector('#cart-total');
  manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = /* HTML */ `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  `;
  manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
  manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = /* HTML */ `
    <button
      class="absolute top-4 right-4 text-gray-500 hover:text-black"
      onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">개별 상품</p>
          <p class="text-gray-700 text-xs pl-2">
            • 키보드 10개↑: 10%<br />
            • 마우스 10개↑: 15%<br />
            • 모니터암 10개↑: 20%<br />
            • 스피커 10개↑: 25%
          </p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">전체 수량</p>
          <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">특별 할인</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: +10%<br />
            • ⚡번개세일: 20%<br />
            • 💝추천할인: 5%
          </p>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br />
            • 키보드+마우스: +50p<br />
            • 풀세트: +100p<br />
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br />
        • ⚡+💝 중복 가능<br />
        • 상품4 = 품절
      </p>
    </div>
  `;
  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  manualOverlay.appendChild(manualColumn);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
  updateProductSelectorOptions();
  calculateCartTotal();
  lightningDelay = Math.random() * 10000;
  setTimeout(() => {
    setInterval(function () {
      const luckyIndex = Math.floor(Math.random() * productList.length);
      const luckyProduct = productList[luckyIndex];
      if (luckyProduct.quantity > 0 && !luckyProduct.onSale) {
        luckyProduct.price = Math.round((luckyProduct.originalPrice * 80) / 100);
        luckyProduct.onSale = true;
        alert('⚡번개세일! ' + luckyProduct.name + '이(가) 20% 할인 중입니다!');
        updateProductSelectorOptions();
        updatePricesInCart();
      }
    }, 30000);
  }, lightningDelay);
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        let suggestedProduct = null;
        for (let k = 0; k < productList.length; k++) {
          if (productList[k].id !== lastSelectedProduct) {
            if (productList[k].quantity > 0) {
              if (!productList[k].suggestSale) {
                suggestedProduct = productList[k];
                break;
              }
            }
          }
        }
        if (suggestedProduct) {
          alert('💝 ' + suggestedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggestedProduct.price = Math.round((suggestedProduct.price * (100 - 5)) / 100);
          suggestedProduct.suggestSale = true;
          updateProductSelectorOptions();
          updatePricesInCart();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
let cartTotalElement;
function updateProductSelectorOptions() {
  let totalStock;
  let option;
  let discountText;
  productSelector.innerHTML = '';
  totalStock = 0;
  for (let idx = 0; idx < productList.length; idx++) {
    const product = productList[idx];
    totalStock = totalStock + product.quantity;
  }
  for (var i = 0; i < productList.length; i++) {
    (function () {
      const product = productList[i];
      option = document.createElement('option');
      option.value = product.id;
      discountText = '';
      if (product.onSale) discountText += ' ⚡SALE';
      if (product.suggestSale) discountText += ' 💝추천';
      if (product.quantity === 0) {
        option.textContent = product.name + ' - ' + product.price + '원 (품절)' + discountText;
        option.disabled = true;
        option.className = 'text-gray-400';
      } else {
        if (product.onSale && product.suggestSale) {
          option.textContent =
            '⚡💝' + product.name + ' - ' + product.originalPrice + '원 → ' + product.price + '원 (25% SUPER SALE!)';
          option.className = 'text-purple-600 font-bold';
        } else if (product.onSale) {
          option.textContent =
            '⚡' + product.name + ' - ' + product.originalPrice + '원 → ' + product.price + '원 (20% SALE!)';
          option.className = 'text-red-500 font-bold';
        } else if (product.suggestSale) {
          option.textContent =
            '💝' + product.name + ' - ' + product.originalPrice + '원 → ' + product.price + '원 (5% 추천할인!)';
          option.className = 'text-blue-500 font-bold';
        } else {
          option.textContent = product.name + ' - ' + product.price + '원' + discountText;
        }
      }
      productSelector.appendChild(option);
    })();
  }
  if (totalStock < 50) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
}
function calculateCartTotal() {
  let cartItems;
  let subtotal;
  let itemDiscounts;
  let lowStockItems;
  let idx;
  var originalTotal;
  let bulkDiscount;
  let savedAmount;
  let summaryDetails;
  let totalDiv;
  let loyaltyPointsDiv;
  let points;
  let discountInfoDiv;
  let itemCountElement;
  let previousCount;
  let stockMessage;
  totalAmount = 0;
  itemCount = 0;
  originalTotal = totalAmount;
  cartItems = cartDisplay.children;
  subtotal = 0;
  bulkDiscount = subtotal;
  itemDiscounts = [];
  lowStockItems = [];
  for (idx = 0; idx < productList.length; idx++) {
    if (productList[idx].quantity < 5 && productList[idx].quantity > 0) {
      lowStockItems.push(productList[idx].name);
    }
  }
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentProduct;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentProduct = productList[j];
          break;
        }
      }
      const quantityElement = cartItems[i].querySelector('.quantity-number');
      let quantity;
      let itemTotal;
      let discount;
      quantity = parseInt(quantityElement.textContent);
      itemTotal = currentProduct.price * quantity;
      discount = 0;
      itemCount += quantity;
      subtotal += itemTotal;
      const itemDiv = cartItems[i];
      const priceElements = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElements.forEach(function (element) {
        if (element.classList.contains('text-lg')) {
          element.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });
      if (quantity >= 10) {
        if (currentProduct.id === PRODUCT_ONE) {
          discount = 10 / 100;
        } else {
          if (currentProduct.id === PRODUCT_TWO) {
            discount = 15 / 100;
          } else {
            if (currentProduct.id === PRODUCT_THREE) {
              discount = 20 / 100;
            } else {
              if (currentProduct.id === PRODUCT_FOUR) {
                discount = 5 / 100;
              } else {
                if (currentProduct.id === PRODUCT_FIVE) {
                  discount = 25 / 100;
                }
              }
            }
          }
        }
        if (discount > 0) {
          itemDiscounts.push({ name: currentProduct.name, discount: discount * 100 });
        }
      }
      totalAmount += itemTotal * (1 - discount);
    })();
  }
  let discountRate = 0;
  var originalTotal = subtotal;
  if (itemCount >= 30) {
    totalAmount = (subtotal * 75) / 100;
    discountRate = 25 / 100;
  } else {
    discountRate = (subtotal - totalAmount) / subtotal;
  }
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmount > 0) {
      totalAmount = (totalAmount * 90) / 100;
      discountRate = 1 - totalAmount / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
  document.getElementById('item-count').textContent = '🛍️ ' + itemCount + ' items in cart';
  summaryDetails = document.getElementById('summary-details');
  summaryDetails.innerHTML = '';
  if (subtotal > 0) {
    for (let i = 0; i < cartItems.length; i++) {
      var currentProduct;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentProduct = productList[j];
          break;
        }
      }
      const quantityElement = cartItems[i].querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);
      const itemTotal = currentProduct.price * quantity;
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${currentProduct.name} x ${quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }
    summaryDetails.innerHTML += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;
    if (itemCount >= 30) {
      summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }
    if (isTuesday) {
      if (totalAmount > 0) {
        summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-purple-400">
            <span class="text-xs">🌟 화요일 추가 할인</span>
            <span class="text-xs">-10%</span>
          </div>
        `;
      }
    }
    summaryDetails.innerHTML += /* HTML */ `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
  totalDiv = cartTotalElement.querySelector('.text-2xl');
  if (totalDiv) {
    totalDiv.textContent = '₩' + Math.round(totalAmount).toLocaleString();
  }
  loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    points = Math.floor(totalAmount / 1000);
    if (points > 0) {
      loyaltyPointsDiv.textContent = '적립 포인트: ' + points + 'p';
      loyaltyPointsDiv.style.display = 'block';
    } else {
      loyaltyPointsDiv.textContent = '적립 포인트: 0p';
      loyaltyPointsDiv.style.display = 'block';
    }
  }
  discountInfoDiv = document.getElementById('discount-info');
  discountInfoDiv.innerHTML = '';
  if (discountRate > 0 && totalAmount > 0) {
    savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
  itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    itemCountElement.textContent = '🛍️ ' + itemCount + ' items in cart';
    if (previousCount !== itemCount) {
      itemCountElement.setAttribute('data-changed', 'true');
    }
  }
  stockMessage = '';
  for (let stockIndex = 0; stockIndex < productList.length; stockIndex++) {
    const product = productList[stockIndex];
    if (product.quantity < 5) {
      if (product.quantity > 0) {
        stockMessage = stockMessage + product.name + ': 재고 부족 (' + product.quantity + '개 남음)\n';
      } else {
        stockMessage = stockMessage + product.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMessage;
  updateStockInfo();
  renderBonusPoints();
}
var renderBonusPoints = function () {
  let basePoints;
  let finalPoints;
  let pointsDetail;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;
  let cartNodes;
  if (cartDisplay.children.length === 0) {
    document.getElementById('loyalty-points').style.display = 'none';
    return;
  }
  basePoints = Math.floor(totalAmount / 1000);
  finalPoints = 0;
  pointsDetail = [];
  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;
  cartNodes = cartDisplay.children;
  for (const node of cartNodes) {
    let product = null;
    for (let productIndex = 0; productIndex < productList.length; productIndex++) {
      if (productList[productIndex].id === node.id) {
        product = productList[productIndex];
        break;
      }
    }
    if (!product) continue;
    if (product.id === PRODUCT_ONE) {
      hasKeyboard = true;
    } else if (product.id === PRODUCT_TWO) {
      hasMouse = true;
    } else if (product.id === PRODUCT_THREE) {
      hasMonitorArm = true;
    }
  }
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }
  if (itemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }
  bonusPoints = finalPoints;
  const pointsTag = document.getElementById('loyalty-points');
  if (pointsTag) {
    if (bonusPoints > 0) {
      pointsTag.innerHTML =
        '<div>적립 포인트: <span class="font-bold">' +
        bonusPoints +
        'p</span></div>' +
        '<div class="text-2xs opacity-70 mt-1">' +
        pointsDetail.join(', ') +
        '</div>';
      pointsTag.style.display = 'block';
    } else {
      pointsTag.textContent = '적립 포인트: 0p';
      pointsTag.style.display = 'block';
    }
  }
};
function getTotalStock() {
  let total;
  let i;
  let currentProduct;
  total = 0;
  for (i = 0; i < productList.length; i++) {
    currentProduct = productList[i];
    total += currentProduct.quantity;
  }
  return total;
}
var updateStockInfo = function () {
  let infoMessage;
  let totalStock;
  infoMessage = '';
  totalStock = getTotalStock();
  if (totalStock < 30) {
  }
  productList.forEach(function (product) {
    if (product.quantity < 5) {
      if (product.quantity > 0) {
        infoMessage = infoMessage + product.name + ': 재고 부족 (' + product.quantity + '개 남음)\n';
      } else {
        infoMessage = infoMessage + product.name + ': 품절\n';
      }
    }
  });
  stockInfo.textContent = infoMessage;
};
function updatePricesInCart() {
  let totalCount = 0,
    j = 0;
  let cartItems;
  while (cartDisplay.children[j]) {
    const quantity = cartDisplay.children[j].querySelector('.quantity-number');
    totalCount += quantity ? parseInt(quantity.textContent) : 0;
    j++;
  }
  totalCount = 0;
  for (j = 0; j < cartDisplay.children.length; j++) {
    totalCount += parseInt(cartDisplay.children[j].querySelector('.quantity-number').textContent);
  }
  cartItems = cartDisplay.children;
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIndex = 0; productIndex < productList.length; productIndex++) {
      if (productList[productIndex].id === itemId) {
        product = productList[productIndex];
        break;
      }
    }
    if (product) {
      const priceDiv = cartItems[i].querySelector('.text-lg');
      const nameDiv = cartItems[i].querySelector('h3');
      if (product.onSale && product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-purple-600">₩' +
          product.price.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡💝' + product.name;
      } else if (product.onSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-red-500">₩' +
          product.price.toLocaleString() +
          '</span>';
        nameDiv.textContent = '⚡' + product.name;
      } else if (product.suggestSale) {
        priceDiv.innerHTML =
          '<span class="line-through text-gray-400">₩' +
          product.originalPrice.toLocaleString() +
          '</span> <span class="text-blue-500">₩' +
          product.price.toLocaleString() +
          '</span>';
        nameDiv.textContent = '💝' + product.name;
      } else {
        priceDiv.textContent = '₩' + product.price.toLocaleString();
        nameDiv.textContent = product.name;
      }
    }
  }
  calculateCartTotal();
}
main();
addToCartButton.addEventListener('click', function () {
  const selectedProductId = productSelector.value;
  let hasProduct = false;
  for (let idx = 0; idx < productList.length; idx++) {
    if (productList[idx].id === selectedProductId) {
      hasProduct = true;
      break;
    }
  }
  if (!selectedProductId || !hasProduct) {
    return;
  }
  let productToAdd = null;
  for (let j = 0; j < productList.length; j++) {
    if (productList[j].id === selectedProductId) {
      productToAdd = productList[j];
      break;
    }
  }
  if (productToAdd && productToAdd.quantity > 0) {
    const item = document.getElementById(productToAdd['id']);
    if (item) {
      const quantityElement = item.querySelector('.quantity-number');
      const newQuantity = parseInt(quantityElement['textContent']) + 1;
      if (newQuantity <= productToAdd.quantity + parseInt(quantityElement.textContent)) {
        quantityElement.textContent = newQuantity;
        productToAdd['quantity']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = productToAdd.id;
      newItem.className =
        'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';
      newItem.innerHTML = /* HTML */ `
        <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
          <div
            class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
          ></div>
        </div>
        <div>
          <h3 class="text-base font-normal mb-1 tracking-tight">
            ${productToAdd.onSale && productToAdd.suggestSale
              ? '⚡💝'
              : productToAdd.onSale
                ? '⚡'
                : productToAdd.suggestSale
                  ? '💝'
                  : ''}${productToAdd.name}
          </h3>
          <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
          <p class="text-xs text-black mb-3">
            ${productToAdd.onSale || productToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                productToAdd.originalPrice.toLocaleString() +
                '</span> <span class="' +
                (productToAdd.onSale && productToAdd.suggestSale
                  ? 'text-purple-600'
                  : productToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500') +
                '">₩' +
                productToAdd.price.toLocaleString() +
                '</span>'
              : '₩' + productToAdd.price.toLocaleString()}
          </p>
          <div class="flex items-center gap-4">
            <button
              class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
              data-product-id="${productToAdd.id}"
              data-change="-1"
            >
              −
            </button>
            <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
            <button
              class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
              data-product-id="${productToAdd.id}"
              data-change="1"
            >
              +
            </button>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg mb-2 tracking-tight tabular-nums">
            ${productToAdd.onSale || productToAdd.suggestSale
              ? '<span class="line-through text-gray-400">₩' +
                productToAdd.originalPrice.toLocaleString() +
                '</span> <span class="' +
                (productToAdd.onSale && productToAdd.suggestSale
                  ? 'text-purple-600'
                  : productToAdd.onSale
                    ? 'text-red-500'
                    : 'text-blue-500') +
                '">₩' +
                productToAdd.price.toLocaleString() +
                '</span>'
              : '₩' + productToAdd.price.toLocaleString()}
          </div>
          <a
            class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
            data-product-id="${productToAdd.id}"
            >Remove</a
          >
        </div>
      `;
      cartDisplay.appendChild(newItem);
      productToAdd.quantity--;
    }
    calculateCartTotal();
    lastSelectedProduct = selectedProductId;
  }
});
cartDisplay.addEventListener('click', function (event) {
  const target = event.target;
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    let product = null;
    for (let productIndex = 0; productIndex < productList.length; productIndex++) {
      if (productList[productIndex].id === productId) {
        product = productList[productIndex];
        break;
      }
    }
    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      var quantityElement = itemElement.querySelector('.quantity-number');
      const currentQuantity = parseInt(quantityElement.textContent);
      const newQuantity = currentQuantity + quantityChange;
      if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
        quantityElement.textContent = newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        product.quantity += currentQuantity;
        itemElement.remove();
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      var quantityElement = itemElement.querySelector('.quantity-number');
      const removedQuantity = parseInt(quantityElement.textContent);
      product.quantity += removedQuantity;
      itemElement.remove();
    }

    calculateCartTotal();
    updateProductSelectorOptions();
  }
});
