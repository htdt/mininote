import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-json',
  templateUrl: './password-dialog.component.html',
})
export class PasswordDialogComponent {
  show = false;
  constructor(public dialogRef: MatDialogRef<PasswordDialogComponent>) {}
}
