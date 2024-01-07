import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditauthorComponent } from './addeditauthor.component';

describe('AddeditauthorComponent', () => {
  let component: AddeditauthorComponent;
  let fixture: ComponentFixture<AddeditauthorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddeditauthorComponent]
    });
    fixture = TestBed.createComponent(AddeditauthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
