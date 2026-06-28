/**
 * Currency formatting — keep all currency rendering in one place so
 * localization (₹ vs $) is a single edit later.
 */

export const formatINR = (n) => {
  const num = Number(n) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

/** Platform fee applied at checkout. */
export const PLATFORM_FEE = 49;

/** GST rate applied at checkout. */
export const GST_RATE = 0.18;

/** Compute total = base + platform fee + tax. */
export const computeBookingTotal = (basePrice) => {
  const base = Number(basePrice) || 0;
  const tax = Math.round(base * GST_RATE);
  return base + PLATFORM_FEE + tax;
};
