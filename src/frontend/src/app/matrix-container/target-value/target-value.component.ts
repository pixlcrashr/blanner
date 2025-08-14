import { formatCurrency } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Decimal } from 'decimal.js/decimal';
import { Subscription } from 'rxjs';
import { AccountNode } from '../../../lib/state/account.service';
import { BudgetAccountTargetValueService } from '../../../lib/state/budget-account-value.service';



@Component({
  selector: 'app-target-value',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './target-value.component.html',
  styleUrl: './target-value.component.scss'
})
export class TargetValueComponent implements OnInit, OnDestroy {
  @Input() public node?: AccountNode;
  @Input() public accountId: string = '';
  @Input() public budgetId: string = '';
  @Input() public revision: number = 0;
  @Input() public disabled: boolean = false;

  private isFocused = false;

  private _value: WritableSignal<Decimal> = signal(new Decimal(0));
  protected readonly disabledValue: Signal<string> = computed(() => TargetValueComponent.formatValue(this._value().toNumber()));

  protected formControl = new FormControl<string | null>(TargetValueComponent.formatValue(0));

  private readonly _budgetAccountTargetValueService = inject(BudgetAccountTargetValueService);
  private readonly _subscription: Subscription;

  public constructor() {
    effect(() => {
      const v = this._value();

      if (this.isFocused) {
        return;
      }

      this.formControl.setValue(
        TargetValueComponent.formatValue(v.toNumber()),
        {
          emitEvent: false,
          onlySelf: false
        }
      );
    });

    this._subscription = this.formControl.valueChanges.subscribe(v => {
      if (!this.isFocused) {
        return;
      }

      v = v?.replace(
        ',',
        '.'
      ) ?? '0';

      const n = Math.floor(parseFloat(v) * 100) / 100;

      const parents = this.node?.getParentPath() ?? [];

      const d = new Decimal(n);
      this._value.update(oldValue => {
        parents.forEach(p => {
          const bav = this._budgetAccountTargetValueService.getOrCreate(
            this.budgetId,
            p.account.id,
            this.revision
          );

          const diff = oldValue.isNaN() ? d : d.minus(oldValue);

          bav.update(n => {
            if (n.isNaN()) {
              return diff;
            }

            return n.add(diff);
          });
        });

        return d;
      });
    });
  }

  private static formatValue(v: number): string {
    if (isNaN(v)) {
      return '- €';
    }

    return formatCurrency(
      v,
      'de-DE',
      '€',
      'EUR'
    );
  }

  ngOnInit(): void {
    this._value = this._budgetAccountTargetValueService.getOrCreate(
      this.budgetId,
      this.accountId,
      this.revision
    );
  }

  public ngOnDestroy() {
    this._subscription?.unsubscribe();
  }

  protected onFocusIn(e: FocusEvent): void {
    this.isFocused = true;

    const v = this._value().toNumber();

    this.formControl.setValue(
      isNaN(v) ? '' : v.toString(),
      {
        emitEvent: false
      }
    );
  }

  protected onFocusOut(e: FocusEvent): void {
    this.formControl.setValue(
      TargetValueComponent.formatValue(this._value().toNumber()),
      {
        emitEvent: false,
        onlySelf: false
      }
    );

    this.isFocused = false;
  }
}
