// src/util/axios.customize.js
import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:8888", // ví dụ: http://localhost:8888
  timeout: 10000
});

// Gắn Authorization trước mỗi request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (!config.headers['Content-Type'] && config.method !== 'get') {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap data + xử lý lỗi 401
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem('access_token');
      // điều hướng về /login
      window.location.href = '/login';
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export default instance;