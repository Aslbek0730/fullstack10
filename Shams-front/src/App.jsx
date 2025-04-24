import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import Tests from './pages/Tests';
import TestDetail from './pages/TestDetail';
import TestResults from './pages/TestResults';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Assistant from './pages/Assistant';
import Payments from './pages/Payments';

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Redirects */}
            <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/assistant" element={<Navigate to="/app/assistant" replace />} />
            <Route path="/payments" element={<Navigate to="/app/payments" replace />} />
            
            {/* Protected routes */}
            <Route path="/app" element={<Layout />}>
                <Route path="dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                
                <Route path="courses" element={
                    <ProtectedRoute>
                        <Courses />
                    </ProtectedRoute>
                } />
                <Route path="courses/:id" element={
                    <ProtectedRoute>
                        <CourseDetail />
                    </ProtectedRoute>
                } />
                
                <Route path="library" element={
                    <ProtectedRoute>
                        <Library />
                    </ProtectedRoute>
                } />
                <Route path="library/:id" element={
                    <ProtectedRoute>
                        <BookDetail />
                    </ProtectedRoute>
                } />
                
                <Route path="tests" element={
                    <ProtectedRoute>
                        <Tests />
                    </ProtectedRoute>
                } />
                <Route path="tests/:id" element={
                    <ProtectedRoute>
                        <TestDetail />
                    </ProtectedRoute>
                } />
                <Route path="tests/:id/results" element={
                    <ProtectedRoute>
                        <TestResults />
                    </ProtectedRoute>
                } />
                
                <Route path="assistant" element={
                    <ProtectedRoute>
                        <Assistant />
                    </ProtectedRoute>
                } />
                
                <Route path="payments" element={
                    <ProtectedRoute>
                        <Payments />
                    </ProtectedRoute>
                } />
                
                <Route path="profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="settings" element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    );
}

export default App; 