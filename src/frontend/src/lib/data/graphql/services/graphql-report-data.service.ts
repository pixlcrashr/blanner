import { inject, Injectable } from '@angular/core';
import { ReportData, ReportDataService } from '../../../../app/report/report-data.service';
import { map, Observable } from 'rxjs';
import { ReportData_GetReportDataGQL } from '../components';
import { RowBudgetValue } from '../../../../app/overview/overview-data.service';



@Injectable()
export class GraphqlReportDataService extends ReportDataService {
  private readonly _getReportDataGQL = inject(ReportData_GetReportDataGQL);

  public override getReportData(bookId: string): Observable<ReportData> {
    return this._getReportDataGQL.fetch(
      {
        bookId: bookId
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
            name: n.account.name,
            fullCodeParts: n.account.fullCode.split('-'),
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
