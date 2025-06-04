import { inject, Injectable } from '@angular/core';
import { Budget, OverviewData, OverviewDataService, Row } from '../../../../app/overview/overview-data.service';
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
        const budgets: Budget[] = res.data.matrix.budgets?.map(b => ({
          id: b.budgetId,
          name: b.budget.name
        })) ?? [];

        const rows: Row[] = res.data.matrix.accounts.map(((
          n,
          i
        ) => ({
          accountId: n.accountId,
          fullCodeParts: n.account.fullCode.split('-'),
          name: n.account.name,
          isGroup: n.account.isGroup,
          code: n.account.code,
          parentIndex: n.parentIndex ?? null,
          type: n.account.type === GraphqlAccountType.Income ? AccountType.Income : AccountType.Expense,
          depth: n.depth,
          targetValues: res.data.matrix.values[i].map(v => ({
            value: v.target.decimal,
            budget: budgets[i]
          })),
          actualValues: res.data.matrix.values[i].map(v => ({
            value: v.actual.decimal,
            budget: budgets[i]
          })),
          differenceValues: res.data.matrix.values[i].map(v => ({
            value: v.difference.decimal,
            budget: budgets[i]
          }))
        })));

        return {
          budgets: budgets,
          maxDepth: res.data.matrix.maxDepth,
          rows: rows
        };
      })
    );
  }
}
