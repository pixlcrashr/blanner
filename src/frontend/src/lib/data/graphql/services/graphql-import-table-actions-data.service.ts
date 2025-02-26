import { map, Observable } from 'rxjs';
import {
  ImportTableActionsDataService
} from '../../../../app/import/import-table-actions/import-table-actions-data.service';
import { inject, Injectable } from '@angular/core';
import { ImportProvider } from '../../types';
import { CurrentBookService } from '../../../book/current-book.service';
import {
  ImportProvider as GraphqlImportProvider,
  ImportTableActionsData_CreateTransactionGQL,
  ImportTableActionsData_IgnoreImportReferenceGQL
} from '../components';
import { formatDateOnly } from '../../date';



@Injectable()
export class GraphqlImportTableActionsDataService extends ImportTableActionsDataService {
  private readonly _currentBookService = inject(CurrentBookService);
  private readonly _createTransactionGQL = inject(ImportTableActionsData_CreateTransactionGQL);
  private readonly _ignoreImportReferenceGQL = inject(ImportTableActionsData_IgnoreImportReferenceGQL);

  public override createTransaction(
    accountId: string,
    value: number,
    description: string,
    bookedAt: Date,
    importProvider: ImportProvider,
    importReference: string
  ): Observable<void> {
    return this._createTransactionGQL.mutate({
      accountId: accountId,
      value: (value * 100).toFixed(0),
      description: description,
      importReference: importReference,
      importProvider: GraphqlImportProvider.Lexware,
      bookedAt: formatDateOnly(bookedAt)
    }).pipe(
      map(() => {
      })
    );
  }

  public override ignoreImportReference(
    provider: ImportProvider,
    reference: string
  ): Observable<void> {
    return this._ignoreImportReferenceGQL.mutate({
      bookId: this._currentBookService.currentBook?.id ?? '',
      provider: GraphqlImportProvider.Lexware,
      reference: reference
    }).pipe(
      map(() => {
      })
    );
  }

}
