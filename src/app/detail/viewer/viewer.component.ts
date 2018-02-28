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
  title: string;
  content: string;

  @Input() set note(note: Note) {
    this.title = note.title;
    this.content = note.content ? marked(note.content) : '';
  }

  @Output() edit = new EventEmitter<EditType>();
  @Output() rm = new EventEmitter<any>();

  clickTitle() { this.edit.emit(EditType.Title); }
  clickEdit() { this.edit.emit(EditType.Content); }
}
