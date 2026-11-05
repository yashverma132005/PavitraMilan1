import api from './api';

export const sendInterest = (receiverId, message = '') => api.post(`/interests/send/${receiverId}`, { message });
export const acceptInterest = (interestId) => api.put(`/interests/accept/${interestId}`);
export const rejectInterest = (interestId) => api.put(`/interests/reject/${interestId}`);
export const getSentInterests = (page = 1, limit = 20) => api.get('/interests/sent', { params: { page, limit } });
export const getReceivedInterests = (page = 1, limit = 20) => api.get('/interests/received', { params: { page, limit } });

