import axios from 'axios';

const baseHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

export const getLeaveDetail = async (id: number) => {
  const res = await axios.get(`http://localhost:8080/api/leave/${id}`,{
    headers: baseHeaders(),
  });
  return res.data.data;
};

export const updateLeave = async (id: number, payload: any) => {
  const res = await axios.put(`http://localhost:8080/api/leave/${id}`, payload,{
    headers: baseHeaders(),
  });
  return res.data.data;
};

