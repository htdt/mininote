import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NoteService } from '../../core/note.service';
import { NoteUpdate } from '../../core/note';
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

  unlock(): Promise<any> {
    return this.dialog.open(PasswordDialogComponent).afterClosed().toPromise();
  }

  async save(e: NoteUpdate): Promise<void> {
    if (e.encrypt && !this.crypto.unlocked$.getValue() && !await this.unlock()) return;
    this.router.navigate(['note', await this.notes.save(e)]);
  }

  cancel(): void {
    this.router.navigateByUrl('/');
  }
}
