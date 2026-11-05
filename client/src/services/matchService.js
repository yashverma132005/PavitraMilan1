import api from './api';

export const getMatches = (page = 1, limit = 20) => api.get('/matches', { params: { page, limit } });

