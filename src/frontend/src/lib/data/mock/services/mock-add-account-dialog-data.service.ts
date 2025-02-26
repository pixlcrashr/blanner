import { delay, Observable, of } from 'rxjs';
import {
  Account,
  AddAccountDialogDataService,
  Data
} from '../../../../app/add-account-dialog/add-account-dialog-data.service';
import { SharedUuid1 } from '../shared';
import { AccountType } from '../../types';
import { faker } from '@faker-js/faker/locale/de';
import { Injectable } from '@angular/core';



@Injectable()
export class MockAddAccountDialogDataService extends AddAccountDialogDataService {
  public override getData(): Observable<Data> {
    return of({
      incomes: [
        {
          id: SharedUuid1,
          name: 'Semesterbeitrag',
          namePrefix: ''
        }
      ],
      expenses: []
    } as Data).pipe(
      delay(500)
    );
  }

  public override addAccount(
    name: string,
    description: string,
    type: AccountType,
    code: string,
    isGroup: boolean,
    parentId: string | null
  ): Observable<Account> {
    return of({
      id: faker.string.uuid(),
      code: `${type === AccountType.Income ? 'E' : 'A'}-1-${code}`
    }).pipe(
      delay(500)
    );
  }
}
