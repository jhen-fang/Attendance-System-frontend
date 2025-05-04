import instance from './axiosInstance';

export const getAllLeaves = async () => {
  const res = await instance.get('/api/manager/leaves');
  return res.data.data;
};

export const getLeave = async (leaveId: number) => {
  const res = await instance.get(`/api/manager/leaves/${leaveId}`);
  return res.data.data;
};

export const approveLeave = async (leaveId: number, approvalReason: string) => {
  const res = await instance.put(`/api/manager/leaves/${leaveId}/approve`, { approvalReason });
  return res.data.data;
};

export const rejectLeave = async (leaveId: number, approvalReason: string) => {
  const res = await instance.put(`/api/manager/leaves/${leaveId}/reject`, { approvalReason });
  return res.data.data;
};
