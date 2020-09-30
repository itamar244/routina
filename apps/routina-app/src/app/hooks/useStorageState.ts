import { useEffect, useState } from "react";

export function useStorageState<T>(name: string, defaultValue: T) {
  const itemString = localStorage.getItem(name);
  const item = itemString && JSON.parse(itemString);

  const [state, setState] = useState<T>(item ?? defaultValue);

  useEffect(() => {
    localStorage.setItem(name, JSON.stringify(state));
  }, [name, state]);

  return [state, setState] as const;
}