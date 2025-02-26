import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalTransactionAccountSelectComponent } from './journal-transaction-account-select.component';

describe('JournalTransactionAccountSelectComponent', () => {
  let component: JournalTransactionAccountSelectComponent;
  let fixture: ComponentFixture<JournalTransactionAccountSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalTransactionAccountSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalTransactionAccountSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
