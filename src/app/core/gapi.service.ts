import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const gapiUrl = 'https://apis.google.com/js/api.js';
const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const scope = 'https://www.googleapis.com/auth/drive.appdata';

// Restricted to https://mininote.js.org/
const clientId = '75719209262-8um92aacfktqs7o7qp495k9vmf5ou954.apps.googleusercontent.com';
const apiKey = 'AIzaSyB2XKxG_RobgBo9KFgjWM8mlcCZU_Mcek0';
// Create new at https://console.developers.google.com/apis/credentials

declare var gapi;

// https://stackoverflow.com/questions/38213298/using-google-drive-appdatafolder-to-store-app-state-with-javascript-on-the-clien

@Injectable()
export class GapiService {
  signed$ = new BehaviorSubject<boolean>(undefined);

  private fileId: string;
  private initialized = false;
  private get gauth(): any { return gapi.auth2.getAuthInstance(); }

  signIn(): void { this.gauth.signIn(); }
  signOut(): void { this.gauth.signOut(); }

  async init(): Promise<void> {
    if (this.initialized) throw new Error('Gapi already initialized');
    this.initialized = true;

    await this.loadScript();
    await this.loadClient();
    await gapi.client.init({ apiKey, clientId, discoveryDocs, scope });

    this.signed$.next(this.gauth.isSignedIn.get());
    this.gauth.isSignedIn.listen(f => this.signed$.next(f));
  }

  async getTS(): Promise<string> {
    const files = await this.list();
    if (files.length == 0) {
      this.fileId = await this.create();
      return null;
    } else if (files.length > 1) {
      console.error(`${files.length} backups on gdrive`);
    }
    this.fileId = files[0].id;
    return files[0].modifiedTime;
  }

  load(): Promise<any> {
    return gapi.client.drive.files.get({fileId: this.fileId, alt: 'media'})
      .then(r => r.body ? JSON.parse(r.body) : null);
  }

  async save(data: any): Promise<any> {
    if (this.fileId == undefined) await this.getTS();
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
    return new Promise((resolve, reject) => {
      const node = document.createElement('script');
      node.src = gapiUrl;
      node.type = 'text/javascript';
      // node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
      node.onload = resolve;
      node.onerror = reject;
    });
  }

  // unused, just in case
  // private rm(fileId: string): Promise<any> {
  //   return gapi.client.drive.files.delete({fileId});
  // }
}
