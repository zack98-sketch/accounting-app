import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase, closeDatabase } from './src/services/database';
import { initializeDefaultData } from './src/services/initialData';
import { useUIStore } from './src/stores/uiStore';
import { getTheme } from './src/utils/theme';
import { LoadingScreen } from './src/screens/LoadingScreen';
import { MainNavigator } from './src/navigation/MainNavigator';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const themeMode = useUIStore(state => state.themeMode);

  useEffect(() => {
    const initialize = async () => {
      try {
        // 初始化数据库
        await initializeDatabase();

        // 初始化预设数据
        await initializeDefaultData();

        setIsReady(true);
      } catch (err) {
        console.error('Initialization error:', err);
        setError((err as Error).message);
      }
    };

    initialize();

    return () => {
      closeDatabase();
    };
  }, []);

  if (!isReady) {
    return <LoadingScreen error={error} />;
  }

  const theme = getTheme(themeMode);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle={themeMode === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={theme.colors.background}
        />
        <MainNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
