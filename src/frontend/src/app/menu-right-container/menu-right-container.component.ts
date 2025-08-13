import { Component } from '@angular/core';
import { JournalContainerComponent } from '../journal-container/journal-container.component';



@Component({
  selector: 'app-menu-right-container',
  imports: [
    JournalContainerComponent
  ],
  templateUrl: './menu-right-container.component.html',
  styleUrl: './menu-right-container.component.scss'
})
export class MenuRightContainerComponent {

}
