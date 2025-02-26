import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncSubject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { OverviewTableAccountNameInputDataService } from './overview-table-account-name-input-data.service';



export interface OverviewTableAccountNameChange {
  accountId: string;
  name: string;
}

@Component({
  selector: 'app-overview-table-account-name-input',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './overview-table-account-name-input.component.html',
  styleUrl: './overview-table-account-name-input.component.scss'
})
export class OverviewTableAccountNameInputComponent implements OnInit, OnDestroy {
  @Input() public accountId: string = '';
  @Input() public value: string = '';

  @Output() public changed: EventEmitter<OverviewTableAccountNameChange> = new EventEmitter<OverviewTableAccountNameChange>();

  protected loading = false;
  protected readonly _formControl = new FormControl<string | null>(
    '',
    [
      Validators.required,
      Validators.minLength(1)
    ]
  );

  private _destroy$ = new AsyncSubject<void>();
  private _dataService = inject(OverviewTableAccountNameInputDataService);

  public ngOnInit(): void {
    this._formControl.setValue(
      this.value,
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
    this.loading = true;

    this._dataService.updateAccountName(
      this.accountId,
      v
    ).subscribe({
      next: () => {
        this.changed.emit({
          accountId: this.accountId,
          name: v
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
