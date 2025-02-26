import { OverviewData, OverviewDataService } from '../../../../app/overview/overview-data.service';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { AccountType } from '../../types';
import { faker } from '@faker-js/faker/locale/de';
import { SharedUuid1, SharedUuid2, SharedUuid3 } from '../shared';



@Injectable()
export class MockOverviewDataService extends OverviewDataService {
  public override getOverviewData(): Observable<OverviewData> {
    return of({
      budgets: [
        {
          id: SharedUuid2,
          name: 'HH 24/25',
          description: 'Testbeschreibung'
        },
        {
          id: SharedUuid3,
          name: 'HH 23/24',
          description: 'Testbeschreibung'
        }
      ],
      accounts: [
        {
          id: SharedUuid1,
          name: 'Semesterbeiträge',
          type: AccountType.Income,
          isEditable: true,
          isGroup: true,
          code: 'E-1-0',
          budgetValues: [
            {
              target: 300,
              actual: 300,
              diff: 0,
              budgetId: SharedUuid2
            },
            {
              target: 250,
              actual: 250,
              diff: 0,
              budgetId: SharedUuid3
            }
          ],
          parentId: null
        },
        {
          id: faker.string.uuid(),
          code: 'E-1-1',
          name: 'UHH Vollzahler',
          type: AccountType.Income,
          isEditable: true,
          isGroup: false,
          parentId: SharedUuid1,
          budgetValues: [
            {
              target: 300,
              actual: 301,
              diff: 0,
              budgetId: SharedUuid2
            },
            {
              target: 250,
              actual: 250,
              diff: 0,
              budgetId: SharedUuid3
            }
          ]
        }
      ]
    }).pipe(
      delay(1000)
    );
  }
}
