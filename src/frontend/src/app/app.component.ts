import { Component } from '@angular/core';
import { MainContainerComponent } from './main-container/main-container.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MainContainerComponent
  ]
})
export class AppComponent {
}
