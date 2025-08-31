// src/util/api.js
import axios from './axios.customize';

const API_PREFIX = '/v1/api';

export const createUserApi = (name, email, password) =>
  axios.post(`${API_PREFIX}/register`, { name, email, password });

export const loginApi = (email, password) =>
  axios.post(`${API_PREFIX}/login`, { email, password });

export const getUserApi = () =>
  axios.get(`${API_PREFIX}/user`);

export const getAccountApi = () =>
  axios.get(`${API_PREFIX}/account`);