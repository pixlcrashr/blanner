import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Transaction } from '../import-dialog/import-dialog.component';
import { Account } from '../import-data.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImportTableActionsDataService } from './import-table-actions-data.service';
import { ImportProvider } from '../../../lib/data/types';



@Component({
  selector: 'app-import-table-actions',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './import-table-actions.component.html',
  styleUrl: './import-table-actions.component.scss'
})
export class ImportTableActionsComponent {
  @Input() transaction: Transaction = {
    reference: '',
    description: '',
    debitAccount: '',
    creditAccount: '',
    amount: 0,
    receiptDate: new Date(),
    index: 0
  };
  @Input() accounts: Account[] = [];

  @Output() ignored: EventEmitter<void> = new EventEmitter<void>();
  @Output() booked: EventEmitter<void> = new EventEmitter<void>();

  protected accountSelectControl = new FormControl<string | null>(
    null,
    [
      Validators.required
    ]
  );

  protected isBooking = false;
  protected isIgnoring = false;

  private readonly _dataService = inject(ImportTableActionsDataService);

  protected book(): void {
    if (this.accountSelectControl.invalid) {
      return;
    }

    this.isBooking = true;

    this._dataService.createTransaction(
      this.accountSelectControl.value ?? '',
      this.transaction.amount,
      this.transaction.description,
      this.transaction.receiptDate,
      ImportProvider.Lexware,
      this.transaction.reference
    ).subscribe({
      next: () => {
      },
      complete: () => {
        this.booked.emit();
      },
      error: (err) => {
        this.isBooking = false;
      }
    });
  }

  protected ignore(): void {
    this.isIgnoring = true;

    this._dataService.ignoreImportReference(
      ImportProvider.Lexware,
      this.transaction.reference
    ).subscribe({
      next: () => {
      },
      complete: () => {
        this.ignored.emit();
      },
      error: (err) => {
        this.isIgnoring = false;
      }
    });
  }
}
