import { Observable } from 'rxjs';
import { AccountType } from '../../lib/data/types';



export interface DataAccount {
  id: string;
  name: string;
  namePrefix: string;
}

export interface Data {
  incomes: DataAccount[];
  expenses: DataAccount[];
}

export interface Account {
  id: string;
  code: string;
}

export abstract class AddAccountDialogDataService {
  public abstract getData(): Observable<Data>;

  public abstract addAccount(
    name: string,
    description: string,
    type: AccountType,
    code: string,
    isGroup: boolean,
    parentId: string | null
  ): Observable<Account>;
}
