import { Component, computed, inject, Signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Budget, BudgetService } from '../../lib/state/budget.service';
import { LeftSelectionType, SelectionService } from '../../lib/state/selection.service';



@Component({
  selector: 'app-budget-container',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './budget-container.component.html',
  styleUrl: './budget-container.component.scss'
})
export class BudgetContainerComponent {
  private readonly _budgetService = inject(BudgetService);
  private readonly _selectionService = inject(SelectionService);

  protected readonly budgets: Signal<Budget[]> = this._budgetService.budgets;
  protected readonly currentBudgetSelection: Signal<string | undefined> = computed(() => {
    const selection = this._selectionService.leftSelection();
    if (!selection) {
      return undefined;
    }

    if (selection.type !== LeftSelectionType.Budget) {
      return undefined;
    }

    return selection.id;
  });

  protected isAdding = false;
  protected readonly addBudgetNameControl = new FormControl(
    '',
    [Validators.required, Validators.minLength(1)]
  );

  protected toggleBudgetSelection(
    e: MouseEvent,
    budget: Budget
  ): void {
    if (this._selectionService.leftSelection()?.id === budget.id) {
      this._selectionService.leftSelection.set(undefined);
      return;
    }

    this._selectionService.leftSelection.set({
      type: LeftSelectionType.Budget,
      id: budget.id
    });
  }

  protected toggleSignal(s: WritableSignal<boolean>): void {
    s.update(value => !value);
  }

  protected addBudget(): void {
    if (this.addBudgetNameControl.invalid) {
      return;
    }

    this._budgetService.addBudget(
      this.addBudgetNameControl.value ?? '',
      true
    );

    this.isAdding = false;
    this.addBudgetNameControl.reset();
  }
}
