// EmployeePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EmployeeDTO } from '../types/Employee';
import dayjs from 'dayjs';
import { Box, Typography, Chip, Paper, CircularProgress } from '@mui/material';

function EmployeePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EmployeeDTO | null>(null);
  const [loading, setLoading] = useState(true);

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

        const data = res.data.data;
        if (!data.monthOfService || data.monthOfService === 0) {
          const months = dayjs().diff(dayjs(data.hireDate), 'month');
          data.monthOfService = months;
        }
        setProfile(data);
      } catch (err) {
        console.error('取得個人資料失敗', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading || !profile) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>資料載入中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
          歡迎，{profile.employeeName}！
        </Typography>

        <Box component="dl" sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1.5, columnGap: 2 }}>
          <Typography component="dt" fontWeight={600} color="text.secondary">員工編號</Typography>
          <Typography component="dd">{profile.employeeCode}</Typography>

          <Typography component="dt" fontWeight={600} color="text.secondary">部門</Typography>
          <Typography component="dd">{profile.departmentName || '—'}</Typography>

          <Typography component="dt" fontWeight={600} color="text.secondary">職位</Typography>
          <Typography component="dd">{profile.positionName || '—'}</Typography>

          <Typography component="dt" fontWeight={600} color="text.secondary">主管</Typography>
          <Typography component="dd">
            {profile.supervisorEmployeeName ? `${profile.supervisorEmployeeName} (${profile.supervisorEmployeeCode})` : '—'}
          </Typography>

          <Typography component="dt" fontWeight={600} color="text.secondary">到職日</Typography>
          <Typography component="dd">{profile.hireDate}</Typography>

          <Typography component="dt" fontWeight={600} color="text.secondary">年資(月)</Typography>
          <Typography component="dd">{profile.monthOfService}</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>角色：</Typography>
          {profile.roleNames.map((r) => (
            <Chip key={r} label={r} sx={{ mr: 1, mb: 1 }} color="primary" />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default EmployeePage;