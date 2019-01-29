import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCategoryComponent } from './general-category.component';

describe('GeneralCategoryComponent', () => {
  let component: GeneralCategoryComponent;
  let fixture: ComponentFixture<GeneralCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
