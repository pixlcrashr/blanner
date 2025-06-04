import { Observable } from 'rxjs';
import { AccountType } from '../../lib/data/types';



export interface Budget {
  id: string;
  name: string;
}

export interface BudgetValue {
  budget: Budget;
  value: number;
}

export interface Row {
  accountId: string;
  name: string;
  code: string;
  fullCodeParts: string[];
  depth: number;
  type: AccountType;
  isGroup: boolean;
  parentIndex: number | null;
  targetValues: BudgetValue[];
  actualValues: BudgetValue[];
  differenceValues: BudgetValue[];
}

export interface OverviewData {
  budgets: Budget[];
  rows: Row[];
  maxDepth: number;
}

export abstract class OverviewDataService {
  public abstract getOverviewData(): Observable<OverviewData>;
}
