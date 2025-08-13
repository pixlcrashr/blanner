import { Injectable, signal, WritableSignal } from '@angular/core';



export enum RightSelectionType {
  Journal
}

export interface RightSelection {
  type: RightSelectionType;
  id: string;
}

export enum LeftSelectionType {
  Budget,
  Account,
  BudgetGroup
}

export interface LeftSelection {
  type: LeftSelectionType;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  /// <summary>
  /// Gets or sets the right selection by the (uu)id of the element. Right selections represent only journal entries.
  /// </summary>
  /// <value>
  /// The right selection. undefined means no selection.
  /// </value>
  public readonly rightSelection: WritableSignal<RightSelection | undefined> = signal(undefined);

  /// <summary>
  /// Gets or sets the left selection by the (uu)id of the element.
  /// </summary>
  /// <value>
  /// The left selection. undefined means no selection.
  /// </value>
  public leftSelection: WritableSignal<LeftSelection | undefined> = signal(undefined);
}
