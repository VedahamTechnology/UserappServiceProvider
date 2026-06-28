import { api } from './api/client';
import { ENDPOINTS } from './api/endpoints';

export const addressService = {
  getAddresses: () => api.get(ENDPOINTS.addresses()),

  addAddress: (addressData) => api.post(ENDPOINTS.addresses(), addressData),

  updateAddress: (addressId, addressData) =>
    api.put(ENDPOINTS.updateAddress(addressId), addressData),

  setDefaultAddress: (addressId) =>
    api.put(ENDPOINTS.setDefaultAddress(addressId), {}),
};
