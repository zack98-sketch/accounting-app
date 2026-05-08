import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import { Account } from '../types';
import { AccountService } from '../services/AccountService';

interface AccountPickerProps {
  selectedAccountId?: string;
  onSelect: (account: Account) => void;
  visible: boolean;
  onClose: () => void;
  excludeIds?: string[];
}

export const AccountPicker: React.FC<AccountPickerProps> = ({
  selectedAccountId,
  onSelect,
  visible,
  onClose,
  excludeIds = [],
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const accountService = new AccountService();
    const allAccounts = accountService.getAllAccounts();
    const filtered = allAccounts.filter(acc => !excludeIds.includes(acc.id));
    setAccounts(filtered);
  };

  const handleSelect = (account: Account) => {
    onSelect(account);
    onClose();
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={[
        styles.accountItem,
        item.id === selectedAccountId && styles.accountItemSelected,
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={[styles.accountIcon, { backgroundColor: item.color }]}>
        <Text style={styles.iconText}>{item.icon.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountBalance}>
          ¥{item.balance.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>选择账户</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>关闭</Text>
            </TouchableOpacity>
          </View>

          {/* 账户列表 */}
          <FlatList
            data={accounts}
            renderItem={renderAccountItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginBottom: 8,
  },
  accountItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    color: '#757575',
  },
});
