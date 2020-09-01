import * as aes4js from 'aes4js';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Cifer } from './note';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private password: string;
  unlocked$ = new BehaviorSubject(false);

  async encrypt(plain: string): Promise<any> {
    return aes4js.encrypt(this.password, plain);
  }

  async decrypt(cipher: Cifer, p?: string): Promise<string> {
    return aes4js.decrypt(p || this.password, cipher);
  }

  setPassword(val?: string): void {
    this.password = val;
    this.unlocked$.next(!!this.password);
  }
}
