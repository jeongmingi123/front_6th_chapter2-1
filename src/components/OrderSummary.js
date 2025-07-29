import { generateCartSummary, calculatePointsInfo } from '../services/cartService.js';

export class OrderSummary {
  constructor() {
    this.element = null;
    this.cartTotalElement = null;
    this.summaryDetails = null;
    this.discountInfo = null;
    this.cartTotal = null;
    this.loyaltyPoints = null;
    this.tuesdaySpecial = null;
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'bg-black text-white p-8 flex flex-col';
    this.element.innerHTML = /* HTML */ `
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

    // 요소 참조 저장
    this.cartTotalElement = this.element.querySelector('#cart-total');
    this.summaryDetails = this.element.querySelector('#summary-details');
    this.discountInfo = this.element.querySelector('#discount-info');
    this.cartTotal = this.element.querySelector('#cart-total .text-2xl');
    this.loyaltyPoints = this.element.querySelector('#loyalty-points');
    this.tuesdaySpecial = this.element.querySelector('#tuesday-special');

    return this.element;
  }

  updateSummaryDetails(cartItems, productList, subtotal, itemDiscounts, itemCount, finalAmount) {
    const { summaryItems, discountInfo } = generateCartSummary(
      cartItems,
      productList,
      subtotal,
      itemDiscounts,
      itemCount,
      finalAmount
    );

    this.summaryDetails.innerHTML = '';

    if (subtotal > 0) {
      // 개별 상품 정보
      summaryItems.forEach((item) => {
        this.summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-xs tracking-wide text-gray-400">
            <span>${item.name} x ${item.quantity}</span>
            <span>₩${item.total.toLocaleString()}</span>
          </div>
        `;
      });

      // 구분선
      this.summaryDetails.innerHTML += /* HTML */ `
        <div class="border-t border-white/10 my-3"></div>
        <div class="flex justify-between text-sm tracking-wide">
          <span>Subtotal</span>
          <span>₩${subtotal.toLocaleString()}</span>
        </div>
      `;

      // 할인 정보
      discountInfo.forEach((discount) => {
        this.summaryDetails.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${discount.name}</span>
            <span class="text-xs">${discount.rate}</span>
          </div>
        `;
      });

      // 배송 정보
      this.summaryDetails.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-gray-400">
          <span>Shipping</span>
          <span>Free</span>
        </div>
      `;
    }
  }

  updateCartTotal(finalAmount) {
    if (this.cartTotal) {
      this.cartTotal.textContent = '₩' + Math.round(finalAmount).toLocaleString();
    }
  }

  updatePointsInfo(finalAmount, cartItems, productList) {
    const { totalPoints, details } = calculatePointsInfo(finalAmount, cartItems, productList);

    if (this.loyaltyPoints) {
      if (totalPoints > 0) {
        this.loyaltyPoints.innerHTML = /* HTML */ `
          <div>적립 포인트: <span class="font-bold">${totalPoints}p</span></div>
          <div class="text-2xs opacity-70 mt-1">${details.join(', ')}</div>
        `;
        this.loyaltyPoints.style.display = 'block';
      } else {
        this.loyaltyPoints.textContent = '적립 포인트: 0p';
        this.loyaltyPoints.style.display = 'none';
      }
    }

    return totalPoints;
  }

  updateDiscountInfo(subtotal, finalAmount) {
    this.discountInfo.innerHTML = '';

    if (subtotal > 0 && finalAmount < subtotal) {
      const savedAmount = subtotal - finalAmount;
      const discountRate = ((subtotal - finalAmount) / subtotal) * 100;

      this.discountInfo.innerHTML = /* HTML */ `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${discountRate.toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    }
  }

  updateTuesdaySpecial(totalAmount) {
    const today = new Date();
    const isTuesday = today.getDay() === 2;

    if (isTuesday && totalAmount > 0) {
      this.tuesdaySpecial.classList.remove('hidden');
    } else {
      this.tuesdaySpecial.classList.add('hidden');
    }
  }
}
