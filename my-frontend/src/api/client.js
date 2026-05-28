const BASE_URL = 'http://localhost:5000/api';

const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const config = {
        method: body ? 'POST' : 'GET',
        ...customConfig,
        headers: {
            ...headers,
            ...customConfig.headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth-error'));
            }
            return Promise.reject(data);
        }
    } catch (err) {
        return Promise.reject({ message: err.message || 'Network error' });
    }
};

export default apiClient;
