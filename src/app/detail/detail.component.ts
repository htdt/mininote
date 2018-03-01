import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { NoteService } from '../core/note.service';
import { Note } from '../core/note';
import { NoteText } from './editor/editor.component';

export enum EditType {Normal, Title, Content}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  note: Note;
  edit = false;
  focus: EditType;

  private routeSub: Subscription;
  private notesSub: Subscription;
  private id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notes: NoteService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(m => {
      this.id = parseInt(m.get('id'), 10);
      this.updateNote();
    });
    this.notesSub = this.notes.list$.pipe(skip(1))
      .subscribe(() => this.updateNote());
  }

  private updateNote(): void {
    if (isNaN(this.id)) return;
    this.note = this.notes.get(this.id);
    if (this.note == undefined) this.router.navigateByUrl('/');
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.notesSub.unsubscribe();
  }

  editOn(e) {
    this.edit = true;
    this.focus = e;
  }

  editOff() {
    this.edit = false;
  }

  save(e: NoteText) {
    this.note.title = e.title;
    this.note.content = e.content;
    this.notes.save(this.note);
    this.editOff();
  }

  rm() {
    this.notes.rm(this.note.id);
    this.router.navigateByUrl('/');
  }
}
