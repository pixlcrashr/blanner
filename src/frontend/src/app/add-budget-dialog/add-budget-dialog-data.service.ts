import { Observable } from 'rxjs';



export interface Budget {
  id: string;
}

export abstract class AddBudgetDialogDataService {
  public abstract addBudget(
    name: string,
    description: string,
    year: number
  ): Observable<Budget>;
}
