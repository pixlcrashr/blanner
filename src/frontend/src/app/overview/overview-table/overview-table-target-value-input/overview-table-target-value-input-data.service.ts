import { Observable } from 'rxjs';



export abstract class OverviewTableTargetValueInputDataService {
  public abstract updateTargetValue(
    accountId: string,
    budgetId: string,
    value: number
  ): Observable<void>;
}
