import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  // cookie (JWT)
  withCredentials: true, 
});

export default api;