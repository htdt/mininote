import { MatDialogRef } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload-json',
  template: `
  <h1 mat-dialog-title>Restore from backup</h1>
  <input type='file' #input (change)='upload(input.files[0])' />
  `,
})
export class UploadJSONComponent {
  constructor(private dialogRef: MatDialogRef<UploadJSONComponent>) {}
  upload(file: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.dialogRef.close(reader.result);
    reader.readAsText(file);
  }
}
