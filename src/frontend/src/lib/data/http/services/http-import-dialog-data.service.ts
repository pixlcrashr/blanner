import { map, Observable } from 'rxjs';
import { ImportDialogDataService } from '../../../../app/import/import-dialog/import-dialog-data.service';
import { Transaction } from '../../../../app/import/import-dialog/import-dialog.component';
import { inject } from '@angular/core';
import { ImportService } from '../client';
import { CurrentBookService } from '../../../book/current-book.service';



export class HttpImportDialogDataService extends ImportDialogDataService {
  private readonly _importService = inject(ImportService);
  private readonly _currentBookService = inject(CurrentBookService);

  public override getLexwareTransactions(importFile: File): Observable<Transaction[]> {
    return this._importService.transactionsProviderImport(
      'lexware',
      this._currentBookService.currentBook?.id ?? '',
      importFile
    ).pipe(
      map(res => res.map(x => ({
        index: x.index,
        amount: x.amount,
        creditAccount: x.credit_account,
        debitAccount: x.debit_account,
        receiptDate: new Date(x.receipt_date),
        reference: x.reference,
        description: x.description
      } as Transaction)))
    );
  }
}
