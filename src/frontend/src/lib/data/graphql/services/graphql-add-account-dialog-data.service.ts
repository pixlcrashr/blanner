import { inject, Injectable } from '@angular/core';
import {
  Account,
  AddAccountDialogDataService,
  Data,
  DataAccount
} from '../../../../app/add-account-dialog/add-account-dialog-data.service';
import { map, Observable } from 'rxjs';
import { AccountType } from '../../types';
import {
  AccountType as GraphqlAccountType,
  AddAccountDialogData_AddAccountGQL,
  AddAccountDialogData_GetDataGQL
} from '../components';
import { CurrentBookService } from '../../../book/current-book.service';



function calcDepth<T>(
  items: readonly T[],
  parentId: string,
  idFn: (item: T) => string,
  parentIdFn: (item: T) => string | null,
  depth: number = 0
): number {
  const item = items.find(item => idFn(item) === parentId);
  if (!item) {
    return depth;
  }

  const newParentId = parentIdFn(item);
  if (!newParentId) {
    return depth;
  }

  return calcDepth(
    items,
    newParentId,
    idFn,
    parentIdFn,
    depth + 1
  );
}

@Injectable()
export class GraphqlAddAccountDialogDataService extends AddAccountDialogDataService {
  private readonly _getDataGQL = inject(AddAccountDialogData_GetDataGQL);
  private readonly _addAccountGQL = inject(AddAccountDialogData_AddAccountGQL);
  private readonly _currentBookService = inject(CurrentBookService);

  public override getData(): Observable<Data> {
    return this._getDataGQL.fetch(
      {
        bookId: this._currentBookService.currentBook?.id ?? ''
      },
      {
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map(res => {
        const incomeAccounts = res.data.searchAccounts
          .filter(a => a.type === GraphqlAccountType.Income);
        const expenseAccounts = res.data.searchAccounts
          .filter(a => a.type === GraphqlAccountType.Expense);

        return {
          incomes: incomeAccounts.map(a => ({
              id: a.id,
              name: a.name,
              namePrefix: '-'.repeat(a.depth)
            } as DataAccount)
          ),
          expenses: expenseAccounts.map(a => ({
              id: a.id,
              name: a.name,
              namePrefix: '-'.repeat(a.depth)
            } as DataAccount)
          )
        };
      })
    );
  }

  public override addAccount(
    name: string,
    description: string,
    type: AccountType,
    code: string,
    isGroup: boolean,
    parentId: string | null
  ): Observable<Account> {
    return this._addAccountGQL.mutate({
      bookId: this._currentBookService.currentBook?.id ?? '',
      name: name,
      description: description,
      type: type === AccountType.Income ? GraphqlAccountType.Income : GraphqlAccountType.Expense,
      code: code,
      isGroup: isGroup,
      parentId: parentId
    }).pipe(
      map(res => ({
        id: res.data?.createAccount?.id ?? '',
        code: res.data?.createAccount?.code ?? ''
      }))
    );
  }

}
