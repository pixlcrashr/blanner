import { Component } from '@angular/core';
import { MenuLeftContainerComponent } from '../menu-left-container/menu-left-container.component';
import { MenuRightContainerComponent } from '../menu-right-container/menu-right-container.component';
import { MatrixContainerComponent } from '../matrix-container/matrix-container.component';



@Component({
  selector: 'app-content-container',
  imports: [
    MenuLeftContainerComponent,
    MenuRightContainerComponent,
    MatrixContainerComponent
  ],
  templateUrl: './content-container.component.html',
  styleUrl: './content-container.component.scss'
})
export class ContentContainerComponent {

}
