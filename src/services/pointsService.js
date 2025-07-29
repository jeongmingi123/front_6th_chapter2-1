import { PRODUCT_IDS } from '../data/products.js';

// 기본 포인트 계산 (구매액의 0.1%)
export function calculateBasePoints(totalAmount) {
  return Math.floor(totalAmount / 1000);
}

// 화요일 포인트 배수 적용
export function applyTuesdayBonus(basePoints) {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  return isTuesday ? basePoints * 2 : basePoints;
}

// 세트 구매 보너스 포인트 계산
export function calculateSetBonus(cartItems, productList) {
  let bonus = 0;
  const details = [];

  // cartItems를 배열로 변환
  const cartItemsArray = Array.from(cartItems);

  // 키보드+마우스 세트 보너스
  const hasKeyboard = cartItemsArray.some((item) => {
    const product = productList.find((p) => p.id === item.id);
    return product && product.id === PRODUCT_IDS.KEYBOARD;
  });

  const hasMouse = cartItemsArray.some((item) => {
    const product = productList.find((p) => p.id === item.id);
    return product && product.id === PRODUCT_IDS.MOUSE;
  });

  if (hasKeyboard && hasMouse) {
    bonus += 50;
    details.push('키보드+마우스 세트 +50p');
  }

  // 풀세트 보너스 (키보드+마우스+모니터암)
  const hasMonitorArm = cartItemsArray.some((item) => {
    const product = productList.find((p) => p.id === item.id);
    return product && product.id === PRODUCT_IDS.MONITOR_ARM;
  });

  if (hasKeyboard && hasMouse && hasMonitorArm) {
    bonus += 100;
    details.push('풀세트 구매 +100p');
  }

  return { bonus, details };
}

// 대량구매 보너스 포인트 계산
export function calculateQuantityBonus(totalQuantity) {
  let bonus = 0;
  let detail = '';

  if (totalQuantity >= 30) {
    bonus = 100;
    detail = '대량구매(30개+) +100p';
  } else if (totalQuantity >= 20) {
    bonus = 50;
    detail = '대량구매(20개+) +50p';
  } else if (totalQuantity >= 10) {
    bonus = 20;
    detail = '대량구매(10개+) +20p';
  }

  return { bonus, detail };
}

// 총 포인트 계산
export function calculateTotalPoints(totalAmount, cartItems, productList) {
  let basePoints = calculateBasePoints(totalAmount);
  let finalPoints = 0;
  const details = [];

  // 기본 포인트
  if (basePoints > 0) {
    finalPoints = basePoints;
    details.push(`기본: ${basePoints}p`);
  }

  // 화요일 보너스
  const tuesdayPoints = applyTuesdayBonus(basePoints);
  if (tuesdayPoints !== basePoints) {
    finalPoints = tuesdayPoints;
    details.push('화요일 2배');
  }

  // 세트 보너스
  const setBonus = calculateSetBonus(cartItems, productList);
  finalPoints += setBonus.bonus;
  details.push(...setBonus.details);

  // 대량구매 보너스
  const cartItemsArray = Array.from(cartItems);
  const totalQuantity = cartItemsArray.reduce((sum, item) => {
    const quantityElement = item.querySelector('.quantity-number');
    return sum + (quantityElement ? parseInt(quantityElement.textContent) : 0);
  }, 0);

  const quantityBonus = calculateQuantityBonus(totalQuantity);
  finalPoints += quantityBonus.bonus;
  if (quantityBonus.detail) {
    details.push(quantityBonus.detail);
  }

  return {
    totalPoints: finalPoints,
    details: details,
  };
}
