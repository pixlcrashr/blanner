import { Observable } from 'rxjs';



export abstract class OverviewTableAccountNameInputDataService {
  public abstract updateAccountName(
    accountId: string,
    value: string
  ): Observable<void>;
}
