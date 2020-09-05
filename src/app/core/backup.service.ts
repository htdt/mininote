import { Injectable } from '@angular/core';
import { fromEvent, BehaviorSubject } from 'rxjs';
import { skip, filter, throttleTime, delay, take } from 'rxjs/operators';

import { GapiService } from './gapi.service';
import { NoteService } from './note.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MergeDialogComponent } from './merge-dialog.component';

@Injectable()
export class BackupService {
  pending$ = new BehaviorSubject<boolean>(false);
  unsaved$ = new BehaviorSubject<boolean>(false);
  skipCurListUpdate = false;

  get syncTS(): string { return localStorage.getItem('syncTS'); }
  set syncTS(x: string)   { localStorage.setItem('syncTS', x); }

  constructor(
    private gapi: GapiService,
    private notes: NoteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  reset(): void {
    this.syncTS = '0';
    this.unsaved$.next(false);
  }

  async start(): Promise<void> {
    if (localStorage.getItem('unsaved') == 'true') this.unsaved$.next(true);
    this.unsaved$.subscribe(x => localStorage.setItem('unsaved', x.toString()));

    this.notes.list$.pipe(skip(1)).subscribe(_ => {
      if (this.skipCurListUpdate) this.skipCurListUpdate = false;
      else this.unsaved$.next(true);
    });

    this.gapi.signed$
      .pipe(filter(f => f))
      .subscribe(_ =>
        this.pending$
          .pipe(filter(f => !f))
          .pipe(take(1))
          .subscribe(this.loadSafe));

    fromEvent(document, 'visibilitychange')
      .pipe(throttleTime(5 * 1000))
      .pipe(filter(() => !document.hidden))
      .pipe(throttleTime(5 * 60 * 1000))
      .pipe(delay(1000))
      .subscribe(this.loadSafe);

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

  private loadError(): void {
    this.snackBar.open(
      'Unable to load from Google Drive',
      'Try Again',
      { duration: 10000 }
    ).onAction().subscribe(this.loadSafe);
  }

  private saveError(): void {
    this.snackBar.open(
      'Unable to save to Google Drive',
      'Try Again',
      { duration: 10000 }
    ).onAction().subscribe(this.saveSafe);
  }

  loadSafe = async (): Promise<void> => {
    if (!this.gapi.signed$.getValue()) return;
    if (this.unsaved$.getValue()) return;
    if (this.pending$.getValue()) {
      console.log('tried to load while pending');
      return;
    }

    this.pending$.next(true);
    try {
      const ts = await this.gapi.getTS();
      if (ts == null) await this.save();
      else if (ts != this.syncTS) await this.load(ts);
    } catch {
      this.loadError();
    } finally {
      this.pending$.next(false);
    }
  }

  private async load(ts: string): Promise<void> {
    const db = await this.gapi.load();
    if (db != null) {
      this.skipCurListUpdate = true;
      this.notes.update(db);
      this.syncTS = ts;
    }
  }

  private async resolveMerge(ts: string): Promise<void> {
    this.dialog.open(MergeDialogComponent).afterClosed().subscribe(
      async result => {
        if (result == 'local') await this.save();
        else if (result == 'drive') {
          this.reset();
          await this.load(ts);
        } else throw new Error('invalid result after merge dialog');
    });
  }

  saveSafe = async (): Promise<void> => {
    if (!this.gapi.signed$.getValue()) return;
    if (this.pending$.getValue()) {
      this.snackBar.open('Sync in progress', 'Ok', { duration: 3000 });
      return;
    }
    this.pending$.next(true);
    try {
      const ts = await this.gapi.getTS();
      if (ts != this.syncTS) await this.resolveMerge(ts);
      else await this.save();
    } catch {
      this.saveError();
    } finally {
      this.pending$.next(false);
    }
  }

  private async save(): Promise<void> {
    const db = this.notes.list$.getValue();
    await this.gapi.save(db);
    this.syncTS = await this.gapi.getTS();
    this.unsaved$.next(false);
  }

  downloadFile(): void {
    const db = this.notes.list$.getValue();
    const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db));
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', `mininote-${new Date().toJSON()}.json`);
    a.click();
    a.remove();
  }
}
