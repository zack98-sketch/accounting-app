import { BaseService } from './base/BaseService';
import { TransactionRepository } from './repositories/TransactionRepository';
import { CategoryRepository } from './repositories/CategoryRepository';
import { AccountRepository } from './repositories/AccountRepository';
import { Statistics, CategoryStatistics, TrendData } from '@/types';
import dayjs from 'dayjs';

export class StatisticsService extends BaseService {
  private transactionRepository: TransactionRepository;
  private categoryRepository: CategoryRepository;
  private accountRepository: AccountRepository;
  private cache: Map<string, any> = new Map();

  constructor() {
    super('StatisticsService');
    this.transactionRepository = new TransactionRepository();
    this.categoryRepository = new CategoryRepository();
    this.accountRepository = new AccountRepository();
  }

  // 获取概览数据
  getOverview(startDate?: Date, endDate?: Date): Statistics {
    const cacheKey = `overview_${startDate?.getTime()}_${endDate?.getTime()}`;
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const totalIncome = this.transactionRepository.calculateTotal('income', startDate, endDate);
    const totalExpense = this.transactionRepository.calculateTotal('expense', startDate, endDate);
    const balance = totalIncome - totalExpense;

    const query: any = {};
    if (startDate) query.startDate = startDate;
    if (endDate) query.endDate = endDate;
    const transactions = this.transactionRepository.queryTransactions(query);

    const categoryStats = this.getCategoryStatistics(startDate, endDate);
    const trendData = this.getTrendData('daily', startDate, endDate);

    const result: Statistics = {
      totalIncome,
      totalExpense,
      balance,
      transactionCount: transactions.length,
      categoryStats,
      trendData,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  // 获取分类统计
  getCategoryStatistics(
    startDate?: Date,
    endDate?: Date,
    type: 'income' | 'expense' = 'expense',
  ): CategoryStatistics[] {
    const categoryTotals = this.transactionRepository.calculateByCategory(type, startDate, endDate);
    const total = Array.from(categoryTotals.values()).reduce((sum, val) => sum + val, 0);

    const stats: CategoryStatistics[] = [];

    categoryTotals.forEach((amount, categoryId) => {
      const category = this.categoryRepository.getById(categoryId);
      if (category) {
        stats.push({
          categoryId,
          categoryName: category.name,
          amount,
          percentage: total > 0 ? (amount / total) * 100 : 0,
          transactionCount: this.transactionRepository.getByCategory(categoryId).length,
        });
      }
    });

    // 按金额排序
    return stats.sort((a, b) => b.amount - a.amount);
  }

  // 获取趋势数据
  getTrendData(
    granularity: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate?: Date,
    endDate?: Date,
  ): TrendData[] {
    const transactions = this.transactionRepository.getByDateRange(
      startDate || dayjs().subtract(30, 'day').toDate(),
      endDate || new Date(),
    );

    const groupedData = new Map<string, { income: number; expense: number }>();

    transactions.forEach(transaction => {
      let dateKey: string;
      const date = dayjs(transaction.date);

      switch (granularity) {
        case 'daily':
          dateKey = date.format('YYYY-MM-DD');
          break;
        case 'weekly':
          dateKey = date.startOf('week').format('YYYY-MM-DD');
          break;
        case 'monthly':
          dateKey = date.startOf('month').format('YYYY-MM');
          break;
        case 'yearly':
          dateKey = date.startOf('year').format('YYYY');
          break;
      }

      if (!groupedData.has(dateKey)) {
        groupedData.set(dateKey, { income: 0, expense: 0 });
      }

      const data = groupedData.get(dateKey)!;
      if (transaction.type === 'income') {
        data.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        data.expense += transaction.amount;
      }
    });

    const trendData: TrendData[] = [];
    let cumulativeBalance = 0;

    Array.from(groupedData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([date, data]) => {
        cumulativeBalance += data.income - data.expense;
        trendData.push({
          date,
          income: data.income,
          expense: data.expense,
          balance: cumulativeBalance,
        });
      });

    return trendData;
  }

  // 获取排名数据
  getRanking(
    type: 'income' | 'expense' = 'expense',
    limit: number = 10,
    startDate?: Date,
    endDate?: Date,
  ): CategoryStatistics[] {
    return this.getCategoryStatistics(startDate, endDate, type).slice(0, limit);
  }

  // 获取资产趋势
  getAssetTrend(
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily',
    startDate?: Date,
    endDate?: Date,
  ): TrendData[] {
    return this.getTrendData(granularity, startDate, endDate);
  }

  // 获取最大交易
  getTopTransactions(
    type: 'income' | 'expense',
    limit: number = 5,
    startDate?: Date,
    endDate?: Date,
  ) {
    let transactions = this.transactionRepository.query('type == $0 AND isDeleted == false', type);

    if (startDate) {
      transactions = transactions.filtered('date >= $0', startDate);
    }
    if (endDate) {
      transactions = transactions.filtered('date <= $0', endDate);
    }

    return Array.from(transactions.sorted('amount', true).slice(0, limit));
  }

  // 清除缓存
  clearCache(): void {
    this.cache.clear();
    this.log('Cache cleared');
  }

  // 获取月度报告
  getMonthlyReport(year: number, month: number) {
    const startDate = dayjs(`${year}-${month}-01`).toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    return {
      overview: this.getOverview(startDate, endDate),
      categoryStats: {
        income: this.getCategoryStatistics(startDate, endDate, 'income'),
        expense: this.getCategoryStatistics(startDate, endDate, 'expense'),
      },
      topExpenses: this.getTopTransactions('expense', 5, startDate, endDate),
      topIncomes: this.getTopTransactions('income', 5, startDate, endDate),
    };
  }

  // 获取年度报告
  getYearlyReport(year: number) {
    const startDate = dayjs(`${year}-01-01`).toDate();
    const endDate = dayjs(startDate).endOf('year').toDate();

    return {
      overview: this.getOverview(startDate, endDate),
      monthlyTrend: this.getTrendData('monthly', startDate, endDate),
      categoryStats: {
        income: this.getCategoryStatistics(startDate, endDate, 'income'),
        expense: this.getCategoryStatistics(startDate, endDate, 'expense'),
      },
    };
  }
}
