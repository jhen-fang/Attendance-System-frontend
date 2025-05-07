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
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { uploadFile, getLeaveDetail, updateLeave } from '../api/leave';
import FileUploadButton from '../components/FileUploadButton';
import LeaveTimePickerGroup from '../components/LeaveTimePickerGroup';
import { useLeaveHoursCalculator } from '../hooks/useLeaveHoursCalculator';
import { useProxiesAndHolidays } from '../hooks/useProxiesAndHolidays';

interface Props {
  open: boolean;
  onClose: () => void;
  leaveId: number | null;
  onSuccess: () => void;
}

export default function LeaveDetailDialog({ open, onClose, leaveId, onSuccess }: Props) {
  const [data, setData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);

  const { proxies, holidays } = useProxiesAndHolidays();
  const leaveHours = useLeaveHoursCalculator(start, end, holidays);

  useEffect(() => {
    if (leaveId && open) {
      getLeaveDetail(leaveId).then((detail) => {
        setData(detail);
        setIsEditing(false);
        setFileName(detail.fileName || '');
        const s = dayjs(detail.startDateTime);
        const e = dayjs(detail.endDateTime);
        setStartDate(s.startOf('day'));
        setStartTime(s);
        setEndDate(e.startOf('day'));
        setEndTime(e);
        setStart(s);
        setEnd(e);
      });
    }
  }, [leaveId, open]);

  useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      const s = startDate.hour(startTime.hour()).minute(startTime.minute());
      const e = endDate.hour(endTime.hour()).minute(endTime.minute());
      setStart(s);
      setEnd(e);
    }
  }, [startDate, startTime, endDate, endTime]);

  useEffect(() => {
    if (data && leaveHours !== data.leaveHours) {
      setData({ ...data, leaveHours });
    }
  }, [leaveHours]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    setData(updated);
  };

  const handleSubmit = async () => {
    const formattedStart = start?.format('YYYY-MM-DDTHH:mm:ss');
    const formattedEnd = end?.format('YYYY-MM-DDTHH:mm:ss');

    let uploadedPath = data.filePath;
    let uploadedName = data.fileName;
    if (file) {
      const result = await uploadFile(file);
      uploadedPath = result.uniqueFileName;
      uploadedName = result.originalFileName;
    }
    const payload = {
      leaveTypeId: data.leaveTypeId,
      startDateTime: formattedStart,
      endDateTime: formattedEnd,
      leaveHours,
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
          <Typography variant="caption">申請人</Typography>
          <Typography gutterBottom>{data.employeeName}</Typography>

          <Typography variant="caption">假別</Typography>
          <Typography gutterBottom>{data.leaveTypeName}</Typography>

          <Typography variant="caption">開始時間</Typography>
          {isEditing ? (
            <LeaveTimePickerGroup
              label=""
              date={startDate}
              time={startTime}
              setDate={setStartDate}
              setTime={setStartTime}
              disableDate={(d) =>
                holidays.includes(d.format('YYYY-MM-DD')) || d.day() === 0 || d.day() === 6
              }
            />
          ) : (
            <Typography gutterBottom>
              {dayjs(data.startDateTime).format('YYYY/MM/DD HH:mm')}
            </Typography>
          )}

          <Typography variant="caption">結束時間</Typography>
          {isEditing ? (
            <LeaveTimePickerGroup
              label=""
              date={endDate}
              time={endTime}
              setDate={setEndDate}
              setTime={setEndTime}
              disableDate={(d) =>
                holidays.includes(d.format('YYYY-MM-DD')) || d.day() === 0 || d.day() === 6
              }
            />
          ) : (
            <Typography gutterBottom>
              {dayjs(data.endDateTime).format('YYYY/MM/DD HH:mm')}
            </Typography>
          )}

          <Typography variant="caption">請假時數</Typography>
          <Typography gutterBottom>{leaveHours} 小時</Typography>

          <Typography variant="caption">請假原因</Typography>
          {isEditing ? (
            <TextField
              fullWidth
              value={data.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              multiline
              rows={3}
              size="small"
              sx={{ mb: 2 }}
            />
          ) : (
            <Typography gutterBottom>{data.reason || '—'}</Typography>
          )}

          <Typography variant="caption">代理人</Typography>
          {isEditing ? (
            <Select
              fullWidth
              size="small"
              value={data.proxyEmployeeCode || ''}
              onChange={(e) => handleChange('proxyEmployeeCode', e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">- 請選擇 -</MenuItem>
              {proxies.map((p) => (
                <MenuItem key={p.employeeCode} value={p.employeeCode}>
                  {p.employeeName}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography gutterBottom>{data.proxyEmployeeName || '—'}</Typography>
          )}

          <Typography variant="caption">審核人</Typography>
          <Typography gutterBottom>{data.approverEmployeeName || '—'}</Typography>

          <Typography variant="caption">附件</Typography>
          {isEditing ? (
            <FileUploadButton
              file={file}
              fileName={fileName}
              onFileChange={(f) => {
                setFile(f);
                setFileName(f?.name || '');
              }}
            />
          ) : (
            <Typography gutterBottom>{fileName || data.fileName || '未選擇檔案'}</Typography>
          )}
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
