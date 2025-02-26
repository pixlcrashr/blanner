import { Injectable } from '@angular/core';
import { Account, ImportDataService } from '../../../../app/import/import-data.service';
import { delay, Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker/locale/de';
import { AccountType } from '../../types';



@Injectable()
export class MockImportDataService extends ImportDataService {
  public override getAccounts(): Observable<Account[]> {
    return of([
      {
        id: faker.string.uuid(),
        name: faker.book.title(),
        namePrefix: '-'.repeat(faker.number.int(4)),
        type: AccountType.Income
      }
    ]).pipe(
      delay(500)
    );
  }
}
