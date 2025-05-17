import axios from 'axios';
import dayjs from 'dayjs';

export const getTaiwanHolidays = async (): Promise<Date[]> => {
  const res = await axios.get(
    `https://data.ntpc.gov.tw/api/datasets/308dcd75-6434-45bc-a95f-584da4fed251/json?size=1000`,
  );
  const raw = res.data;

  const holidays = raw
    .filter((item: any) => item.isholiday === '是')
    .map(
      (item: any) =>
        new Date(`${item.date.slice(0, 4)}-${item.date.slice(4, 6)}-${item.date.slice(6, 8)}`),
    );

  const pastDates = Array.from({ length: 365 }, (_, i) =>
    dayjs()
      .subtract(i + 1, 'day')
      .toDate(),
  );

  const weekends = Array.from({ length: 365 }, (_, i) => {
    const d = dayjs().add(i, 'day').toDate();
    const day = d.getDay();
    return day === 0 || day === 6 ? d : null;
  }).filter(Boolean) as Date[];

  return [...holidays, ...pastDates, ...weekends];
};
