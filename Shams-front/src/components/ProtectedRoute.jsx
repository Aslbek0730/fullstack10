import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        // Save the attempted URL for redirecting after login
        sessionStorage.setItem('redirectUrl', location.pathname);
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute; 