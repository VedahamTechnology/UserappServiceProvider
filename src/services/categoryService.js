import { api } from './api';

export const categoryService = {
  getCategories: async () => {
    try {
      const response = await api.get('/api/vendor/services/browse/categories');
      return response;
    } catch (error) {
      throw error;
    }
  },
};
