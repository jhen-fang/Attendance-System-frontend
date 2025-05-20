import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import {
  Box,
  Typography,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { CheckCircle } from 'lucide-react';
import { getLeaveBalance, uploadFile, applyLeave } from '../api/leave';
import { useLeaveHoursCalculator } from '../hooks/useLeaveHoursCalculator';
import { useProxiesAndHolidays } from '../hooks/useProxiesAndHolidays';
import LeaveTimePickerGroup from '../components/LeaveTimePickerGroup';
import FileUploadButton from '../components/FileUploadButton';
import LeaveTypeRadioGroup from '../components/LeaveTypeRadioGroup';

export default function LeavePage() {
  const [leaveTypeId, setLeaveTypeId] = useState(1);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);
  const [reason, setReason] = useState('');
  const [proxyCode, setProxyCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [, setFilePath] = useState('');
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [maxHours, setMaxHours] = useState(0);

  const { proxies, holidays } = useProxiesAndHolidays();
  const leaveHours = useLeaveHoursCalculator(start, end, holidays);

  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      const s = startDate.hour(startTime.hour()).minute(startTime.minute());
      const e = endDate.hour(endTime.hour()).minute(endTime.minute());
      setStart(s);
      setEnd(e);
    }
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    getLeaveBalance(leaveTypeId).then(setMaxHours);
  }, [leaveTypeId]);

  const handleSubmit = async () => {
    setErrorMsg('');

    if (!start || !end || leaveHours === 0 || leaveHours > maxHours) {
      setErrorMsg('請確認請假時間與剩餘時數');
      return;
    }

    let uploadedPath = '';
    let uploadedName = '';

    if (file) {
      const result = await uploadFile(file);
      uploadedPath = result.uniqueFileName;
      uploadedName = result.originalFileName;
    }

    const formattedStart = start?.format('YYYY-MM-DDTHH:mm:ss');
    const formattedEnd = end?.format('YYYY-MM-DDTHH:mm:ss');

    try {
      const payload = {
        leaveTypeId,
        startDateTime: formattedStart,
        endDateTime: formattedEnd,
        leaveHours,
        reason,
        proxyEmployeeCode: proxyCode,
        filePath: uploadedPath,
        fileName: uploadedName,
      };
      const res = await applyLeave(payload);
      setSuccessData(res);
      resetForm();
    } catch (err: any) {
      const apiMsg = err?.response?.data?.msg || '請假申請失敗，請稍後再試';
      setErrorMsg(apiMsg);
    }
  };

  const resetForm = () => {
    setLeaveTypeId(1);
    setStartDate(null);
    setStartTime(null);
    setEndDate(null);
    setEndTime(null);
    setStart(null);
    setEnd(null);
    setReason('');
    setProxyCode('');
    setFile(null);
    setFileName('');
    setFilePath('');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: '100%', p: 2, display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1000,
            p: 3,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" color="text.primary" mb={2}>
            請假申請表
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <LeaveTypeRadioGroup leaveTypeId={leaveTypeId} setLeaveTypeId={setLeaveTypeId} />

          <LeaveTimePickerGroup
            label="開始時間"
            date={startDate}
            time={startTime}
            setDate={setStartDate}
            setTime={setStartTime}
            disableDate={(d) =>
              holidays.includes(d.format('YYYY-MM-DD')) || d.day() === 0 || d.day() === 6
            }
          />

          <LeaveTimePickerGroup
            label="結束時間"
            date={endDate}
            time={endTime}
            setDate={setEndDate}
            setTime={setEndTime}
            disableDate={(d) =>
              holidays.includes(d.format('YYYY-MM-DD')) || d.day() === 0 || d.day() === 6
            }
          />

          <Typography sx={{ mb: 2 }} color="text.secondary">
            請假時數：{leaveHours} 小時
            {leaveTypeId !== 4 && `（上限 ${maxHours} 小時）`}
          </Typography>

          <TextField
            label="請假原因"
            fullWidth
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            size="small"
            sx={{ mb: 2 }}
          />

          <Select
            value={proxyCode}
            onChange={(e) => setProxyCode(e.target.value)}
            fullWidth
            size="small"
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="">- 選擇代理人 -</MenuItem>
            {proxies.map((p) => (
              <MenuItem key={p.employeeCode} value={p.employeeCode}>
                {p.employeeName}
              </MenuItem>
            ))}
          </Select>

          <FileUploadButton
            fileName={fileName}
            onFileChange={(f) => {
              setFile(f);
              setFileName(f?.name || '');
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            送出請假申請
          </Button>

          <Dialog open={!!successData} onClose={() => setSuccessData(null)}>
            <DialogTitle>
              <CheckCircle style={{ color: 'green', marginRight: 8 }} />
              請假申請成功
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={1}>
                <Typography>假單編號：{successData?.leaveApplicationId}</Typography>
                <Typography>假別：{successData?.leaveTypeName}</Typography>
                <Typography>
                  時間：{dayjs(successData?.startDateTime).format('YYYY-MM-DD HH:mm')} ～
                  {dayjs(successData?.endDateTime).format('YYYY-MM-DD HH:mm')}
                </Typography>
                <Typography>總時數：{successData?.leaveHours} 小時</Typography>
                <Typography>代理人：{successData?.proxyEmployeeName || '—'}</Typography>
                <Typography>事由：{successData?.reason || '—'}</Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSuccessData(null)} variant="contained">
                關閉
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
