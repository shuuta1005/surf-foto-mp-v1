//features/cart/cart-utils.ts

//This function is used in checkout api to return the discounted price depending on the number of photos in the cart
export function getDiscountedTotal(count: number): number {
  if (count === 1) return 1000;
  if (count === 2) return 1600;
  if (count === 3) return 2100;
  if (count === 4) return 2400;
  if (count === 5) return 2500;
  return count * 500;
}

export function getOriginalPrice(count: number): number {
  return count * 1000;
}

export function getDiscount(count: number): number {
  return getOriginalPrice(count) - getDiscountedTotal(count);
}
