import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddBudgetDialogResult } from '../add-budget-dialog/add-budget-dialog.component';
import { AddBookDialogDataService } from './add-book-dialog-data.service';
import { DialogRef } from '@angular/cdk/dialog';



export interface AddBookDialogData {

}

export interface AddBookDialogResult {
  id: string;
  name: string;
}

@Component({
  selector: 'app-add-book-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-book-dialog.component.html',
  styleUrl: './add-book-dialog.component.scss'
})
export class AddBookDialogComponent {
  protected loading = false;
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
    startMonth: new FormControl<number | null>(
      1,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(12)
      ]
    )
  });
  protected readonly dialogRef = inject<DialogRef<AddBookDialogData, AddBookDialogComponent>>(DialogRef<AddBookDialogData, AddBookDialogComponent>);

  private readonly _dataService = inject(AddBookDialogDataService);

  protected add(): void {
    if (this.formGroup.invalid) {
      return;
    }

    const value = this.formGroup.value;

    this.loading = true;
    this.formGroup.disable({
      emitEvent: false
    });
    this._dataService.addBook(
      value.name ?? '',
      value.description ?? '',
      value.startMonth ?? 1
    ).subscribe({
      next: res => {
        this.dialogRef.close(
          {
            id: res.id,
            name: value.name
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
