import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagesorterComponent } from './imagesorter.component';

describe('ImagesorterComponent', () => {
  let component: ImagesorterComponent;
  let fixture: ComponentFixture<ImagesorterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImagesorterComponent]
    });
    fixture = TestBed.createComponent(ImagesorterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
