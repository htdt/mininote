import { Component, OnInit } from '@angular/core';
import { Note } from '../note';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list: Note[];

  constructor(private noteService: NoteService) {}

  ngOnInit() {
    this.noteService.list$.subscribe(x =>
      this.list = x.sort((n1, n2) => n2.updated - n1.updated));
  }
}
