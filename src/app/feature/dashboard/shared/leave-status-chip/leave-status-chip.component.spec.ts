import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveStatusChipComponent } from './leave-status-chip.component';

describe('LeaveStatusComponent', () => {
  let component: LeaveStatusChipComponent;
  let fixture: ComponentFixture<LeaveStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveStatusChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
