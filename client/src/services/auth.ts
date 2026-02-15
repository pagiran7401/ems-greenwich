import api from './api';
import type { UserPublic, ApiResponse } from '@ems/shared';

export const updateProfile = async (data: {
  firstName: string;
  lastName: string;
  phone?: string;
}): Promise<UserPublic> => {
  const response = await api.put<ApiResponse<UserPublic>>('/auth/profile', data);
  return response.data.data!;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> => {
  await api.put('/auth/change-password', data);
};
