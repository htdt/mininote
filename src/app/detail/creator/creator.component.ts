import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { NoteService } from '../../core/note.service';
import { Note, NoteUpdate } from '../../core/note';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent {
  constructor(
    private router: Router,
    private noteService: NoteService,
  ) {}

  async save(e: NoteUpdate) {
    const id = await this.noteService.save(e);
    if (id !== null) this.router.navigate(['note', id]);
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
