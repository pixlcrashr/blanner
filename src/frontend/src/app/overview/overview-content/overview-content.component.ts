import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountAddedEvent, OverviewTableComponent } from '../overview-table/overview-table.component';
import { OverviewTreeComponent } from '../overview-tree/overview-tree.component';
import { Budget, Row } from '../overview-data.service';
import { ViewType } from '../overview.component';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-overview-content',
  imports: [
    FormsModule,
    OverviewTableComponent,
    OverviewTreeComponent,
    ReactiveFormsModule
  ],
  templateUrl: './overview-content.component.html',
  styleUrl: './overview-content.component.scss'
})
export class OverviewContentComponent implements OnInit, OnChanges, OnDestroy {
  @Input() budgets: Budget[] = [];
  @Input() rows: Row[] = [];
  @Input() maxDepth: number = 0;
  @Input() showActualValues: boolean = false;
  @Input() showDiffValues: boolean = false;

  @Output() accountAdded: EventEmitter<AccountAddedEvent> = new EventEmitter<AccountAddedEvent>();

  protected colorMode: boolean = false;
  protected selectedBudgets: Budget[] = [];
  protected selectedBudgetsFormArray: FormArray<FormControl<boolean | null>> = new FormArray<FormControl<boolean | null>>([]);
  protected readonly ViewType = ViewType;
  protected viewType: ViewType = ViewType.Table;

  private _subscription?: Subscription;

  public ngOnInit(): void {
    this._subscription = this.selectedBudgetsFormArray.valueChanges.subscribe({
      next: values => {
        this.updateSelectedBudgets(values);
      },
      error: () => {
      },
      complete: () => {
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['budgets']) {
      this.selectedBudgetsFormArray.clear();
      this.budgets.forEach((
        _,
        i
      ) => {
        this.selectedBudgetsFormArray.push(
          new FormControl<boolean | null>(true)
        );
      });
      this.updateSelectedBudgets(this.selectedBudgetsFormArray.value);
    }
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private updateSelectedBudgets(values: (boolean | null)[]): void {
    this.selectedBudgets = this.budgets.filter((
      _,
      i
    ) => {
      return values[i] ?? false;
    });
  }
}
