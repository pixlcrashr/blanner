import { Component } from '@angular/core';
import { ContentContainerComponent } from '../content-container/content-container.component';
import { HeaderComponent } from '../header/header.component';



@Component({
  selector: 'app-main-container',
  imports: [
    ContentContainerComponent,
    HeaderComponent
  ],
  templateUrl: './main-container.component.html',
  styleUrl: './main-container.component.scss'
})
export class MainContainerComponent {

}
