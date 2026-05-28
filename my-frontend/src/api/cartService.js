import apiClient from './client';

export const cartService = {
    getCart: () => apiClient('/cart'),
    addToCart: (gameId) => apiClient('/cart/add', { body: { gameId } }),
    removeFromCart: (gameId) => apiClient('/cart/remove', { body: { gameId } }),
};
