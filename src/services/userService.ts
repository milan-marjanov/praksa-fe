import api from '../axios/axiosClient';
import type { User } from '../types/UserDTO';
import type { CreateUserDTO } from '../types/CreateUserDTO';

export const getAllUsers = (): Promise<User[]> => api.get<User[]>('/api').then((res) => res.data);

export const createUser = (user: CreateUserDTO): Promise<User> =>
  api.post<User>('/api/admin/createUser', user).then((res) => res.data);

export const deleteUser = (id: number): Promise<void> =>
  api.delete(`/api/admin/${id}`).then(() => {});
