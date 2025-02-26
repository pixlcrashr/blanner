import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Budget, Row } from '../overview-data.service';
import {
  OverviewTableTargetValueChange,
  OverviewTableTargetValueInputComponent
} from './overview-table-target-value-input/overview-table-target-value-input.component';
import {
  OverviewTableAccountNameInputComponent
} from './overview-table-account-name-input/overview-table-account-name-input.component';
import { AccountType } from '../../../lib/data/types';



export interface AccountAddedEvent {
  type: AccountType;
  parentId: string;
}

@Component({
  selector: 'app-overview-table',
  imports: [
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    OverviewTableTargetValueInputComponent,
    OverviewTableAccountNameInputComponent
  ],
  templateUrl: './overview-table.component.html',
  styleUrl: './overview-table.component.scss'
})
export class OverviewTableComponent implements OnChanges {
  protected budgetColspan = 0;
  protected codeColspan = 1;
  protected codeColspanValues: string[] = [];
  protected unassignedValues: number[] = [];

  @Input() showTargetValues: boolean = false;
  @Input() showActualValues: boolean = false;
  @Input() showDiffValues: boolean = false;
  @Input() colorMode: boolean = false;
  @Input() maxDepth: number = 0;

  @Input() budgets: Budget[] = [];
  @Input() rows: Row[] = [];

  @Output() accountAdded: EventEmitter<AccountAddedEvent> = new EventEmitter<AccountAddedEvent>();

  protected targetValuesFormArray: FormArray<FormArray<FormControl<number | null>>> = new FormArray<FormArray<FormControl<number | null>>>([]);

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['showTargetValues'] || changes['showActualValues'] || changes['showDiffValues']) {
      this.updateBudgetColspan();
    }

    if (changes['budgets'] || changes['rows'] || changes['maxDepth']) {
      this.updateUnassignedValuesAndColspan();
      this.updateFormArray();
    }
  }

  private updateUnassignedValuesAndColspan(): void {
    const uA: number[] = new Array(this.budgets.length).fill(0);
    this.budgets.map((
      _,
      i
    ) => {
      uA[i] = this.rows.reduce(
        (
          p,
          c
        ) => p + (c.parentIndex === null ? (c.type === AccountType.Income ? 1 : -1) * c.budgetValues[i].target : 0),
        0
      );
    });

    this.unassignedValues = uA;
    this.codeColspan = this.maxDepth;
    this.codeColspanValues = new Array(this.maxDepth).fill('0');
  }

  protected targetValueChanged(e: OverviewTableTargetValueChange): void {
    const r = this.rows.find(r => r.accountId === e.accountId);
    if (!r) {
      return;
    }

    const bv = r.budgetValues[e.budgetIndex];
    if (!bv) {
      return;
    }

    const valueChange = e.value - bv.target;
    bv.target = e.value;
    bv.diff = bv.target - bv.actual;

    if (r.parentIndex !== null) {
      this.updateParentValuesRecursively(
        r.parentIndex,
        valueChange,
        e.budgetIndex
      );
    }

    this.updateUnassignedValuesAndColspan();
  }

  private updateParentValuesRecursively(
    parentIndex: number,
    valueChange: number,
    budgetIndex: number
  ): void {
    const r = this.rows[parentIndex];

    const bv = r.budgetValues[budgetIndex];
    if (bv) {
      bv.target += valueChange;
      bv.diff = bv.target - bv.actual;
    }

    if (r.parentIndex !== null) {
      this.updateParentValuesRecursively(
        r.parentIndex,
        valueChange,
        budgetIndex
      );
    }
  }

  private updateBudgetColspan(): void {
    this.budgetColspan = 0;

    if (this.showTargetValues) {
      this.budgetColspan++;
    }

    if (this.showActualValues) {
      this.budgetColspan++;
    }

    if (this.showDiffValues) {
      this.budgetColspan++;
    }
  }

  private updateFormArray(): void {
    const rowsHeight = this.rows.length;
    const rowsWidth = this.budgets.length;

    const rowsHeightDiff = this.targetValuesFormArray.controls.length - rowsHeight;

    if (rowsHeightDiff > 0) {
      this.targetValuesFormArray.controls.splice(
        rowsHeight - 1,
        rowsHeightDiff
      );
    } else if (rowsHeightDiff < 0) {
      const toAdd = new Array(-rowsHeightDiff)
        .fill(0)
        .map(
          () => new FormArray<FormControl<number | null>>(
            new Array(rowsWidth).fill(0).map(() => new FormControl<number | null>(0))
          )
        );

      this.targetValuesFormArray.controls.push(...toAdd);
    }

    this.targetValuesFormArray.controls.forEach((
      arr,
      i
    ) => {
      const rowsWidthDiff = arr.length - rowsWidth;

      if (rowsWidthDiff > 0) {
        arr.controls.splice(
          rowsWidth - 1,
          rowsWidthDiff
        );
      } else if (rowsWidthDiff < 0) {
        const toAdd = new Array(-rowsWidthDiff)
          .fill(0)
          .map(
            (
              _,
              j
            ) => new FormControl<number | null>(this.rows[i].budgetValues[arr.length + j].target)
          );

        arr.controls.push(...toAdd);
      } else {
        arr.controls.forEach((
          control,
          j
        ) => {
          control.setValue(
            this.rows[i].budgetValues[j].target,
            {
              emitEvent: false
            }
          );
        });
      }
    });
  }

  protected addAccount(
    type: AccountType,
    parentId: string
  ): void {
    this.accountAdded.emit({
      type,
      parentId
    });
  }

  protected readonly AccountType = AccountType;
}
