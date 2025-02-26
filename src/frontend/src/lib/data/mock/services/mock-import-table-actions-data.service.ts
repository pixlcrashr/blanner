import { Injectable } from '@angular/core';
import {
  ImportTableActionsDataService
} from '../../../../app/import/import-table-actions/import-table-actions-data.service';
import { delay, map, Observable, of } from 'rxjs';
import { ImportProvider } from '../../types';



@Injectable()
export class MockImportTableActionsDataService extends ImportTableActionsDataService {
  public override createTransaction(
    accountId: string,
    value: number,
    description: string,
    bookedAt: Date,
    importProvider: ImportProvider,
    importReference: string
  ): Observable<void> {
    return of({}).pipe(
      map(() => {
      }),
      delay(2000)
    );
  }

  public override ignoreImportReference(
    provider: ImportProvider,
    reference: string
  ): Observable<void> {
    return of({}).pipe(
      map(() => {
      }),
      delay(2000)
    );
  }

}
