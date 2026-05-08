import { CategoryRepository } from './repositories/CategoryRepository';
import { AccountRepository } from './repositories/AccountRepository';
import { CategoryType, AccountType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// 预设支出分类
const defaultExpenseCategories = [
  { name: '餐饮', icon: 'food', color: '#FF6B6B' },
  { name: '交通', icon: 'car', color: '#4ECDC4' },
  { name: '购物', icon: 'shopping', color: '#45B7D1' },
  { name: '娱乐', icon: 'game', color: '#96CEB4' },
  { name: '医疗', icon: 'medical', color: '#FFEAA7' },
  { name: '教育', icon: 'book', color: '#DDA0DD' },
  { name: '居住', icon: 'home', color: '#98D8C8' },
  { name: '通讯', icon: 'phone', color: '#F7DC6F' },
  { name: '服饰', icon: 'shirt', color: '#BB8FCE' },
  { name: '美容', icon: 'beauty', color: '#F1948A' },
  { name: '运动', icon: 'sport', color: '#85C1E9' },
  { name: '旅游', icon: 'travel', color: '#F8B500' },
  { name: '宠物', icon: 'pet', color: '#E59866' },
  { name: '礼物', icon: 'gift', color: '#D7BDE2' },
  { name: '其他', icon: 'other', color: '#95A5A6' },
];

// 预设收入分类
const defaultIncomeCategories = [
  { name: '工资', icon: 'salary', color: '#27AE60' },
  { name: '奖金', icon: 'bonus', color: '#2ECC71' },
  { name: '兼职', icon: 'parttime', color: '#58D68D' },
  { name: '投资', icon: 'invest', color: '#82E0AA' },
  { name: '理财', icon: 'finance', color: '#ABEBC6' },
  { name: '报销', icon: 'reimburse', color: '#73C6B6' },
  { name: '红包', icon: 'redpacket', color: '#E74C3C' },
  { name: '其他', icon: 'other', color: '#95A5A6' },
];

// 预设账户
const defaultAccounts = [
  { name: '现金', type: 'cash' as AccountType, icon: 'cash', color: '#27AE60' },
  { name: '银行卡', type: 'bank' as AccountType, icon: 'bank', color: '#3498DB' },
  { name: '支付宝', type: 'bank' as AccountType, icon: 'alipay', color: '#00AAEE' },
  { name: '微信', type: 'bank' as AccountType, icon: 'wechat', color: '#09BB07' },
];

// 初始化预设数据
export const initializeDefaultData = async (): Promise<void> => {
  const categoryRepo = new CategoryRepository();
  const accountRepo = new AccountRepository();

  // 检查是否已初始化
  if (categoryRepo.count() > 0) {
    console.log('Data already initialized');
    return;
  }

  console.log('Initializing default data...');

  // 创建支出分类
  defaultExpenseCategories.forEach((cat, index) => {
    categoryRepo.create({
      id: uuidv4(),
      name: cat.name,
      type: 'expense' as CategoryType,
      icon: cat.icon,
      color: cat.color,
      order: index,
      usageCount: 0,
      isDefault: true,
    } as any);
  });

  // 创建收入分类
  defaultIncomeCategories.forEach((cat, index) => {
    categoryRepo.create({
      id: uuidv4(),
      name: cat.name,
      type: 'income' as CategoryType,
      icon: cat.icon,
      color: cat.color,
      order: index,
      usageCount: 0,
      isDefault: true,
    } as any);
  });

  // 创建默认账户
  defaultAccounts.forEach((acc, index) => {
    accountRepo.create({
      id: uuidv4(),
      name: acc.name,
      type: acc.type,
      icon: acc.icon,
      color: acc.color,
      balance: 0,
      initialBalance: 0,
      includeInTotal: true,
      order: index,
    } as any);
  });

  console.log('Default data initialized successfully');
};
