import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTableTargetValueInputComponent } from './overview-table-target-value-input.component';

describe('OverviewTableTargetValueInputComponent', () => {
  let component: OverviewTableTargetValueInputComponent;
  let fixture: ComponentFixture<OverviewTableTargetValueInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewTableTargetValueInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewTableTargetValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
