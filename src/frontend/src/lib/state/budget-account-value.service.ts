import { Injectable, signal, WritableSignal } from '@angular/core';
import { Decimal } from 'decimal.js/decimal';



type NestedMap<Keys extends any[], V> =
  Keys extends [infer K, ...infer Rest]
    ? Map<K, NestedMap<Rest, V>>
    : V;

export class MapND<Keys extends any[], V> {
  private _data: NestedMap<Keys, V> = new Map() as NestedMap<Keys, V>;

  set(
    keys: Keys,
    value: V
  ): void {
    let map: any = this._data;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!map.has(keys[i])) {
        map.set(
          keys[i],
          new Map()
        );
      }

      map = map.get(keys[i]);
    }

    map.set(
      keys[keys.length - 1],
      value
    );
  }

  get(keys: Keys): V | undefined {
    let map: any = this._data;

    for (let i = 0; i < keys.length - 1; i++) {
      map = map.get(keys[i]);

      if (!map) {
        return undefined;
      }
    }

    return map.get(keys[keys.length - 1]);
  }

  has(keys: Keys): boolean {
    let map: any = this._data;

    for (let i = 0; i < keys.length - 1; i++) {
      map = map.get(keys[i]);

      if (!map) {
        return false;
      }
    }

    return map.has(keys[keys.length - 1]);
  }

  delete(keys: Keys): boolean {
    let map: any = this._data;

    for (let i = 0; i < keys.length - 1; i++) {
      map = map.get(keys[i]);

      if (!map) {
        return false;
      }
    }

    return map.delete(keys[keys.length - 1]);
  }

  clear(): void {
    (this._data as Map<any, any>).clear();
  }
}

@Injectable({
  providedIn: 'root'
})
export class BudgetAccountTargetValueService {
  private _data: MapND<[string, number, string], WritableSignal<Decimal>> = new MapND();

  public getOrCreate(
    budgetId: string,
    accountId: string,
    revision: number = 0
  ): WritableSignal<Decimal> {
    let v = this._data.get([
      budgetId,
      revision,
      accountId
    ]);
    if (v === undefined) {
      v = signal(new Decimal(0));
      this._data.set(
        [
          budgetId,
          revision,
          accountId
        ],
        v
      );
    }

    return v;
  }

  public set(
    budgetId: string,
    accountId: string,
    value: Decimal,
    revision: number = 0
  ): void {
    revision ??= 0;
    if (revision < 0) {
      throw new Error('revision cannot be negative');
    }

    const v = this._data.get([
      budgetId,
      revision,
      accountId
    ]);

    if (v !== undefined) {
      if (value.eq(v())) {
        return;
      }

      v.set(value);
      return;
    }

    this._data.set(
      [
        budgetId,
        revision,
        accountId
      ],
      signal(value)
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class BudgetAccountActualValueService {
  private _data: MapND<[string, string], WritableSignal<Decimal>> = new MapND();

  public getOrCreate(
    budgetId: string,
    accountId: string
  ): WritableSignal<Decimal> {
    let v = this._data.get([
      budgetId,
      accountId
    ]);
    if (v === undefined) {
      v = signal(new Decimal(0));
      this._data.set(
        [
          budgetId,
          accountId
        ],
        v
      );
    }

    return v;
  }

  public set(
    budgetId: string,
    accountId: string,
    value: Decimal
  ): void {
    const v = this._data.get([
      budgetId,
      accountId
    ]);

    if (v !== undefined) {
      if (value.eq(v())) {
        return;
      }

      v.set(value);
      return;
    }

    this._data.set(
      [
        budgetId,
        accountId
      ],
      signal(value)
    );
  }
}
