import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeManageComponent } from './leave-type-manage.component';

describe('LeaveTypeManageComponent', () => {
  let component: LeaveTypeManageComponent;
  let fixture: ComponentFixture<LeaveTypeManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTypeManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveTypeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
