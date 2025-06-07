import { useState, useEffect } from 'react';
import { checkDailyLimit, incrementDailyCount } from '../utils/helpers';

export const useDailyLimit = () => {
  const [dailyLimit, setDailyLimit] = useState(checkDailyLimit());

  useEffect(() => {
    setDailyLimit(checkDailyLimit());
  }, []);

  const updateDailyLimit = () => {
    setDailyLimit(checkDailyLimit());
  };

  const consumeDaily = () => {
    incrementDailyCount();
    setDailyLimit(checkDailyLimit());
  };

  return {
    dailyLimit,
    updateDailyLimit,
    consumeDaily
  };
}; 