import { Dayjs } from 'dayjs';

export function isHoliday(date: Dayjs, holidays: string[]): boolean {
  const isWeekend = date.day() === 0 || date.day() === 6;
  const isInHolidayList = holidays.includes(date.format('YYYY-MM-DD'));
  return isWeekend || isInHolidayList;
}

export function disableDate(holidays: string[]) {
  return (date: Dayjs) => isHoliday(date, holidays);
}
