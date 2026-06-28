/**
 * Date utilities. All date formatting goes through here so we can swap
 * to a single locale and consistent format later.
 */

import { DATE_PICKER_WEEKDAY_KEYS } from '../constants/timeSlots';

/**
 * Format a Date as YYYY-MM-DD — used as a date picker key and as the
 * `bookingDate` value sent to the API.
 */
export const formatDateKey = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Display a booking date in the user-facing format.
 * `withTime = true` appends HH:mm (used on Bookings tab cards).
 */
export const formatDisplayDate = (date, { withTime = false } = {}) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const opts = withTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return d.toLocaleDateString('en-IN', opts);
};

/**
 * Compact format for notification list rows: "12 Jun, 14:30"
 */
export const formatRelative = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate `count` consecutive date keys starting from today.
 */
export const nextDateKeys = (count = 7) => {
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    out.push(formatDateKey(d));
  }
  return out;
};

/**
 * Compare two date keys (YYYY-MM-DD) for equality.
 */
export const isSameDateKey = (a, b) => formatDateKey(new Date(a)) === formatDateKey(new Date(b));

/**
 * Check if a date key represents today.
 */
export const isTodayKey = (dateKey) => formatDateKey(new Date()) === formatDateKey(new Date(dateKey));

/**
 * Short weekday name from a date key. Defaults to English; pass a translator
 * to localize.
 */
export const weekdayName = (dateKey, translator) => {
  const idx = new Date(dateKey).getDay(); // 0..6 (Sun..Sat)
  const key = DATE_PICKER_WEEKDAY_KEYS[idx];
  return translator ? translator(key) : key;
};
