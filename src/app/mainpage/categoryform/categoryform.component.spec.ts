import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryformComponent } from './categoryform.component';

describe('CategoryformComponent', () => {
  let component: CategoryformComponent;
  let fixture: ComponentFixture<CategoryformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryformComponent]
    });
    fixture = TestBed.createComponent(CategoryformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
