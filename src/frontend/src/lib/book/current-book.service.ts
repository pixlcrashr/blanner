import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



export interface Book {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrentBookService {
  public get currentBook(): Book | null {
    return this._bookSubject.getValue();
  }

  public get currentBook$(): Observable<Book | null> {
    return this._bookSubject.asObservable();
  }

  private readonly _bookSubject = new BehaviorSubject<Book | null>(null);

  public setCurrentBook(
    id: string,
    name: string
  ): void {
    this._bookSubject.next({
      id,
      name
    });
  }
}
