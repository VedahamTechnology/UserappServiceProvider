/**
 * Mappers — convert raw API response objects to our domain shapes.
 * Centralized so we only deal with messy backend field names in one place.
 */

import { STATUS_COLORS } from '../constants/colors';

/** Coerce status to a known lowercase key, or 'default'. */
const normalizeStatus = (s) => {
  const k = String(s || '').toLowerCase().trim();
  return STATUS_COLORS[k] ? k : 'default';
};

export const mapUser = (raw) => ({
  id: raw._id || raw.id,
  userId: raw.userId,
  firstName: raw.firstName || '',
  lastName: raw.lastName || '',
  email: raw.email || '',
  phone: raw.phone || '',
  role: raw.role || 'customer',
  gender: raw.gender || 'male',
  isActive: raw.isActive !== false,
  avatar: raw.avatar || raw.profileImage || null,
  createdAt: raw.createdAt,
});

export const mapCategory = (raw) => ({
  id: raw._id || raw.id,
  name: raw.name || '',
  image: raw.image || '',
  description: raw.description || '',
});

/**
 * Pick the first MongoId-shaped string from a value. Vendors can be
 * represented as a populated object `{ _id }`, a bare string, or wrapped
 * in a `vendorId` / `vendors[].vendorId` array — handle all three.
 */
const pickVendorId = (raw) => {
  if (!raw) return null;
  // Bare string id
  if (typeof raw === 'string') return raw;
  // Populated object
  if (typeof raw === 'object') {
    if (raw._id) return raw._id;
    if (raw.id) return raw.id;
  }
  return null;
};

export const mapService = (raw) => ({
  id: raw._id || raw.id,
  name: raw.name || '',
  description: raw.description || '',
  image: raw.image || '',
  category: raw.category ? mapCategory(raw.category) : null,
  categoryName: raw.category?.name || '',
  basePrice: Number(raw.basePrice ?? raw.price ?? 0),
  discountedPrice: Number(raw.discountedPrice ?? 0),
  estimatedDuration: raw.estimatedDuration || 60,
  features: Array.isArray(raw.features) ? raw.features : [],
  rating: Number(raw.rating ?? 4.5),
  // Preserve vendor info — required by CheckoutScreen to build the booking payload.
  // The backend exposes this as `vendorId` (string or populated), `vendor`
  // (populated object), or `vendors` (array of { vendorId }) depending on
  // the endpoint and the service's state.
  vendorId:
    pickVendorId(raw.vendorId) ||
    pickVendorId(raw.vendor) ||
    pickVendorId(raw.vendors?.[0]?.vendorId) ||
    null,
  vendor: raw.vendor || null,
});

export const mapBooking = (raw) => ({
  id: raw._id || raw.id,
  serviceName: raw.serviceId?.name || 'Service',
  date: raw.scheduledDate || raw.bookingDate || raw.createdAt,
  rawDate: raw.bookingDate || raw.scheduledDate,
  timeSlot: raw.timeSlot || null,
  status: normalizeStatus(raw.status),
  rawStatus: raw.status || '',
  price: Number(raw.totalPrice ?? raw.price ?? 0),
  providerName: raw.providerId?.name || '',
  customerNotes: raw.customerNotes || '',
  serviceAddress: raw.serviceAddress || null,
});

export const mapAddress = (raw) => ({
  id: raw._id || raw.id,
  label: raw.label || 'Other',
  street: raw.street || '',
  city: raw.city || '',
  state: raw.state || '',
  pincode: raw.pincode || '',
  latitude: raw.latitude ?? null,
  longitude: raw.longitude ?? null,
  isDefault: !!raw.isDefault,
});

export const mapNotification = (raw) => ({
  id: raw._id || raw.id,
  title: raw.title || '',
  message: raw.message || '',
  type: raw.type || 'default',
  isRead: !!raw.isRead,
  createdAt: raw.createdAt,
  raw: raw,
});

/** Best-effort extraction of a list from a varied API response shape. */
export const extractList = (response, ...keys) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  for (const key of keys) {
    const candidate = response[key];
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === 'object') {
      for (const inner of keys) {
        if (Array.isArray(candidate[inner])) return candidate[inner];
      }
    }
  }
  return [];
};
