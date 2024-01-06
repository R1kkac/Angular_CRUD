import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListtypeComponent } from './listtype.component';

describe('ListtypeComponent', () => {
  let component: ListtypeComponent;
  let fixture: ComponentFixture<ListtypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListtypeComponent]
    });
    fixture = TestBed.createComponent(ListtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
