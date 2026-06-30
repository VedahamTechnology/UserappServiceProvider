/**
 * Payment service — wraps the backend's Razorpay flow endpoints.
 *
 * Two-step flow:
 *   1. createOrder(bookingId) → returns { order, key } from Razorpay
 *   2. verifyPayment({ bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature })
 *      → backend marks booking.payment.status = 'completed' and booking.status = 'completed'
 *
 * Uses the shared `api` client (Bearer token, JSON, ApiError on non-2xx)
 * — same pattern as bookingService.js.
 */

import { api } from './api/client';
import { ENDPOINTS } from './api/endpoints';

export const paymentService = {
  /**
   * Phase 1 — create a Razorpay order for an existing booking.
   * Backend expects: { bookingId } and returns:
   *   { success, order: { id, amount, currency, receipt }, key }
   */
  createOrder: (bookingId) => api.post(ENDPOINTS.createOrder(), { bookingId }),

  /**
   * Phase 3 — verify a payment after the user completes the Razorpay popup.
   * Backend validates the HMAC signature and updates the booking.
   */
  verifyPayment: ({
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }) =>
    api.post(ENDPOINTS.verifyPayment(), {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
};
