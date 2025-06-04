import { inject, Injectable } from '@angular/core';
import { Account, ImportDataService } from '../../../../app/import/import-data.service';
import { map, Observable } from 'rxjs';
import { CurrentBookService } from '../../../book/current-book.service';
import { AccountType as GraphqlAccountType, ImportData_GetAccountsGQL } from '../components';
import { AccountType } from '../../types';



@Injectable()
export class GraphqlImportDataService extends ImportDataService {
  private readonly _currentBookService = inject(CurrentBookService);
  private readonly _getAccountsGQL = inject(ImportData_GetAccountsGQL);

  public override getAccounts(): Observable<Account[]> {
    return this._getAccountsGQL.fetch(
      {
        bookId: this._currentBookService.currentBook?.id ?? ''
      },
      {
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map(res => res.data.searchAccounts.map(a => ({
        id: a.id,
        name: a.name,
        namePrefix: '',
        type: a.type === GraphqlAccountType.Income ? AccountType.Income : AccountType.Expense,
        fullCode: a.fullCode,
        depth: a.depth
      })))
    );
  }
}
