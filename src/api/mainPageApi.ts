import axios from 'axios';

const baseHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
});

export const getLeaveBalance = async (leaveTypeId: number) => {
  const res = await axios.get(`http://localhost:8080/api/leave-balance/type/${leaveTypeId}`, {
    headers: baseHeaders(),
  });
  return res.data.data;
};

export const getLeaveHistory = async () => {
  const res = await axios.get(`http://localhost:8080/api/leave`, {
    headers: baseHeaders(),
  });
  return res.data.data;
};

export const downloadAttachment = (filename: string) => {
  return `http://localhost:8080/api/file/download/${filename}`;
};