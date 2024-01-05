import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadimagesComponent } from './uploadimages.component';

describe('UploadimagesComponent', () => {
  let component: UploadimagesComponent;
  let fixture: ComponentFixture<UploadimagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadimagesComponent]
    });
    fixture = TestBed.createComponent(UploadimagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
