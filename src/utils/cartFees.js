export const calcFees = (subtotal) => {
  const deliveryFee = subtotal > 0 && subtotal < 500 ? 40 : 0;
  const platformFee = 10;
  const packingCharge = 20;
  const grandTotal = subtotal + deliveryFee + platformFee + packingCharge;
  const savings = deliveryFee === 0 && subtotal > 0 ? 40 : 0;
  return { deliveryFee, platformFee, packingCharge, grandTotal, savings };
};