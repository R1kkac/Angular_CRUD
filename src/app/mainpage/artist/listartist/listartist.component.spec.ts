import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListartistComponent } from './listartist.component';

describe('ListartistComponent', () => {
  let component: ListartistComponent;
  let fixture: ComponentFixture<ListartistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListartistComponent]
    });
    fixture = TestBed.createComponent(ListartistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
