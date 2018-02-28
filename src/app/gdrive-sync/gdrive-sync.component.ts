import { Component, OnInit } from '@angular/core';
import { GapiService } from '../core/gapi.service';
import { BackupService } from '../core/backup.service';

@Component({
  selector: 'app-gdrive-sync',
  templateUrl: './gdrive-sync.component.html',
  styleUrls: ['./gdrive-sync.component.css']
})
export class GdriveSyncComponent {
  constructor(
    public gapi: GapiService,
    public backup: BackupService,
  ) {}
}
