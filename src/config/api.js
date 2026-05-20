import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://bank-app-be-sand.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle errors (like token expiration)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export default api;
