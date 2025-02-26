import { Observable } from 'rxjs';



export interface Book {
  id: string;
  name: string;
}

export abstract class LayoutBookMenuDataService {
  public abstract listBooks(): Observable<Book[]>;
}
