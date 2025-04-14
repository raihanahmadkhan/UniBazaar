import axios from 'axios';
import { getAuth } from 'firebase/auth';
import config from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.apiBaseUrl,
});

// Add request interceptor to automatically add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added auth token to request');
      }
      
      return config;
    } catch (error) {
      console.error('Error adding auth token to request:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    }
    
    return Promise.reject(error);
  }
);

// API functions for listings
export const listingsApi = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  getUserListings: () => api.get('/listings/mine'),
  create: (data) => api.post('/listings', data),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// API functions for users
export const usersApi = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users', data),
  verifyEmail: (token) => api.get(`/users/verify-email/${token}`),
  resendVerification: () => api.post('/users/resend-verification'),
  createProfile: (data) => api.post('/users', data),
};

export default api;
