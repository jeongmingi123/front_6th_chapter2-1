import { generateSaleDisplayText } from '../services/saleService.js';

// 상수 정의
const CSS_CLASSES = {
  CONTAINER: 'mb-6 pb-6 border-b border-gray-200',
  SELECT: 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
  BUTTON:
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all',
  STOCK_INFO: 'text-xs text-red-500 mt-3 whitespace-pre-line',
  DISABLED_OPTION: 'text-gray-400',
};

const ELEMENT_IDS = {
  PRODUCT_SELECT: 'product-select',
  ADD_TO_CART: 'add-to-cart',
  STOCK_STATUS: 'stock-status',
};

const STOCK_THRESHOLDS = {
  LOW_STOCK: 5,
  WARNING_STOCK: 50,
};

const MESSAGES = {
  ADD_TO_CART: 'Add to Cart',
  OUT_OF_STOCK: ' (품절)',
  LOW_STOCK_FORMAT: ': 재고 부족 ({quantity}개 남음)',
  OUT_OF_STOCK_FORMAT: ': 품절',
};

export class ProductSelector {
  constructor() {
    this.element = null;
    this.addToCartButton = null;
    this.stockInfo = null;
  }

  create() {
    const selectorContainer = this.createContainer();

    this.element = this.createSelectElement();
    this.addToCartButton = this.createAddToCartButton();
    this.stockInfo = this.createStockInfoElement();

    selectorContainer.appendChild(this.element);
    selectorContainer.appendChild(this.addToCartButton);
    selectorContainer.appendChild(this.stockInfo);

    return selectorContainer;
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = CSS_CLASSES.CONTAINER;
    return container;
  }

  createSelectElement() {
    const select = document.createElement('select');
    select.id = ELEMENT_IDS.PRODUCT_SELECT;
    select.className = CSS_CLASSES.SELECT;
    return select;
  }

  createAddToCartButton() {
    const button = document.createElement('button');
    button.id = ELEMENT_IDS.ADD_TO_CART;
    button.innerHTML = MESSAGES.ADD_TO_CART;
    button.className = CSS_CLASSES.BUTTON;
    return button;
  }

  createStockInfoElement() {
    const stockInfo = document.createElement('div');
    stockInfo.id = ELEMENT_IDS.STOCK_STATUS;
    stockInfo.className = CSS_CLASSES.STOCK_INFO;
    return stockInfo;
  }

  updateOptions(productList) {
    if (!Array.isArray(productList)) {
      console.warn('ProductSelector: productList must be an array');
      return;
    }

    this.element.innerHTML = '';
    const totalStock = this.calculateTotalStock(productList);

    productList.forEach((product) => {
      const option = this.createProductOption(product);
      this.element.appendChild(option);
    });

    this.updateSelectBorderColor(totalStock);
  }

  createProductOption(product) {
    const option = document.createElement('option');
    option.value = product.id;

    if (product.quantity === 0) {
      this.setOutOfStockOption(option, product);
    } else {
      this.setInStockOption(option, product);
    }

    return option;
  }

  setOutOfStockOption(option, product) {
    option.textContent = `${product.name} - ${product.price}원${MESSAGES.OUT_OF_STOCK}`;
    option.disabled = true;
    option.className = CSS_CLASSES.DISABLED_OPTION;
  }

  setInStockOption(option, product) {
    const { displayText, className } = generateSaleDisplayText(product);
    option.textContent = displayText;
    if (className) {
      option.className = className;
    }
  }

  calculateTotalStock(productList) {
    return productList.reduce((sum, product) => sum + (product.quantity || 0), 0);
  }

  updateSelectBorderColor(totalStock) {
    this.element.style.borderColor = totalStock < STOCK_THRESHOLDS.WARNING_STOCK ? 'orange' : '';
  }

  updateStockInfo(productList) {
    if (!Array.isArray(productList)) {
      console.warn('ProductSelector: productList must be an array');
      return;
    }

    const { lowStockItems, outOfStockItems } = this.checkStockStatus(productList);
    const stockMessage = this.buildStockMessage(lowStockItems, outOfStockItems);
    this.stockInfo.textContent = stockMessage;
  }

  buildStockMessage(lowStockItems, outOfStockItems) {
    let message = '';

    lowStockItems.forEach((item) => {
      message += item.name + MESSAGES.LOW_STOCK_FORMAT.replace('{quantity}', item.quantity) + '\n';
    });

    outOfStockItems.forEach((item) => {
      message += item + MESSAGES.OUT_OF_STOCK_FORMAT + '\n';
    });

    return message;
  }

  checkStockStatus(productList) {
    const lowStockItems = [];
    const outOfStockItems = [];

    productList.forEach((product) => {
      if (product.quantity === 0) {
        outOfStockItems.push(product.name);
      } else if (product.quantity < STOCK_THRESHOLDS.LOW_STOCK) {
        lowStockItems.push(product);
      }
    });

    return { lowStockItems, outOfStockItems };
  }

  getSelectedProductId() {
    return this.element?.value || '';
  }

  addEventListener(event, handler) {
    if (typeof handler !== 'function') {
      console.warn('ProductSelector: handler must be a function');
      return;
    }
    this.addToCartButton?.addEventListener(event, handler);
  }
}
