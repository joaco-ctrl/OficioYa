import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const api = {
  get: async (path) => {
    const { data } = await client.get(path);
    return data;
  },
  post: async (path, body) => {
    const { data } = await client.post(path, body);
    return data;
  },
  put: async (path, body) => {
    const { data } = await client.put(path, body);
    return data;
  },
  delete: async (path) => {
    const { data } = await client.delete(path);
    return data;
  },
};

export default api;