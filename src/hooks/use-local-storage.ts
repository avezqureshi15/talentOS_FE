import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/storage";

export function useLocalStorage(key: string, initialValue: string): [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState(() => storage.get(key) ?? initialValue);

  useEffect(() => {
    const current = storage.get(key);
    if (current !== storedValue) {
      if (current !== null) {
        setStoredValue(current);
      } else {
        storage.set(key, storedValue);
      }
    }
  }, [key, storedValue]);

  const setValue = useCallback(
    (value: string) => {
      setStoredValue(value);
      storage.set(key, value);
    },
    [key],
  );

  return [storedValue, setValue];
}
