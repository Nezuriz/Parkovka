import api from './api.js';

export const getKendaraans = async () => {
  try {
    const response = await api.get('/kendaraan');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data kendaraan');
  }
};

export const createKendaraan = async (data) => {
  try {
    const response = await api.post('/kendaraan', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menambahkan kendaraan');
  }
};

export const updateKendaraan = async (id, data) => {
  try {
    const response = await api.put(`/kendaraan/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengupdate kendaraan');
  }
};

export const deleteKendaraan = async (id) => {
  try {
    const response = await api.delete(`/kendaraan/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal menghapus kendaraan');
  }
};