import React, { useState, useEffect } from 'react';
import { getLeave, approveLeave, rejectLeave } from '../api/manager';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  IconButton,
  Alert,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

interface LeaveReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  leaveId: number | null;
  approvalReason: string;
  setApprovalReason: (value: string) => void;
  downloadAttachment: (fileName: string) => Promise<void>;
}

const LeaveReviewDialog: React.FC<LeaveReviewDialogProps> = ({
  open,
  onClose,
  onApprove,
  onReject,
  leaveId,
  approvalReason,
  setApprovalReason,
  downloadAttachment,
}) => {
  const [data, setData] = useState<null | {
    leaveApplicationId: number;
    employeeId: number;
    employeeName: string;
    leaveTypeName: string;
    applicationDateTime: string;
    startDateTime: string;
    endDateTime: string;
    leaveHours: number;
    reason: string;
    proxyEmployeeCode: string;
    proxyEmployeeName: string;
    fileName?: string;
    filePath?: string;
  }>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (leaveId !== null && open) {
      getLeave(leaveId).then((res) => {
        setData(res);
        setApprovalReason('');
        setError('');
      });
    } else {
      setData(null);
    }
  }, [leaveId, open, setApprovalReason]);

  const handleApprove = async () => {
    if (!approvalReason.trim()) {
      setError('請填寫主管留言');
      return;
    }
    await approveLeave(data!.leaveApplicationId, approvalReason);
    onApprove();
  };

  const handleReject = async () => {
    if (!approvalReason.trim()) {
      setError('請填寫主管留言');
      return;
    }
    await rejectLeave(data!.leaveApplicationId, approvalReason);
    onReject();
  };

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>審核請假申請</DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>員工編號：{data.employeeId}</Typography>
        <Typography>員工姓名：{data.employeeName}</Typography>
        <Typography>假別：{data.leaveTypeName}</Typography>
        <Typography>申請時間：{data.applicationDateTime}</Typography>
        <Typography>請假時間：{data.startDateTime}</Typography>
        <Typography>結束時間：{data.endDateTime}</Typography>
        <Typography>
          請假時數：{data.leaveHours} 小時 ({(data.leaveHours / 8).toFixed(1)} 天)
        </Typography>
        <Typography>代理人員工編號：{data.proxyEmployeeCode}</Typography>
        <Typography>代理人姓名：{data.proxyEmployeeName}</Typography>
        <Typography>請假事由：{data.reason}</Typography>
        <Typography>
          附件：
          {data.fileName && data.filePath ? (
            <IconButton
              color="primary"
              onClick={() => downloadAttachment(data.filePath as string)}
              aria-label="下載附件"
            >
              <LinkIcon />
            </IconButton>
          ) : (
            '—'
          )}
        </Typography>
        <TextField
          label="主管留言"
          fullWidth
          multiline
          rows={3}
          value={approvalReason}
          onChange={(e) => {
            setApprovalReason(e.target.value);
            setError('');
          }}
          error={!!error}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleApprove}
          variant="contained"
          color="success"
        >
          同意
        </Button>
        <Button
          onClick={handleReject}
          variant="contained"
          color="error"
        >
          駁回
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveReviewDialog;
