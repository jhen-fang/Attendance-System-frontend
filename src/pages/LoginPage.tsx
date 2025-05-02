import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

function LoginPage({ setToken }: { setToken: (t: string) => void }) {
  const navigate = useNavigate();
  const [employeeCode, setEmployeeCode] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    try {
      setErrorMsg(''); // 清除前一次錯誤訊息
      const data = await login(employeeCode, password);
      localStorage.setItem('jwtToken', data.data.token);
      setToken(data.data.token);
      navigate('/main');
    } catch (error) {
      setErrorMsg('帳號或密碼錯誤，請再試一次');
    }
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '320px',
        padding: '2rem',
        borderRadius: '10px',
        backgroundColor: 'white',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        {/* Logo 區域 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <img
            src="https://img.icons8.com/fluency/48/checked--v1.png"
            alt="logo"
            style={{ marginBottom: '0.5rem' }}
          />
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0d6efd' }}>考勤管理系統</h2>
        </div>

        {/* 輸入區域 */}
        <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            員工ID
          </label>
          <input
            type="text"
            value={employeeCode}
            onChange={(e) => setEmployeeCode(e.target.value)}
            placeholder="請輸入員工編號"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#ffffff',
              color: '#333'
            }}
          />
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            密碼
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              backgroundColor: '#ffffff',
              color: '#333',
            }}
          />
        </div>

        {/* 登入按鈕 */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b5ed7'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0d6efd'}
        >
          登入
        </button>
        {errorMsg && (
          <div style={{marginTop:'1rem',color:'red',fontSize:'0.9rem'}}>{errorMsg}</div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
