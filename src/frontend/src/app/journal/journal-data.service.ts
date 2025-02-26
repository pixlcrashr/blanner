import { Observable } from 'rxjs';
import { AccountType } from '../../lib/data/types';



export interface Transaction {
  id: string;
  reference: string;
  isImported: boolean;
  accountId: string;
  isDeletable: boolean;
  isEditable: boolean;
  amount: number;
  createdAt: Date;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
}

export interface JournalData {
  transactions: Transaction[];
  accounts: Account[];
}

export abstract class JournalDataService {
  public abstract getJournalData(): Observable<JournalData>;

  public abstract deleteTransaction(transactionId: string): Observable<void>;

  public abstract changeTransactionAccount(
    transactionId: string,
    accountId: string
  ): Observable<void>;
}
