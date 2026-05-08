import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

interface LoadingScreenProps {
  error?: string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ error }) => {
  return (
    <View style={styles.container}>
      {error ? (
        <>
          <Text style={styles.errorText}>初始化失败</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </>
      ) : (
        <>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>正在初始化...</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
