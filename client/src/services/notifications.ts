import api from './api';
import type { INotification, ApiResponse } from '@ems/shared';

export const getNotifications = async (): Promise<INotification[]> => {
  const response = await api.get<ApiResponse<INotification[]>>('/notifications');
  return response.data.data || [];
};

export const markAsRead = async (id: string): Promise<INotification> => {
  const response = await api.put<ApiResponse<INotification>>(`/notifications/${id}/read`);
  return response.data.data!;
};

export const markAllAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all');
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
  return response.data.data?.count || 0;
};
