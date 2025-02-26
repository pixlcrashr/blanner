import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { JournalDataService } from '../journal-data.service';



export interface TransactionDeleted {
  transactionId: string;
}

@Component({
  selector: 'app-journal-transaction-account-actions',
  imports: [],
  templateUrl: './journal-transaction-account-actions.component.html',
  styleUrl: './journal-transaction-account-actions.component.scss'
})
export class JournalTransactionAccountActionsComponent {
  @Input() transactionId: string = '';
  @Input() isDeletable: boolean = false;
  @Output() deleted: EventEmitter<TransactionDeleted> = new EventEmitter<TransactionDeleted>();

  protected loading: boolean = false;

  private readonly _dataService = inject(JournalDataService);

  protected deleteTransaction(): void {
    this.loading = true;
    this._dataService.deleteTransaction(this.transactionId).subscribe({
      next: () => {
        this.deleted.emit({
          transactionId: this.transactionId
        });
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
      }
    });
  }
}
