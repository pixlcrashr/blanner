import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetGroupValueComponent } from './target-group-value.component';

describe('TargetGroupValueComponent', () => {
  let component: TargetGroupValueComponent;
  let fixture: ComponentFixture<TargetGroupValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TargetGroupValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetGroupValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
