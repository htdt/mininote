import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject, timer } from 'rxjs';
import { skip, filter, throttleTime, delay, skipUntil, tap } from 'rxjs/operators';

import { GapiService } from './gapi.service';
import { NoteService } from './note.service';
import { MatSnackBar, MatDialog } from '@angular/material';
import { MergeDialogComponent } from './merge-dialog.component';

@Injectable()
export class BackupService {
  pending$ = new BehaviorSubject<boolean>(false);
  skipCurListUpdate = false;

  get syncTS()     { return localStorage.getItem('syncTS'); }
  set syncTS(x: string)   { localStorage.setItem('syncTS', x); }
  get unsaved()    { return localStorage.getItem('unsaved') == 'true'; }
  set unsaved(x: boolean) { localStorage.setItem('unsaved', x.toString()); }

  constructor(
    private gapi: GapiService,
    private notes: NoteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  async start() {
    this.notes.list$.pipe(skip(1)).subscribe(_ => {
      if (this.skipCurListUpdate) this.skipCurListUpdate = false;
      else {
        this.unsaved = true;
        this.syncSafe();
      }
    });

    this.gapi.signed$.pipe(filter(f => f)).subscribe(this.syncSafe);

    fromEvent(document, 'visibilitychange')
      .pipe(filter(() => !document.hidden))
      .pipe(skipUntil(timer(60 * 1000)))
      .pipe(throttleTime(5 * 60 * 1000))
      .pipe(delay(1000))
      .subscribe(this.syncSafe);

    this.pending$.next(true);
    try {
      await this.gapi.init();
    } catch {
      this.connectError();
    } finally {
      this.pending$.next(false);
    }
  }

  private connectError(): void {
    this.snackBar.open(
      'Unable to connect to Google Drive',
      'Reload',
      { duration: 10000 }
    ).onAction().subscribe(() => window.location.reload());
  }

  private syncError(): void {
    this.snackBar.open(
      'Unable to sync with Google Drive',
      'Try Again',
      { duration: 10000 }
    ).onAction().subscribe(this.syncSafe);
  }

  private syncSafe = async (): Promise<void> => {
    this.pending$.next(true);
    try {
      await this.syncWithDrive();
    } catch {
      this.syncError();
    } finally {
      this.pending$.next(false);
    }
  }

  private async syncWithDrive(): Promise<void> {
    if (!this.gapi.signed$.getValue()) return;

    const ts = await this.gapi.getTS();
    if (ts != this.syncTS) {
      if (!this.unsaved) this.load(ts);
      else {
        this.dialog.open(MergeDialogComponent).afterClosed().subscribe(
          async result => {
            if (result == 'local') await this.save();
            else if (result == 'drive') await this.load(ts);
            else if (result == undefined) return; // ignore issue :)
            else throw new Error('invalid result after merge dialog');
        });
      }
    } else if (this.unsaved || ts == null) this.save();
  }

  private async load(ts: string): Promise<void> {
    console.log('Google Drive: load');
    const db = await this.gapi.load();
    if (db != null) {
      this.skipCurListUpdate = true;
      this.notes.update(db);
      this.syncTS = ts;
    }
  }

  private async save(): Promise<void> {
    console.log('Google Drive: save');
    const db = this.notes.list$.getValue();
    await this.gapi.save(db);
    this.unsaved = false;
    this.syncTS = await this.gapi.getTS();
  }
}
