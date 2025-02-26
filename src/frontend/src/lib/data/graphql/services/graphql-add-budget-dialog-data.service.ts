import { inject, Injectable } from '@angular/core';
import { AddBudgetDialogDataService, Budget } from '../../../../app/add-budget-dialog/add-budget-dialog-data.service';
import { map, Observable } from 'rxjs';
import { CurrentBookService } from '../../../book/current-book.service';
import { AddBudgetDialogData_AddBudgetGQL } from '../components';



@Injectable()
export class GraphqlAddBudgetDialogDataService extends AddBudgetDialogDataService {
  private readonly _currentBookService = inject(CurrentBookService);
  private readonly _addBudgetGQL = inject(AddBudgetDialogData_AddBudgetGQL);

  public override addBudget(
    name: string,
    description: string,
    year: number
  ): Observable<Budget> {
    return this._addBudgetGQL.mutate({
      bookId: this._currentBookService.currentBook?.id ?? '',
      name: name,
      description: description,
      year: year
    }).pipe(
      map(res => ({
        id: res?.data?.createBudget?.id ?? ''
      }))
    );
  }
}
