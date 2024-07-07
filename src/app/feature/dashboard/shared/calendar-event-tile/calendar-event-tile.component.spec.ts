import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventTileComponent } from './calendar-event-tile.component';

describe('CalendarEventTileComponent', () => {
  let component: CalendarEventTileComponent;
  let fixture: ComponentFixture<CalendarEventTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarEventTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarEventTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
