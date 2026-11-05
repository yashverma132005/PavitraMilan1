import api from './api';

export const reportUser = (reportedId, reason, description) => api.post('/reports/report', { reportedId, reason, description });
export const blockUser = (userId) => api.post(`/reports/block/${userId}`);
export const unblockUser = (userId) => api.delete(`/reports/unblock/${userId}`);
export const getBlockedUsers = () => api.get('/reports/blocked');
