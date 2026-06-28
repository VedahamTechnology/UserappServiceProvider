import { api } from './api/client';
import { ENDPOINTS } from './api/endpoints';

export const categoryService = {
  getCategories: () => api.get(ENDPOINTS.categories()),
};
