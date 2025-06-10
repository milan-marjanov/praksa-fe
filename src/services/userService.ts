import api from '../api/apiClient';
import type { User } from '../types/User';
import type { CreateUserDTO } from '../types/CreateUserDTO';

export const getAllUsers = (): Promise<User[]> => api.get<User[]>('/users').then((res) => res.data);

export const createUser = (user: CreateUserDTO): Promise<User> =>
  api.post<User>('/users/createUser', user).then((res) => res.data);

export const deleteUser = (id: number): Promise<void> => api.delete(`/users/${id}`).then(() => {});
