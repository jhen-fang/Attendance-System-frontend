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
  Link,
} from '@mui/material';

interface LeaveReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  leaveId: number | null;
  approvalReason: string;
  setApprovalReason: (value: string) => void;
  downloadAttachment: (fileName: string) => string;
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
    proxyEmployeeId: number;
    proxyEmployeeName: string;
    fileName?: string;
  }>(null);

  useEffect(() => {
    if (leaveId !== null && open) {
      getLeave(leaveId).then((res) => {
        setData(res);
      });
    } else {
      setData(null);
    }
  }, [leaveId, open]);

  if (!data) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>審核請假申請</DialogTitle>
      <DialogContent dividers>
        <Typography>員工編號：{data.employeeId}</Typography>
        <Typography>員工姓名：{data.employeeName}</Typography>
        <Typography>假別：{data.leaveTypeName}</Typography>
        <Typography>申請時間：{data.applicationDateTime}</Typography>
        <Typography>請假時間：{data.startDateTime}</Typography>
        <Typography>結束時間：{data.endDateTime}</Typography>
        <Typography>
          請假時數：{data.leaveHours} 小時 ({(data.leaveHours / 8).toFixed(1)} 天)
        </Typography>
        <Typography>代理人員 ID：{data.proxyEmployeeId}</Typography>
        <Typography>代理人姓名：{data.proxyEmployeeName}</Typography>
        <Typography>請假事由：{data.reason}</Typography>
        <Typography>
          附件：
          {data.fileName ? (
            <Link href={downloadAttachment(data.fileName)} target="_blank" rel="noopener">
              📎 {data.fileName}
            </Link>
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
          onChange={(e) => setApprovalReason(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={async () => {
            await approveLeave(data.leaveApplicationId, approvalReason);
            onApprove();
          }}
          variant="contained"
          color="success"
        >
          同意
        </Button>
        <Button
          onClick={async () => {
            await rejectLeave(data.leaveApplicationId, approvalReason);
            onReject();
          }}
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
