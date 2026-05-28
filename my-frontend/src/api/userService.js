import apiClient from './client';

export const userService = {
    getProfile: () => apiClient('/users/profile'),
    updateProfile: (profileData) => apiClient('/users/profile', {
        method: 'PUT',
        body: profileData
    }),
};
