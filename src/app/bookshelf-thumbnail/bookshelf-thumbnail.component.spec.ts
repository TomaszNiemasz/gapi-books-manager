import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelfThumbnailComponent } from './bookshelf-thumbnail.component';

describe('BookshelfThumbnailComponent', () => {
  let component: BookshelfThumbnailComponent;
  let fixture: ComponentFixture<BookshelfThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookshelfThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookshelfThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
