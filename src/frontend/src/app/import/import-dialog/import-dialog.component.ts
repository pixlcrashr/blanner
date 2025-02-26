import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { ImportDialogDataService } from './import-dialog-data.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';



export interface Transaction {
  index: number;
  description: string;
  reference: string;
  receiptDate: Date;
  amount: number;
  debitAccount: string;
  creditAccount: string;
}

export interface ImportDialogData {

}

export interface ImportDialogResult {
  transactions: Transaction[];
}

@Component({
  selector: 'app-import-dialog',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './import-dialog.component.html',
  styleUrl: './import-dialog.component.scss'
})
export class ImportDialogComponent {
  protected readonly dialogRef = inject<DialogRef<ImportDialogData, ImportDialogComponent>>(DialogRef<ImportDialogData, ImportDialogComponent>);
  private readonly _dataService = inject(ImportDialogDataService);

  protected loading = false;
  protected selectedFile?: File;

  protected readonly formGroup = new FormGroup({
    type: new FormControl<number | null>(
      0,
      [
        Validators.required
      ]
    )
  });

  protected onFileSelected(e: Event): void {
    this.selectedFile = (e.target as HTMLInputElement)?.files?.[0] ?? undefined;
  }

  protected import(): void {
    if (!this.selectedFile || this.formGroup.invalid) {
      return;
    }

    this.loading = true;
    this.formGroup.disable();
    this._dataService.getLexwareTransactions(this.selectedFile).subscribe({
      next: data => {
        this.dialogRef.close({
          transactions: data
        } as ImportDialogResult);
      },
      error: err => {
        this.selectedFile = undefined;
        this.loading = false;
        this.formGroup.enable();
      },
      complete: () => {
      }
    });
  }

  protected close(): void {
    this.dialogRef.close(undefined);
  }
}
