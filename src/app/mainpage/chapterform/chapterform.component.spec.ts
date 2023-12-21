import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterformComponent } from './chapterform.component';

describe('ChapterformComponent', () => {
  let component: ChapterformComponent;
  let fixture: ComponentFixture<ChapterformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChapterformComponent]
    });
    fixture = TestBed.createComponent(ChapterformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
