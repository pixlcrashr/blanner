import { Component } from '@angular/core';
import { SectionContainerComponent } from '../section-container/section-container.component';
import { SectionContentComponent } from '../section-content/section-content.component';
import { SectionHeaderComponent } from '../section-header/section-header.component';
import { SectionFooterComponent } from '../section-footer/section-footer.component';
import { SectionIconButtonComponent } from '../section-icon-button/section-icon-button.component';



@Component({
  selector: 'app-balance-group-container',
  imports: [
    SectionContainerComponent,
    SectionContentComponent,
    SectionHeaderComponent,
    SectionFooterComponent,
    SectionIconButtonComponent
  ],
  templateUrl: './balance-groups-container.component.html',
  styleUrl: './balance-groups-container.component.scss'
})
export class BalanceGroupsContainerComponent {

}
