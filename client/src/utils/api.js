import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API endpoints
export const auth = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};

export const sessions = {
    start: (sessionData) => api.post('/sessions', sessionData),
    getAll: () => api.get('/sessions')
};

// Authentication
const login = async (email, password) => {
    try {
        const { data } = await auth.login({ email, password });
        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Login failed:', error.response.data);
        throw error;
    }
};

// Sessions
const startSession = async (duration) => {
    try {
        const { data } = await sessions.start({ duration });
        return data;
    } catch (error) {
        console.error('Failed to start session:', error.response.data);
        throw error;
    }
};

export default api;