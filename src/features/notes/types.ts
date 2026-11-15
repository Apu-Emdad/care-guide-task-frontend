export interface Note {
  _id: string;
  author: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
