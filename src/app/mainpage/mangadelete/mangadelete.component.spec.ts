import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangadeleteComponent } from './mangadelete.component';

describe('MangadeleteComponent', () => {
  let component: MangadeleteComponent;
  let fixture: ComponentFixture<MangadeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangadeleteComponent]
    });
    fixture = TestBed.createComponent(MangadeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
