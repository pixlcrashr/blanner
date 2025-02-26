import { Component, inject, OnInit } from '@angular/core';
import { Budget, ReportDataService, Row } from './report-data.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';



@Component({
  selector: 'app-report',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  private readonly _dataService = inject(ReportDataService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  protected budgets: Budget[] = [];
  protected rows: Row[] = [];
  protected budgetValuesColspan = 1;
  protected showActual = false;
  protected showDifference = false;
  protected codeColspan: number = 0;
  protected codeColspanValues: string[] = [];

  ngOnInit(): void {
    const bookId = this._activatedRoute.snapshot.queryParamMap.get('book_id');
    if (!bookId) {
      return;
    }

    this._dataService.getReportData(bookId).subscribe({
      next: data => {
        this.budgets = data.budgets;
        this.rows = data.rows;
        this.codeColspan = data.maxDepth;
        this.codeColspanValues = new Array(data.maxDepth).fill('0');
        console.log(data);
      }
    });
  }
}
