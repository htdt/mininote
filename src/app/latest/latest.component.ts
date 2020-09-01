import { Component, OnInit } from '@angular/core';
import { NoteService } from '../core/note.service';
import { Router } from '@angular/router';

@Component({
  template: ' '
})
export class LatestComponent implements OnInit {

  constructor(
    private noteService: NoteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const note = this.noteService.getLast();
    if (note != null) this.router.navigate(['note', note.id]);
  }
}
