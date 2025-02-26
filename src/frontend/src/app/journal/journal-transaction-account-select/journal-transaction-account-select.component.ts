import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account, JournalDataService } from '../journal-data.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-journal-transaction-account-select',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './journal-transaction-account-select.component.html',
  styleUrl: './journal-transaction-account-select.component.scss'
})
export class JournalTransactionAccountSelectComponent implements OnInit, OnChanges, OnDestroy {
  @Input() accounts: Account[] = [];
  @Input() accountId: string = '';
  @Input() transactionId: string = '';
  @Input() isEditable: boolean = false;

  protected isErrored = false;

  protected _formControl = new FormControl<string | null>(
    '',
    [
      Validators.required
    ]
  );

  private _subscription?: Subscription;
  private readonly _dataService = inject(JournalDataService);

  public ngOnInit(): void {
    this._subscription = this._formControl.valueChanges.subscribe({
      next: value => {
        this._formControl.disable({
          emitEvent: false
        });

        this._dataService.changeTransactionAccount(
          this.transactionId,
          value ?? ''
        ).subscribe({
          next: () => {
          },
          complete: () => {
            this.isErrored = false;
            this._formControl.enable({
              emitEvent: false
            });
          },
          error: err => {
            this.isErrored = true;
            this._formControl.enable({
              emitEvent: false
            });
          }
        });
      },
      error: () => {
      },
      complete: () => {
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['accountId']) {
      this._formControl.setValue(
        this.accountId,
        {
          emitEvent: false
        }
      );
    }
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }
}
