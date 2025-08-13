import { Component } from '@angular/core';
import { BudgetContainerComponent } from '../budget-container/budget-container.component';
import { AccountContainerComponent } from '../account-container/account-container.component';
import { BalanceGroupsContainerComponent } from '../balance-group-container/balance-groups-container.component';



export enum Tab {
  Budgets,
  Accounts,
  BalanceGroups
}

@Component({
  selector: 'app-menu-left-container',
  imports: [
    BudgetContainerComponent,
    AccountContainerComponent,
    BalanceGroupsContainerComponent
  ],
  templateUrl: './menu-left-container.component.html',
  styleUrl: './menu-left-container.component.scss'
})
export class MenuLeftContainerComponent {
  protected readonly Tab = Tab;

  protected currentTab: Tab = Tab.Budgets;
}
