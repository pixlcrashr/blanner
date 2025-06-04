import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Budget, Row } from '../overview-data.service';



@Component({
  selector: 'app-overview-print',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './overview-print.component.html',
  styleUrl: './overview-print.component.scss'
})
export class OverviewPrintComponent implements OnInit, OnChanges {
  @Input()
  public budgets: Budget[] = [];
  @Input()
  public rows: Row[] = [];
  @Input()
  public maxDepth = 0;

  protected budgetValuesColspan = 1;
  protected showActual = false;
  protected showDifference = false;
  protected codeColspan: number = 0;
  protected codeColspanValues: string[] = [];

  ngOnInit(): void {
    this.codeColspan = this.maxDepth;
    this.codeColspanValues = new Array(this.maxDepth).fill('0');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
}
