import { inject, Injectable } from '@angular/core';
import { OverviewData, OverviewDataService, RowBudgetValue } from '../../../../app/overview/overview-data.service';
import { map, Observable } from 'rxjs';
import { CurrentBookService } from '../../../book/current-book.service';
import { AccountType as GraphqlAccountType, OverviewData_GetOverviewDataGQL } from '../components';
import { AccountType } from '../../types';



@Injectable()
export class GraphqlOverviewDataService extends OverviewDataService {
  private readonly _currentBookService = inject(CurrentBookService);
  private readonly _getOverviewDataGQL = inject(OverviewData_GetOverviewDataGQL);

  public override getOverviewData(): Observable<OverviewData> {
    return this._getOverviewDataGQL.fetch(
      {
        bookId: this._currentBookService.currentBook?.id ?? ''
      },
      {
        fetchPolicy: 'no-cache'
      }
    ).pipe(
      map(res => {
        return {
          budgets: res.data.matrix.budgets?.map(b => ({
            id: b.budgetId,
            name: b.budget.name
          })) ?? [],
          maxDepth: res.data.matrix.maxDepth,
          rows: res.data.matrix.accounts.map(((
            n,
            i
          ) => ({
            accountId: n.accountId,
            name: n.account.name,
            isGroup: n.account.isGroup,
            code: n.account.code,
            parentIndex: n.parentIndex ?? null,
            type: n.account.type === GraphqlAccountType.Income ? AccountType.Income : AccountType.Expense,
            depth: n.depth,
            budgetValues: res.data.matrix.values[i].map(v => ({
              target: v.target.decimal,
              actual: v.actual.decimal,
              diff: v.difference.decimal
            } as RowBudgetValue))
          })))
        };
      })
    );
  }
}
