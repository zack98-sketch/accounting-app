import { BaseService } from './base/BaseService';
import { AccountRepository } from './repositories/AccountRepository';
import { Account, AccountType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class AccountService extends BaseService {
  private accountRepository: AccountRepository;

  constructor() {
    super('AccountService');
    this.accountRepository = new AccountRepository();
  }

  // 创建账户
  createAccount(data: {
    name: string;
    type: AccountType;
    icon: string;
    color: string;
    initialBalance: number;
    includeInTotal?: boolean;
  }): Account {
    const account = this.accountRepository.create({
      id: uuidv4(),
      ...data,
      balance: data.initialBalance,
      includeInTotal: data.includeInTotal ?? true,
      order: this.accountRepository.count(),
    } as Partial<Account>);

    this.log('Account created:', account.id);
    return account;
  }

  // 更新账户
  updateAccount(
    id: string,
    data: Partial<Omit<Account, 'id' | 'balance' | 'createdAt'>>,
  ): Account | null {
    const account = this.accountRepository.update(id, data);
    if (account) {
      this.log('Account updated:', id);
    }
    return account;
  }

  // 删除账户
  deleteAccount(id: string): boolean {
    // TODO: 检查是否有关联的交易记录
    const success = this.accountRepository.delete(id);
    if (success) {
      this.log('Account deleted:', id);
    }
    return success;
  }

  // 获取所有账户
  getAllAccounts(): Account[] {
    return Array.from(this.accountRepository.sorted('order'));
  }

  // 根据类型获取账户
  getAccountsByType(type: AccountType): Account[] {
    return this.accountRepository.getByType(type);
  }

  // 转账
  transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    note?: string,
  ): { fromAccount: Account; toAccount: Account } {
    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account');
    }

    const fromAccount = this.accountRepository.getById(fromAccountId);
    const toAccount = this.accountRepository.getById(toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error('Account not found');
    }

    if (fromAccount.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // 执行转账
    const updatedFrom = this.accountRepository.adjustBalance(fromAccountId, -amount);
    const updatedTo = this.accountRepository.adjustBalance(toAccountId, amount);

    if (!updatedFrom || !updatedTo) {
      throw new Error('Transfer failed');
    }

    this.log('Transfer completed:', { fromAccountId, toAccountId, amount });
    return { fromAccount: updatedFrom, toAccount: updatedTo };
  }

  // 调整余额
  adjustBalance(id: string, amount: number): Account | null {
    const account = this.accountRepository.adjustBalance(id, amount);
    if (account) {
      this.log('Balance adjusted:', { id, amount, newBalance: account.balance });
    }
    return account;
  }

  // 获取账户统计
  getAccountStats() {
    return this.accountRepository.getStatistics();
  }

  // 获取总资产
  getTotalAssets(): number {
    const stats = this.accountRepository.getStatistics();
    return stats.totalBalance;
  }

  // 重新排序账户
  reorderAccounts(accountIds: string[]): void {
    this.accountRepository.reorder(accountIds);
    this.log('Accounts reordered');
  }
}
