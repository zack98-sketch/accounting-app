import { create } from 'zustand';
import { Account, AccountType } from '@/types';
import { AccountService } from '@/services/AccountService';

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;

  // Actions
  loadAccounts: () => Promise<void>;
  createAccount: (data: {
    name: string;
    type: AccountType;
    icon: string;
    color: string;
    initialBalance: number;
    includeInTotal?: boolean;
  }) => Promise<Account>;
  updateAccount: (id: string, data: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  transfer: (
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    note?: string,
  ) => Promise<void>;
  getTotalAssets: () => number;
}

export const useAccountStore = create<AccountState>((set, get) => {
  let accountService: AccountService | null = null;

  const getAccountService = () => {
    if (!accountService) {
      accountService = new AccountService();
    }
    return accountService;
  };

  return {
    accounts: [],
    loading: false,
    error: null,

    loadAccounts: async () => {
      set({ loading: true, error: null });
      try {
        const service = getAccountService();
        const accounts = service.getAllAccounts();
        set({ accounts, loading: false });
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },

    createAccount: async data => {
      set({ loading: true, error: null });
      try {
        const service = getAccountService();
        const account = service.createAccount(data);
        set(state => ({
          accounts: [...state.accounts, account],
          loading: false,
        }));
        return account;
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
        throw error;
      }
    },

    updateAccount: async (id, data) => {
      set({ loading: true, error: null });
      try {
        const service = getAccountService();
        const updated = service.updateAccount(id, data);
        if (updated) {
          set(state => ({
            accounts: state.accounts.map(acc => (acc.id === id ? updated : acc)),
            loading: false,
          }));
        }
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },

    deleteAccount: async id => {
      set({ loading: true, error: null });
      try {
        const service = getAccountService();
        service.deleteAccount(id);
        set(state => ({
          accounts: state.accounts.filter(acc => acc.id !== id),
          loading: false,
        }));
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },

    transfer: async (fromAccountId, toAccountId, amount, note) => {
      set({ loading: true, error: null });
      try {
        const service = getAccountService();
        const { fromAccount, toAccount } = service.transfer(
          fromAccountId,
          toAccountId,
          amount,
          note,
        );
        set(state => ({
          accounts: state.accounts.map(acc => {
            if (acc.id === fromAccountId) return fromAccount;
            if (acc.id === toAccountId) return toAccount;
            return acc;
          }),
          loading: false,
        }));
      } catch (error) {
        set({ error: (error as Error).message, loading: false });
      }
    },

    getTotalAssets: () => {
      const service = getAccountService();
      return service.getTotalAssets();
    },
  };
});
