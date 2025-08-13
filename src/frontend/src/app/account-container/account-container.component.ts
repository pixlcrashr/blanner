import { Component, inject, signal, Signal, WritableSignal } from '@angular/core';
import { AccountTreeViewComponent } from '../account-tree-view/account-tree-view.component';
import { Account, AccountNode, AccountService } from '../../lib/state/account.service';
import { NgTemplateOutlet } from '@angular/common';
import { HierarchyPrefixPipe } from './pipes/hierarchy-prefix.pipe';



@Component({
  selector: 'app-account-container',
  imports: [
    AccountTreeViewComponent,
    NgTemplateOutlet,
    HierarchyPrefixPipe
  ],
  templateUrl: './account-container.component.html',
  styleUrl: './account-container.component.scss'
})
export class AccountContainerComponent {
  private readonly _accountService = inject(AccountService);
  protected items: Signal<AccountNode[]> = this._accountService.rootNode.children;
  selectedAccountId: WritableSignal<string | undefined> = signal('2');

  protected selectAccount(
    e: MouseEvent,
    account: Account
  ): void {
    this.selectedAccountId.set(account.id);
  }
}
