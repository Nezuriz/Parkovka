import api from './api.js';

export const getTransaksis = async () => {
  try {
    const response = await api.get('/transaksi');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil data transaksi');
  }
};

export const catatMasuk = async (data) => {
  try {
    const response = await api.post('/transaksi/masuk', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mencatat kendaraan masuk');
  }
};

export const catatKeluar = async (id) => {
  try {
    const response = await api.put(`/transaksi/keluar/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mencatat kendaraan keluar');
  }
};

export const getRekapTransaksi = async (startDate, endDate) => {
  try {
    let url = '/transaksi/rekap';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal mengambil rekap');
  }
};