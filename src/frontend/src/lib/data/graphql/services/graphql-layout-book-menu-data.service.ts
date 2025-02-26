import { inject, Injectable } from '@angular/core';
import { Book, LayoutBookMenuDataService } from '../../../../app/layout/layout-book-menu/layout-book-menu-data.service';
import { map, Observable } from 'rxjs';
import { LayoutBookMenuData_ListBooksGQL } from '../components';



@Injectable()
export class GraphqlLayoutBookMenuDataService extends LayoutBookMenuDataService {
  private readonly _listBooksGQL = inject(LayoutBookMenuData_ListBooksGQL);

  public override listBooks(): Observable<Book[]> {
    return this._listBooksGQL
      .fetch(
        {},
        {
          fetchPolicy: 'no-cache'
        }
      )
      .pipe(
        map(res => res.data.searchBooks)
      );
  }
}
