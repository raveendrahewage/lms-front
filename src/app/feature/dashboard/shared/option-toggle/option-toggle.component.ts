import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { EnumSelectField } from '../../models/enum-select-field';
import { StatusValue } from '../../models/status-toggle';

export enum DataRecordStatus {
  Active = 1,
  Inactive = 2,
}

@Component({
  selector: 'app-option-toggle',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  templateUrl: './option-toggle.component.html',
  styleUrls: ['./option-toggle.component.css'],
})
export class OptionToggleComponent {
  @Input() control: FormControl = new FormControl();
  @Input() options: StatusValue[] = [];
}
