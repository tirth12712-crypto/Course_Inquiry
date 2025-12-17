import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const submitForm = async (formData) => {
  return apiClient.post('/forms/submit', formData);
};

export const adminLogin = async (username, password) => {
  return apiClient.post('/admin/login', { username, password });
};

export const getAllForms = async () => {
  return apiClient.get('/admin/forms');
};

export const markFormAsRead = async (id) => {
  return apiClient.put(`/admin/forms/${id}/read`);
};

export const updateAdminNotes = async (id, adminNotes) => {
  return apiClient.put(`/admin/forms/${id}/notes`, { adminNotes });
};

export default apiClient;


