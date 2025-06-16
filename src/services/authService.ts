import api from '../axios/AxiosClient';

export async function login(email: string, password: string) {
  try {
    const { data } = await api.post<{ token: string }>('auth/signin', {
      email,
      password,
    });
    localStorage.setItem('jwtToken', data.token);
    return data.token;
  } catch {
    return undefined;
  }
}
