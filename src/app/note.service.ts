import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { skip } from 'rxjs/operators';

import { Note } from './note';
import { GapiService } from './gapi.service';

@Injectable()
export class NoteService {
  list$: BehaviorSubject<Note[]>;

  constructor(private gapi: GapiService) {
    const init = JSON.parse(localStorage.getItem('mininoteDB')) || [];
    this.list$ = new BehaviorSubject(init);
    this.list$.subscribe(x =>
      localStorage.setItem('mininoteDB', JSON.stringify(x)));
    this.startGapi();
  }

  async startGapi(): Promise<void> {
    await this.gapi.init();
    const db = await this.gapi.firstSync();
    if (db != null) this.list$.next(db);
    this.list$.pipe(skip(1)).subscribe(x => this.gapi.saveIfSync(x));
  }

  get(id: number): Note {
    return this.list$.getValue().find(x => x.id == id);
  }

  getLast(): Note {
    const curList = this.list$.getValue();
    if (!curList.length) return null;
    return curList.reduce((acc, el) => el.updated > acc.updated ? el : acc);
  }

  save(note: Note): number {
    const curList = this.list$.getValue();
    note.updated = Date.now();
    const idx = curList.findIndex(x => x.id == note.id);
    if (idx >= 0) curList[idx] = note;
    else {
      if (curList.length == 0) note.id = 0;
      else note.id = Math.max(...curList.map(n => n.id)) + 1;
      curList.push(note);
    }
    this.list$.next(curList);
    return note.id;
  }

  rm(id: number): void {
    const curList = this.list$.getValue();
    const idx = curList.findIndex(x => x.id == id);
    if (idx >= 0) {
      curList.splice(idx, 1);
      this.list$.next(curList);
    }
  }
}
