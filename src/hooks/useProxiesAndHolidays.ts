import { useEffect, useState } from 'react';
import { getProxies } from '../api/employee';
import { getTaiwanHolidays } from '../api/holiday';
import dayjs from 'dayjs';

export function useProxiesAndHolidays() {
  const [proxies, setProxies] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [proxyList, holidayList] = await Promise.all([getProxies(), getTaiwanHolidays()]);
        setProxies(proxyList);
        setHolidays(holidayList.map((d) => dayjs(d).format('YYYY-MM-DD')));
      } catch (err) {
        console.error('代理人與假日載入失敗:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { proxies, holidays, loading };
}
