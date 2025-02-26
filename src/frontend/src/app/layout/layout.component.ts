import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LayoutBookMenuComponent } from './layout-book-menu/layout-book-menu.component';
import { CurrentBookService } from '../../lib/book/current-book.service';
import { AsyncPipe } from '@angular/common';



@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLinkActive,
    RouterLink,
    LayoutBookMenuComponent,
    AsyncPipe
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  protected readonly currentBookService = inject(CurrentBookService);
}
