import axios from 'axios';

const API_URL = 'https://localhost:5054/api/auth';

const register = async (email, password) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
};

const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed');
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

export default { register, login, logout };