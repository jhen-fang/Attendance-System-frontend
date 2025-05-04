import instance from './axiosInstance';

export const getProxies = async () => {
  const res = await instance.get('/api/employee/proxies');
  return res.data.data;
};

export const getSupervisor = async () => {
  const res = await instance.get('/api/employee');
  return res.data?.data?.supervisorEmployeeName ?? '';
};
