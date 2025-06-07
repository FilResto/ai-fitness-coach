import { useState, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/helpers';

export const useLocalStorage = (step, initialValue) => {
  const [value, setValue] = useState(() => {
    const saved = loadFromLocalStorage(step);
    return saved || initialValue;
  });

  const updateValue = (newValue) => {
    setValue(newValue);
    saveToLocalStorage(step, newValue);
  };

  return [value, updateValue];
}; 