import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteService } from './note.service';
import { GapiService } from './gapi.service';
import { BackupService } from './backup.service';
import { MergeDialogComponent } from './merge-dialog.component';
import { AppMaterialModule } from '../app-material.module';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
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
