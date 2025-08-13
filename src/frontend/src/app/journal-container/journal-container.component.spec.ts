import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalContainerComponent } from './journal-container.component';

describe('JournalContainerComponent', () => {
  let component: JournalContainerComponent;
  let fixture: ComponentFixture<JournalContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
