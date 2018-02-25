import { Component } from '@angular/core';
import { GapiService } from './gapi.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private gapiService: GapiService) {}
}
