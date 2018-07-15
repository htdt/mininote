export interface Cifer {
  encrypted: string;
  iv: number[];
  bin: boolean;
}

export interface Note {
  id?: number;
  title: string;
  updated?: number;
  content: Cifer | any;
}

export interface NoteUpdate extends Note {
  encrypt?: boolean;
}
