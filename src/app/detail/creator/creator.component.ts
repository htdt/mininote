import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { NoteService } from '../../core/note.service';
import { Note, NoteUpdate } from '../../core/note';
import { CryptoService } from '../../core/crypto.service';
import { PasswordDialogComponent } from '../../password-dialog/password-dialog.component';

@Component({
  selector: 'app-creator',
  templateUrl: './creator.component.html',
  styleUrls: ['./creator.component.css']
})
export class CreatorComponent {
  constructor(
    private router: Router,
    private notes: NoteService,
    private crypto: CryptoService,
    private dialog: MatDialog,
  ) {}

  unlock() {
    return this.dialog.open(PasswordDialogComponent).afterClosed().toPromise();
  }

  async save(e: NoteUpdate) {
    if (e.encrypt && !this.crypto.unlocked$.getValue() && !await this.unlock()) return;
    this.router.navigate(['note', await this.notes.save(e)]);
  }

  cancel() {
    this.router.navigateByUrl('/');
  }
}
