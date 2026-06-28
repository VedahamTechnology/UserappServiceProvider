/**
 * Single source of truth for booking time slots.
 * Used by CheckoutScreen, BookingActions (reschedule), and any future scheduling UI.
 */

export const TIME_SLOTS = [
  { startTime: '09:00', endTime: '11:00' },
  { startTime: '11:00', endTime: '13:00' },
  { startTime: '13:00', endTime: '15:00' },
  { startTime: '15:00', endTime: '17:00' },
  { startTime: '17:00', endTime: '19:00' },
];

/** Number of future days shown in date pickers. */
export const DATE_PICKER_DAYS = 7;

/** Day-of-week labels for date pickers — i18n keys consumed via t(). */
export const DATE_PICKER_WEEKDAY_KEYS = [
  'date.sun',
  'date.mon',
  'date.tue',
  'date.wed',
  'date.thu',
  'date.fri',
  'date.sat',
];
