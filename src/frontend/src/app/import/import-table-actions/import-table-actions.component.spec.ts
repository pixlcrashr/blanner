import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTableActionsComponent } from './import-table-actions.component';

describe('ImportTableActionsComponent', () => {
  let component: ImportTableActionsComponent;
  let fixture: ComponentFixture<ImportTableActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTableActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportTableActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
