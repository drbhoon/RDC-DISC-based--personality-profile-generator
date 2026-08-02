import axios from 'axios';

import { withBase } from '../basePath';

const api = axios.create({
  baseURL: withBase('/api'),
});

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rdc_admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('rdc_admin_token');
      window.location.href = withBase('/admin/login');
    }
    return Promise.reject(err);
  }
);

export default api;
