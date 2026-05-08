import { BaseService } from './base/BaseService';
import { TransactionRepository } from './repositories/TransactionRepository';
import { AccountRepository } from './repositories/AccountRepository';
import { CategoryRepository } from './repositories/CategoryRepository';
import { Transaction, TransactionType, TransactionQuery } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class TransactionService extends BaseService {
  private transactionRepository: TransactionRepository;
  private accountRepository: AccountRepository;
  private categoryRepository: CategoryRepository;

  constructor() {
    super('TransactionService');
    this.transactionRepository = new TransactionRepository();
    this.accountRepository = new AccountRepository();
    this.categoryRepository = new CategoryRepository();
  }

  // 创建交易记录
  createTransaction(data: {
    type: TransactionType;
    amount: number;
    categoryId: string;
    accountId: string;
    toAccountId?: string;
    date: Date;
    note?: string;
    location?: string;
    tags?: string[];
  }): Transaction {
    // 验证账户和分类
    const account = this.accountRepository.getById(data.accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    const category = this.categoryRepository.getById(data.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // 创建交易记录
    const transaction = this.transactionRepository.create({
      id: uuidv4(),
      ...data,
      isDeleted: false,
    } as Partial<Transaction>);

    // 更新账户余额
    this.updateAccountBalance(data.type, data.amount, data.accountId, data.toAccountId);

    // 增加分类使用次数
    this.categoryRepository.incrementUsageCount(data.categoryId);

    this.log('Transaction created:', transaction.id);
    return transaction;
  }

  // 更新交易记录
  updateTransaction(
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'createdAt'>>,
  ): Transaction | null {
    const oldTransaction = this.transactionRepository.getById(id);
    if (!oldTransaction) return null;

    // 如果金额或账户发生变化,需要调整余额
    if (data.amount !== undefined || data.accountId !== undefined) {
      // 恢复旧余额
      this.reverseAccountBalance(
        oldTransaction.type,
        oldTransaction.amount,
        oldTransaction.accountId,
        oldTransaction.toAccountId,
      );

      // 应用新余额
      const newType = data.type || oldTransaction.type;
      const newAmount = data.amount !== undefined ? data.amount : oldTransaction.amount;
      const newAccountId = data.accountId || oldTransaction.accountId;
      const newToAccountId = data.toAccountId !== undefined ? data.toAccountId : oldTransaction.toAccountId;

      this.updateAccountBalance(newType, newAmount, newAccountId, newToAccountId);
    }

    const transaction = this.transactionRepository.update(id, data);
    if (transaction) {
      this.log('Transaction updated:', id);
    }
    return transaction;
  }

  // 删除交易记录
  deleteTransaction(id: string, permanent: boolean = false): boolean {
    const transaction = this.transactionRepository.getById(id);
    if (!transaction) return false;

    if (permanent) {
      // 永久删除,恢复余额
      this.reverseAccountBalance(
        transaction.type,
        transaction.amount,
        transaction.accountId,
        transaction.toAccountId,
      );
      const success = this.transactionRepository.delete(id);
      if (success) {
        this.log('Transaction permanently deleted:', id);
      }
      return success;
    } else {
      // 软删除
      const result = this.transactionRepository.softDelete(id);
      if (result) {
        this.log('Transaction soft deleted:', id);
      }
      return result !== null;
    }
  }

  // 恢复删除的交易
  restoreTransaction(id: string): Transaction | null {
    const transaction = this.transactionRepository.restore(id);
    if (transaction) {
      // 恢复余额
      this.updateAccountBalance(
        transaction.type,
        transaction.amount,
        transaction.accountId,
        transaction.toAccountId,
      );
      this.log('Transaction restored:', id);
    }
    return transaction;
  }

  // 查询交易记录
  getTransactions(query: TransactionQuery): Transaction[] {
    return this.transactionRepository.queryTransactions(query);
  }

  // 获取最近的交易记录
  getRecentTransactions(limit: number = 20): Transaction[] {
    const results = this.transactionRepository
      .query('isDeleted == false')
      .sorted('date', true)
      .slice(0, limit);
    return Array.from(results);
  }

  // 搜索交易记录
  searchTransactions(keyword: string): Transaction[] {
    return this.transactionRepository.queryTransactions({ keyword });
  }

  // 按日期分组
  groupByDate(transactions: Transaction[]): Map<string, Transaction[]> {
    return this.transactionRepository.groupByDate(transactions);
  }

  // 批量删除
  batchDelete(ids: string[]): number {
    let count = 0;
    ids.forEach(id => {
      if (this.deleteTransaction(id, false)) {
        count++;
      }
    });
    this.log('Batch deleted transactions:', count);
    return count;
  }

  // 更新账户余额
  private updateAccountBalance(
    type: TransactionType,
    amount: number,
    accountId: string,
    toAccountId?: string,
  ): void {
    switch (type) {
      case 'income':
        this.accountRepository.adjustBalance(accountId, amount);
        break;
      case 'expense':
        this.accountRepository.adjustBalance(accountId, -amount);
        break;
      case 'transfer':
        if (toAccountId) {
          this.accountRepository.adjustBalance(accountId, -amount);
          this.accountRepository.adjustBalance(toAccountId, amount);
        }
        break;
    }
  }

  // 反向更新账户余额(用于删除或修改)
  private reverseAccountBalance(
    type: TransactionType,
    amount: number,
    accountId: string,
    toAccountId?: string,
  ): void {
    switch (type) {
      case 'income':
        this.accountRepository.adjustBalance(accountId, -amount);
        break;
      case 'expense':
        this.accountRepository.adjustBalance(accountId, amount);
        break;
      case 'transfer':
        if (toAccountId) {
          this.accountRepository.adjustBalance(accountId, amount);
          this.accountRepository.adjustBalance(toAccountId, -amount);
        }
        break;
    }
  }

  // 获取交易统计
  getTransactionStats(
    startDate?: Date,
    endDate?: Date,
  ): {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  } {
    const totalIncome = this.transactionRepository.calculateTotal('income', startDate, endDate);
    const totalExpense = this.transactionRepository.calculateTotal('expense', startDate, endDate);
    const balance = totalIncome - totalExpense;

    let query: TransactionQuery = {};
    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;

    const transactions = this.transactionRepository.queryTransactions(query);

    return {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactions.length,
    };
  }
}
