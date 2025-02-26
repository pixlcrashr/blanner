import { Injectable } from '@angular/core';
import { Book, LayoutBookMenuDataService } from '../../../../app/layout/layout-book-menu/layout-book-menu-data.service';
import { delay, Observable, of } from 'rxjs';
import { SharedUuid1, SharedUuid2 } from '../shared';



@Injectable()
export class MockLayoutBookMenuDataService extends LayoutBookMenuDataService {
  public override listBooks(): Observable<Book[]> {
    return of([
      {
        id: SharedUuid1,
        name: 'Buch 1'
      },
      {
        id: SharedUuid2,
        name: 'Buch 2'
      }
    ]).pipe(
      delay(1000)
    );
  }
}
