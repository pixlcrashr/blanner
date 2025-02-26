import { Observable } from 'rxjs';
import { AccountType } from '../../lib/data/types';



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
  accountId: string;
  name: string;
  code: string;
  depth: number;
  type: AccountType;
  isGroup: boolean;
  parentIndex: number | null;
  budgetValues: RowBudgetValue[];
}

export interface OverviewData {
  budgets: Budget[];
  rows: Row[];
  maxDepth: number;
}

export abstract class OverviewDataService {
  public abstract getOverviewData(): Observable<OverviewData>;
}
