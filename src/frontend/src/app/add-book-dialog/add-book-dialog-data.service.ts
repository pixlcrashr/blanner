import { Observable } from 'rxjs';



export interface Book {
  id: string;
}

export abstract class AddBookDialogDataService {
  public abstract addBook(
    name: string,
    description: string,
    startMonth: number
  ): Observable<Book>;
}
