import {useState} from 'react';

const localStorageKey = "WANIKANI_API_KEY";

// Reference: https://usehooks.com/useLocalStorage/
export default function useAPIKey() {
    const [storedAPIKey, setStoredAPIKey] = useState<string | null>(() => {
        if (typeof window === "undefined") {
            return null;
        }

        try {
            const apiKey = window.localStorage.getItem(localStorageKey);
            return apiKey ?? null;
        } catch (error) {
            return null;
        }
    });

    const setAPIKey = (value: string | null) => {
        try {
            setStoredAPIKey(value);
            if (typeof window !== "undefined") {
                if (value === null) {
                    window.localStorage.removeItem(localStorageKey);
                } else {
                    window.localStorage.setItem(localStorageKey, value);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return [storedAPIKey, setAPIKey] as const;
}