import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTransactionAccountActionsComponent } from './journal-transaction-account-actions.component';

describe('JournalTransactionAccountActionsComponent', () => {
  let component: JournalTransactionAccountActionsComponent;
  let fixture: ComponentFixture<JournalTransactionAccountActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalTransactionAccountActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalTransactionAccountActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
