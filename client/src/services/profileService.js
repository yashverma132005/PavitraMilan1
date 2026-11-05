import api from './api';

export const createProfile = (data) => api.post('/profiles', data);
// Profile saves can touch several Supabase rows, so allow more time than the
// short timeout used for routine reads. The server may still finish a write
// after a client timeout, which otherwise looks like a failed save.
export const updateProfile = (data) => api.put('/profiles', data, { timeout: 30000 });
export const getMyProfile = () => api.get('/profiles/me');
export const getProfileById = (id) => api.get(`/profiles/${id}`);
export const getRecommendedProfiles = () => api.get('/profiles/recommendations');
export const searchProfiles = (params) => api.get('/profiles/search', { params });
export const uploadPhoto = (formData, type = 'profile') => 
  api.post(`/profiles/upload-photo?type=${type}`, formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  });

