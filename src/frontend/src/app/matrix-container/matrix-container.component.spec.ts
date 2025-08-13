import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixContainerComponent } from './matrix-container.component';

describe('MatrixContainerComponent', () => {
  let component: MatrixContainerComponent;
  let fixture: ComponentFixture<MatrixContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatrixContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
