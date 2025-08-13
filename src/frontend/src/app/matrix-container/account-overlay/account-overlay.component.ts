import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Account } from '../../../lib/state/account.service';
import { SelectionService } from '../../../lib/state/selection.service';



@Component({
  selector: 'app-account-overlay',
  imports: [
    FormsModule
  ],
  templateUrl: './account-overlay.component.html',
  styleUrl: './account-overlay.component.scss'
})
export class AccountOverlayComponent {
  @Input() public data?: Account;

  private readonly _selectionService = inject(SelectionService);

  protected close(): void {
    this._selectionService.leftSelection.set(undefined);
  }
}
