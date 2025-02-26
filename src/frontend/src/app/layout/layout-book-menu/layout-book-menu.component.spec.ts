import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBookMenuComponent } from './layout-book-menu.component';

describe('LayoutBookMenuComponent', () => {
  let component: LayoutBookMenuComponent;
  let fixture: ComponentFixture<LayoutBookMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutBookMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutBookMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
