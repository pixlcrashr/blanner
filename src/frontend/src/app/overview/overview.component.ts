import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { concatMap, Subscription, tap } from 'rxjs';
import { Budget, OverviewDataService, Row } from './overview-data.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  AddAccountDialogComponent,
  AddAccountDialogData,
  AddAccountDialogResult
} from '../add-account-dialog/add-account-dialog.component';
import {
  AddBudgetDialogComponent,
  AddBudgetDialogData,
  AddBudgetDialogResult
} from '../add-budget-dialog/add-budget-dialog.component';
import { OverviewContentComponent } from './overview-content/overview-content.component';
import { CurrentBookService } from '../../lib/book/current-book.service';
import { AccountType } from '../../lib/data/types';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';



export enum ViewType {
  Table,
  Tree
}

@Component({
  selector: 'app-overview',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    OverviewContentComponent,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit, OnDestroy {
  protected readonly ViewType = ViewType;

  protected loading = true;
  protected rows: Row[] = [];
  protected budgets: Budget[] = [];
  protected maxDepth: number = 0;

  protected filterFormGroup = new FormGroup({
    showActual: new FormControl(false),
    showDifference: new FormControl(false)
  });
  protected selectedBudgetsFormArray: FormArray<FormControl<boolean | null>> = new FormArray<FormControl<boolean | null>>([]);

  private readonly _dialog = inject(Dialog);
  private readonly _subscriptions: Subscription[] = [];
  private readonly _dataService = inject(OverviewDataService);
  protected readonly currentBookService = inject(CurrentBookService);

  public ngOnInit() {
    this._subscriptions.push(
      this.currentBookService.currentBook$.pipe(
        tap(() => this.loading = true),
        concatMap(() => this._dataService.getOverviewData())
      ).subscribe({
        next: data => {
          this.selectedBudgetsFormArray.clear();
          data.budgets.forEach((
            _,
            i
          ) => {
            this.selectedBudgetsFormArray.controls.push(
              new FormControl<boolean | null>(true)
            );
          });

          this.budgets = data.budgets;
          this.rows = data.rows;
          this.maxDepth = data.maxDepth;
          this.loading = false;
        },
        error: () => this.loading = false
      })
    );
  }

  public ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  protected openAddAccountDialog(
    type?: AccountType,
    parentId?: string
  ): void {
    const ref = this._dialog.open<AddAccountDialogResult, AddAccountDialogData, AddAccountDialogComponent>(
      AddAccountDialogComponent,
      {
        data: {
          type: type ?? null,
          parentId: parentId ?? null
        }
      }
    );
    ref.closed.subscribe({
      next: data => {
        if (!data) {
          return;
        }

        this._dataService.getOverviewData().subscribe({
          next: data => {
            this.selectedBudgetsFormArray.clear();
            data.budgets.forEach((
              _,
              i
            ) => {
              this.selectedBudgetsFormArray.controls.push(
                new FormControl<boolean | null>(true)
              );
            });

            this.budgets = data.budgets;
            this.rows = data.rows;
            this.maxDepth = data.maxDepth;
            this.loading = false;
          },
          error: () => this.loading = false
        });
      }
    });
  }

  protected openAddBudgetDialog(): void {
    const ref = this._dialog.open<AddBudgetDialogResult, AddBudgetDialogData, AddBudgetDialogComponent>(
      AddBudgetDialogComponent,
      {}
    );
    ref.closed.subscribe({
      next: data => {
        if (!data) {
          return;
        }

        // TODO: add dynamic insert
      }
    });
  }

}
