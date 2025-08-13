import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceGroupsContainerComponent } from './balance-groups-container.component';

describe('BalanceGroupsContainerComponent', () => {
  let component: BalanceGroupsContainerComponent;
  let fixture: ComponentFixture<BalanceGroupsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceGroupsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceGroupsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
