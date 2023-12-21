import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserfollowingComponent } from './userfollowing.component';

describe('UserfollowingComponent', () => {
  let component: UserfollowingComponent;
  let fixture: ComponentFixture<UserfollowingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserfollowingComponent]
    });
    fixture = TestBed.createComponent(UserfollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
