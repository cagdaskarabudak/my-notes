import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator() {
  const { resolvedTheme } = useTheme();

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#0D1117',
      card: '#161B22',
      border: '#21262D',
      primary: '#A29BFE',
    },
  };

  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F8F9FE',
      card: '#FFFFFF',
      border: '#E8ECF4',
      primary: '#6C5CE7',
    },
  };

  return (
    <NavThemeProvider value={resolvedTheme === 'dark' ? darkTheme : lightTheme}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerBackTitle: 'Geri',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="note/[id]"
          options={{
            title: '',
            headerTransparent: false,
          }}
        />
        <Stack.Screen
          name="note/editor"
          options={{
            title: 'Not Düzenle',
            presentation: 'modal',
            headerTransparent: false,
          }}
        />
        <Stack.Screen
          name="pin-lock"
          options={{
            title: '',
            presentation: 'modal',
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="category-editor"
          options={{
            title: 'Kategori',
            presentation: 'modal',
          }}
        />
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
