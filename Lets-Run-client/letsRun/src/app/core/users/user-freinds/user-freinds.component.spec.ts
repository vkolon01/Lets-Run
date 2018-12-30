import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFreindsComponent } from './user-freinds.component';

describe('UserFreindsComponent', () => {
  let component: UserFreindsComponent;
  let fixture: ComponentFixture<UserFreindsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFreindsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFreindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
