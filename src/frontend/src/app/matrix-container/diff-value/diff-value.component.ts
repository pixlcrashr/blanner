import { Component, computed, inject, Input, OnInit, signal, Signal } from '@angular/core';
import {
  BudgetAccountActualValueService,
  BudgetAccountTargetValueService
} from '../../../lib/state/budget-account-value.service';
import { CurrencyPipe } from '@angular/common';



@Component({
  selector: 'app-diff-value',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './diff-value.component.html',
  styleUrl: './diff-value.component.scss'
})
export class DiffValueComponent implements OnInit {
  @Input() public accountId: string = '';
  @Input() public budgetId: string = '';

  protected value: Signal<number> = signal(0);

  private readonly _budgetAccountTargetValueService = inject(BudgetAccountTargetValueService);
  private readonly _budgetAccountActualValueService = inject(BudgetAccountActualValueService);

  ngOnInit(): void {
    const aS = this._budgetAccountActualValueService.getOrCreate(
      this.budgetId,
      this.accountId
    );
    const tS = this._budgetAccountTargetValueService.getOrCreate(
      this.budgetId,
      this.accountId
    );

    this.value = computed(() => tS().minus(aS()).toNumber());
  }
}
