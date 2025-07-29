import { generateSaleDisplayText } from '../services/saleService.js';

export class ProductSelector {
  constructor() {
    this.element = null;
    this.addToCartButton = null;
    this.stockInfo = null;
  }

  create() {
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

    // 상품 선택기 생성
    this.element = document.createElement('select');
    this.element.id = 'product-select';
    this.element.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

    // 장바구니 버튼
    this.addToCartButton = document.createElement('button');
    this.addToCartButton.id = 'add-to-cart';
    this.addToCartButton.innerHTML = 'Add to Cart';
    this.addToCartButton.className =
      'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

    // 재고 정보
    this.stockInfo = document.createElement('div');
    this.stockInfo.id = 'stock-status';
    this.stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

    selectorContainer.appendChild(this.element);
    selectorContainer.appendChild(this.addToCartButton);
    selectorContainer.appendChild(this.stockInfo);

    return selectorContainer;
  }

  updateOptions(productList) {
    this.element.innerHTML = '';

    const totalStock = productList.reduce((sum, product) => sum + product.quantity, 0);

    productList.forEach((product) => {
      const option = document.createElement('option');
      option.value = product.id;

      const { displayText, className } = generateSaleDisplayText(product);

      if (product.quantity === 0) {
        option.textContent = product.name + ' - ' + product.price + '원 (품절)';
        option.disabled = true;
        option.className = 'text-gray-400';
      } else {
        option.textContent = displayText;
        if (className) {
          option.className = className;
        }
      }

      this.element.appendChild(option);
    });

    // 재고 부족 시 테두리 색상 변경
    if (totalStock < 50) {
      this.element.style.borderColor = 'orange';
    } else {
      this.element.style.borderColor = '';
    }
  }

  updateStockInfo(productList) {
    const { lowStockItems, outOfStockItems } = this.checkStockStatus(productList);

    let stockMessage = '';

    lowStockItems.forEach((item) => {
      stockMessage += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
    });

    outOfStockItems.forEach((item) => {
      stockMessage += `${item}: 품절\n`;
    });

    this.stockInfo.textContent = stockMessage;
  }

  checkStockStatus(productList) {
    const lowStockItems = [];
    const outOfStockItems = [];

    productList.forEach((product) => {
      if (product.quantity === 0) {
        outOfStockItems.push(product.name);
      } else if (product.quantity < 5) {
        lowStockItems.push(product);
      }
    });

    return { lowStockItems, outOfStockItems };
  }

  getSelectedProductId() {
    return this.element.value;
  }

  addEventListener(event, handler) {
    this.addToCartButton.addEventListener(event, handler);
  }
}
