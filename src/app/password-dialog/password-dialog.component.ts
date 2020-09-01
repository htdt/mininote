import { MatDialogRef } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { CryptoService } from '../core/crypto.service';
import { NoteService } from '../core/note.service';

@Component({
  selector: 'app-upload-json',
  templateUrl: './password-dialog.component.html',
})
export class PasswordDialogComponent {
  show = false;
  invalid = false;
  constructor(
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
    private crypto: CryptoService,
    private notes: NoteService,
  ) {}

  async submit(pass: string): Promise<void> {
    if (!pass) return;
    this.invalid = false;
    const val = this.notes.validationCifer();
    if (val) {
      try {
        await this.crypto.decrypt(val, pass);
      } catch {
        this.invalid = true;
        return;
      }
    }
    this.crypto.setPassword(pass);
    this.dialogRef.close(true);
  }
}
