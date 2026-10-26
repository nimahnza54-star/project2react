import { useEffect, useState } from 'react';

/** state ماندگار در localStorage؛ در صورت خطا بی‌صدا به مقدار اولیه برمی‌گردد */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage در دسترس نیست */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
