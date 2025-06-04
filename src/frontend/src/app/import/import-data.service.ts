import { Observable } from 'rxjs';
import { AccountType } from '../../lib/data/types';



export interface Account {
  id: string;
  name: string;
  namePrefix: string;
  type: AccountType;
  fullCode: string;
  depth: number;
}

export abstract class ImportDataService {
  public abstract getAccounts(): Observable<Account[]>
}
