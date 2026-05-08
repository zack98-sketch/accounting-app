import Realm from 'realm';

// Account Schema
export const AccountSchema = {
  name: 'Account',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    type: 'string',
    icon: 'string',
    color: 'string',
    balance: 'double',
    initialBalance: 'double',
    includeInTotal: 'bool',
    order: 'int',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Category Schema
export const CategorySchema = {
  name: 'Category',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    type: 'string',
    icon: 'string',
    color: 'string',
    parentId: { type: 'string', optional: true },
    order: 'int',
    usageCount: 'int',
    isDefault: 'bool',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Transaction Schema
export const TransactionSchema = {
  name: 'Transaction',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'string',
    amount: 'double',
    categoryId: 'string',
    accountId: 'string',
    toAccountId: { type: 'string', optional: true },
    date: 'date',
    note: { type: 'string', optional: true },
    location: { type: 'string', optional: true },
    tags: { type: 'list', objectType: 'string' },
    isDeleted: 'bool',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Budget Schema
export const BudgetSchema = {
  name: 'Budget',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    amount: 'double',
    period: 'string',
    categoryId: { type: 'string', optional: true },
    startDate: 'date',
    endDate: { type: 'date', optional: true },
    alertThreshold: 'double',
    isActive: 'bool',
    createdAt: 'date',
    updatedAt: 'date',
  },
};

// Backup Schema
export const BackupSchema = {
  name: 'Backup',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    filePath: 'string',
    size: 'double',
    createdAt: 'date',
  },
};

// 所有Schema
export const schemas = [
  AccountSchema,
  CategorySchema,
  TransactionSchema,
  BudgetSchema,
  BackupSchema,
];

// 数据库版本
export const schemaVersion = 1;
