import * as marked from 'marked';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EditType } from '../detail.component';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {
  @Input() title: string;
  @Input() content: string | null;
  @Input() encrypted: boolean;
  get locked(): boolean { return this.content === null; }

  @Output() edit = new EventEmitter<EditType>();
  @Output() rm = new EventEmitter<any>();
  @Output() unlock = new EventEmitter<any>();

  emitEdit(focusTitle = false) {
    if (!this.locked) this.edit.emit(focusTitle ? EditType.Title : EditType.Content);
  }

  marked(str: string): string { return str ? marked(str) : ''; }
}
