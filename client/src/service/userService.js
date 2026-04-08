// src/service/userService.js
import api from './api.js';

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data user');
  }
};

export const createUser = async (data) => {
  try {
    const response = await api.post('/users', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menambahkan user');
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengupdate user');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus user');
  }
};