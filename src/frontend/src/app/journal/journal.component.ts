import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Account, JournalDataService, Transaction } from './journal-data.service';
import { Subscription } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  JournalTransactionAccountSelectComponent
} from './journal-transaction-account-select/journal-transaction-account-select.component';
import {
  JournalTransactionAccountActionsComponent
} from './journal-transaction-account-actions/journal-transaction-account-actions.component';



@Component({
  selector: 'app-journal',
  imports: [
    DatePipe,
    CurrencyPipe,
    ReactiveFormsModule,
    JournalTransactionAccountSelectComponent,
    JournalTransactionAccountActionsComponent
  ],
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss'
})
export class JournalComponent implements OnInit, OnDestroy {
  protected loading = true;
  protected transactions: Transaction[] = [];
  protected accounts: Account[] = [];

  private readonly _dataService = inject(JournalDataService);
  private _subscription?: Subscription;

  public ngOnInit(): void {
    this.loading = true;

    this._subscription = this._dataService.getJournalData().subscribe({
      next: data => {
        this.transactions = data.transactions;
        this.accounts = data.accounts;
      },
      complete: () => this.loading = false,
      error: () => this.loading = false
    });
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  protected deleteTransaction(index: number): void {
    this.transactions.splice(
      index,
      1
    );
  }
}
