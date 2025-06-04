import { Component, inject, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  ImportDialogComponent,
  ImportDialogData,
  ImportDialogResult,
  Transaction
} from './import-dialog/import-dialog.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ImportTableActionsComponent } from './import-table-actions/import-table-actions.component';
import { Account, ImportDataService } from './import-data.service';



@Component({
  selector: 'app-import',
  imports: [
    DatePipe,
    CurrencyPipe,
    ImportTableActionsComponent
  ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent implements OnInit {
  protected transactions: Transaction[] = [];
  protected accounts: Account[] = [];
  private readonly _dialog = inject(Dialog);
  private readonly _dataService = inject(ImportDataService);

  public openImportDialog(): void {
    const ref = this._dialog.open<ImportDialogResult, ImportDialogData, ImportDialogComponent>(
      ImportDialogComponent,
      {}
    );
    ref.closed.subscribe({
        next: data => {
          if (!data) {
            return;
          }

          this.transactions = data.transactions;
        }
      }
    );
  }

  public ngOnInit(): void {
    this._dataService.getAccounts().subscribe({
      next: res => {
        this.accounts = res;
        this.accounts.sort((
          a,
          b
        ) => {
          if (a.type === b.type) {
            if (a.depth === b.depth) {
              return a.name.localeCompare(b.name);
            }

            return a.depth - b.depth;
          }

          return a.type - b.type;
        });
      },
      complete: () => {
      },
      error: () => {
      }
    });
  }

  protected removeTransaction(index: number): void {
    this.transactions.splice(
      index,
      1
    );
  }
}
