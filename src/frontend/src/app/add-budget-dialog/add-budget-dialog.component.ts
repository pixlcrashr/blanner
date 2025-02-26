import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddBudgetDialogDataService } from './add-budget-dialog-data.service';



export interface AddBudgetDialogData {

}

export interface AddBudgetDialogResult {
  id: string;
  name: string;
  description: string;
  year: number;
}

@Component({
  selector: 'app-add-budget-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-budget-dialog.component.html',
  styleUrl: './add-budget-dialog.component.scss'
})
export class AddBudgetDialogComponent {
  protected loading = false;
  protected readonly dialogRef = inject<DialogRef<AddBudgetDialogData, AddBudgetDialogComponent>>(DialogRef<AddBudgetDialogData, AddBudgetDialogComponent>);
  protected readonly data = inject(DIALOG_DATA);

  protected readonly formGroup = new FormGroup({
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
    year: new FormControl<number | null>(
      new Date().getFullYear(),
      [
        Validators.required,
        Validators.minLength(1)
      ]
    )
  });

  private readonly _dataService = inject(AddBudgetDialogDataService);

  protected add(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;

    this.loading = true;
    this.formGroup.disable({
      emitEvent: false
    });
    this._dataService.addBudget(
      value.name ?? '',
      value.description ?? '',
      value.year ?? new Date().getFullYear()
    ).subscribe({
      next: res => {
        this.dialogRef.close(
          {
            id: res.id,
            name: value.name,
            description: value.description,
            year: value.year
          } as AddBudgetDialogResult
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
