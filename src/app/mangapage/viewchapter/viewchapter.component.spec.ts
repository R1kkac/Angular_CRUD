import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewchapterComponent } from './viewchapter.component';

describe('ViewchapterComponent', () => {
  let component: ViewchapterComponent;
  let fixture: ComponentFixture<ViewchapterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewchapterComponent]
    });
    fixture = TestBed.createComponent(ViewchapterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
