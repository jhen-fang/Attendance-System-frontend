import React, { useEffect, useState } from 'react';
import LeaveReviewDialog from './LeaveReviewDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Link,
} from '@mui/material';
import { getAllLeaves } from '../api/manager';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const LeaveManage = () => {
  const [leaveData, setLeaveData] = useState([]);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [approvalReason, setApprovalReason] = useState('');

  // 點擊未審核按鈕時打開 dialog
  const handleOpenDialog = (leaveId:number) => {
    setSelectedId(leaveId);
    setDialogOpen(true);
  };

  // 審核邏輯
  const handleApprove = () => {
    // 執行核准邏輯
    setDialogOpen(false);
  };

  const handleReject = () => {
    // 執行拒絕邏輯
    setDialogOpen(false);
  };

  // download URL 產生器
  const downloadAttachment = (fileName: string) => `/api/download/${fileName}`;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllLeaves();
      setLeaveData(data);
    };
    fetchData();
  }, []);

  const getStatusChip = (status: string, id: number) => {
    if (status === '待審核') {
      return (
        <Chip label="待審核" color="default"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDialog(id);
          }}
          clickable
        />
      );
    }
    if (status === '已核准') {
      return <Chip label="已核准" color="success" />;
    }
    if (status === '已駁回' || status === '已拒絕') {
      return <Chip label="已駁回" color="error" />;
    }
    return <Chip label={status} color="default" />;
  };


  const renderCell = (datetime: string) =>
    datetime ? dayjs(datetime).format('YYYY-MM-DD HH:mm') : '—';

  return (
    <div className="p-4">
      <Typography variant="h6" gutterBottom color="text.primary">
        員工請假審核
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>申請時間</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>假別</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>請假時間</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>結束時間</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>請假時數</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>申請狀態</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveData.map((row: any) => (
              <TableRow>
                <TableCell>{renderCell(row.applicationDateTime)}</TableCell>
                <TableCell>{row.leaveTypeName || '—'}</TableCell>
                <TableCell>{renderCell(row.startDateTime)}</TableCell>
                <TableCell>{renderCell(row.endDateTime)}</TableCell>
                <TableCell>
                  {row.leaveHours} 小時 ({(row.leaveHours / 8).toFixed(1)} 天)
                </TableCell>
                <TableCell>{getStatusChip(row.status, row.applicationId)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <LeaveReviewDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        leaveId={selectedId}
        approvalReason={approvalReason}
        setApprovalReason={setApprovalReason}
        downloadAttachment={downloadAttachment}
    />
    </div>
  );
};

export default LeaveManage;
