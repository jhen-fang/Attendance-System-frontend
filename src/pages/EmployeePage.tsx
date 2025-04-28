import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EmployeeDTO } from '../types/Employee';
import dayjs from 'dayjs';

function EmployeePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployeeDTO | null>(null);
  const [loading, setLoading] = useState(true);

  /** 取得個人資料 */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:8080/api/employee', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 後端回傳格式 { msg, data: {...} }
        // 若後端沒給 monthOfService 或為 0，前端自行計算
        const data = res.data.data;
        if (!data.monthOfService || data.monthOfService === 0) {
          const months = dayjs().diff(dayjs(data.hireDate), 'month');
          data.monthOfService = months;
        }
        setProfile(data);
        return;
      } catch (err) {
        console.error('取得個人資料失敗', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /** Loading 畫面 */
  if (loading || !profile) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f8f9fa',
          fontSize: '1.1rem',
        }}
      >
        資料載入中...
      </div>
    );
  }

  /** 主畫面 */
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '500px',
          backgroundColor: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '14px',
          boxShadow: '0 12px 28px rgba(0,0,0,.1)',
          lineHeight: 1.7,
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem',
            color: '#333',
          }}
        >
          歡迎，{profile.employeeName}！
        </h2>

        {/* 基本資料表格 */}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, width: '40%', color: '#555', padding: '4px 0' }}>員工編號</td>
              <td style={{ color: '#222', padding: '4px 0' }}>{profile.employeeCode}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#555', padding: '4px 0' }}>部門</td>
              <td style={{ color: '#222', padding: '4px 0' }}>{profile.departmentName || '—'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#555', padding: '4px 0' }}>職位</td>
              <td style={{ color: '#222', padding: '4px 0' }}>{profile.positionName || '—'}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#555', padding: '4px 0' }}>主管</td>
              <td style={{ color: '#222', padding: '4px 0' }}>
                {profile.supervisorEmployeeName
                  ? `${profile.supervisorEmployeeName} (${profile.supervisorEmployeeCode})`
                  : '—'}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#555', padding: '4px 0' }}>到職日</td>
              <td style={{ color: '#222', padding: '4px 0' }}>{profile.hireDate}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, color: '#555', padding: '4px 0' }}>年資(月)</td>
              <td style={{ color: '#222', padding: '4px 0' }}>
                {profile.monthOfService ?? dayjs().diff(dayjs(profile.hireDate), 'month')}
              </td>
            </tr>
          </tbody>
        </table>

        {/* 角色 badge */}
        <div style={{ marginTop: '1.2rem', display:'flex', alignItems:'center' }}>
          <span style={{ fontWeight: 600, color:'#555', marginRight:'0.5rem' }}>角色：</span>
          {profile.roleNames.map((r) => (
            <span
              key={r}
              style={{
                display: 'inline-block',
                background: '#0d6efd',
                color: '#fff',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                marginRight: '0.4rem',
              }}
            >
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeePage;