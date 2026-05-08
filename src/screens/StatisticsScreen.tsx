import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const StatisticsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>统计分析</Text>
      <Text style={styles.subtitle}>功能开发中...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
});
