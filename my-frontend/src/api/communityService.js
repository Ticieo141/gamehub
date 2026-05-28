import apiClient from './client';

export const communityService = {
    getAllPosts: () => apiClient('/community'),
    createPost: (postData) => apiClient('/community', { body: postData }),
    addReply: (postId, content, parentId = null) => apiClient(`/community/${postId}/reply`, { body: { content, parentId } }),
    toggleLike: (postId) => apiClient(`/community/${postId}/like`, { method: 'PUT' }),
};
