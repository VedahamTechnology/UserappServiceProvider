import { api } from './api';

export const addressService = {
  getAddresses: async () => {
    try {
      const response = await api.get('/api/user/addresses');
      return response;
    } catch (error) {
      throw error;
    }
  },

  addAddress: async (addressData) => {
    try {
      const response = await api.post('/api/user/addresses', addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await api.put(`/api/user/addresses/${addressId}`, addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  setDefaultAddress: async (addressId) => {
    try {
      const response = await api.put(`/api/user/addresses/${addressId}/default`, {});
      return response;
    } catch (error) {
      throw error;
    }
  },
};
