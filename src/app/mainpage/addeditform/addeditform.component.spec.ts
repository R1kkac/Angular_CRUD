import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditformComponent } from './addeditform.component';

describe('AddeditformComponent', () => {
  let component: AddeditformComponent;
  let fixture: ComponentFixture<AddeditformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddeditformComponent]
    });
    fixture = TestBed.createComponent(AddeditformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
