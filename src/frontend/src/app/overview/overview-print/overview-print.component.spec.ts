import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewPrintComponent } from './overview-print.component';



describe(
  'OverviewPrintComponent',
  () => {
    let component: OverviewPrintComponent;
    let fixture: ComponentFixture<OverviewPrintComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [OverviewPrintComponent]
      })
        .compileComponents();

      fixture = TestBed.createComponent(OverviewPrintComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it(
      'should create',
      () => {
        expect(component).toBeTruthy();
      }
    );
  }
);
