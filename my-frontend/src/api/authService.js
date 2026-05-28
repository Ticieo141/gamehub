import apiClient from './client';

export const authService = {
    login: (credentials) => apiClient('/auth/login', { body: credentials }),
    googleLogin: (token) => apiClient('/auth/google', { body: { token } }),
    register: (userData) => apiClient('/auth/register', { body: userData }),
    verifyEmail: (token) => apiClient(`/auth/verify/${token}`),
    resendVerification: (email) => apiClient('/auth/resend-verification', { body: { email } }),
};
