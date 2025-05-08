import { useMemo } from 'react';
import { Dayjs } from 'dayjs';

export function useLeaveHoursCalculator(
  start: Dayjs | null,
  end: Dayjs | null,
  holidays: string[],
) {
  return useMemo(() => {
    if (!start || !end || !end.isAfter(start)) return 0;

    let hours = 0;
    let curr = start.startOf('hour');

    while (curr.isBefore(end)) {
      const isHoliday = holidays.includes(curr.format('YYYY-MM-DD'));
      const isWeekend = curr.day() === 0 || curr.day() === 6;
      const hour = curr.hour();

      if (!isHoliday && !isWeekend && hour >= 9 && hour < 18) {
        hours += 1;
      }

      curr = curr.add(1, 'hour');
    }

    return hours;
  }, [start, end, holidays]);
}
