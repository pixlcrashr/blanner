import { Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../../../lib/state/account.service';
import { SelectionService } from '../../../lib/state/selection.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-account-overlay',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './account-overlay.component.html',
  styleUrl: './account-overlay.component.scss'
})
export class AccountOverlayComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public data?: Account;

  protected formGroup = inject(FormBuilder).group({
    title: ['', [Validators.required]],
    description: [''],
    isVisible: [false, [Validators.required]]
  });

  public ngOnInit(): void {
    if (this.data) {
      this.updateFormData(this.data);
    }

    this._subscription = this.formGroup.valueChanges.subscribe(v => {
      this.data?.title.set(v.title ?? '');
      this.data?.isVisible.set(v.isVisible ?? false);
      this.data?.description.set(v.description ?? '');
    });
  }

  private updateFormData(data: Account): void {
    this.formGroup.setValue(
      {
        title: data.title(),
        description: data.description(),
        isVisible: data.isVisible()
      },
      {
        emitEvent: false
      }
    );
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

  private readonly _selectionService = inject(SelectionService);
  private _subscription?: Subscription;

  protected close(): void {
    this._selectionService.leftSelection.set(undefined);
  }
}
