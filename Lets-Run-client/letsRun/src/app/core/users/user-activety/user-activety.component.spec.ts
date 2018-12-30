import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivetyComponent } from './user-activety.component';

describe('UserActivetyComponent', () => {
  let component: UserActivetyComponent;
  let fixture: ComponentFixture<UserActivetyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserActivetyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActivetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
