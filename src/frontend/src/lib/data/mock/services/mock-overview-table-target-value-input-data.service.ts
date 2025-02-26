import { Injectable } from '@angular/core';
import {
  OverviewTableTargetValueInputDataService
} from '../../../../app/overview/overview-table/overview-table-target-value-input/overview-table-target-value-input-data.service';
import { delay, map, Observable, of } from 'rxjs';



@Injectable()
export class MockOverviewTableTargetValueInputDataService extends OverviewTableTargetValueInputDataService {
  public override updateTargetValue(
    accountId: string,
    budgetId: string,
    value: number
  ): Observable<void> {
    return of(1).pipe(
      map(() => {
      }),
      delay(1000)
    );
  }
}
