import axios from 'axios';
import dayjs from 'dayjs';

const baseHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/** 查詢剩餘時數 */
export const getLeaveBalance = async (leaveTypeId: number) => {
  const res = await axios.get(`http://localhost:8080/api/leave-balance/type/${leaveTypeId}`, {
    headers: baseHeaders(),
  });
  return res.data.data;
};

/** 查詢代理人 */
export const getProxies = async () => {
  const res = await axios.get('http://localhost:8080/api/employee/proxies', {
    headers: baseHeaders(),
  });
  return res.data.data;
};

/** 查詢主管姓名 */
export const getSupervisor = async () => {
  const res = await axios.get('http://localhost:8080/api/employee', {
    headers: baseHeaders(),
  });
  return res.data?.data?.supervisorEmployeeName ?? '';
};

/** 上傳附件 */
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await axios.post('http://localhost:8080/api/file/upload', formData, {
    headers: {
      ...baseHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data.data;
};

/** 提交請假申請 */
export const applyLeave = async (payload: any) => {
  const res = await axios.post('http://localhost:8080/api/leave/apply', payload, {
    headers: baseHeaders(),
  });
  return res.data.data;
};

/** 查詢台灣假日 (使用新北市政府資料)  */
export const getTaiwanHolidays = async (): Promise<Date[]> => {
  const res = await axios.get(`/api-holidays/api/datasets/308dcd75-6434-45bc-a95f-584da4fed251/json?size=1000`);
  const raw = res.data;
  const holidays = raw.filter((item: any) => item.isholiday === '是')
    .map((item: any) => {
      const d = item.date;
      return new Date(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`);
    });

  const pastDates = Array(365).fill(0).map((_, i) => {
    const d = dayjs().subtract(i + 1, 'day').toDate();
    return d;
  });

  const weekends = Array(365).fill(0).map((_, i) => {
    const d = dayjs().add(i, 'day').toDate();
    const day = d.getDay();
    return day === 0 || day === 6 ? d : null;
  }).filter(Boolean) as Date[];

  return [...holidays, ...pastDates, ...weekends];
};
