import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRightContainerComponent } from './menu-right-container.component';

describe('MenuRightContainerComponent', () => {
  let component: MenuRightContainerComponent;
  let fixture: ComponentFixture<MenuRightContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuRightContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuRightContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
