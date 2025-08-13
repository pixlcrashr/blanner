import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';



export class Revision {
  public readonly date: WritableSignal<Date>;
  public readonly description: WritableSignal<string>;
  public readonly isVisible: WritableSignal<boolean>;

  public constructor(
    date: Date,
    description: string,
    isVisible: boolean = true
  ) {
    this.description = signal(description);
    this.date = signal(date);
    this.isVisible = signal(isVisible);
  }
}

export class Budget {
  public constructor(
    name: string,
    isVisible: boolean,
    revisions: Revision[] = [],
    showActual: boolean = false,
    showTarget: boolean = false,
    showDifference: boolean = false,
    public readonly id: string = uuidv4()
  ) {
    this.name = signal(name);
    this.isVisible = signal(isVisible);
    this.showActual = signal(showActual);
    this.showTarget = signal(showTarget);
    this.showDifference = signal(showDifference);
    this._revisions = signal(revisions ?? []);
    this.visibleRevisions = computed(() => {
      return this._revisions().filter(r => r.isVisible());
    });
  }

  public readonly name: WritableSignal<string>;
  public readonly isVisible: WritableSignal<boolean>;
  public readonly showActual: WritableSignal<boolean>;
  public readonly showTarget: WritableSignal<boolean>;
  public readonly showDifference: WritableSignal<boolean>;

  private readonly _revisions: WritableSignal<Revision[]>;
  public get revisions(): Signal<Revision[]> {
    return this._revisions.asReadonly();
  }

  public readonly visibleRevisions: Signal<Revision[]>;

  public addRevision(
    date: Date,
    description: string,
    isVisible: boolean = true
  ): void {
    this._revisions.update(revisions => [...revisions, new Revision(
      date,
      description,
      isVisible
    )]);
  }

  public removeLastRevision(): void {
    this._revisions.update(revisions => revisions.slice(
      0,
      revisions.length - 1
    ));
  }
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private _budgetMap: Map<string, Budget> = new Map();
  private readonly _budgetsSignal: WritableSignal<Budget[]> = signal([]);

  public get budgets(): Signal<Budget[]> {
    return this._budgetsSignal;
  }

  constructor() {
    let b = this.addBudget(
      'HH 24/25',
      true
    );
    b.addRevision(
      new Date(
        2022,
        10,
        1
      ),
      ''
    );
    b.addRevision(
      new Date(
        2022,
        10,
        5
      ),
      ''
    );
    b.addRevision(
      new Date(
        2022,
        10,
        9
      ),
      ''
    );

    this.addBudget(
      'NHH 24/25',
      true
    );
    this.addBudget(
      'HH 25/26',
      true
    );
    this.addBudget(
      'NHH 25/26',
      true
    );
    this.addBudget(
      'HH 25/26',
      true
    );
    this.addBudget(
      'NHH 25/26',
      true
    );
    this.addBudget(
      'HH 25/26',
      true
    );
    this.addBudget(
      'NHH 25/26',
      true
    );
  }

  public addBudget(
    name: string,
    isVisible: boolean
  ): Budget {
    const budget = new Budget(
      name,
      isVisible,
      [new Revision(
        new Date(),
        ''
      )],
      true,
      true,
      false
    );

    this._budgetMap.set(
      budget.id,
      budget
    );
    this._budgetsSignal.update(budgets => {
      return [...budgets, budget];
    });

    return budget;
  }

  public removeBudget(id: string): void {
    this._budgetMap.delete(id);
    this._budgetsSignal.update(budgets => {
      return budgets.filter(b => b.id !== id);
    });
  }

  public getBudget(id: string): Budget | null {
    return this._budgetMap.get(id) ?? null;
  }
}
