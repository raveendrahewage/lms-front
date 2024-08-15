import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCalculationBarComponent } from './leave-calculation-bar.component';

describe('LeaveCalculationBarComponent', () => {
  let component: LeaveCalculationBarComponent;
  let fixture: ComponentFixture<LeaveCalculationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveCalculationBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeaveCalculationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
