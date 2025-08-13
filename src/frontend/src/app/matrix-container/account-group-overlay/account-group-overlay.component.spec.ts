import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountGroupOverlayComponent } from './account-group-overlay.component';

describe('AccountGroupOverlayComponent', () => {
  let component: AccountGroupOverlayComponent;
  let fixture: ComponentFixture<AccountGroupOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountGroupOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountGroupOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
