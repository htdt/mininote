import * as aes4js from 'aes4js';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { PasswordDialogComponent } from './password-dialog.component';
import { Cifer } from './note';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private pwd: string;
  unlocked$ = new BehaviorSubject(false);

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  async encrypt(plain: string): Promise<any> {
    return aes4js.encrypt(this.pwd, plain);
  }

  async decrypt(cipher: Cifer): Promise<string> {
    return aes4js.decrypt(this.pwd, cipher);
  }

  lock() {
    this.pwd = undefined;
    this.unlocked$.next(false);
  }

  async unlock(val?: Cifer): Promise<boolean> {
    if (this.unlocked$.getValue()) return true;
    this.pwd = await this.dialog.open(PasswordDialogComponent).afterClosed().toPromise();
    if (!this.pwd) return false;
    if (val) {
      try {
        await this.decrypt(val);
      } catch {
        this.pwd = undefined;
        this.snackBar.open(`Password doesn't match encrypted note`, 'Ok', { duration: 5000 });
        return false;
      }
    }
    this.unlocked$.next(true);
    return true;
  }
}
