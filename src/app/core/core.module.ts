import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from '../app-material.module';
import { NoteService } from './note.service';
import { GapiService } from './gapi.service';
import { BackupService } from './backup.service';
import { MergeDialogComponent } from './merge-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [MergeDialogComponent],
  providers: [
    NoteService,
    GapiService,
    BackupService
  ]
})
export class CoreModule {}
