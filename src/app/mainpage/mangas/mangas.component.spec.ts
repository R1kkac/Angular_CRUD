import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangasComponent } from './mangas.component';

describe('MangasComponent', () => {
  let component: MangasComponent;
  let fixture: ComponentFixture<MangasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangasComponent]
    });
    fixture = TestBed.createComponent(MangasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
