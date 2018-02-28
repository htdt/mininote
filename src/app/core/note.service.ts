import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Note } from './note';

@Injectable()
export class NoteService {
  list$: BehaviorSubject<Note[]>;

  constructor() {
    const init = JSON.parse(localStorage.getItem('mininoteDB')) || [];
    this.list$ = new BehaviorSubject(init);
    this.list$.subscribe(x =>
      localStorage.setItem('mininoteDB', JSON.stringify(x)));
  }

  undo(): void {
    // TODO
  }

  update(db: Note[]): void {
    this.list$.next(db);
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
