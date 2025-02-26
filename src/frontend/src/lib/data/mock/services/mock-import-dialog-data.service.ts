import { Injectable } from '@angular/core';
import { ImportDialogDataService } from '../../../../app/import/import-dialog/import-dialog-data.service';
import { delay, Observable, of } from 'rxjs';
import { Transaction } from '../../../../app/import/import-dialog/import-dialog.component';
import { faker } from '@faker-js/faker/locale/de';



@Injectable()
export class MockImportDialogDataService extends ImportDialogDataService {
  public override getLexwareTransactions(importFile: File): Observable<Transaction[]> {
    return of(new Array(45).fill(0).map((
      _,
      i
    ) => ({
      index: i,
      amount: faker.number.float({ min: 0, max: 1000 }),
      creditAccount: faker.number.int({ min: 1000, max: 9999 }).toString(),
      debitAccount: faker.number.int({ min: 1000, max: 9999 }).toString(),
      receiptDate: faker.date.recent(),
      reference: faker.book.title(),
      description: faker.book.title()
    }))).pipe(
      delay(500)
    );
  }
}
