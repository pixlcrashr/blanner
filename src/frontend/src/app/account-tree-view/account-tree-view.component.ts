import { Component, computed, effect, inject, Input, signal, Signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeftSelectionType, SelectionService } from '../../lib/state/selection.service';
import { Account, AccountNode } from '../../lib/state/account.service';



@Component({
  selector: 'app-account-tree-view',
  imports: [
    NgTemplateOutlet,
    FormsModule
  ],
  templateUrl: './account-tree-view.component.html',
  styleUrl: './account-tree-view.component.scss'
})
export class AccountTreeViewComponent {
  @Input() items: Signal<AccountNode[]> = signal([]);

  protected maxAccountDepth: number = 0;
  protected cols: number[] = [];

  private readonly _selectionService = inject(SelectionService);

  protected readonly currentAccountSelection: Signal<string | undefined> = computed(() => {
    const selection = this._selectionService.leftSelection();
    if (!selection) {
      return undefined;
    }

    if (selection.type !== LeftSelectionType.Account) {
      return undefined;
    }

    return selection.id;
  });

  public constructor() {
    effect(() => {
      const nodes = this.items();

      this.maxAccountDepth = Math.max(...nodes.map(node => node.getDepth()));

      this.cols = new Array(this.maxAccountDepth).fill(0).map((
        _,
        i
      ) => i + 1);
    });
  }

  protected toggleAccountSelection(
    e: MouseEvent,
    account: Account
  ): void {
    if (this._selectionService.leftSelection()?.id === account.id) {
      this._selectionService.leftSelection.set(undefined);
      return;
    }

    this._selectionService.leftSelection.set({
      type: LeftSelectionType.Account,
      id: account.id
    });
  }
}
