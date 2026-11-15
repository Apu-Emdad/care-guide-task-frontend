export interface Note {
  _id: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/** The owner of a note, as the admin list sends it. */
export interface NoteAuthor {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
}

/** A note in the admin list: `author` comes filled in with the owner. */
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

/** Everything the list page filters by. */
export interface NotesFiltersState {
  search: string;
  page: number;
  pageSize: number;
}
