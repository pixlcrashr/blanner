import { delay, map, mergeMap, Observable, of, throwError, timer } from 'rxjs';
import { JournalData, JournalDataService } from '../../../../app/journal/journal-data.service';
import { SharedUuid1, SharedUuid2, SharedUuid3 } from '../shared';
import { faker } from '@faker-js/faker/locale/de';
import { Injectable } from '@angular/core';



@Injectable()
export class MockJournalDataService extends JournalDataService {
  public override getJournalData(): Observable<JournalData> {
    return of({
      accounts: [
        {
          id: SharedUuid1,
          name: faker.book.title()
        },
        {
          id: SharedUuid2,
          name: faker.book.title()
        },
        {
          id: SharedUuid3,
          name: faker.book.title()
        }
      ],
      transactions: [
        {
          id: SharedUuid1,
          isImported: true,
          createdAt: faker.date.recent(),
          accountId: SharedUuid1,
          amount: 123.45,
          isDeletable: true,
          isEditable: true,
          reference: faker.commerce.productDescription()
        },
        {
          id: SharedUuid2,
          isImported: true,
          createdAt: faker.date.recent(),
          accountId: SharedUuid1,
          amount: 67.89,
          isDeletable: true,
          isEditable: true,
          reference: faker.commerce.productDescription()
        },
        {
          id: SharedUuid3,
          isImported: false,
          createdAt: faker.date.recent(),
          accountId: SharedUuid2,
          isDeletable: false,
          isEditable: false,
          amount: 0.01,
          reference: faker.commerce.productDescription()
        }
      ]
    }).pipe(
      delay(1000)
    );
  }

  public override deleteTransaction(transactionId: string): Observable<void> {
    if (transactionId === SharedUuid2) {
      return timer(1000).pipe(
        mergeMap(() => throwError(() => new Error('could not delete transaction'))),
        map(() => {
        })
      );
    }

    return of({}).pipe(
      map(() => {
      }),
      delay(1000)
    );
  }

  public override changeTransactionAccount(
    transactionId: string,
    accountId: string
  ): Observable<void> {
    return of({}).pipe(
      delay(1000),
      map(() => {
        if (accountId === SharedUuid2) {
          throw new Error('could not update account of transaction');
        }
      })
    );
  }
}
