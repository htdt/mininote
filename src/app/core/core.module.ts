import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppMaterialModule } from '../app-material.module';
import { NoteService } from './note.service';
import { GapiService } from './gapi.service';
import { BackupService } from './backup.service';
import { MergeDialogComponent } from './merge-dialog.component';
import { PasswordDialogComponent } from './password-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    AppMaterialModule,
  ],
  declarations: [MergeDialogComponent, PasswordDialogComponent],
  entryComponents: [MergeDialogComponent, PasswordDialogComponent],
  providers: [
    NoteService,
    GapiService,
    BackupService
  ]
})
export class CoreModule { }
