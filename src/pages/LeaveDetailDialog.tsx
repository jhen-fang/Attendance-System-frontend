import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';
import { getProxies } from '../api/employee';
import { uploadFile, getLeaveDetail, updateLeave } from '../api/leave';

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

  useEffect(() => {
    if (leaveId && open) {
      Promise.all([getLeaveDetail(leaveId), getProxies()]).then(([detail, proxyList]) => {
        console.log('取得請假資料：', detail);
        setData(detail);
        setProxies(proxyList);
        setIsEditing(false);
        setFileName(detail.fileName || '');
      });
    }
  }, [leaveId, open]);

  const calculateLeaveHours = (startStr: string, endStr: string) => {
    const start = dayjs(startStr);
    const end = dayjs(endStr);
    if (!start.isValid() || !end.isValid() || !end.isAfter(start)) return 0;

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
      hours =
        (firstDayHours > 0 ? firstDayHours : 0) +
        (fullDays > 0 ? fullDays * 8 : 0) +
        (lastDayHours > 0 ? lastDayHours : 0);
    }
    return hours;
  };

  const handleChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    if (field === 'startDateTime' || field === 'endDateTime') {
      updated.leaveHours = calculateLeaveHours(updated.startDateTime, updated.endDateTime);
    }
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
    console.log('送出更新資料：', payload);
    await updateLeave(leaveId!, payload);
    onSuccess();
    onClose();
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>請假紀錄詳情</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption">申請人</Typography>
            <Typography>{data.employeeName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">假別</Typography>
            <Typography>{data.leaveTypeName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">開始時間</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                type="datetime-local"
                value={dayjs(data.startDateTime).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => handleChange('startDateTime', e.target.value)}
              />
            ) : (
              <Typography>{dayjs(data.startDateTime).format('YYYY/MM/DD HH:mm')}</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">結束時間</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                type="datetime-local"
                value={dayjs(data.endDateTime).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => handleChange('endDateTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <Typography>{dayjs(data.endDateTime).format('YYYY/MM/DD HH:mm')}</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">請假時數</Typography>
            <Typography>{data.leaveHours} 小時</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption">請假原因</Typography>
            {isEditing ? (
              <TextField
                fullWidth
                value={data.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                multiline
                rows={3}
              />
            ) : (
              <Typography>{data.reason || '—'}</Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">代理人</Typography>
            {isEditing ? (
              <Select
                fullWidth
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
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption">審核人</Typography>
            <Typography>{data.approverEmployeeName || '—'}</Typography>
          </Grid>
          <Grid item xs={12}>
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
          </Grid>
        </Grid>
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
