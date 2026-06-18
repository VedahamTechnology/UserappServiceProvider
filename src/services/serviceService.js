import { api } from './api';

export const serviceService = {
  getServices: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

      const queryString = queryParams.toString();
      const endpoint = `/api/user/services${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getServicesByCategory: async (categoryId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.search) queryParams.append('search', params.search);

      const queryString = queryParams.toString();
      const endpoint = `/api/user/services/category/${categoryId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getServiceDetails: async (serviceId) => {
    try {
      const response = await api.get(`/api/user/services/${serviceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
