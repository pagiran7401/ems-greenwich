import api from './api';
import type { UserPublic, ApiResponse, OrganizerRole } from '@ems/shared';

export interface CreateTeamMemberInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  organizerRole: OrganizerRole;
  phone?: string;
  customRoleLabel?: string;
}

export interface UpdateTeamMemberInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  organizerRole?: OrganizerRole;
  customRoleLabel?: string;
  isActive?: boolean;
}

export interface OrganizationInfo {
  _id: string;
  name: string;
  ownerId: string;
  customRoles: string[];
}

export const listTeamMembers = async (): Promise<UserPublic[]> => {
  const response = await api.get<ApiResponse<UserPublic[]>>('/users/team');
  return response.data.data ?? [];
};

export const getOrganization = async (): Promise<OrganizationInfo> => {
  const response = await api.get<ApiResponse<OrganizationInfo>>('/users/team/organization');
  return response.data.data!;
};

export const createTeamMember = async (
  input: CreateTeamMemberInput
): Promise<UserPublic> => {
  const response = await api.post<ApiResponse<UserPublic>>('/users/team', input);
  return response.data.data!;
};

export const updateTeamMember = async (
  id: string,
  input: UpdateTeamMemberInput
): Promise<UserPublic> => {
  const response = await api.put<ApiResponse<UserPublic>>(`/users/team/${id}`, input);
  return response.data.data!;
};

export const resetTeamMemberPassword = async (
  id: string,
  password: string
): Promise<void> => {
  await api.patch<ApiResponse>(`/users/team/${id}/password`, { password });
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await api.delete<ApiResponse>(`/users/team/${id}`);
};

export const addCustomRole = async (label: string): Promise<string[]> => {
  const response = await api.post<ApiResponse<{ customRoles: string[] }>>(
    '/users/team/custom-roles',
    { label }
  );
  return response.data.data?.customRoles ?? [];
};

export const deleteCustomRole = async (label: string): Promise<string[]> => {
  const response = await api.delete<ApiResponse<{ customRoles: string[] }>>(
    `/users/team/custom-roles/${encodeURIComponent(label)}`
  );
  return response.data.data?.customRoles ?? [];
};
