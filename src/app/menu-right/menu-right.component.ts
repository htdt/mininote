import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GapiService } from '../core/gapi.service';
import { BackupService } from '../core/backup.service';
import { UploadJSONComponent } from './upload-json.component';
import { NoteService } from '../core/note.service';
import { CryptoService } from '../core/crypto.service';

@Component({
  selector: 'app-menu-right',
  templateUrl: './menu-right.component.html',
  styleUrls: ['./menu-right.component.css']
})
export class MenuRightComponent {
  constructor(
    public gapi: GapiService,
    public backup: BackupService,
    public notes: NoteService,
    public crypto: CryptoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  uploadJSON(): void {
    this.dialog.open(UploadJSONComponent).afterClosed().subscribe(async result => {
      if (!result) return;
      try {
        this.notes.update(JSON.parse(result));
      } catch {
        this.snackBar.open('Error loading file', 'Close', { duration: 3000 });
      }
    });
  }

  logout(): void {
    this.gapi.signOut();
    this.notes.update([]);
    this.backup.reset();
  }
}
