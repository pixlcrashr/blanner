import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Budget } from '../../../lib/state/budget.service';
import { SelectionService } from '../../../lib/state/selection.service';
import { RevisionDateInputComponent } from './revision-date-input/revision-date-input.component';



@Component({
  selector: 'app-budget-overlay',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RevisionDateInputComponent
  ],
  templateUrl: './budget-overlay.component.html',
  styleUrl: './budget-overlay.component.scss'
})
export class BudgetOverlayComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public data?: Budget;

  protected formGroup = inject(FormBuilder).group({
    name: ['', [Validators.required]],
    isVisible: [false, [Validators.required]],
    showTarget: [false, [Validators.required]],
    showActual: [false, [Validators.required]],
    showDifference: [false, [Validators.required]]
  });

  private _subscription?: Subscription;
  private readonly _selectionService = inject(SelectionService);

  public ngOnInit(): void {
    if (this.data) {

      this.updateFormData(this.data);
    }

    this._subscription = this.formGroup.valueChanges.subscribe(v => {
      this.data?.name.set(v.name ?? '');
      this.data?.isVisible.set(v.isVisible ?? false);
      this.data?.showTarget.set(v.showTarget ?? false);
      this.data?.showActual.set(v.showActual ?? false);
      this.data?.showDifference.set(v.showDifference ?? false);
    });
  }

  public ngOnChanges(c: SimpleChanges): void {
    if (this.data) {
      this.updateFormData(this.data);
    } else {
      this.formGroup.reset();
    }
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  protected close(): void {
    this._selectionService.leftSelection.set(undefined);
  }

  private updateFormData(data: Budget): void {
    this.formGroup.setValue(
      {
        name: data.name(),
        isVisible: data.isVisible(),
        showTarget: data.showTarget(),
        showActual: data.showActual(),
        showDifference: data.showDifference()
      },
      {
        emitEvent: false
      }
    );
  }

  protected addRevision(): void {
    this.data?.addRevision(
      new Date(),
      ''
    );
  }

  protected removeLastRevision(): void {
    this.data?.removeLastRevision();
  }
}
