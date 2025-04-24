import api from '../config/api';

const authService = {
    // Register new user
    register: async (userData) => {
        try {
            const response = await api.post('/accounts/auth/register/', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Verify email
    verifyEmail: async (token) => {
        try {
            const response = await api.get(`/auth/verify-email/${token}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Login with email/password
    login: async (credentials) => {
        try {
            const response = await api.post('/accounts/auth/login/', credentials);
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Refresh token
    refreshToken: async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            const response = await api.post('/accounts/auth/token/refresh/', { refresh });
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Password reset request
    requestPasswordReset: async (email) => {
        const response = await api.post('/auth/password-reset/', { email });
        return response.data;
    },

    // Confirm password reset
    confirmPasswordReset: async (data) => {
        const response = await api.post('/auth/password-reset/confirm/', data);
        return response.data;
    },

    // Google OAuth login
    googleLogin: async (accessToken) => {
        const response = await api.post('/auth/google-login/', { access_token: accessToken });
        if (response.data.access) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Facebook OAuth login
    facebookLogin: async (accessToken) => {
        const response = await api.post('/auth/facebook-login/', { access_token: accessToken });
        if (response.data.access) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('access_token');
        return !!token;
    },

    // Get current user
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Get auth token
    getToken: () => {
        return localStorage.getItem('access_token');
    },

    // Update user profile
    updateProfile: async (userData) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await api.patch('/profile/', userData, {
            headers: {
                'Authorization': `Bearer ${user.access}`
            }
        });
        return response.data;
    }
};

export default authService; 