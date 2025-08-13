import { Directive, Input, OnChanges, OnDestroy, SimpleChanges, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';



@Directive({
  selector: '[appSignalFormControl]'
})
export class SignalFormControlDirective implements OnChanges, OnDestroy {
  @Input() signal?: WritableSignal<any>;
  @Input() formControl?: FormControl<any>;

  private _subscription?: Subscription;

  public ngOnChanges(c: SimpleChanges): void {
    if (c['signal']) {
      this.updateFormControl(
        c['signal'].currentValue,
        this.formControl
      );
    }

    if (c['formControl']) {
      this._subscription?.unsubscribe();
      this.subscribeFormControl(c['formControl'].currentValue);
      this.updateFormControl(
        this.signal,
        c['formControl'].currentValue
      );
    }
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private subscribeFormControl(fC: FormControl<any>): void {
    this._subscription = this.formControl?.valueChanges.subscribe(() => {
      this.signal?.set(this.formControl?.value);
    });
  }

  private updateFormControl(
    s?: WritableSignal<any>,
    fC?: FormControl<any>
  ): void {
    if (s) {
      fC?.setValue(
        s(),
        { emitEvent: false }
      );
    }
  }
}
