import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveMainComponent } from './leave-main.component';

describe('LeaverequestMainComponent', () => {
  let component: LeaveMainComponent;
  let fixture: ComponentFixture<LeaveMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveMainComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
