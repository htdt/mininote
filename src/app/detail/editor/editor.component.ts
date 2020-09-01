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

  @ViewChild('inputTitle', {static: true}) inputTitle: ElementRef;
  @ViewChild('inputContent', {static: true}) inputContent: ElementRef;

  emitSave(): void {
    this.save.emit({title: this.title, content: this.content, encrypt: this.encrypt});
  }

  keyPress(e: KeyboardEvent): void {
    if (e.key == 'Enter' && e.shiftKey) {
      e.preventDefault();
      setTimeout(() => this.emitSave(), 1); // skip frame to prevent trigger edit
    }
  }

  keyUp(e: KeyboardEvent): void { // Escape captured only with keyUp
    if (e.key == 'Escape') this.cancel.emit();
  }
}
