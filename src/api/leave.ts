import instance from './axiosInstance';

export const getLeaveBalance = async (leaveTypeId: number) => {
  const res = await instance.get(`/api/leave-balance/type/${leaveTypeId}`);
  return res.data.data;
};

export const getLeaveHistory = async () => {
  const res = await instance.get('/api/leave');
  return res.data.data;
};

export const getLeaveDetail = async (id: number) => {
  const res = await instance.get(`/api/leave/${id}`);
  return res.data.data;
};

export const updateLeave = async (id: number, payload: any) => {
  const res = await instance.put(`/api/leave/${id}`, payload);
  return res.data.data;
};

export const applyLeave = async (payload: any) => {
  const res = await instance.post('/api/leave/apply', payload);
  return res.data.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await instance.post('/api/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

export const downloadAttachment = async (filename: string) => {
  const res = await instance.get(`/api/file/download/${filename}`, {
    responseType: 'blob',
  });

  const blob = new Blob([res.data]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
};
