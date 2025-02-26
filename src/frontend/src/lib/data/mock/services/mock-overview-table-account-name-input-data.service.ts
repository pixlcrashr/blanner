import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import {
  OverviewTableAccountNameInputDataService
} from '../../../../app/overview/overview-table/overview-table-account-name-input/overview-table-account-name-input-data.service';



@Injectable()
export class MockOverviewTableAccountNameInputDataService extends OverviewTableAccountNameInputDataService {
  public override updateAccountName(
    accountId: string,
    value: string
  ): Observable<void> {
    return of(1).pipe(
      map(() => {
      }),
      delay(1000)
    );
  }
}
