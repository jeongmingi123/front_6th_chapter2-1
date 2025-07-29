// 번개세일 적용 (20% 할인)
export function applyLightningSale(product) {
  if (product.quantity > 0 && !product.onSale) {
    product.price = Math.round((product.originalPrice * 80) / 100);
    product.onSale = true;
    return true;
  }
  return false;
}

// 추천할인 적용 (5% 할인)
export function applyRecommendationSale(product) {
  if (product.quantity > 0 && !product.suggestSale) {
    product.price = Math.round((product.price * 95) / 100);
    product.suggestSale = true;
    return true;
  }
  return false;
}

// 세일 상태에 따른 표시 텍스트 생성
export function generateSaleDisplayText(product) {
  let displayText = product.name;
  let className = '';

  if (product.onSale && product.suggestSale) {
    displayText = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
    className = 'text-purple-600 font-bold';
  } else if (product.onSale) {
    displayText = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
    className = 'text-red-500 font-bold';
  } else if (product.suggestSale) {
    displayText = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
    className = 'text-blue-500 font-bold';
  } else {
    displayText = `${product.name} - ${product.price}원`;
  }

  return { displayText, className };
}

// 세일 상태에 따른 가격 표시 HTML 생성
export function generatePriceDisplayHTML(product) {
  if (product.onSale && product.suggestSale) {
    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-purple-600">₩${product.price.toLocaleString()}</span>`;
  } else if (product.onSale) {
    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-red-500">₩${product.price.toLocaleString()}</span>`;
  } else if (product.suggestSale) {
    return `<span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> <span class="text-blue-500">₩${product.price.toLocaleString()}</span>`;
  } else {
    return `₩${product.price.toLocaleString()}`;
  }
}

// 세일 상태에 따른 상품명 표시 생성
export function generateProductNameDisplay(product) {
  if (product.onSale && product.suggestSale) {
    return '⚡💝' + product.name;
  } else if (product.onSale) {
    return '⚡' + product.name;
  } else if (product.suggestSale) {
    return '💝' + product.name;
  } else {
    return product.name;
  }
}
