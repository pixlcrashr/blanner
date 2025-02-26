import { Injectable } from '@angular/core';
import { AddBookDialogDataService, Book } from '../../../../app/add-book-dialog/add-book-dialog-data.service';
import { delay, Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker/locale/de';



@Injectable()
export class MockAddBookDialogDataService extends AddBookDialogDataService {
  public override addBook(name: string): Observable<Book> {
    return of({
      id: faker.string.uuid()
    }).pipe(
      delay(500)
    );
  }
}
