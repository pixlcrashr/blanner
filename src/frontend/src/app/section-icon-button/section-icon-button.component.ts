import { Component, Input } from '@angular/core';



@Component({
  selector: 'app-section-icon-button',
  imports: [],
  templateUrl: './section-icon-button.component.html',
  styleUrl: './section-icon-button.component.scss'
})
export class SectionIconButtonComponent {
  @Input() icon: string = '';
}
