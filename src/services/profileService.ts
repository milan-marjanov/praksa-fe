import api from '../api/apiClient';
import type { MyProfileDTO, UserProfileDTO } from '../types/ProfileDTO';

export const getMyProfile = (): Promise<MyProfileDTO> =>
  api.get<MyProfileDTO>('/api/user/profile').then(res => res.data);

export const getUserProfile = (id: number): Promise<UserProfileDTO> =>
  api.get<UserProfileDTO>(`/api/user/${id}/public-profile`).then(res => res.data);
