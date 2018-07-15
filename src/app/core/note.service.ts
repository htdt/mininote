import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note, NoteUpdate, Cifer } from './note';
import { CryptoService } from './crypto.service';

@Injectable()
export class NoteService {
  private bin: Note;
  list$: BehaviorSubject<Note[]>;

  constructor(
    private snackBar: MatSnackBar,
    private crypto: CryptoService,
  ) {
    const init = JSON.parse(localStorage.getItem('mininoteDB')) || [];
    this.list$ = new BehaviorSubject(init);
    this.list$.subscribe(x =>
      localStorage.setItem('mininoteDB', JSON.stringify(x)));
  }

  get length() {
    return this.list$.pipe(map(x => x.length));
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

  validationCifer(): Cifer | undefined {
    const valNote = this.list$.getValue().find(x => x.content && x.content.encrypted);
    return valNote ? valNote.content : undefined;
  }

  private async createNote(e: NoteUpdate): Promise<Note> {
    let content = e.content;
    if (e.encrypt) {
      if (!await this.crypto.unlock(this.validationCifer())) return null;
      content = await this.crypto.encrypt(e.content);
    }
    return {updated: Date.now(), id: e.id, title: e.title, content};
  }

  private addToList(note: Note, curList: Note[]): Note[] {
    const idx = curList.findIndex(x => x.id == note.id);
    if (idx >= 0) curList[idx] = note;
    else {
      note.id = curList.length == 0 ? 0 : Math.max(...curList.map(n => n.id)) + 1;
      curList.push(note);
    }
    return curList;
  }

  async save(e: NoteUpdate): Promise<number | null> {
    const note = await this.createNote(e);
    if (note == null) return null;
    this.list$.next(this.addToList(note, this.list$.getValue()));
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
