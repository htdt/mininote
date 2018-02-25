import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Note } from '../../note';
import { EditType } from '../detail.component';

export interface NoteText {
  title: string;
  content: string;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  title: string;
  content: string;

  @Input() set note(note: Note) {
    this.title = note.title;
    this.content = note.content;
  }

  @Input() set focus(focus: EditType) {
    if (focus == EditType.Title) this.inputTitle.nativeElement.focus();
    if (focus == EditType.Content) this.inputContent.nativeElement.focus();
  }

  @Output() save = new EventEmitter<NoteText>();
  @Output() cancel = new EventEmitter<any>();

  @ViewChild('inputTitle') inputTitle: ElementRef;
  @ViewChild('inputContent') inputContent: ElementRef;

  emitSave() {
    this.save.emit({title: this.title, content: this.content});
  }

  onTextEdit(e: KeyboardEvent) {
    if (e.key == 'Enter' && e.shiftKey) this.emitSave();
  }
}
