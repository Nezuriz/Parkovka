// src/service/areaService.js
import api from './api.js';

export const getAreas = async () => {
  try {
    const response = await api.get('/area');
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data area');
  }
};

export const createArea = async (data) => {
  try {
    const response = await api.post('/area', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal membuat area');
  }
};

export const updateArea = async (id, data) => {
  try {
    const response = await api.put(`/area/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengupdate area');
  }
};

export const deleteArea = async (id) => {
  try {
    const response = await api.delete(`/area/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus area');
  }
};