import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useMemo, useState } from "react";
import useSavedSettings from "../libs/hooks/useSavedSettings";

const ThemeContext = createContext({
    toggleThemeMode: () => {},
});

export const ThemeContextProvider: React.FC<{children?: React.ReactNode}> = ({children}) => {
    const [savedSettings, _] = useSavedSettings();
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    const theme = useMemo(() => createTheme({palette: {mode: themeMode}}), [themeMode]);
    const toggleThemeMode = () => {
        setThemeMode(prevValue => prevValue === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        // saved settings has higher priority than system preference
        if ((savedSettings?.isDarkModeEnabled === undefined && prefersDarkMode) || savedSettings?.isDarkModeEnabled) {
            setThemeMode('dark');
        }
    }, [savedSettings?.isDarkModeEnabled, prefersDarkMode]);

    return (
        <ThemeContext.Provider value={{toggleThemeMode}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeContext;