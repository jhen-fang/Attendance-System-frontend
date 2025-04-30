import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, ReactElement } from 'react';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import EmployeePage from './pages/EmployeePage';
import LeavePage from './pages/LeavePage';
import LeaveManage from './pages/LeaveManage';
import MainPage from './pages/MainPage';

function Protect({ element }: { element: ReactElement }) {
  return localStorage.getItem('jwtToken') ? element : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  return (
    <BrowserRouter>
      <Routes>
        {/* --- 公開路徑 --- */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />

        {/* --- 受保護路徑，統一包在 Layout 內 --- */}
        <Route element={<Protect element={<Layout />} />}>
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/leave-manage" element={<LeaveManage />} />
          <Route path="/main" element={<MainPage />} />
          {/* 進入 / 時自動導到員工資料 */}
          <Route index element={<Navigate to="/main" replace />} />
        </Route>

        {/* 任何未知網址 → 依是否登入導向 */}
        <Route
          path="*"
          element={
            token ? <Navigate to="/main" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
