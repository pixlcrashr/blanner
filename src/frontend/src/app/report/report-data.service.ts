import { Observable } from 'rxjs';



export interface Budget {
  id: string;
  name: string;
}

export interface RowBudgetValue {
  target: number;
  actual: number;
  diff: number;
}

export interface Row {
  name: string;
  fullCodeParts: string[];
  depth: number;
  budgetValues: RowBudgetValue[];
}

export interface ReportData {
  budgets: Budget[];
  rows: Row[];
  maxDepth: number;
}

export abstract class ReportDataService {
  public abstract getReportData(bookId: string): Observable<ReportData>;
}
