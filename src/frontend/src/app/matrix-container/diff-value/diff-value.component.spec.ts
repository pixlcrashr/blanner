import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffValueComponent } from './diff-value.component';

describe('DiffValueComponent', () => {
  let component: DiffValueComponent;
  let fixture: ComponentFixture<DiffValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffValueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiffValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
