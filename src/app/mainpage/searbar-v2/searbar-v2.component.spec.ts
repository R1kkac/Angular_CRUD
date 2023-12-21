import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearbarV2Component } from './searbar-v2.component';

describe('SearbarV2Component', () => {
  let component: SearbarV2Component;
  let fixture: ComponentFixture<SearbarV2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearbarV2Component]
    });
    fixture = TestBed.createComponent(SearbarV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
