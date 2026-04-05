import api from './api';

export const uploadEventImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload/event-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data.imageUrl;
};
