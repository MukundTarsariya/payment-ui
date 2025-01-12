import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <div class="dialog-container">
      <h1 mat-dialog-title>Confirm Delete</h1>
      <div mat-dialog-content>
        <p>Are you sure you want to delete this payment?</p>
      </div>
      <div mat-dialog-actions>
        <button mat-raised-button color="primary" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
    }
    mat-dialog-actions {
      justify-content: center;
    }
    h1 {
      font-size: 1.5em;
      margin-bottom: 10px;
    }
    p {
      font-size: 1.1em;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}