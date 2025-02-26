import { map, Observable } from 'rxjs';
import {
  OverviewTableAccountNameInputDataService
} from '../../../../app/overview/overview-table/overview-table-account-name-input/overview-table-account-name-input-data.service';
import { OverviewTableAccountNameInputData_UpdateAccountNameGQL } from '../components';
import { inject } from '@angular/core';



export class GraphqlOverviewTableAccountNameInputDataService extends OverviewTableAccountNameInputDataService {
  private readonly _updateAccountNameGQL = inject(OverviewTableAccountNameInputData_UpdateAccountNameGQL);

  public override updateAccountName(
    accountId: string,
    value: string
  ): Observable<void> {
    return this._updateAccountNameGQL.mutate({
      accountId: accountId,
      name: value
    }).pipe(
      map(() => {
      })
    );
  }

}
