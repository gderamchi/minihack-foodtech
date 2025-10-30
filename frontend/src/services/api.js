import axios from 'axios';

// Use relative URL in production (same domain), localhost in development
// In production, VITE_API_URL should not be set, so it defaults to '/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5001/api');

console.log('API Base URL:', API_BASE_URL); // Debug log to verify in production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dishes API
export const dishesAPI = {
  getAll: (params) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  delete: (id) => api.delete(`/dishes/${id}`),
  generateVeganAlternative: (data) => api.post('/dishes/generate-vegan-alternative', data),
  analyzeVegan: (data) => api.post('/dishes/analyze-vegan', data),
  addRating: (id, data) => api.post(`/dishes/${id}/ratings`, data),
};

// Menus API
export const menusAPI = {
  getAll: (params) => api.get('/menus', { params }),
  getById: (id) => api.get(`/menus/${id}`),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
  getFeatured: () => api.get('/menus/featured/base'),
  addRating: (id, data) => api.post(`/menus/${id}/ratings`, data),
};

// Stores API
export const storesAPI = {
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
  findNearby: (params) => {
    // Add default pagination params
    const paginatedParams = {
      limit: 50,
      page: 1,
      ...params
    };
    return api.get('/stores/nearby', { params: paginatedParams });
  },
  findWithIngredients: (data) => api.post('/stores/find-with-ingredients', data),
  getRecommendationsForDish: (data) => api.post('/stores/recommendations-for-dish', data),
  addRating: (id, data) => api.post(`/stores/${id}/ratings`, data),
};

// Users API
export const usersAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  updateLocation: (data) => api.put('/users/me/location', data),
  saveMenu: (menuId) => api.post(`/users/me/saved-menus/${menuId}`),
  unsaveMenu: (menuId) => api.delete(`/users/me/saved-menus/${menuId}`),
  saveDish: (dishId) => api.post(`/users/me/saved-dishes/${dishId}`),
  unsaveDish: (dishId) => api.delete(`/users/me/saved-dishes/${dishId}`),
  changePassword: (data) => api.put('/users/me/password', data),
};

export default api;
