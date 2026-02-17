import { Colors } from '@/constants/theme';
import { getSettings, saveSettings } from '@/services/storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
    themePreference: ThemePreference;
    resolvedTheme: ResolvedTheme;
    colors: typeof Colors.light;
    setThemePreference: (pref: ThemePreference) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
    themePreference: 'system',
    resolvedTheme: 'light',
    colors: Colors.light,
    setThemePreference: async () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useSystemColorScheme();
    const [themePreference, setThemePref] = useState<ThemePreference>('system');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getSettings().then((s) => {
            setThemePref(s.theme || 'system');
            setLoaded(true);
        });
    }, []);

    const resolvedTheme: ResolvedTheme =
        themePreference === 'system'
            ? (systemScheme === 'dark' ? 'dark' : 'light')
            : themePreference;

    const colors = resolvedTheme === 'dark' ? Colors.dark : Colors.light;

    const setThemePreference = useCallback(async (pref: ThemePreference) => {
        setThemePref(pref);
        await saveSettings({ theme: pref });
    }, []);

    return (
        <ThemeContext.Provider value={{ themePreference, resolvedTheme, colors, setThemePreference }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
