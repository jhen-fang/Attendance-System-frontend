import { Link, Outlet, useLocation } from 'react-router-dom';

const menu = [
  { path: '/employee', label: '員工資料' },
  { path: '/leave', label: '請假頁面' },
  { path: '/leave-manage', label: '假單管理' },
  { path: '/logout', label: '登出', isLogout: true },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f8fa' }}>
      {/* --- 左側欄 --- */}
      <aside
        style={{
          width: 220,
          background: '#fff',
          boxShadow: '2px 0 6px rgba(0,0,0,.05)',
          padding: '1.5rem',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '2rem', color: '#0d6efd' }}>
          <img src="https://img.icons8.com/fluency/32/checked--v1.png" /> 考勤管理系統
        </div>

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
              display: 'block',
              padding: '0.6rem 0.8rem',
              marginBottom: '0.5rem',
              color: pathname === m.path ? '#fff' : '#333',
              background: pathname === m.path ? '#0d6efd' : 'transparent',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            {m.label}
          </Link>
        ))}
      </aside>

      {/* --- 右側內容 --- */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}