import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOverlayComponent } from './account-overlay.component';

describe('AccountOverlayComponent', () => {
  let component: AccountOverlayComponent;
  let fixture: ComponentFixture<AccountOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
