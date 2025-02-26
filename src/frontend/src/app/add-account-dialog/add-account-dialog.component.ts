import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { AccountType } from '../../lib/data/types';
import { AddAccountDialogDataService, DataAccount } from './add-account-dialog-data.service';
import { Subscription } from 'rxjs';



export interface AddAccountDialogData {
  type: AccountType | null;
  parentId: string | null;
}

export interface AddAccountDialogResult {
  id: string;
  type: number;
  name: string;
  description: string;
  code: string;
  isGroup: boolean;
  parentId: string | null;
  depth: number;
}

@Component({
  selector: 'app-add-account-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-account-dialog.component.html',
  styleUrl: './add-account-dialog.component.scss'
})
export class AddAccountDialogComponent implements OnInit, OnDestroy {
  protected readonly AccountType = AccountType;

  protected loading = false;
  protected readonly dialogRef = inject<DialogRef<AddAccountDialogData, AddAccountDialogComponent>>(DialogRef<AddAccountDialogData, AddAccountDialogComponent>);
  private readonly _data: AddAccountDialogData = inject(DIALOG_DATA);
  private readonly _dataService = inject(AddAccountDialogDataService);
  protected accounts: DataAccount[] = [];

  private incomeAccounts: DataAccount[] = [];
  private expenseAccounts: DataAccount[] = [];

  protected isTypeSet = this._data.type !== null;
  protected isParentIdSet = this._data.parentId !== null;

  protected readonly formGroup = new FormGroup({
    type: new FormControl<string | null>(
      '0',
      []
    ),
    isGroup: new FormControl<boolean | null>(
      false,
      [
        Validators.required
      ]
    ),
    name: new FormControl<string | null>(
      '',
      [
        Validators.required,
        Validators.minLength(1)
      ]
    ),
    description: new FormControl<string | null>(
      '',
      []
    ),
    code: new FormControl<string | null>(
      '',
      [
        Validators.required,
        Validators.minLength(1)
      ]
    ),
    parentId: new FormControl<string | null>(
      '',
      []
    )
  });

  private _subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.formGroup.disable({
      emitEvent: false
    });
    this.loading = true;
    this._subscriptions.push(
      this._dataService.getData().subscribe({
        next: data => {
          this.accounts = this.formGroup.controls.type.value === AccountType.Income.toString() ? data.incomes : data.expenses;
          this.incomeAccounts = data.incomes;
          this.expenseAccounts = data.expenses;

          if (this.isTypeSet) {
            this.formGroup.controls.type.setValue(
              this._data.type!.toString(),
              {
                emitEvent: true
              }
            );
          }

          if (this.isParentIdSet) {
            this.formGroup.controls.parentId.setValue(
              this._data.parentId,
              {
                emitEvent: false
              }
            );
          }
        },
        error: () => {
          this.loading = false;
          this.formGroup.enable({
            emitEvent: false
          });
        },
        complete: () => {
          this.loading = false;
          this.formGroup.enable({
            emitEvent: false
          });
        }
      })
    );
    this._subscriptions.push(
      this.formGroup.controls.type.valueChanges.subscribe({
        next: v => {
          this.accounts = v === AccountType.Income.toString() ? this.incomeAccounts : this.expenseAccounts;
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  protected add(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;

    this.loading = true;
    this.formGroup.disable({
      emitEvent: false
    });
    this._dataService.addAccount(
      value.name ?? '',
      value.description ?? '',
      parseInt(
        value.type ?? AccountType.Income.toString(),
        10
      ),
      value.code ?? '',
      value.isGroup ?? false,
      value.parentId === '' ? null : value.parentId ?? ''
    ).subscribe({
      next: res => {
        this.dialogRef.close(
          {
            id: res.id,
            name: value.name,
            description: value.description,
            code: res.code,
            isGroup: value.isGroup ?? false,
            parentId: value.parentId === '' ? null : value.parentId,
            type: parseInt(
              value.type ?? AccountType.Income.toString(),
              10
            )
          } as AddAccountDialogResult
        );
      },
      error: () => {
        this.loading = false;
        this.formGroup.enable({
          emitEvent: false
        });
      },
      complete: () => {
      }
    });
  }

  protected close(): void {
    this.dialogRef.close(undefined);
  }
}
