import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OverviewTableTargetValueInputDataService } from './overview-table-target-value-input-data.service';
import { parseDecimal } from './parse-decimal';



export interface OverviewTableTargetValueChange {
  accountId: string;
  budgetId: string;
  budgetIndex: number;
  value: number;
}

@Component({
  selector: 'app-overview-table-target-value-input',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './overview-table-target-value-input.component.html',
  styleUrl: './overview-table-target-value-input.component.scss'
})
export class OverviewTableTargetValueInputComponent implements OnInit, OnDestroy {
  @Input() public accountId: string = '';
  @Input() public budgetId: string = '';
  @Input() public budgetIndex: number = 0;
  @Input() public value: number = 0;

  @Output() public changed: EventEmitter<OverviewTableTargetValueChange> = new EventEmitter<OverviewTableTargetValueChange>();

  protected loading = false;
  protected readonly _formControl = new FormControl<string | null>(
    '0',
    [
      Validators.required,
      Validators.pattern(/^[0-9]*([,.]\d{0,2})?$/)
    ]
  );

  private _destroy$ = new AsyncSubject<void>();
  private readonly _dataService = inject(OverviewTableTargetValueInputDataService);

  public ngOnInit(): void {
    this._formControl.setValue(
      this.value.toString(),
      {
        emitEvent: false
      }
    );

    this._formControl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this._destroy$)
    ).subscribe({
      next: (v) => {
        if (this.loading || this._formControl.invalid) {
          return;
        }

        this.updateIfNeeded(v ?? '0');
      }
    });
  }

  private updateIfNeeded(v: string): void {
    const d = parseDecimal(v ?? '0');
    if (Number.isNaN(d)) {
      this.loading = false;
      return;
    }

    this.loading = true;

    this._dataService.updateTargetValue(
      this.accountId,
      this.budgetId,
      d
    ).subscribe({
      next: () => {
        this.changed.emit({
          accountId: this.accountId,
          budgetId: this.budgetId,
          budgetIndex: this.budgetIndex,
          value: d
        });
      },
      complete: () => {
        if (this._formControl.value !== v) {
          this.updateIfNeeded(this._formControl.value ?? '0');
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        if (this._formControl.value !== v) {
          this.updateIfNeeded(this._formControl.value ?? '0');
        } else {
          this.loading = false;
        }
      }
    });
  }


  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
