import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionIconButtonComponent } from './section-icon-button.component';

describe('SectionIconButtonComponent', () => {
  let component: SectionIconButtonComponent;
  let fixture: ComponentFixture<SectionIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionIconButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
