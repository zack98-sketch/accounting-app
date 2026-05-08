import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUIStore } from '../stores/uiStore';

export const SettingsScreen: React.FC = () => {
  const { themeMode, toggleTheme } = useUIStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>设置</Text>

      <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
        <Text style={styles.settingLabel}>主题模式</Text>
        <Text style={styles.settingValue}>
          {themeMode === 'light' ? '浅色' : '深色'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingLabel}>数据备份</Text>
        <Text style={styles.settingValue}>{'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingLabel}>数据导出</Text>
        <Text style={styles.settingValue}>{'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingLabel}>关于</Text>
        <Text style={styles.settingValue}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 24,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#212121',
  },
  settingValue: {
    fontSize: 16,
    color: '#757575',
  },
});
