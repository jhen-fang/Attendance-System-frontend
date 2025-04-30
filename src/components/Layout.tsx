import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const menu = [
  { path: '/main', label: '主頁' },
  { path: '/employee', label: '員工資料' },
  { path: '/leave', label: '請假頁面' },
  { path: '/leave-manage', label: '假單管理' },
  { path: '/logout', label: '登出', isLogout: true },
];

const containerStyle = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  padding: '0 2rem',
};

export default function Layout() {
  const { pathname } = useLocation();
  const [employeeName, setEmployeeName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return;
    axios
      .get('http://localhost:8080/api/employee', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEmployeeName(res.data.data.employeeName);
      })
      .catch(() => setEmployeeName(null));
  }, []);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#f6f8fa' }}>
      {/* --- 上方導覽列 --- */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            ...containerStyle,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
          }}
        >
          {/* 左側 Logo 與選單 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://img.icons8.com/fluency/32/checked--v1.png"
              alt="logo"
              style={{ marginRight: 8 }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#0d6efd',
                marginRight: '2rem',
              }}
            >
              考勤管理系統
            </span>
            {menu.map((m) => (
              <Link
                key={m.path}
                to={m.isLogout ? '#' : m.path}
                onClick={() => {
                  if (m.isLogout) {
                    localStorage.removeItem('jwtToken');
                    window.location.href = '/login';
                  }
                }}
                style={{
                  marginRight: '1rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  color: pathname === m.path ? '#fff' : '#333',
                  backgroundColor:
                    pathname === m.path ? '#0d6efd' : 'transparent',
                }}
              >
                {m.label}
              </Link>
            ))}
          </div>

          {/* 右側歡迎訊息 */}
          <div style={{ fontSize: '1rem', color: '#333' }}>
            {employeeName ? `${employeeName} 你好` : ''}
          </div>
        </div>
      </header>

      {/* --- 主內容區域 --- */}
      <main
        style={{
          width: '100%',
          boxSizing: 'border-box',
          paddingTop: '88px', // 預留 header 高度 + 安全間距
        }}
      >
        <div style={containerStyle}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
