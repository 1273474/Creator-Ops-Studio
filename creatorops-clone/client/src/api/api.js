import axios from 'axios';

// Vite uses import.meta.env for environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        // Try to get token from browser storage
        const token = localStorage.getItem('token');

        // If token exists, add it to the headers
        if (token) {
            // This is the same header your backend expects!
            // Look at middlewares/auth.js: req.header('x-auth-token')
            config.headers['x-auth-token'] = token;
        }

        // Return the modified config
        return config;
    },
    (error) => {
        // If something goes wrong, pass the error along
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        // If request succeeded, just return the response
        return response;
    },
    (error) => {
        // If we get a 401 (Unauthorized), token might be invalid/expired
        if (error.response && error.response.status === 401) {
            // Remove the invalid token
            localStorage.removeItem('token');
            // Optionally redirect to login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;