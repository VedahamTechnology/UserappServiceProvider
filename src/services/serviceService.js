import { api } from './api/client';
import { ENDPOINTS, buildQuery } from './api/endpoints';

const serviceParams = (params = {}) => {
  const allowed = ['page', 'limit', 'sortBy', 'sortOrder', 'minPrice', 'maxPrice', 'search'];
  const filtered = Object.fromEntries(Object.entries(params).filter(([k]) => allowed.includes(k)));
  return buildQuery(filtered);
};

export const serviceService = {
  getServices: (params = {}) => api.get(ENDPOINTS.services(), { query: serviceParams(params) }),

  getServicesByCategory: (categoryId, params = {}) =>
    api.get(ENDPOINTS.servicesByCategory(categoryId), { query: serviceParams(params) }),

  getServiceDetails: (serviceId) => api.get(ENDPOINTS.serviceDetail(serviceId)),
};
