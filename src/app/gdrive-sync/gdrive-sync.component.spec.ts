import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdriveSyncComponent } from './gdrive-sync.component';

describe('GdriveSyncComponent', () => {
  let component: GdriveSyncComponent;
  let fixture: ComponentFixture<GdriveSyncComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdriveSyncComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdriveSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
