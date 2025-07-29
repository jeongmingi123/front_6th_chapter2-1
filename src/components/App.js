import { Header } from './Header.js';
import { ProductSelector } from './ProductSelector.js';
import { CartDisplay } from './CartDisplay.js';
import { OrderSummary } from './OrderSummary.js';
import { ManualManager } from './ManualManager.js';
import { calculateCartItems, calculateFinalAmount } from '../services/cartService.js';
import { applyLightningSale, applyRecommendationSale } from '../services/saleService.js';

export class App {
  constructor() {
    this.productList = [];
    this.bonusPoints = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
    this.totalAmount = 0;

    // 컴포넌트들
    this.header = new Header();
    this.productSelector = new ProductSelector();
    this.cartDisplay = new CartDisplay();
    this.orderSummary = new OrderSummary();
    this.manualOverlay = new ManualManager();
  }

  initialize(initialProducts) {
    // 초기화
    this.totalAmount = 0;
    this.itemCount = 0;
    this.lastSelectedProduct = null;
    this.productList = JSON.parse(JSON.stringify(initialProducts)); // 깊은 복사

    // DOM 요소 생성
    this.createLayout();

    // 이벤트 리스너 설정
    this.setupEventListeners();

    // 초기 상태 업데이트
    this.updateProductSelectorOptions();
    this.calculateCartTotal();

    // 자동 세일 설정
    this.setupAutoSales();
  }

  createLayout() {
    const root = document.getElementById('app');

    // 헤더 생성
    const header = this.header.create();
    root.appendChild(header);

    // 메인 그리드 컨테이너 생성
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

    // 왼쪽 컬럼 (상품 선택 + 장바구니)
    const leftColumn = this.createLeftColumn();

    // 오른쪽 컬럼 (주문 요약)
    const rightColumn = this.orderSummary.create();

    gridContainer.appendChild(leftColumn);
    gridContainer.appendChild(rightColumn);
    root.appendChild(gridContainer);

    // 매뉴얼 오버레이 생성
    this.manualOverlay.create();
  }

  createLeftColumn() {
    const leftColumn = document.createElement('div');
    leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

    // 선택기 컨테이너
    const selectorContainer = this.productSelector.create();

    // 장바구니 표시 영역
    const cartDisplayElement = this.cartDisplay.create();

    leftColumn.appendChild(selectorContainer);
    leftColumn.appendChild(cartDisplayElement);

    return leftColumn;
  }

  setupEventListeners() {
    this.productSelector.addEventListener('click', (event) => this.handleAddToCart(event));
    this.cartDisplay.addEventListener('click', (event) => this.handleCartInteraction(event));
  }

  setupAutoSales() {
    // 번개세일 설정
    const lightningDelay = Math.random() * 10000;
    setTimeout(() => {
      setInterval(() => {
        const luckyIndex = Math.floor(Math.random() * this.productList.length);
        const luckyProduct = this.productList[luckyIndex];

        if (applyLightningSale(luckyProduct)) {
          alert('⚡번개세일! ' + luckyProduct.name + '이(가) 20% 할인 중입니다!');
          this.updateProductSelectorOptions();
          this.updatePricesInCart();
        }
      }, 30000);
    }, lightningDelay);

    // 추천할인 설정
    setTimeout(() => {
      setInterval(() => {
        if (this.lastSelectedProduct) {
          let suggestedProduct = null;
          for (let k = 0; k < this.productList.length; k++) {
            if (
              this.productList[k].id !== this.lastSelectedProduct &&
              this.productList[k].quantity > 0 &&
              !this.productList[k].suggestSale
            ) {
              suggestedProduct = this.productList[k];
              break;
            }
          }

          if (suggestedProduct && applyRecommendationSale(suggestedProduct)) {
            alert('💝 ' + suggestedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
            this.updateProductSelectorOptions();
            this.updatePricesInCart();
          }
        }
      }, 60000);
    }, Math.random() * 20000);
  }

  updateProductSelectorOptions() {
    this.productSelector.updateOptions(this.productList);
  }

  calculateCartTotal() {
    const cartItems = this.cartDisplay.getItems();

    // 장바구니 아이템 계산
    const {
      subtotal,
      totalAmount: calculatedTotal,
      itemCount: calculatedItemCount,
      itemDiscounts,
    } = calculateCartItems(cartItems, this.productList);

    // 최종 금액 계산
    const finalAmount = calculateFinalAmount(subtotal, calculatedTotal, calculatedItemCount);

    // 전역 변수 업데이트
    this.totalAmount = finalAmount;
    this.itemCount = calculatedItemCount;

    // UI 업데이트
    this.header.updateItemCount(this.itemCount);
    this.orderSummary.updateSummaryDetails(
      cartItems,
      this.productList,
      subtotal,
      itemDiscounts,
      calculatedItemCount,
      finalAmount
    );
    this.orderSummary.updateCartTotal(finalAmount);
    this.bonusPoints = this.orderSummary.updatePointsInfo(finalAmount, cartItems, this.productList);
    this.orderSummary.updateDiscountInfo(subtotal, finalAmount);
    this.productSelector.updateStockInfo(this.productList);
    this.orderSummary.updateTuesdaySpecial(this.totalAmount);
  }

  updatePricesInCart() {
    this.cartDisplay.updatePrices(this.productList);
    this.calculateCartTotal();
  }

  handleAddToCart() {
    const selectedProductId = this.productSelector.getSelectedProductId();
    const productToAdd = this.productList.find((p) => p.id === selectedProductId);

    // 유효하지 않은 상품이거나 재고가 없는 경우 early return
    if (!productToAdd || productToAdd.quantity <= 0) {
      return;
    }

    const existingItem = this.cartDisplay.findItem(productToAdd.id);

    // 기존 아이템이 있는 경우 수량 증가 처리
    if (existingItem) {
      this.handleExistingItemQuantityIncrease(existingItem, productToAdd);
    } else {
      // 새 아이템 추가
      this.cartDisplay.addItem(productToAdd);
      productToAdd.quantity--;
    }

    this.calculateCartTotal();
    this.lastSelectedProduct = selectedProductId;
  }

  handleExistingItemQuantityIncrease(existingItem, productToAdd) {
    const quantityElement = existingItem.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElement.textContent);
    const newQuantity = currentQuantity + 1;
    const availableStock = productToAdd.quantity + currentQuantity;

    // 재고 부족 시 early return
    if (newQuantity > availableStock) {
      alert('재고가 부족합니다.');
      return;
    }

    // 수량 증가 및 재고 감소
    quantityElement.textContent = newQuantity;
    productToAdd.quantity--;
  }

  handleCartInteraction(event) {
    const target = event.target;

    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;
      const itemElement = this.cartDisplay.findItem(productId);
      const product = this.productList.find((p) => p.id === productId);

      if (!product || !itemElement) return;

      if (target.classList.contains('quantity-change')) {
        const quantityChange = parseInt(target.dataset.change);
        const quantityElement = itemElement.querySelector('.quantity-number');
        const currentQuantity = parseInt(quantityElement.textContent);
        const newQuantity = currentQuantity + quantityChange;

        if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
          quantityElement.textContent = newQuantity;
          product.quantity -= quantityChange;
        } else if (newQuantity <= 0) {
          product.quantity += currentQuantity;
          this.cartDisplay.removeItem(productId);
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (target.classList.contains('remove-item')) {
        const quantityElement = itemElement.querySelector('.quantity-number');
        const removedQuantity = parseInt(quantityElement.textContent);
        product.quantity += removedQuantity;
        this.cartDisplay.removeItem(productId);
      }

      this.calculateCartTotal();
      this.updateProductSelectorOptions();
    }
  }
}
