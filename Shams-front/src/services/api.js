import api from '../config/api';

// Auth services
export const authService = {
    login: (data) => api.post('/auth/login/', data),
    register: (data) => api.post('/auth/register/', data),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}/`),
    resetPassword: (data) => api.post('/auth/password-reset/', data),
    resetPasswordConfirm: (data) => api.post('/auth/password-reset/confirm/', data),
    refreshToken: (data) => api.post('/auth/token/refresh/', data),
    googleLogin: (data) => api.post('/auth/google-login/', data),
    facebookLogin: (data) => api.post('/auth/facebook-login/', data),
};

// User services
export const userService = {
    getProfile: () => api.get('/accounts/profile/'),
    updateProfile: (data) => api.put('/accounts/profile/', data),
    getActivities: () => api.get('/accounts/activities/'),
    getProgress: () => api.get('/accounts/dashboard/my-progress/'),
    getDashboardOverview: () => api.get('/accounts/dashboard/overview/'),
};

// Course services
export const courseService = {
    getCourses: (params) => api.get('/courses/', { params }),
    getCourse: (id) => api.get(`/courses/${id}/`),
    getLessons: (courseId) => api.get(`/courses/${courseId}/lessons/`),
    getLesson: (courseId, lessonId) => api.get(`/courses/${courseId}/lessons/${lessonId}/`),
    enrollCourse: (courseId) => api.post(`/courses/${courseId}/enroll/`),
    updateProgress: (courseId, lessonId, data) => api.post(`/courses/${courseId}/lessons/${lessonId}/progress/`, data),
};

// Test services
export const testService = {
    getTests: (params) => api.get('/tests/', { params }),
    getTest: (id) => api.get(`/tests/${id}/`),
    submitTest: (id, data) => api.post(`/tests/${id}/submit/`, data),
    getResults: (id) => api.get(`/tests/${id}/results/`),
};

// Book services
export const bookService = {
    getBooks: (params) => api.get('/library/', { params }),
    getBook: (id) => api.get(`/library/${id}/`),
    purchaseBook: (id, data) => api.post(`/library/${id}/purchase/`, data),
    downloadBook: (id) => api.post(`/library/${id}/download/`),
};

// Payment services
export const paymentService = {
    createPayment: (data) => api.post('/payments/create/', data),
    verifyPayment: (id) => api.post(`/payments/${id}/verify/`),
    getPaymentHistory: () => api.get('/payments/history/'),
};

// Chat services
export const chatService = {
    sendMessage: (data) => api.post('/chatbot/message/', data),
    getHistory: () => api.get('/chatbot/history/'),
}; 