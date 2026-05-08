import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// 自定义颜色
const customColors = {
  primary: '#2196F3',
  secondary: '#03A9F4',
  accent: '#FF5722',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  income: '#27AE60',
  expense: '#E74C3C',
  transfer: '#3498DB',
};

// 浅色主题
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
  },
};

// 深色主题
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...customColors,
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
  },
};

// 主题类型
export type Theme = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

// 获取主题
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'light' ? lightTheme : darkTheme;
};
