import instance from './axiosInstance';

export const getProxies = async () => {
  try {
    const res = await instance.get('/api/employee/proxies');
    return res.data.data;
  } catch (error) {
    console.error("取得代理人資料失敗", error);
    throw error;
  }
};

export const getSupervisor = async () => {
  try {
    const res = await instance.get('/api/employee');
    // 使用可選鏈接操作符和空值合併運算符，防止錯誤
    return res.data?.data?.supervisorEmployeeName ?? '';
  } catch (error) {
    console.error("取得主管資料失敗", error);
    return '';
  }
};

export async function getEmployeeProfile() {
  try {
    const res = await instance.get('/api/employee');
    return res.data.data;
  } catch (error) {
    console.error('取得員工資料失敗', error);
    throw error; // 或者你也可以選擇 return null / 預設物件
  }
}
