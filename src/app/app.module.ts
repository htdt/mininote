import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app-material.module';
import { EditorComponent } from './detail/editor/editor.component';
import { ViewerComponent } from './detail/viewer/viewer.component';
import { CreatorComponent } from './detail/creator/creator.component';
import { LatestComponent } from './latest/latest.component';
import { CoreModule } from './core/core.module';
import { MenuRightComponent } from './menu-right/menu-right.component';
import { UploadJSONComponent } from './menu-right/upload-json.component';
import { PasswordDialogComponent } from './password-dialog/password-dialog.component';
import { ListDialogComponent } from './list/list-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailComponent,
    EditorComponent,
    ViewerComponent,
    CreatorComponent,
    LatestComponent,
    MenuRightComponent,
    UploadJSONComponent,
    PasswordDialogComponent,
    ListDialogComponent,
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register(
      '/ngsw-worker.js',
      { enabled: environment.production }
    ),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    CoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
