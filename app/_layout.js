import { Stack } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export default function Layout() {
  const system = useColorScheme(); // 'light' | 'dark'
  const [themeName, setThemeName] = useState(system);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeName(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const toggleTheme = () => {
    setThemeName(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = themeName === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeContext.Provider value={{ theme, toggleTheme, themeName }}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.background },
              headerTintColor: theme.text,
              contentStyle: { backgroundColor: theme.background },
              headerBackTitle: "Voltar"
            }}
          >
            <Stack.Screen name="index" options={{ title: '$pender' }} />
            <Stack.Screen name="add" options={{ title: 'Adicionar transação' }} />
            <Stack.Screen name="settings" options={{ title: 'Ajustes' }} />
          </Stack>
        </ThemeContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export const lightTheme = {
  background: '#dae3dc',
  backgroundContainer: '#e6ebe7',
  text: '#000000',
  primary: '#1e90ff',
  placeholder: '#888888',
};

export const darkTheme = {
  background: '#222222',
  backgroundContainer: '#363535',
  text: '#ffffff',
  primary: '#1e90ff',
  placeholder: '#aaaaaa',
};