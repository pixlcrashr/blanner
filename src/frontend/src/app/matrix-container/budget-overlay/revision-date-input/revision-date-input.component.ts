import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-revision-date-input',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './revision-date-input.component.html',
  styleUrl: './revision-date-input.component.scss'
})
export class RevisionDateInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public date?: Date;
  @Output() public dateChange = new EventEmitter<Date>();

  protected readonly formControl = new FormControl<string | null>(
    null,
    []
  );
  private readonly _subscription: Subscription;

  public constructor() {
    this._subscription = this.formControl.valueChanges.subscribe(v => {
      this.dateChange.emit(new Date(v ?? ''));
    });
  }

  public ngOnInit(): void {
    this.formControl.setValue(
      this.date?.toISOString().split('T')[0] ?? null,
      {
        emitEvent: false
      }
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      this.formControl.setValue(
        (changes['date'].currentValue as any as Date).toISOString().split('T')[0] ?? null,
        {
          emitEvent: false
        }
      );
    }
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
