import { Component } from '@angular/core';

@Component({
  selector: 'app-merge-dialog',
  template: `
  <h1 mat-dialog-title>Sync conflict</h1>
  <div mat-dialog-content>Local DB doesn't match backup on Google Drive,<br/>
  please choose correct version:</div>
  <div mat-dialog-actions>
    <button mat-button [mat-dialog-close]='"local"'>Local</button>
    <button mat-button [mat-dialog-close]='"drive"'>Google Drive</button>
  </div>
  `,
})
export class MergeDialogComponent {}
