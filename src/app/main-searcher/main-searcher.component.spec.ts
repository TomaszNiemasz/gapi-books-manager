import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSearcherComponent } from './main-searcher.component';

describe('MainSearcherComponent', () => {
  let component: MainSearcherComponent;
  let fixture: ComponentFixture<MainSearcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainSearcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
