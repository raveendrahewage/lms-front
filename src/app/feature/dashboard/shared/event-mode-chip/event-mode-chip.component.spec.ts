import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventModeChipComponent } from './event-mode-chip.component';

describe('EventModeChipComponent', () => {
  let component: EventModeChipComponent;
  let fixture: ComponentFixture<EventModeChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventModeChipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventModeChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
