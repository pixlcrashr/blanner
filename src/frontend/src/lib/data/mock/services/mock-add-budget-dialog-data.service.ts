import { delay, Observable, of } from 'rxjs';
import { AddBudgetDialogDataService, Budget } from '../../../../app/add-budget-dialog/add-budget-dialog-data.service';
import { faker } from '@faker-js/faker/locale/de';
import { Injectable } from '@angular/core';



@Injectable()
export class MockAddBudgetDialogDataService extends AddBudgetDialogDataService {
  public override addBudget(
    name: string,
    description: string,
    year: number
  ): Observable<Budget> {
    return of({
      id: faker.string.uuid()
    }).pipe(
      delay(500)
    );
  }
}
