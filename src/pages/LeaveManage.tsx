import { Box, Typography, Paper } from '@mui/material';

export default function LeaveManage() {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, p: 4, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#333' }}>
          假單管理（待開發）
        </Typography>
        <Typography color="text.secondary">
          這裡將提供主管審核與查詢假單的功能。
        </Typography>
      </Paper>
    </Box>
  );
}