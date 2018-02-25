import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { NoteService } from './note.service';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { EditorComponent } from './detail/editor/editor.component';
import { ViewerComponent } from './detail/viewer/viewer.component';
import { CreatorComponent } from './detail/creator/creator.component';
import { LatestComponent } from './latest/latest.component';
import { GapiService } from './gapi.service';
import { GdriveSyncComponent } from './gdrive-sync/gdrive-sync.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailComponent,
    EditorComponent,
    ViewerComponent,
    CreatorComponent,
    LatestComponent,
    GdriveSyncComponent,
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register(
      '/mininote/ngsw-worker.js',
      { enabled: environment.production }
    ),
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
  ],
  providers: [
    NoteService,
    GapiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
