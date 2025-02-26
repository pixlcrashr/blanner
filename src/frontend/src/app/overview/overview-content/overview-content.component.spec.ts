import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewContentComponent } from './overview-content.component';

describe('OverviewContentComponent', () => {
  let component: OverviewContentComponent;
  let fixture: ComponentFixture<OverviewContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
