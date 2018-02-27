import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

import { GapiService } from '../core/gapi.service';
import { NoteService } from '../core/note.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-gdrive-sync',
  templateUrl: './gdrive-sync.component.html',
  styleUrls: ['./gdrive-sync.component.css']
})
export class GdriveSyncComponent implements OnInit {
  constructor(
    public gapi: GapiService,
    public notes: NoteService,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.gapi.unsynced$.pipe(filter(f => f)).subscribe(this.unsyncMsg);
    this.gapi.netError$.pipe(filter(f => f)).subscribe(this.errorMsg);
  }

  private unsyncMsg = () =>
    this.snackBar.open(
      'Local DB doesn\'t match backup on Google Drive',
      'Save Anyway')
    .onAction().subscribe(() => this.save(true))

  private errorMsg = () =>
    this.snackBar.open('Error saving to Google Drive', 'Try Again')
    .onAction().subscribe(() => this.save(false))

  private save(force: boolean) {
    const list = this.notes.list$.getValue();
    if (force) this.gapi.saveForce(list);
    else this.gapi.saveIfSync(list);
  }
}
