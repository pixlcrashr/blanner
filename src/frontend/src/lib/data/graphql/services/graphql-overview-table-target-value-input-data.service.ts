import { inject, Injectable } from '@angular/core';
import {
  OverviewTableTargetValueInputDataService
} from '../../../../app/overview/overview-table/overview-table-target-value-input/overview-table-target-value-input-data.service';
import { map, Observable } from 'rxjs';
import { OverviewTableTargetValueInputData_UpdateTargetValueGQL } from '../components';



@Injectable()
export class GraphqlOverviewTableTargetValueInputDataService extends OverviewTableTargetValueInputDataService {
  private readonly _updateTargetValueGQL = inject(OverviewTableTargetValueInputData_UpdateTargetValueGQL);

  public override updateTargetValue(
    accountId: string,
    budgetId: string,
    value: number
  ): Observable<void> {
    return this._updateTargetValueGQL.mutate({
      accountId: accountId,
      budgetId: budgetId,
      value: (value * 100).toFixed(0)
    }).pipe(
      map(() => {
      })
    );
  }

}
