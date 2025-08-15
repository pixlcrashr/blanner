import { Component, inject, Signal } from '@angular/core';
import { OptionService } from '../matrix-container/option.service';



@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly _optionService = inject(OptionService);
  protected readonly showAccountDescription: Signal<boolean> = this._optionService.showAccountDescription.asReadonly();

  protected toggleAccountDescription(): void {
    this._optionService.showAccountDescription.update(v => !v);
  }
}
