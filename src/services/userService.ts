import api from '../axios/AxiosClient';
import { NotificationDto } from '../types/Notification';
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

export async function getUserNotifications() {
  const response = await api.get<NotificationDto[]>(`/api/notifications/user`);
  return response.data;
}

export async function markNotificationAsRead(id: number) {
  const response = await api.put<void>(`/api/notifications/mark-as-read/${id}`);
  return response.data; 
}

export async function deleteNotification(id: number) {
  const response = await api.delete<void>(`/api/notifications/notifications/${id}`);
  return response.data;  
}

export async function updateProfile(dto: UpdateProfileRequestDTO) {
  const response = await api.patch<MyProfileDTO>('/api/user/update-profile', dto);
  return response.data;
}

export async function changePassword(dto: PasswordChangeRequestDTO) {
  await api.post('/api/user/change-password', dto);
}

export async function uploadProfilePicture(dto: ChangeProfilePictureDTO) {
  const formData = new FormData();
  formData.append('image', dto.profilePicture);
  await api.post('/api/user/upload-profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function getProfileImage() {
  try {
    const response = await api.get<Blob>('/api/user/image', {
      responseType: 'blob',
      validateStatus: (status) => status === 200 || status === 404 || status == 403,
    });
    if (response.status === 200) {
      return URL.createObjectURL(response.data);
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateProfileWithPicture(
  data: UpdateProfileRequestDTO & { profilePicture?: File },
) {
  const updated = await updateProfile(data);
  if (data.profilePicture) {
    await uploadProfilePicture({ profilePicture: data.profilePicture });
  }
  return updated;
}

export async function removeProfilePicture() {
  await api.delete('/api/user/removeImage');
}
