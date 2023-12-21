import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInfoUserComponent } from './update-info-user.component';

describe('UpdateInfoUserComponent', () => {
  let component: UpdateInfoUserComponent;
  let fixture: ComponentFixture<UpdateInfoUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateInfoUserComponent]
    });
    fixture = TestBed.createComponent(UpdateInfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
