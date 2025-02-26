import { inject, Injectable } from '@angular/core';
import { AddBookDialogDataService, Book } from '../../../../app/add-book-dialog/add-book-dialog-data.service';
import { map, Observable } from 'rxjs';
import { AddBookDialogData_AddBookGQL } from '../components';



@Injectable()
export class GraphqlAddBookDialogDataService extends AddBookDialogDataService {
  private readonly _addBookGQL = inject(AddBookDialogData_AddBookGQL);

  public override addBook(
    name: string,
    description: string,
    startMonth: number
  ): Observable<Book> {
    return this._addBookGQL.mutate({
      name: name,
      description: description,
      startMonth: startMonth
    }).pipe(
      map(res => ({
        id: res.data?.createBook.id ?? ''
      }))
    );
  }
}
