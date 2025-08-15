import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { BudgetAccountTargetValueService } from '../../../lib/state/budget-account-value.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountNode } from '../../../lib/state/account.service';
import { CurrencyPipe, formatCurrency } from '@angular/common';
import { Decimal } from 'decimal.js/decimal';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-target-value',
  imports: [
    FormsModule,
    CurrencyPipe,
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

  @ViewChild('input')
  private inputRef?: ElementRef<HTMLInputElement>;

  private isFocused = false;
  protected formControl = new FormControl<string | null>(TargetValueComponent.formatValue(0));
  private readonly srcValue: WritableSignal<Decimal> = signal(new Decimal(0));
  protected value: Signal<number>;

  private readonly _budgetAccountTargetValueService = inject(BudgetAccountTargetValueService);
  private readonly _subscription: Subscription = this.formControl.valueChanges.subscribe(v => {
    if (!this.isFocused) {
      return;
    }

    const n = parseFloat(v ?? '0');

    console.log(v);

    const parents = this.node?.getParentPath() ?? [];

    const d = new Decimal(n);
    this.srcValue.update(oldValue => {
      parents.forEach(p => {
        const bav = this._budgetAccountTargetValueService.getOrCreate(
          this.budgetId,
          p.account.id
        );
        bav.update(n => n.plus(d.minus(oldValue)));
      });

      return d;
    });
  });

  public constructor() {
    this.value = computed(() => {
      const v = this.srcValue();

      return v.toNumber();
    });

    effect(() => {
      const v = this.srcValue();

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
  }

  private static formatValue(v: number): string {
    return formatCurrency(
      v,
      'de-DE',
      '€',
      'EUR'
    );
  }

  ngOnInit(): void {
    /*this.srcValue = this._budgetAccountTargetValueService.getOrCreate(
      this.budgetId,
      this.accountId
    );*/
  }

  public ngOnDestroy() {
    this._subscription?.unsubscribe();
  }

  protected onFocusIn(e: FocusEvent): void {
    this.isFocused = true;
    this.formControl.setValue(
      this.value().toString(),
      {
        emitEvent: false
      }
    );
    this.inputRef?.nativeElement.select();
  }

  protected onFocusOut(e: FocusEvent): void {
    this.formControl.setValue(
      TargetValueComponent.formatValue(this.value()),
      {
        emitEvent: false,
        onlySelf: false
      }
    );
    this.isFocused = false;
  }

}
