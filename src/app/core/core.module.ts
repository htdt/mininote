import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteService } from './note.service';
import { GapiService } from './gapi.service';
import { BackupService } from './backup.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    NoteService,
    GapiService,
    BackupService
  ]
})
export class CoreModule { }
