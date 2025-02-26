import { inject, Injectable } from '@angular/core';
import { JournalData, JournalDataService } from '../../../../app/journal/journal-data.service';
import { map, Observable } from 'rxjs';
import { CurrentBookService } from '../../../book/current-book.service';
import {
  AccountType as GraphqlAccountType,
  JournalData_ChangeTransactionAccountGQL,
  JournalData_DeleteTransactionGQL,
  JournalData_GetJournalDataGQL
} from '../components';
import { AccountType } from '../../types';



@Injectable()
export class GraphqlJournalDataService extends JournalDataService {
  private readonly _currentBookService = inject(CurrentBookService);
  private readonly _getJournalDataGQL = inject(JournalData_GetJournalDataGQL);
  private readonly _deleteTransactionGQL = inject(JournalData_DeleteTransactionGQL);
  private readonly _changeTransactionAccountGQL = inject(JournalData_ChangeTransactionAccountGQL);

  public override getJournalData(): Observable<JournalData> {
    return this._getJournalDataGQL.fetch(
      {
        bookId: this._currentBookService.currentBook?.id ?? ''
      },
      {
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map(res => ({
        accounts: res.data.searchAccounts.map(a => ({
          id: a.id,
          name: a.name,
          type: a.type === GraphqlAccountType.Income ? AccountType.Income : AccountType.Expense
        })),
        transactions: res.data.searchTransactions.map(t => ({
          id: t.id,
          amount: t.value.decimal,
          reference: t.reference,
          isDeletable: true,
          isImported: true,
          isEditable: true,
          accountId: t.accountId,
          createdAt: new Date(t.bookedAt)
        }))
      }))
    );
  }

  public override deleteTransaction(transactionId: string): Observable<void> {
    return this._deleteTransactionGQL.mutate({
      transactionId: transactionId
    }).pipe(
      map(() => {
      })
    );
  }

  public override changeTransactionAccount(
    transactionId: string,
    accountId: string
  ): Observable<void> {
    return this._changeTransactionAccountGQL.mutate({
      transactionId: transactionId,
      accountId: accountId
    }).pipe(
      map(() => {
      })
    );
  }

}
