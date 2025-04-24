import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Fetch user data
            axios.get('/api/auth/user/')
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    setError(error);
                    setLoading(false);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/auth/login/', credentials);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            navigate('/app/dashboard');
            return { success: true };
        } catch (error) {
            setError(error.response?.data || { message: 'An error occurred during login' });
            return { success: false, error: error.response?.data };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register/', userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
            navigate('/app/dashboard');
            return { success: true };
        } catch (error) {
            setError(error.response?.data || { message: 'An error occurred during registration' });
            return { success: false, error: error.response?.data };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/');
    };

    return {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
};

export default useAuth; 