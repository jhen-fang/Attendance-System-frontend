import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Grid } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

interface Props {
  label: string;
  date: Dayjs | null;
  time: Dayjs | null;
  setDate: (d: Dayjs | null) => void;
  setTime: (t: Dayjs | null) => void;
  disableDate?: (date: Dayjs) => boolean;
}

export default function LeaveTimePickerGroup({
  label,
  date,
  time,
  setDate,
  setTime,
  disableDate,
}: Props) {
  return (
    <>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <Grid container spacing={2} sx={{ my: 1 }}>
        <Grid item xs={6}>
          <DatePicker
            label="日期"
            value={date}
            onChange={setDate}
            shouldDisableDate={disableDate}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TimePicker
            label="時間"
            value={time}
            onChange={setTime}
            ampm={false}
            views={['hours']}
            minTime={dayjs().hour(9)}
            maxTime={dayjs().hour(18)}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Grid>
      </Grid>
    </>
  );
}
