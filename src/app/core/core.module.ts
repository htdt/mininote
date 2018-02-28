import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteService } from './note.service';
import { GapiService } from './gapi.service';
import { BackupService } from './backup.service';
import { MergeDialogComponent } from './merge-dialog.component';
import { MatDialogModule, MatSnackBarModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  declarations: [MergeDialogComponent],
  entryComponents: [MergeDialogComponent],
  providers: [
    NoteService,
    GapiService,
    BackupService
  ]
})
export class CoreModule { }
