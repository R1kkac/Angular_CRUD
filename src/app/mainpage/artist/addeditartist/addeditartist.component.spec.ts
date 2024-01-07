import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditartistComponent } from './addeditartist.component';

describe('AddeditartistComponent', () => {
  let component: AddeditartistComponent;
  let fixture: ComponentFixture<AddeditartistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddeditartistComponent]
    });
    fixture = TestBed.createComponent(AddeditartistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
