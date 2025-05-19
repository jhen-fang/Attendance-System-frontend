import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import LeaveStatusChip from './LeaveStatusChip';
import { downloadAttachment } from '../api/leave';
import { formatDateTime } from '../utils/formats';
import LinkIcon from '@mui/icons-material/Link';

interface Props {
  data: any[];
  onRowClick: (id: number) => void;
}

const renderCell = (value?: string) => formatDateTime(value);

export default function LeaveTable({ data, onRowClick }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 80 }}>申請時間</TableCell>
            <TableCell sx={{ minWidth: 60 }}>假別</TableCell>
            <TableCell sx={{ minWidth: 120 }}>審核時間</TableCell>
            <TableCell sx={{ minWidth: 120 }}>請假時間</TableCell>
            <TableCell sx={{ minWidth: 120 }}>結束時間</TableCell>
            <TableCell sx={{ minWidth: 100 }}>請假時數</TableCell>
            <TableCell sx={{ minWidth: 200 }}>請假原因</TableCell>
            <TableCell sx={{ minWidth: 200 }}>主管留言</TableCell>
            <TableCell sx={{ minWidth: 120 }}>代理人員編</TableCell>
            <TableCell sx={{ minWidth: 80 }}>代理人姓名</TableCell>
            <TableCell sx={{ minWidth: 60 }}>附件</TableCell>
            <TableCell sx={{ minWidth: 100 }}>申請狀態</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.applicationId}
              hover
              onClick={() => onRowClick(row.applicationId)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>{row.applicationDateTime?.split('T')[0] || '—'}</TableCell>
              <TableCell>{row.leaveTypeName}</TableCell>
              <TableCell>{renderCell(row.approvalDatetime)}</TableCell>
              <TableCell>{renderCell(row.startDateTime)}</TableCell>
              <TableCell>{renderCell(row.endDateTime)}</TableCell>
              <TableCell>
                {row.leaveHours} 小時 ({(row.leaveHours / 8).toFixed(1)} 天)
              </TableCell>
              <TableCell>
                <Tooltip title={row.reason || ''}>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.reason || '—'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={row.approvalReason || ''}>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {row.approvalReason || '—'}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>{row.proxyEmployeeCode || '—'}</TableCell>
              <TableCell>{row.proxyEmployeeName || '—'}</TableCell>
              <TableCell align="center">
                {row.fileName ? (
                  <IconButton
                    color="primary"
                    onClick={() => downloadAttachment(row.fileName)}
                    aria-label="下載附件"
                  >
                    <LinkIcon />
                  </IconButton>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                <LeaveStatusChip status={row.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
