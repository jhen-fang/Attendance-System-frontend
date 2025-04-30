
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import {
  getLeaveBalance,
  getProxies,
  getSupervisor,
  uploadFile,
  applyLeave,
  getTaiwanHolidays,
} from '../api/leaveApi';
import { EmployeeDTO } from '../types/Employee';
import {
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Grid
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CheckCircle } from 'lucide-react';

export default function LeavePage() {
  const navigate = useNavigate();
  const [leaveTypeId, setLeaveTypeId] = useState(1);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);
  const [leaveHours, setLeaveHours] = useState(0);
  const [maxHours, setMaxHours] = useState(0);
  const [reason, setReason] = useState('');
  const [proxies, setProxies] = useState<EmployeeDTO[]>([]);
  const [proxyCode, setProxyCode] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState('');
  const [fileName, setFileName] = useState('');
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [holidays, setHolidays] = useState<string[]>([]);

  useEffect(() => {
    getSupervisor().then(name => setSupervisor(name || ''));
    getProxies().then(setProxies);
    getTaiwanHolidays().then(dates => {
      setHolidays(dates.map(d => dayjs(d).format('YYYY-MM-DD')));
    });
  }, []);

  useEffect(() => {
    getLeaveBalance(leaveTypeId).then(setMaxHours);
  }, [leaveTypeId]);

  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      const s = startDate.hour(startTime.hour()).minute(startTime.minute());
      const e = endDate.hour(endTime.hour()).minute(endTime.minute());
      setStart(s);
      setEnd(e);
      setErrorMsg('');
    }
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    if (start && end && end.isAfter(start)) {
      const startDay = start.startOf('day');
      const endDay = end.startOf('day');
      const dayDiff = endDay.diff(startDay, 'day');

      let hours = 0;
      if (dayDiff === 0) {
        const startHour = Math.max(start.hour(), 9);
        const endHour = Math.min(end.hour(), 18);
        hours = endHour > startHour ? endHour - startHour : 0;
      } else {
        const firstDayHours = 18 - Math.max(start.hour(), 9);
        const lastDayHours = Math.min(end.hour(), 18) - 9;
        const fullDays = dayDiff - 1;
        hours = (firstDayHours > 0 ? firstDayHours : 0) + (fullDays > 0 ? fullDays * 8 : 0) + (lastDayHours > 0 ? lastDayHours : 0);
      }
      setLeaveHours(hours);
    } else if (start && end && (end.isSame(start) || end.isBefore(start))) {
      setErrorMsg('結束時間不能早於或等於開始時間，請重新選擇');
      setEndTime(null);
      setEndDate(null);
      setLeaveHours(0);
    }
  }, [start, end]);

  const handleFileUpload = async () => {
    if (!file) return;
    const result = await uploadFile(file);
    setFilePath(result.uniqueFileName);
    setFileName(result.originalFileName);
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!start || !end || leaveHours === 0 || leaveHours > maxHours) {
      setErrorMsg('請確認請假時間與剩餘時數');
      return;
    }
    await handleFileUpload();

    try {
      const payload = {
        leaveTypeId,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        leaveHours,
        reason,
        proxyEmployeeCode: proxyCode,
        filePath,
        fileName,
      };
      const res = await applyLeave(payload);
      setSuccessData(res);
      setLeaveTypeId(1);
      setStartDate(null);
      setStartTime(null);
      setEndDate(null);
      setEndTime(null);
      setStart(null);
      setEnd(null);
      setLeaveHours(0);
      setReason('');
      setProxyCode('');
      setFile(null);
      setFilePath('');
      setFileName('');
    } catch (err: any) {
      const apiMsg = err?.response?.data?.msg || '請假申請失敗，請稍後再試';
      setErrorMsg(apiMsg);
    }
  };

  const disableDate = (date: dayjs.Dayjs) => {
    const day = date.day();
    return day === 0 || day === 6 || holidays.includes(date.format('YYYY-MM-DD'));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: '100vh', width: '100vw', backgroundColor: '#f6f8fa', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', boxSizing: 'border-box' }}>
      <Box sx={{ width: '100%', maxWidth: 540, mx: 'auto', mt: 4, p: 3, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" mb={2}>請假申請表</Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <FormLabel>假別</FormLabel>
          <RadioGroup row value={leaveTypeId} onChange={(e) => setLeaveTypeId(Number(e.target.value))}>
            <FormControlLabel value={1} control={<Radio />} label="特休" />
            <FormControlLabel value={2} control={<Radio />} label="病假" />
            <FormControlLabel value={3} control={<Radio />} label="事假" />
          </RadioGroup>
        </FormControl>

        <FormLabel>開始時間</FormLabel>
        <Grid container spacing={2} sx={{ mb: 1, mt: 0.5 }}>
          <Grid item xs={6}><DatePicker label="開始日期" value={startDate} onChange={setStartDate} shouldDisableDate={disableDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
          <Grid item xs={6}><TimePicker ampm={false} views={['hours']} format="HH:mm" label="開始時間" value={startTime} onChange={setStartTime} minTime={dayjs().hour(9)} maxTime={dayjs().hour(18)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
        </Grid>

        <FormLabel>結束時間</FormLabel>
        <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
          <Grid item xs={6}><DatePicker label="結束日期" value={endDate} onChange={setEndDate} shouldDisableDate={disableDate} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
          <Grid item xs={6}><TimePicker ampm={false} views={['hours']} format="HH:mm" label="結束時間" value={endTime} onChange={setEndTime} minTime={dayjs().hour(9)} maxTime={dayjs().hour(18)} slotProps={{ textField: { size: 'small', fullWidth: true } }} /></Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>請假時數：{leaveHours} 小時（上限 {maxHours} 小時）</Typography>

        <FormLabel>代理人</FormLabel>
        <FormControl fullWidth size="small" sx={{ mb: 2, mt: 0.5 }}>
          <Select value={proxyCode} onChange={(e) => setProxyCode(e.target.value)}>
            <MenuItem value="">- Select -</MenuItem>
            {proxies.map(p => <MenuItem key={p.employeeCode} value={p.employeeCode}>{p.employeeName}</MenuItem>)}
          </Select>
        </FormControl>

        <Typography variant="body2" sx={{ mb: 2 }}>主管：{supervisor}</Typography>

        <FormLabel>請假事由</FormLabel>
        <TextField value={reason} onChange={(e) => setReason(e.target.value)} fullWidth multiline rows={3} size="small" sx={{ mb: 2, mt: 0.5 }} />

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Button variant="outlined" component="label" size="small">
            上傳附件
            <input type="file" hidden onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setFileName(e.target.files?.[0]?.name || '');
            }} />
          </Button>
          <Typography variant="body2" color="text.secondary">{fileName || '未選擇檔案'}</Typography>
        </Stack>

        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>立即申請請假</Button>

        <Dialog open={!!successData} onClose={() => setSuccessData(null)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle style={{ color: 'green' }} />
            <Typography variant="h6">請假申請成功</Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={1}>
              <Typography>假單編號：{successData?.leaveApplicationId}</Typography>
              <Typography>假別：{successData?.leaveTypeName}</Typography>
              <Typography>
                時間：{dayjs(successData?.startDateTime).format('YYYY-MM-DD HH:mm')} ～ {dayjs(successData?.endDateTime).format('YYYY-MM-DD HH:mm')}
              </Typography>
              <Typography>總時數：{successData?.leaveHours} 小時</Typography>
              <Typography>代理人：{successData?.proxyEmployeeName || '—'}</Typography>
              <Typography>主管：{supervisor || '—'}</Typography>
              <Typography>事由：{successData?.reason || '—'}</Typography>
              <Typography>附件：{successData?.fileName || '—'}</Typography>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSuccessData(null)} variant="contained" color="primary">關閉</Button>
          </DialogActions>
        </Dialog>

              </Box>
      </Box>
    </LocalizationProvider>
  );
}


