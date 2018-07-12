import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { Note } from './note';

@Injectable()
export class NoteService {
  private bin: Note;
  list$: BehaviorSubject<Note[]>;

  constructor(private snackBar: MatSnackBar) {
    const init = JSON.parse(localStorage.getItem('mininoteDB')) || [];
    this.list$ = new BehaviorSubject(init);
    this.list$.subscribe(x =>
      localStorage.setItem('mininoteDB', JSON.stringify(x)));
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
      this.bin = curList.splice(idx, 1)[0];
      this.list$.next(curList);
      this.showUndo();
    }
  }

  private showUndo(): void {
    const ref = this.snackBar.open('Deleted', 'Undo', { duration: 7000 });
    ref.onAction().subscribe(() => this.bin && this.save(this.bin));
    ref.afterDismissed().subscribe(() => this.bin = undefined);
  }
}
