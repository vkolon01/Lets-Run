import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListWithDescComponent } from './post-list-with-desc.component';

describe('PostListWithDescComponent', () => {
  let component: PostListWithDescComponent;
  let fixture: ComponentFixture<PostListWithDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostListWithDescComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListWithDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
