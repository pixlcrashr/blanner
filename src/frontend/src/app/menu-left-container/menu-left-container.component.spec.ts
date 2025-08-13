import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLeftContainerComponent } from './menu-left-container.component';

describe('MenuLeftContainerComponent', () => {
  let component: MenuLeftContainerComponent;
  let fixture: ComponentFixture<MenuLeftContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuLeftContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuLeftContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
