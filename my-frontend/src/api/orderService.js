import apiClient from './client';

export const orderService = {
    getUserOrders: () => apiClient('/orders'),
    createOrder: (orderData) => apiClient('/orders', { body: orderData }),
};
