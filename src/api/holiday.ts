import axios from 'axios';
import dayjs from 'dayjs';

export const getTaiwanHolidays = async (): Promise<Date[]> => {
  const res = await axios.get(
    `https://us-central1-tsmc-attendance-system-458811.cloudfunctions.net/ntpcHolidays`,
  );

  const raw = res.data;
  const holidays = raw
    .filter((item: any) => item.isholiday === '是')
    .map(
      (item: any) =>
        new Date(`${item.date.slice(0, 4)}-${item.date.slice(4, 6)}-${item.date.slice(6, 8)}`),
    );

  const weekends = Array.from({ length: 365 }, (_, i) => {
    const d = dayjs().add(i, 'day').toDate();
    const day = d.getDay();
    return day === 0 || day === 6 ? d : null;
  }).filter(Boolean) as Date[];

  return [...holidays, ...weekends];
};
