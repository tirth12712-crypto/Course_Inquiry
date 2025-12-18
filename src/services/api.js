import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api'
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const submitForm = (formData) =>
  apiClient.post('/forms/submit', formData);

export const adminLogin = (username, password) =>
  apiClient.post('/admin/login', { username, password });

export const getAllForms = () =>
  apiClient.get('/admin/forms');

export const markFormAsRead = (id) =>
  apiClient.put(`/admin/forms/${id}/read`);

export const updateAdminNotes = (id, adminNotes) =>
  apiClient.put(`/admin/forms/${id}/notes`, { adminNotes });

export default apiClient;
