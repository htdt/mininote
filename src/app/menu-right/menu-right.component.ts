import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { GapiService } from '../core/gapi.service';
import { BackupService } from '../core/backup.service';
import { UploadJSONComponent } from './upload-json.component';
import { NoteService } from '../core/note.service';

@Component({
  selector: 'app-menu-right',
  templateUrl: './menu-right.component.html',
  styleUrls: ['./menu-right.component.css']
})
export class MenuRightComponent {
  constructor(
    public gapi: GapiService,
    public backup: BackupService,
    private dialog: MatDialog,
    private notes: NoteService,
    private snackBar: MatSnackBar,
  ) {}

  showError() {
    this.snackBar.open('Error loading file', 'Close', { duration: 3000 });
  }

  uploadJSON() {
    this.dialog.open(UploadJSONComponent).afterClosed().subscribe(async result => {
      if (!result) return this.showError();
      try {
        this.notes.update(JSON.parse(result));
      } catch {
        this.showError();
      }
    });
  }
}
