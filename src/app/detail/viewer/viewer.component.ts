import * as marked from 'marked';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../core/note';
import { EditType } from '../detail.component';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() locked: boolean;
  @Input() encrypted: boolean;

  @Output() edit = new EventEmitter<EditType>();
  @Output() rm = new EventEmitter<any>();
  @Output() unlock = new EventEmitter<any>();

  clickTitle() { this.edit.emit(EditType.Title); }
  clickEdit() { this.edit.emit(EditType.Content); }

  marked(str: string): string { return str ? marked(str) : ''; }
}
