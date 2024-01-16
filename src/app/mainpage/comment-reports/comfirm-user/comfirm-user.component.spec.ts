import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmUserComponent } from './comfirm-user.component';

describe('ComfirmUserComponent', () => {
  let component: ComfirmUserComponent;
  let fixture: ComponentFixture<ComfirmUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComfirmUserComponent]
    });
    fixture = TestBed.createComponent(ComfirmUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
