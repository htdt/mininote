import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { NoteService } from '../core/note.service';
import { CryptoService } from '../core/crypto.service';
import { NoteUpdate } from '../core/note';
import { PasswordDialogComponent } from '../password-dialog/password-dialog.component';


export enum EditType {Normal, Title, Content}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  edit = false;
  focus: EditType;

  private routeSub: Subscription;
  private notesSub: Subscription;
  private cryptoSub: Subscription;
  private id: number;
  public title: string;
  public content: string;
  public encrypted: boolean;

  @HostListener('document:keypress', ['$event']) onKeypress(e: KeyboardEvent) {
    if (e.key == 'Enter' && !e.shiftKey && !this.encrypted && !this.edit) {
      this.editOn(EditType.Content);
    }
  }

  constructor(
    private crypto: CryptoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public notes: NoteService,
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(m => {
      this.id = parseInt(m.get('id'), 10);
      this.updateNote();
    });
    this.notesSub = this.notes.list$.pipe(skip(1)).subscribe(this.updateNote);
    this.cryptoSub = this.crypto.unlocked$.subscribe(this.updateNote);
  }

  private updateNote = async () => {
    if (isNaN(this.id)) return;
    const note = this.notes.get(this.id);
    if (note == undefined) return this.router.navigateByUrl('/');

    this.title = note.title;
    if (this.encrypted = note.content && note.content.encrypted) {
      try {
        this.content = await this.crypto.decrypt(note.content);
      } catch {
        this.content = null;
      }
    } else {
      this.content = note.content;
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.notesSub.unsubscribe();
    this.cryptoSub.unsubscribe();
  }

  editOn(e) {
    this.edit = true;
    this.focus = e;
  }

  editOff() {
    this.edit = false;
  }

  unlock() {
    return this.dialog.open(PasswordDialogComponent).afterClosed().toPromise();
  }

  async save(e: NoteUpdate) {
    if (e.encrypt && !this.crypto.unlocked$.getValue() && !await this.unlock()) return;
    await this.notes.save({id: this.id, ...e});
    this.editOff();
  }

  rm() {
    this.notes.rm(this.id);
    this.router.navigateByUrl('/');
  }
}
