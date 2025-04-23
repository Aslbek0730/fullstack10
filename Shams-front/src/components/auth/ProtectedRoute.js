import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const user = authService.getCurrentUser();

    if (!user) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if token is expired
    const tokenExpiration = new Date(user.exp * 1000);
    if (tokenExpiration < new Date()) {
        // Try to refresh token
        authService.refreshToken(user.refresh)
            .catch(() => {
                // If refresh fails, logout and redirect to login
                authService.logout();
                return <Navigate to="/login" state={{ from: location }} replace />;
            });
    }

    return children;
};

export default ProtectedRoute; 