import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTreeViewComponent } from './account-tree-view.component';

describe('AccountTreeViewComponent', () => {
  let component: AccountTreeViewComponent;
  let fixture: ComponentFixture<AccountTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTreeViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
