import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NoteService } from '../note.service';
import { Note } from '../note';
import { NoteText } from './editor/editor.component';

export enum EditType {Normal, Title, Content}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  note: Note;
  edit = false;
  focus: EditType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(m =>
      this.note = this.noteService.get(+m.get('id'))
    );
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
    this.noteService.save(this.note);
    this.editOff();
  }

  rm() {
    this.noteService.rm(this.note.id);
    this.router.navigateByUrl('/');
  }
}
