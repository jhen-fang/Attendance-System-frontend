import { useEffect, useState } from 'react';
import LeaveDetailDialog from './LeaveDetailDialog';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getLeaveBalance, getLeaveHistory } from '../api/leave';
import LeaveTable from '../components/LeaveTable';

const leaveTypes = [
  { id: 1, name: '特休假' },
  { id: 2, name: '病假' },
  { id: 3, name: '事假' },
];

const statuses = [
  { value: 'ALL', label: '全部' },
  { value: '待審核', label: '待審核' },
  { value: '已核准', label: '已核准' },
  { value: '已拒絕', label: '已拒絕' },
  { value: '已取消', label: '已取消' },
];

export default function MainPage() {
  const [balances, setBalances] = useState<Record<number, string>>({});
  const [history, setHistory] = useState<any[]>([]);
  const [leaveFilter, setLeaveFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const newBalances: Record<number, string> = {};
      for (const lt of leaveTypes) {
        try {
          const hours = await getLeaveBalance(lt.id);
          newBalances[lt.id] = `${hours}小時 (${(hours / 8).toFixed(1)}天)`;
        } catch {
          newBalances[lt.id] = '錯誤';
        }
      }
      setBalances(newBalances);

      try {
        const h = await getLeaveHistory();
        setHistory(h);
      } catch {
        setHistory([]);
      }
    };
    fetchData();
  }, []);

  const filteredHistory = history.filter((row) => {
    const leaveMatch = leaveFilter === 'ALL' || row.leaveTypeName === leaveFilter;
    const statusMatch = statusFilter === 'ALL' || row.status === statusFilter;
    return leaveMatch && statusMatch;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', p: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            p: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" color="text.primary" gutterBottom>
            剩餘假期：
          </Typography>
          <Grid container spacing={2}>
            {leaveTypes.map((lt) => (
              <Grid item xs={4} key={lt.id}>
                <Paper
                  sx={{ p: 2, textAlign: 'center', backgroundColor: '#0d6efd', color: 'white' }}
                >
                  <Typography variant="subtitle2">{lt.name}</Typography>
                  <Typography variant="h6">{balances[lt.id] || '讀取中...'}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" color="text.primary" sx={{ mt: 4 }} gutterBottom>
            請假歷史：
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>篩選假別</InputLabel>
                <Select
                  value={leaveFilter}
                  label="篩選假別"
                  onChange={(e: SelectChangeEvent) => setLeaveFilter(e.target.value)}
                >
                  <MenuItem value="ALL">全部</MenuItem>
                  {leaveTypes.map((lt) => (
                    <MenuItem key={lt.id} value={lt.name}>
                      {lt.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>申請狀態</InputLabel>
                <Select
                  value={statusFilter}
                  label="申請狀態"
                  onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <LeaveTable
            data={filteredHistory}
            onRowClick={(id) => {
              setSelectedId(id);
              setDialogOpen(true);
            }}
          />

          <LeaveDetailDialog
            open={dialogOpen}
            leaveId={selectedId}
            onClose={() => setDialogOpen(false)}
            onSuccess={async () => {
              const h = await getLeaveHistory();
              setHistory(h);
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
