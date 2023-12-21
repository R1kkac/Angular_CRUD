import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangainfoComponent } from './mangainfo.component';

describe('MangainfoComponent', () => {
  let component: MangainfoComponent;
  let fixture: ComponentFixture<MangainfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangainfoComponent]
    });
    fixture = TestBed.createComponent(MangainfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
