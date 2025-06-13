import api from '../axios/AxiosClient';
import {
  UserDTO,
  CreateUserDTO,
  MyProfileDTO,
  UserProfileDTO,
  UpdateProfileRequestDTO,
  PasswordChangeRequestDTO,
  ChangeProfilePictureDTO,
} from '../types/User';

export async function getAllUsers() {
  const response = await api.get<UserDTO[]>('/api');
  return response.data;
}

export async function createUser(user: CreateUserDTO) {
  const response = await api.post<UserDTO>('/api/admin/createUser', user);
  return response.data;
}

export async function deleteUser(id: number) {
  await api.delete(`/api/admin/${id}`);
}

export async function getMyProfile() {
  const response = await api.get<MyProfileDTO>('/api/user/profile');
  return response.data;
}

export async function getUserProfile(id: number) {
  const response = await api.get<UserProfileDTO>(`/api/user/${id}/public-profile`);
  return response.data;
}

export async function updateProfile(data: UpdateProfileRequestDTO) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null) {
      formData.append(key, value as any);
    }
  });

  await api.patch('/api/user/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function changePassword(id: number, dto: PasswordChangeRequestDTO) {
  await api.post(`/api/user/${id}/change-password`, dto);
}

export async function uploadProfilePicture(id: number, dto: ChangeProfilePictureDTO): Promise<string> {
  const formData = new FormData();
  formData.append('image', dto.profilePicture);

  const response = await api.post<{ url: string }>(
    `/api/user/${id}/upload-profile-picture`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data.url;
}
