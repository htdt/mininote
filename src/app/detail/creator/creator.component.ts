import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NoteService }  from '../../note.service';
import { Note } from '../../note';
import { NoteText } from '../editor/editor.component';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent implements OnInit {
  note = new Note();

  constructor(
    private router: Router,
    private noteService: NoteService
  ) {}


  ngOnInit() {
  }

  save(e: NoteText) {
    this.note.title = e.title;
    this.note.content = e.content;
    let id = this.noteService.save(this.note);
    this.router.navigate(['note', id]);
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
