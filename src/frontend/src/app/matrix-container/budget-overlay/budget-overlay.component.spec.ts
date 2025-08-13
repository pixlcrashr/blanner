import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetOverlayComponent } from './budget-overlay.component';

describe('BudgetOverlayComponent', () => {
  let component: BudgetOverlayComponent;
  let fixture: ComponentFixture<BudgetOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
