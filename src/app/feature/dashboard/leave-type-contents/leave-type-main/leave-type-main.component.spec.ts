import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeMainComponent } from './leave-type-main.component';

describe('LeaveTypeMainComponent', () => {
  let component: LeaveTypeMainComponent;
  let fixture: ComponentFixture<LeaveTypeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTypeMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveTypeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
