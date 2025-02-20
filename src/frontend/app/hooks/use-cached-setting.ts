import { useState } from "react";

export function useCachedSetting<T>(localStorageKey: string, defaultValue: T) {
  const cachedValue = localStorage.getItem(localStorageKey);
  let value: T = cachedValue == null ? defaultValue : JSON.parse(cachedValue);

  const [setting, setSetting] = useState(value);

  const updater = (newValue: T) => {
    localStorage.setItem(localStorageKey, JSON.stringify(newValue));
    setSetting(newValue);
  };

  return [setting, updater] as const;
}
