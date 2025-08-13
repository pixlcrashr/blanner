import { Component, computed, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { BudgetAccountActualValueService } from '../../../lib/state/budget-account-value.service';
import { CurrencyPipe } from '@angular/common';



@Component({
  selector: 'app-actual-value',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './actual-value.component.html',
  styleUrl: './actual-value.component.scss'
})
export class ActualValueComponent implements OnInit {
  @Input() public accountId: string = '';
  @Input() public budgetId: string = '';

  protected value: Signal<number> = signal(0);

  private readonly _budgetAccountActualValueService = inject(BudgetAccountActualValueService);

  ngOnInit(): void {
    this.value = computed(() => this._budgetAccountActualValueService.getOrCreate(
        this.budgetId,
        this.accountId
      )().toNumber()
    );
  }
}
