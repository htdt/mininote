import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NoteUpdate } from '../../core/note';
import { EditType } from '../detail.component';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  @Input() title: string;
  @Input() content: string;
  @Input() encrypt: boolean;
  @Input() set focus(focus: EditType) {
    if (focus == EditType.Title) this.inputTitle.nativeElement.focus();
    if (focus == EditType.Content) this.inputContent.nativeElement.focus();
  }
  @Output() save = new EventEmitter<NoteUpdate>();
  @Output() cancel = new EventEmitter<any>();

  @ViewChild('inputTitle') inputTitle: ElementRef;
  @ViewChild('inputContent') inputContent: ElementRef;

  emitSave() {
    this.save.emit({title: this.title, content: this.content, encrypt: this.encrypt});
  }

  keyPress(e: KeyboardEvent) {
    if (e.key == 'Enter' && e.shiftKey) this.emitSave();
  }

  keyUp(e: KeyboardEvent) { // Escape captured only with keyUp
    if (e.key == 'Escape') this.cancel.emit();
  }
}
