import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTreeComponent } from './overview-tree.component';

describe('OverviewTreeComponent', () => {
  let component: OverviewTreeComponent;
  let fixture: ComponentFixture<OverviewTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverviewTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
