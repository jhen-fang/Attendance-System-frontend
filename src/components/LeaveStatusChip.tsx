import { Chip } from '@mui/material';

export default function LeaveStatusChip({ status }: { status: string }) {
  switch (status) {
    case '待審核':
    case 'PENDING':
      return <Chip label="待審核" color="default" />;
    case '已核准':
    case 'APPROVED':
      return <Chip label="已核准" color="success" />;
    case '已拒絕':
    case 'REJECTED':
      return <Chip label="已拒絕" color="error" />;
    case '已取消':
    case 'CANCELED':
      return <Chip label="已取消" color="default" />;
    default:
      return <Chip label={status} />;
  }
}
