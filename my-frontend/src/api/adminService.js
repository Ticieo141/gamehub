import apiClient from './client';

export const adminService = {
    getStats: () => apiClient('/admin/stats'),
    getUsers: () => apiClient('/admin/users'),
    updateUserRole: (id, role) => apiClient(`/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    }),
    getOrders: () => apiClient('/admin/orders'),
    updateOrderStatus: (id, status) => apiClient(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    // Game CRUD (calling the game routes which now have admin protection for write ops)
    createGame: (gameData) => apiClient('/games', {
        method: 'POST',
        body: gameData
    }),
    updateGame: (id, gameData) => apiClient(`/games/${id}`, {
        method: 'PUT',
        body: gameData
    }),
    deleteGame: (id) => apiClient(`/games/${id}`, {
        method: 'DELETE'
    }),
    getPosts: () => apiClient('/community/admin'),
    updatePostStatus: (id, status) => apiClient(`/community/${id}/status`, {
        method: 'PATCH',
        body: { status }
    }),
    deletePost: (id) => apiClient(`/community/${id}`, {
        method: 'DELETE'
    })
};
