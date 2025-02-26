import { Observable } from 'rxjs';
import { ImportProvider } from '../../../lib/data/types';



export abstract class ImportTableActionsDataService {
  public abstract createTransaction(
    accountId: string,
    value: number,
    description: string,
    bookedAt: Date,
    importProvider: ImportProvider,
    importReference: string
  ): Observable<void>;

  public abstract ignoreImportReference(
    provider: ImportProvider,
    reference: string
  ): Observable<void>;
}
