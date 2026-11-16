export interface Note {
  _id: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteAuthor {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
}

export interface AdminNote extends Omit<Note, 'author'> {
  author: NoteAuthor;
}

export interface AdminNotesList {
  total: number;
  notes: AdminNote[];
}

export interface NotesList {
  total: number;
  notes: Note[];
}

export interface NotesFiltersState {
  search: string;
  page: number;
  pageSize: number;
}
