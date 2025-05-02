import instance from './axiosInstance';

export async function login(employeeCode: string, password: string) {
  const response = await instance.post('/api/auth/login', {
    employeeCode,
    password,
  });
  return response.data;
}
