import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { TransactionType } from '../types';

export const QuickBookScreen: React.FC = () => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    // TODO: 实现保存逻辑
    console.log('Save transaction:', { type, amount, note });
  };

  return (
    <ScrollView style={styles.container}>
      {/* 类型切换 */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
          onPress={() => setType('expense')}
        >
          <Text
            style={[styles.typeText, type === 'expense' && styles.typeTextActive]}
          >
            支出
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.typeButtonActive]}
          onPress={() => setType('income')}
        >
          <Text
            style={[styles.typeText, type === 'income' && styles.typeTextActive]}
          >
            收入
          </Text>
        </TouchableOpacity>
      </View>

      {/* 金额输入 */}
      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>金额</Text>
        <View style={styles.amountInput}>
          <Text style={styles.currencySymbol}>¥</Text>
          <TextInput
            style={styles.amountTextInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor="#BDBDBD"
          />
        </View>
      </View>

      {/* 分类选择 */}
      <TouchableOpacity style={styles.categorySelector}>
        <Text style={styles.selectorLabel}>分类</Text>
        <Text style={styles.selectorValue}>请选择分类 {'>'}</Text>
      </TouchableOpacity>

      {/* 账户选择 */}
      <TouchableOpacity style={styles.categorySelector}>
        <Text style={styles.selectorLabel}>账户</Text>
        <Text style={styles.selectorValue}>请选择账户 {'>'}</Text>
      </TouchableOpacity>

      {/* 备注 */}
      <View style={styles.noteSection}>
        <Text style={styles.noteLabel}>备注</Text>
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="添加备注..."
          placeholderTextColor="#BDBDBD"
          multiline
        />
      </View>

      {/* 保存按钮 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  typeButtonActive: {
    backgroundColor: '#2196F3',
  },
  typeText: {
    fontSize: 16,
    color: '#757575',
  },
  typeTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  amountSection: {
    marginBottom: 24,
  },
  amountLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    paddingBottom: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 8,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212121',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectorLabel: {
    fontSize: 16,
    color: '#212121',
  },
  selectorValue: {
    fontSize: 16,
    color: '#757575',
  },
  noteSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
