/**
 * @typedef {Object} TimeSlot
 * @property {string} startTime  // "HH:mm"
 * @property {string} endTime    // "HH:mm"
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} serviceName
 * @property {string} date        ISO string — bookingDate or scheduledDate
 * @property {string} [rawDate]
 * @property {TimeSlot|null} [timeSlot]
 * @property {string} status      normalized: 'pending'|'accepted'|'confirmed'|'in_progress'|'completed'|'cancelled'|'rejected'|'default'
 * @property {string} rawStatus
 * @property {number} price
 * @property {string} [providerName]
 * @property {string} [customerNotes]
 * @property {Object} [serviceAddress]
 */

export {};
