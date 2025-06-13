import api from '../axios/axiosClient';
import { PasswordChangeRequestDTO } from '../types/PasswordChangeRequestDTO';
import type { MyProfileDTO, UserProfileDTO } from '../types/ProfileDTO';
import { UpdateProfileRequestDTO } from '../types/UpdateProfileRequestDTO';

export const getMyProfile = (): Promise<MyProfileDTO> =>
  api.get<MyProfileDTO>('/api/user/profile').then((res) => res.data);

export const getUserProfile = (id: number): Promise<UserProfileDTO> =>
  api.get<UserProfileDTO>(`/api/user/${id}/public-profile`).then((res) => res.data);

export const updateProfile = (data: UpdateProfileRequestDTO): Promise<void> => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value != null) {
      formData.append(key, value as any);
    }
  });

  return api
    .patch<void>('/api/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(() => {});
};

export const changePassword = (id: number, dto: PasswordChangeRequestDTO): Promise<void> =>
  api.post<void>(`/api/user/${id}/change-password`, dto).then(() => {});
