import { PRODUCT_IDS } from '../data/products.js';

// 개별 상품 할인율 계산
export function calculateIndividualDiscount(productId, quantity) {
  if (quantity < 10) return 0;

  const discountRates = {
    [PRODUCT_IDS.KEYBOARD]: 0.1, // 10%
    [PRODUCT_IDS.MOUSE]: 0.15, // 15%
    [PRODUCT_IDS.MONITOR_ARM]: 0.2, // 20%
    [PRODUCT_IDS.LAPTOP_POUCH]: 0.05, // 5%
    [PRODUCT_IDS.SPEAKER]: 0.25, // 25%
  };

  return discountRates[productId] || 0;
}

// 대량구매 할인율 계산 (30개 이상)
export function calculateBulkDiscount(totalQuantity) {
  return totalQuantity >= 30 ? 0.25 : 0; // 25%
}

// 화요일 특별 할인율 계산
export function calculateTuesdayDiscount() {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  return isTuesday ? 0.1 : 0; // 10%
}

// 총 할인율 계산
export function calculateTotalDiscountRate(itemDiscounts, totalQuantity, subtotal) {
  let totalDiscountAmount = 0;

  // 개별 상품 할인
  itemDiscounts.forEach((item) => {
    totalDiscountAmount += item.discountAmount;
  });

  // 대량구매 할인
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  if (bulkDiscount > 0) {
    totalDiscountAmount += subtotal * bulkDiscount;
  }

  // 화요일 할인
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0) {
    const amountAfterBulkDiscount = subtotal - subtotal * bulkDiscount;
    totalDiscountAmount += amountAfterBulkDiscount * tuesdayDiscount;
  }

  return subtotal > 0 ? totalDiscountAmount / subtotal : 0;
}

// 할인 정보 생성
export function generateDiscountInfo(itemDiscounts, totalQuantity, subtotal) {
  const discountInfo = [];

  // 개별 상품 할인 정보
  itemDiscounts.forEach((item) => {
    discountInfo.push({
      type: 'individual',
      name: item.name,
      rate: item.discountRate * 100,
      amount: item.discountAmount,
    });
  });

  // 대량구매 할인 정보
  const bulkDiscount = calculateBulkDiscount(totalQuantity);
  if (bulkDiscount > 0) {
    discountInfo.push({
      type: 'bulk',
      name: '대량구매 할인 (30개 이상)',
      rate: bulkDiscount * 100,
      amount: subtotal * bulkDiscount,
    });
  }

  // 화요일 할인 정보
  const tuesdayDiscount = calculateTuesdayDiscount();
  if (tuesdayDiscount > 0) {
    const amountAfterBulkDiscount = subtotal - subtotal * bulkDiscount;
    discountInfo.push({
      type: 'tuesday',
      name: '화요일 추가 할인',
      rate: tuesdayDiscount * 100,
      amount: amountAfterBulkDiscount * tuesdayDiscount,
    });
  }

  return discountInfo;
}
