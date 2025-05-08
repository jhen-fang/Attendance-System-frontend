import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

interface Props {
  leaveTypeId: number;
  setLeaveTypeId: (val: number) => void;
}

const leaveTypes = [
  { id: 1, label: '特休' },
  { id: 2, label: '病假' },
  { id: 3, label: '事假' },
];

export default function LeaveTypeRadioGroup({ leaveTypeId, setLeaveTypeId }: Props) {
  return (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <FormLabel>假別</FormLabel>
      <RadioGroup row value={leaveTypeId} onChange={(e) => setLeaveTypeId(Number(e.target.value))}>
        {leaveTypes.map((t) => (
          <FormControlLabel
            key={t.id}
            value={t.id}
            control={<Radio />}
            label={t.label}
            sx={{ color: 'text.primary' }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
