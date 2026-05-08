import { BaseRepository } from '../base/BaseRepository';
import { Transaction, TransactionType, TransactionQuery } from '@/types';
import dayjs from 'dayjs';

export class TransactionRepository extends BaseRepository<Transaction> {
  constructor() {
    super('Transaction');
  }

  // 根据日期范围查询
  getByDateRange(startDate: Date, endDate: Date): Transaction[] {
    return this.query(
      'date >= $0 AND date <= $1 AND isDeleted == false',
      startDate,
      endDate,
    ).sorted('date', true);
  }

  // 根据分类查询
  getByCategory(categoryId: string): Transaction[] {
    return this.query(
      'categoryId == $0 AND isDeleted == false',
      categoryId,
    ).sorted('date', true);
  }

  // 根据账户查询
  getByAccount(accountId: string): Transaction[] {
    return this.query(
      'accountId == $0 AND isDeleted == false',
      accountId,
    ).sorted('date', true);
  }

  // 复杂查询
  queryTransactions(query: TransactionQuery): Transaction[] {
    let results = this.query('isDeleted == false');

    if (query.startDate) {
      results = results.filtered('date >= $0', query.startDate);
    }

    if (query.endDate) {
      results = results.filtered('date <= $0', query.endDate);
    }

    if (query.categoryId) {
      results = results.filtered('categoryId == $0', query.categoryId);
    }

    if (query.accountId) {
      results = results.filtered('accountId == $0', query.accountId);
    }

    if (query.type) {
      results = results.filtered('type == $0', query.type);
    }

    if (query.minAmount !== undefined) {
      results = results.filtered('amount >= $0', query.minAmount);
    }

    if (query.maxAmount !== undefined) {
      results = results.filtered('amount <= $0', query.maxAmount);
    }

    if (query.keyword) {
      results = results.filtered('note CONTAINS[c] $0', query.keyword);
    }

    // 排序
    results = results.sorted('date', true);

    // 分页
    if (query.page !== undefined && query.pageSize !== undefined) {
      const start = query.page * query.pageSize;
      const end = start + query.pageSize;
      return results.slice(start, end);
    }

    return Array.from(results);
  }

  // 软删除
  softDelete(id: string): Transaction | null {
    return this.update(id, { isDeleted: true } as Partial<Transaction>);
  }

  // 恢复删除
  restore(id: string): Transaction | null {
    return this.update(id, { isDeleted: false } as Partial<Transaction>);
  }

  // 获取已删除的记录
  getDeleted(): Transaction[] {
    return this.query('isDeleted == true').sorted('updatedAt', true);
  }

  // 统计金额
  calculateTotal(
    type?: TransactionType,
    startDate?: Date,
    endDate?: Date,
  ): number {
    let results = this.query('isDeleted == false');

    if (type) {
      results = results.filtered('type == $0', type);
    }

    if (startDate) {
      results = results.filtered('date >= $0', startDate);
    }

    if (endDate) {
      results = results.filtered('date <= $0', endDate);
    }

    return results.reduce((sum, t) => sum + t.amount, 0);
  }

  // 按日期分组
  groupByDate(transactions: Transaction[]): Map<string, Transaction[]> {
    const groups = new Map<string, Transaction[]>();

    transactions.forEach(transaction => {
      const dateKey = dayjs(transaction.date).format('YYYY-MM-DD');
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(transaction);
    });

    return groups;
  }

  // 按分类统计
  calculateByCategory(
    type: TransactionType,
    startDate?: Date,
    endDate?: Date,
  ): Map<string, number> {
    let results = this.query('type == $0 AND isDeleted == false', type);

    if (startDate) {
      results = results.filtered('date >= $0', startDate);
    }

    if (endDate) {
      results = results.filtered('date <= $0', endDate);
    }

    const categoryTotals = new Map<string, number>();
    results.forEach(t => {
      const current = categoryTotals.get(t.categoryId) || 0;
      categoryTotals.set(t.categoryId, current + t.amount);
    });

    return categoryTotals;
  }
}
