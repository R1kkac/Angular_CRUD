import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmangaComponent } from './listmanga.component';

describe('ListmangaComponent', () => {
  let component: ListmangaComponent;
  let fixture: ComponentFixture<ListmangaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListmangaComponent]
    });
    fixture = TestBed.createComponent(ListmangaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
