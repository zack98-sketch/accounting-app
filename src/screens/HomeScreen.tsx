import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccountStore } from '../stores/accountStore';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { accounts, loadAccounts, getTotalAssets } = useAccountStore();

  useEffect(() => {
    loadAccounts();
  }, []);

  const totalAssets = getTotalAssets();

  return (
    <View style={styles.container}>
      {/* 总资产卡片 */}
      <View style={styles.assetCard}>
        <Text style={styles.assetLabel}>总资产</Text>
        <Text style={styles.assetValue}>¥{totalAssets.toFixed(2)}</Text>
      </View>

      {/* 快速记账按钮 */}
      <TouchableOpacity
        style={styles.quickBookButton}
        onPress={() => navigation.navigate('QuickBook' as never)}
      >
        <Text style={styles.quickBookText}>+ 快速记账</Text>
      </TouchableOpacity>

      {/* 账户列表 */}
      <View style={styles.accountList}>
        <Text style={styles.sectionTitle}>我的账户</Text>
        {accounts.map(account => (
          <View key={account.id} style={styles.accountItem}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountBalance}>
              ¥{account.balance.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  assetCard: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  assetLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  assetValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  quickBookButton: {
    backgroundColor: '#FF5722',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  quickBookText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  accountList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#212121',
  },
  accountItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountName: {
    fontSize: 16,
    color: '#212121',
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});
