import { Observable } from 'rxjs';
import { AccountType } from '../../lib/data/types';



export interface Account {
  id: string;
  name: string;
  namePrefix: string;
  type: AccountType;
}

export abstract class ImportDataService {
  public abstract getAccounts(): Observable<Account[]>
}
