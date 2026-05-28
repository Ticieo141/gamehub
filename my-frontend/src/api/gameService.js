import apiClient from './client';

export const gameService = {
    getAllGames: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiClient(`/games?${queryParams}`);
    },
    getGameById: (id) => apiClient(`/games/${id}`),
};
