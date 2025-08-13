import { Component, computed, effect, inject, Signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Budget, BudgetService } from '../../lib/state/budget.service';
import { AccountNode, AccountService } from '../../lib/state/account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ActualValueComponent } from './actual-value/actual-value.component';
import { TargetValueComponent } from './target-value/target-value.component';
import { DiffValueComponent } from './diff-value/diff-value.component';
import { LeftSelectionType, SelectionService } from '../../lib/state/selection.service';
import { BudgetOverlayComponent } from './budget-overlay/budget-overlay.component';
import { AccountOverlayComponent } from './account-overlay/account-overlay.component';
import { AccountGroupOverlayComponent } from './account-group-overlay/account-group-overlay.component';



@Component({
  selector: 'app-matrix-container',
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule,
    ActualValueComponent,
    TargetValueComponent,
    DiffValueComponent,
    BudgetOverlayComponent,
    AccountOverlayComponent,
    AccountGroupOverlayComponent,
    DatePipe
  ],
  templateUrl: './matrix-container.component.html',
  styleUrl: './matrix-container.component.scss'
})
export class MatrixContainerComponent {
  private readonly _budgetService = inject(BudgetService);
  private readonly _accountService = inject(AccountService);
  private readonly _selectionService = inject(SelectionService);

  protected leftSelection = this._selectionService.leftSelection.asReadonly();
  protected leftSelectionObject: Signal<any | undefined> = computed(() => {
    const sel = this.leftSelection();

    switch (sel?.type) {
      case LeftSelectionType.Account:
        return this._accountService.rootNode.getAccount(sel.id) ?? undefined;
      case LeftSelectionType.Budget:
        return this._budgetService.getBudget(sel.id) ?? undefined;
      case LeftSelectionType.BudgetGroup:
        return undefined;
      default:
        return undefined;
    }
  });

  protected maxAccountDepth: number = 0;
  protected numberingCols: number[] = [];
  protected readonly LeftSelectionType = LeftSelectionType;

  protected readonly budgets: Signal<Budget[]> = this._budgetService.budgets;
  protected readonly accounts: Signal<AccountNode[]> = this._accountService.rootNode.children;

  public constructor() {
    effect(() => {
      this.maxAccountDepth = this._accountService.rootNode.getDepth();
      this.numberingCols = new Array(this.maxAccountDepth).fill(0).map((
        _,
        i
      ) => i + 1);
    });
  }

  protected closeLeftSelection(): void {
    this._selectionService.leftSelection.set(undefined);
  }

  protected readonly Budget = Budget;
}
