import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeDetailsComponent } from './leave-type-details.component';

describe('LeaveTypeDetailsComponent', () => {
  let component: LeaveTypeDetailsComponent;
  let fixture: ComponentFixture<LeaveTypeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTypeDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveTypeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
