import axios from 'axios';

const baseHeaders = () => {
  const token = localStorage.getItem('jwtToken');
  return {
    Authorization: `Bearer ${token}`,
  };
};

/** 查詢主管底下所有員工的假單 */
export const getAllLeaves = async () => {
    const res = await axios.get('http://localhost:8080/api/manager/leaves', {
        headers: baseHeaders(),
    });
    return res.data.data;
}

/** 查詢特定假單詳細內容 */
export const getLeave = async (leaveId: number) => {
    const res = await axios.get(`http://localhost:8080/api/manager/leaves/${leaveId}`, {
        headers: baseHeaders(),
    });
    return res.data.data;
}

/** 核准假單 */
export const approveLeave = async (leaveId: number, approvalReason: string) => {
    const res = await axios.put(
      `http://localhost:8080/api/manager/leaves/${leaveId}/approve`,
      { approvalReason },
      { headers: baseHeaders() }
    );
    return res.data.data;
}

/** 駁回假單 */
export const rejectLeave = async (leaveId: number, approvalReason: string) => {
    const res = await axios.put(
      `http://localhost:8080/api/manager/leaves/${leaveId}/reject`,
      { approvalReason },
      { headers: baseHeaders() }
    );
    return res.data.data;
}