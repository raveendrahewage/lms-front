import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRecordStatusChipComponent } from './data-record-status-chip.component';

describe('DataRecordStatusChipComponent', () => {
  let component: DataRecordStatusChipComponent;
  let fixture: ComponentFixture<DataRecordStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataRecordStatusChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataRecordStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
