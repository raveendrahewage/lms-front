import { Component, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ConfirmationDialogData } from '../../models/confimation-modal-data';

@Component({
  selector: 'app-confimation-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
  ],
  templateUrl: './confimation-modal.component.html',
  styleUrl: './confimation-modal.component.css',
})
export class ConfimationModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfimationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}

  onConfirm(): void {
    this.data.onConfirm();
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
