import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('wagashi_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wagashi_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const adminApi = axios.create({
  baseURL: '/api',
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('wagashi_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('wagashi_admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
