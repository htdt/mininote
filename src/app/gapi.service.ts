import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { clientId, apiKey } from './gapi.credentials';
import { Note } from './note';

const gapiUrl = 'https://apis.google.com/js/api.js';
const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const scope = 'https://www.googleapis.com/auth/drive.appdata';

declare var gapi;

// https://stackoverflow.com/questions/38213298/using-google-drive-appdatafolder-to-store-app-state-with-javascript-on-the-clien

@Injectable()
export class GapiService {
  signed$ = new BehaviorSubject<boolean>(undefined);
  unsynced$ = new BehaviorSubject<boolean>(false);
  netError$ = new BehaviorSubject<boolean>(false);

  private fileId: string;
  private modifiedTime: string;
  private initialized = false;

  private get gauth() { return gapi.auth2.getAuthInstance(); }

  signIn(): void { this.gauth.signIn(); }
  signOut(): void { this.gauth.signOut(); }

  async init(): Promise<void> {
    if (this.initialized) return console.error('Gapi already initialized');
    this.initialized = true;

    await this.loadScript();
    await this.loadClient();
    await gapi.client.init({ apiKey, clientId, discoveryDocs, scope });

    this.signed$.next(this.gauth.isSignedIn.get());
    this.gauth.isSignedIn.listen(f => this.signed$.next(f));
    return;
  }

  private timeDiffers = (x: {modifiedTime: string}) =>
    this.modifiedTime && x.modifiedTime && this.modifiedTime != x.modifiedTime

  async saveIfSync(data: any): Promise<void> {
    console.log('saveIfSync');
    if (!this.fileId || !this.signed$.getValue()) {
      throw new Error('Drive API: not signed in');
    }

    if (this.netError$.getValue()) this.netError$.next(false);

    let files;
    try {
      files = await this.list();
    } catch {
      this.netError$.next(true);
      throw new Error('Drive API: error listing backups');
    }

    if (!files.length || this.timeDiffers(files[0])) {
      this.unsynced$.next(true);
      return;
    }

    await this.saveForce(data);
  }

  async saveForce(data: any): Promise<void> {
    try {
      await this.save(data);
    } catch {
      this.netError$.next(true);
      throw new Error('Drive API: error updating backup');
    }
    try {
      const files = await this.list();
      this.modifiedTime = files[0].modifiedTime;
    } catch {
      this.netError$.next(true);
      throw new Error('Drive API: error listing backups after update');
    }
    if (this.unsynced$.getValue()) this.unsynced$.next(false);
  }


  async firstSync(): Promise<Note[]> {
    await this.signed$.pipe(first(f => f)).toPromise();
    console.log('firstSync start');

    const files = await this.list();
    if (files.length == 0) {
      console.log('firstSync len 0');
      this.fileId = await this.create();
      return null;
    }

    if (files.length > 1) console.error(`${files.length} backups on gdrive`);
    this.fileId = files[0].id;
    this.modifiedTime = files[0].modifiedTime;
    const file = await this.load();
    console.log('firstSync loaded');
    return file ? JSON.parse(file) : null;
  }

  private rm(fileId: string): Promise<any> {
    return gapi.client.drive.files.delete({fileId});
  }

  private load(): Promise<any> {
    return gapi.client.drive.files.get({fileId: this.fileId, alt: 'media'})
      .then(r => r.body);
  }

  private save(data: any): Promise<any> {
    return gapi.client.request({
      path: '/upload/drive/v3/files/' + this.fileId,
      method: 'PATCH',
      params: { uploadType: 'media'},
      body: JSON.stringify(data)
    });
  }

  private create(): Promise<string> {
    return gapi.client.drive.files.create({
      parents: ['appDataFolder'],
      fields: 'id'
    }).then(r => r.result.id);
  }

  private list(): Promise<{id: string, modifiedTime: string}[]> {
    return gapi.client.drive.files.list({
      spaces: 'appDataFolder',
      fields: 'files(id, modifiedTime)'
    }).then(r => r.result.files);
  }

  private loadClient(): Promise<void> {
    return new Promise(resolve => gapi.load('client:auth2', resolve));
  }

  private loadScript(): Promise<any> {
    return new Promise(resolve => {
      const node = document.createElement('script');
      node.src = gapiUrl;
      node.type = 'text/javascript';
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
      node.onload = resolve;
    });
  }
}
