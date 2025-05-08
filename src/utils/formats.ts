import dayjs from 'dayjs';

export function formatDateTime(value?: string | null): string {
  return value ? dayjs(value).format('YYYY-MM-DD HH') + '點' : '—';
}

export function formatDateOnly(value: string | Date): string {
  return dayjs(value).format('YYYY-MM-DD');
}

export function formatHourOnly(value?: string | Date | null): string {
  return value ? dayjs(value).format('HH') + '點' : '—';
}
