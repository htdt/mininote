import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Note } from '../core/note';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';


@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
})
export class ListDialogComponent implements OnInit {
  inputControl = new FormControl();
  filteredNotes: Observable<Note[]>;

  constructor(
    public dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public notes: Note[],
  ) {}

  ngOnInit() {
    this.filteredNotes = this.inputControl.valueChanges.pipe(
      startWith<string | Note>(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : null),
      map(value => this.notes.filter(n => n.title.toLowerCase().includes(value))));
  }

  optionSelected(e: MatAutocompleteSelectedEvent) {
    this.dialogRef.close(e.option.value.id);
  }

  displayFn(note?: Note) {
    return note ? note.title : undefined;
  }
}
