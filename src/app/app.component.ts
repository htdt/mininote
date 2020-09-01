import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { NoteService } from './core/note.service';
import { BackupService } from './core/backup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  openNavAtStart: boolean;
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  constructor(
    private notes: NoteService,
    private backup: BackupService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    // don't open empty list on mobile
    this.openNavAtStart = !(this.mobileQuery.matches && this.notes.getLast() == null);
    this.backup.start();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }
}
