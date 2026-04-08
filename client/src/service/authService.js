import api from './api.js';

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Tidak dapat terhubung ke server');
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal terhubung ke server');
  }
};