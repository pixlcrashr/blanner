import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTableAccountNameInputComponent } from './overview-table-account-name-input.component';

describe('OverviewTableAccountNameInputComponent', () => {
  let component: OverviewTableAccountNameInputComponent;
  let fixture: ComponentFixture<OverviewTableAccountNameInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewTableAccountNameInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewTableAccountNameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
