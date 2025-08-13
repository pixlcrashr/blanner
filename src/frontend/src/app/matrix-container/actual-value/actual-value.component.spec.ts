import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualValueComponent } from './actual-value.component';

describe('ActualValueComponent', () => {
  let component: ActualValueComponent;
  let fixture: ComponentFixture<ActualValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
