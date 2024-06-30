import { AuthService } from './../../auth/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormGroup,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { EventForm } from '../../models/forms';
import { DataRecordStatus } from '../../constant/data-record-status';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { StatusValue } from '../../models/status-toggle';
import { OptionToggleComponent } from '../../shared/option-toggle/option-toggle.component';
import { Event } from '../../models/event';
import { EventStatus } from '../../constant/event-status';
import { EventService } from '../../services/event.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatRadioModule,
    CommonModule,
    RouterModule,
    MatButtonToggleModule,
    OptionToggleComponent,
    MatDatepickerModule,
  ],
  templateUrl: './event-manage.component.html',
  styleUrls: ['./event-manage.component.css'],
})
export class EventManageComponent {
  dataRecordStatus: typeof DataRecordStatus = DataRecordStatus;
  eventForm: FormGroup<EventForm> = this.fb.group({
    id: [0, [Validators.required]],
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    startDate: [new Date(''), [Validators.required]],
    endDate: [new Date(''), [Validators.required]],
    eventStatus: [EventStatus.ACTIVE, [Validators.required]],
  });
  statuses: StatusValue[] = [
    {
      value: EventStatus.ACTIVE,
      label: 'Active',
      color: '#0cbe8c',
      clickAction: () => this.updateStatus(EventStatus.ACTIVE),
    },
    {
      value: EventStatus.CANCELED,
      label: 'Canceled',
      color: 'darkgray',
      clickAction: () => this.updateStatus(EventStatus.CANCELED),
    },
  ];

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private eventService: EventService,
    private toastr: ToastrService
  ) {}

  updateStatus(eventStatus: EventStatus) {
    this.eventForm.controls.eventStatus.patchValue(eventStatus);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventFormData: Event = this.eventForm.getRawValue() as Event;
      this.eventService.createEvent(eventFormData).subscribe({
        next: (res) => {
          this.toastr.success(res.message);
        },
        error: (error) => {
          console.log(error.error.message);
          this.toastr.error(error.error.message);
        },
      });
    }
  }
}
