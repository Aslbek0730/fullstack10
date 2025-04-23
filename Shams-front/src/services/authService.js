import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register/`, userData);
        return response.data;
    },

    // Verify email
    verifyEmail: async (token) => {
        const response = await axios.get(`${API_URL}/auth/verify-email/?token=${token}`);
        return response.data;
    },

    // Login with email/password
    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/auth/login/`, credentials);
        if (response.data.access) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Refresh token
    refreshToken: async (refresh) => {
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
        if (response.data.access) {
            const user = JSON.parse(localStorage.getItem('user'));
            user.access = response.data.access;
            localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
    },

    // Password reset request
    requestPasswordReset: async (email) => {
        const response = await axios.post(`${API_URL}/auth/password-reset/`, { email });
        return response.data;
    },

    // Confirm password reset
    confirmPasswordReset: async (data) => {
        const response = await axios.post(`${API_URL}/auth/password-reset/confirm/`, data);
        return response.data;
    },

    // Google OAuth login
    googleLogin: async (accessToken) => {
        const response = await axios.post(`${API_URL}/auth/google-login/`, { access_token: accessToken });
        if (response.data.access) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Facebook OAuth login
    facebookLogin: async (accessToken) => {
        const response = await axios.post(`${API_URL}/auth/facebook-login/`, { access_token: accessToken });
        if (response.data.access) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Update user profile
    updateProfile: async (userData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.patch(
            `${API_URL}/profile/`,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${user.access}`
                }
            }
        );
        return response.data;
    }
};

export default authService; 