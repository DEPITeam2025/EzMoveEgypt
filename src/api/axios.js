// src/api/axios.js
import axios from "axios";
// import { store } from "../store";

let store;

export const injectStore = (_store) => {
  store = _store;
};

const api = axios.create({
  baseURL: "https://6906e4d5b1879c890ed842fb.mockapi.io/api", // غيّريها للـ backend الحقيقي
});

// interceptor لإضافة Authorization header تلقائياً لو في token
api.interceptors.request.use((config) => {
  try {
    if (!store) return config;

    const state = store.getState();
    const token = state.auth?.token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.log(e);
  }
  return config;
});

export default api;
