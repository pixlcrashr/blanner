import { Injectable, signal, WritableSignal } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class OptionService {
  public readonly showAccountDescription: WritableSignal<boolean> = signal(true);
}
