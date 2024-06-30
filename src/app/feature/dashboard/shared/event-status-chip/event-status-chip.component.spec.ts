import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStatusChipComponent } from './event-status-chip.component';

describe('EventStatusChipComponent', () => {
  let component: EventStatusChipComponent;
  let fixture: ComponentFixture<EventStatusChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventStatusChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
