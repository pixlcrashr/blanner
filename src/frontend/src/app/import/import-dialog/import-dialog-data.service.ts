import { Observable } from 'rxjs';
import { Transaction } from './import-dialog.component';



export abstract class ImportDialogDataService {
  public abstract getLexwareTransactions(importFile: File): Observable<Transaction[]>;
}
