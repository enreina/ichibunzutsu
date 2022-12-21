import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useState } from "react";
import useSavedSettings from "../libs/hooks/useSavedSettings";

const ThemeContext = createContext({
    toggleThemeMode: () => {},
});

export const ThemeContextProvider: React.FC<{children?: React.ReactNode}> = ({children}) => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
    const theme = createTheme({palette: {mode: themeMode}});
    const toggleThemeMode = () => {
        setThemeMode(prevValue => prevValue === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{toggleThemeMode}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeContext;