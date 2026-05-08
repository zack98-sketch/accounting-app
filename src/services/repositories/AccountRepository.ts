import { BaseRepository } from '../base/BaseRepository';
import { Account, AccountType } from '@/types';

export class AccountRepository extends BaseRepository<Account> {
  constructor() {
    super('Account');
  }

  // 根据类型获取账户
  getByType(type: AccountType): Account[] {
    return this.query('type == $0', type).sorted('order');
  }

  // 获取包含在总资产的账户
  getIncludedInTotal(): Account[] {
    return this.query('includeInTotal == true').sorted('order');
  }

  // 更新余额
  updateBalance(id: string, newBalance: number): Account | null {
    return this.update(id, { balance: newBalance } as Partial<Account>);
  }

  // 调整余额(增加或减少)
  adjustBalance(id: string, amount: number): Account | null {
    const account = this.getById(id);
    if (!account) return null;

    const newBalance = account.balance + amount;
    return this.updateBalance(id, newBalance);
  }

  // 重新排序
  reorder(accountIds: string[]): void {
    this.realm.write(() => {
      accountIds.forEach((id, index) => {
        const account = this.getById(id);
        if (account) {
          (account as any).order = index;
          (account as any).updatedAt = new Date();
        }
      });
    });
  }

  // 获取账户统计
  getStatistics(): {
    totalAccounts: number;
    totalBalance: number;
    byType: Record<AccountType, { count: number; balance: number }>;
  } {
    const accounts = this.getIncludedInTotal();
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    const byType: Record<AccountType, { count: number; balance: number }> = {
      cash: { count: 0, balance: 0 },
      bank: { count: 0, balance: 0 },
      credit: { count: 0, balance: 0 },
      investment: { count: 0, balance: 0 },
      other: { count: 0, balance: 0 },
    };

    this.getAll().forEach(account => {
      byType[account.type].count++;
      if (account.includeInTotal) {
        byType[account.type].balance += account.balance;
      }
    });

    return {
      totalAccounts: this.count(),
      totalBalance,
      byType,
    };
  }
}
