/**
 * Shared validators. Messages are translation keys — the consuming screen
 * runs them through `t()`.
 */

export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());

export const isValidIndianPincode = (pincode) =>
  /^\d{6}$/.test(String(pincode || '').trim());

export const isValidPhone = (phone) => {
  const cleaned = String(phone || '').replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const isStrongEnoughPassword = (password) =>
  String(password || '').length >= 6;

/**
 * Indian states — used by ManageAddressScreen to pick the "state" out of
 * a free-form geocoded address string.
 */
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];
