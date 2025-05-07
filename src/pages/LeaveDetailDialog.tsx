// LeaveDetailDialog.tsx
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import Grid2 from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { getProxies } from '../api/employee';
import { uploadFile, getLeaveDetail, updateLeave } from '../api/leave';
import { getTaiwanHolidays } from '../api/holiday';

interface Props {
  open: boolean;
  onClose: () => void;
  leaveId: number | null;
  onSuccess: () => void;
}

export default function LeaveDetailDialog({ open, onClose, leaveId, onSuccess }: Props) {
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [proxies, setProxies] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [holidays, setHolidays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (leaveId && open) {
      Promise.all([getLeaveDetail(leaveId), getProxies(), getTaiwanHolidays()]).then(
        ([detail, proxyList, holidayList]) => {
          setData(detail);
          setProxies(proxyList);
          setHolidays(holidayList.map((d) => dayjs(d).format('YYYY-MM-DD')));
          setIsEditing(false);
          setFileName(detail.fileName || '');
          const s = dayjs(detail.startDateTime);
          const e = dayjs(detail.endDateTime);
          setStartDate(s.startOf('day'));
          setStartTime(s);
          setEndDate(e.startOf('day'));
          setEndTime(e);
        },
      );
    }
  }, [leaveId, open]);

  const disableDate = (date: Dayjs) => {
    const day = date.day();
    return day === 0 || day === 6 || holidays.includes(date.format('YYYY-MM-DD'));
  };

  useEffect(() => {
    if (startDate && startTime && endDate && endTime && data) {
      const start = startDate.hour(startTime.hour()).minute(startTime.minute());
      const end = endDate.hour(endTime.hour()).minute(endTime.minute());

      const updated = { ...data };
      updated.startDateTime = start.toISOString();
      updated.endDateTime = end.toISOString();
      updated.leaveHours = calculateLeaveHours(start.toISOString(), end.toISOString());
      setData(updated);
    }
  }, [startDate, startTime, endDate, endTime]);

  const calculateLeaveHours = (startStr: string, endStr: string) => {
    const start = dayjs(startStr);
    const end = dayjs(endStr);
    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return 0;

    let hours = 0;
    let curr = start.startOf('hour');

    while (curr.isBefore(end)) {
      const isHoliday = holidays.includes(curr.format('YYYY-MM-DD'));
      const isWeekend = curr.day() === 0 || curr.day() === 6;
      if (!isHoliday && !isWeekend) {
        const hour = curr.hour();
        if (hour >= 9 && hour < 18) hours += 1;
      }
      curr = curr.add(1, 'hour');
    }
    return hours;
  };

  const handleChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    setData(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected?.name || '');
  };

  const handleSubmit = async () => {
    let uploadedPath = data.filePath;
    let uploadedName = data.fileName;
    if (file) {
      const result = await uploadFile(file);
      uploadedPath = result.uniqueFileName;
      uploadedName = result.originalFileName;
    }
    const payload = {
      leaveTypeId: data.leaveTypeId,
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
      leaveHours: data.leaveHours,
      reason: data.reason,
      proxyEmployeeCode: data.proxyEmployeeCode ?? '',
      filePath: uploadedPath,
      fileName: uploadedName,
    };
    await updateLeave(leaveId!, payload);
    onSuccess();
    onClose();
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>請假紀錄詳情</DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid2 container columns={12} spacing={2}>
            <Grid2 xs={6}>
              <Typography variant="caption">申請人</Typography>
              <Typography>{data.employeeName}</Typography>
            </Grid2>
            <Grid2 xs={6}>
              <Typography variant="caption">假別</Typography>
              <Typography>{data.leaveTypeName}</Typography>
            </Grid2>

            <Grid2 xs={12}>
              <Typography variant="caption">開始時間</Typography>
              {isEditing ? (
                <Grid2 container columns={12} spacing={2}>
                  <Grid2 xs={6}>
                    <DatePicker
                      label="開始日期"
                      value={startDate}
                      onChange={setStartDate}
                      shouldDisableDate={disableDate}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid2>
                  <Grid2 xs={6}>
                    <TimePicker
                      label="開始時間"
                      ampm={false}
                      views={['hours']}
                      minTime={dayjs().hour(9)}
                      maxTime={dayjs().hour(18)}
                      value={startTime}
                      onChange={setStartTime}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid2>
                </Grid2>
              ) : (
                <Typography>{dayjs(data.startDateTime).format('YYYY/MM/DD HH:mm')}</Typography>
              )}
            </Grid2>

            <Grid2 xs={12}>
              <Typography variant="caption">結束時間</Typography>
              {isEditing ? (
                <Grid2 container columns={12} spacing={2}>
                  <Grid2 xs={6}>
                    <DatePicker
                      label="結束日期"
                      value={endDate}
                      onChange={setEndDate}
                      shouldDisableDate={disableDate}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid2>
                  <Grid2 xs={6}>
                    <TimePicker
                      label="結束時間"
                      ampm={false}
                      views={['hours']}
                      minTime={dayjs().hour(9)}
                      maxTime={dayjs().hour(18)}
                      value={endTime}
                      onChange={setEndTime}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </Grid2>
                </Grid2>
              ) : (
                <Typography>{dayjs(data.endDateTime).format('YYYY/MM/DD HH:mm')}</Typography>
              )}
            </Grid2>

            <Grid2 xs={12}>
              <Typography variant="caption">請假時數</Typography>
              <Typography>{data.leaveHours} 小時</Typography>
            </Grid2>
            <Grid2 xs={12}>
              <Typography variant="caption">請假原因</Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  value={data.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  multiline
                  rows={3}
                  size="small"
                />
              ) : (
                <Typography>{data.reason || '—'}</Typography>
              )}
            </Grid2>

            <Grid2 xs={6}>
              <Typography variant="caption">代理人</Typography>
              {isEditing ? (
                <Select
                  fullWidth
                  size="small"
                  value={data.proxyEmployeeCode || ''}
                  onChange={(e) => handleChange('proxyEmployeeCode', e.target.value)}
                >
                  <MenuItem value="">- 請選擇 -</MenuItem>
                  {proxies.map((p) => (
                    <MenuItem key={p.employeeCode} value={p.employeeCode}>
                      {p.employeeName}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Typography>{data.proxyEmployeeName || '—'}</Typography>
              )}
            </Grid2>

            <Grid2 xs={6}>
              <Typography variant="caption">審核人</Typography>
              <Typography>{data.approverEmployeeName || '—'}</Typography>
            </Grid2>

            <Grid2 xs={12}>
              <Typography variant="caption">附件</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                {isEditing && (
                  <Button variant="outlined" component="label" size="small">
                    重新上傳
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                )}
                <Typography variant="body2">{fileName || data.fileName || '未選擇檔案'}</Typography>
              </Stack>
            </Grid2>
          </Grid2>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        {!isEditing ? (
          <>
            <Button
              onClick={() => setIsEditing(true)}
              disabled={data.status !== '待審核'}
              variant="outlined"
            >
              編輯
            </Button>
            <Button onClick={onClose}>關閉</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(false)}>取消</Button>
            <Button onClick={handleSubmit} variant="contained">
              儲存
            </Button>
            <Button onClick={onClose}>關閉</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
