import { Component, OnInit, HostListener } from '@angular/core';
import { Note } from '../core/note';
import { NoteService } from '../core/note.service';
import { MatDialog } from '@angular/material';
import { ListDialogComponent } from './list-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list: Note[];

  @HostListener('document:keypress', ['$event']) onKeypress(e) {
    if (e.key == 'P' && e.ctrlKey) {
      this.dialog.open(ListDialogComponent, {
        data: this.list,
        position: {top: '5vh'},
      }).afterClosed().subscribe(async noteId =>
        noteId !== undefined && this.router.navigate(['note', noteId]));
    }
  }

  constructor(
    private noteService: NoteService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.noteService.list$.subscribe(x =>
      this.list = x.sort((n1, n2) => n2.updated - n1.updated));
  }
}
