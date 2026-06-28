/**
 * Custom error class for API failures.
 * Keeps `status`, `body`, and `code` accessible everywhere the error bubbles up.
 */
export class ApiError extends Error {
  constructor(message, { status, body, code } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.code = code;
  }

  /** True for reschedule/cancel-style "too late" responses (400/403). */
  isClientError() {
    return this.status >= 400 && this.status < 500;
  }

  /** Helpful user-facing message when the backend returns nothing useful. */
  get userMessage() {
    return this.message || 'Something went wrong. Please try again.';
  }
}
