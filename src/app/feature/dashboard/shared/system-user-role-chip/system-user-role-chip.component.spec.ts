import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemUserChipComponent } from './system-user-role-chip.component';

describe('SystemUserChipComponent', () => {
  let component: SystemUserChipComponent;
  let fixture: ComponentFixture<SystemUserChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemUserChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemUserChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
