// 账户类型
export type AccountType = 'cash' | 'bank' | 'credit' | 'investment' | 'other';

// 账户接口
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  icon: string;
  color: string;
  balance: number;
  initialBalance: number;
  includeInTotal: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// 分类类型
export type CategoryType = 'income' | 'expense';

// 分类接口
export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  parentId?: string;
  order: number;
  usageCount: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 交易类型
export type TransactionType = 'income' | 'expense' | 'transfer';

// 交易接口
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  accountId: string;
  toAccountId?: string; // 转账目标账户
  date: Date;
  note?: string;
  location?: string;
  tags?: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 预算周期
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// 预算接口
export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: string; // 分类预算
  startDate: Date;
  endDate?: Date;
  alertThreshold: number; // 预警阈值(百分比)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 备份接口
export interface Backup {
  id: string;
  name: string;
  filePath: string;
  size: number;
  createdAt: Date;
}

// 统计数据接口
export interface Statistics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  categoryStats: CategoryStatistics[];
  trendData: TrendData[];
}

export interface CategoryStatistics {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface TrendData {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

// 查询参数接口
export interface TransactionQuery {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  keyword?: string;
  page?: number;
  pageSize?: number;
}

// 预算状态接口
export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  isAlert: boolean;
}
