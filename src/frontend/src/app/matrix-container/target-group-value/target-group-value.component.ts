import { Component, Input, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Account } from '../../../lib/state/account.service';



@Component({
  selector: 'app-target-group-value',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './target-group-value.component.html',
  styleUrl: './target-group-value.component.scss'
})
export class TargetGroupValueComponent implements OnInit {
  @Input() public budgetId: string = '';
  @Input() public children: Signal<Account[]> = signal([]);

  protected readonly value: WritableSignal<number> = signal(0);

  ngOnInit(): void {
  }
}
