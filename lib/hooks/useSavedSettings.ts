import { useState } from 'react';

const localStorageKey = 'SAVED_SETTINGS';

export type SavedSettings = {
  isWaniKaniEnabled?: boolean;
  waniKaniAPIKey?: string;
  isDarkModeEnabled?: boolean;
  isQuizModeEnabled?: boolean;
};

// Reference: https://usehooks.com/useLocalStorage/
export default function useSavedSettings() {
  const [storedSettings, setStoredSettings] = useState<SavedSettings | null>(
    () => {
      if (typeof window === 'undefined') {
        return null;
      }

      try {
        const settingsJSON = window.localStorage.getItem(localStorageKey);
        return settingsJSON ? JSON.parse(settingsJSON) : null;
      } catch (error) {
        return null;
      }
    }
  );

  const setSettings = (value: SavedSettings | null) => {
    try {
      setStoredSettings(value);
      if (typeof window !== 'undefined') {
        if (value === null) {
          window.localStorage.removeItem(localStorageKey);
        } else {
          window.localStorage.setItem(localStorageKey, JSON.stringify(value));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedSettings, setSettings] as const;
}
