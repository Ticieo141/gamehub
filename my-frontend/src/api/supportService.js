import apiClient from './client';

export const supportService = {
    getUserTickets: () => apiClient('/support'),
    submitTicket: (ticketData) => apiClient('/support', { body: ticketData }),
};
