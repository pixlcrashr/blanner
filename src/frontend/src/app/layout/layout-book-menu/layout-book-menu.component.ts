import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Book, LayoutBookMenuDataService } from './layout-book-menu-data.service';
import { CurrentBookService } from '../../../lib/book/current-book.service';
import { AsyncPipe } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import {
  AddBookDialogComponent,
  AddBookDialogData,
  AddBookDialogResult
} from '../../add-book-dialog/add-book-dialog.component';



@Component({
  selector: 'app-layout-book-menu',
  imports: [
    AsyncPipe
  ],
  templateUrl: './layout-book-menu.component.html',
  styleUrl: './layout-book-menu.component.scss'
})
export class LayoutBookMenuComponent implements OnInit {
  protected loading = true;
  protected showMenu = false;
  protected menuTitle = 'Buch auswählen';
  protected books: Book[] = [];
  protected currentBookService = inject(CurrentBookService);

  private readonly _dialog = inject(Dialog);

  @ViewChild('dropdown') dropdown?: ElementRef;

  @HostListener(
    'document:mousedown',
    ['$event']
  )
  protected onMouseDown(e: MouseEvent): void {
    if (this.dropdown && !this.dropdown.nativeElement.contains(e.target)) {
      this.showMenu = false;
    }
  }

  private readonly _dataService = inject(LayoutBookMenuDataService);

  public ngOnInit(): void {
    this._dataService.listBooks().subscribe({
      next: data => {
        this.books = data;
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  protected setCurrentBook(book: Book): void {
    if (this.currentBookService.currentBook?.id === book.id) {
      return;
    }

    this.currentBookService.setCurrentBook(
      book.id,
      book.name
    );
    this.menuTitle = book.name;
    this.showMenu = false;
  }

  protected openAddBookDialog(): void {
    const ref = this._dialog.open<AddBookDialogResult, AddBookDialogData, AddBookDialogComponent>(
      AddBookDialogComponent,
      {}
    );
    ref.closed.subscribe({
      next: data => {
        if (!data) {
          return;
        }

        const book = {
          id: data.id,
          name: data.name
        };
        this.books.push(book);
        this.menuTitle = book.name;
        this.setCurrentBook(book);
      }
    });
  }
}
