import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionDateInputComponent } from './revision-date-input.component';

describe('RevisionDateInputComponent', () => {
  let component: RevisionDateInputComponent;
  let fixture: ComponentFixture<RevisionDateInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisionDateInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisionDateInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
