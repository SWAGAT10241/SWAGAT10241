/**
 * @fileoverview System Clock Hook
 */
import { useState, useEffect } from 'react';

export function useClock() {
  const [timeString, setTimeString] = useState('--:--');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeString;
}

