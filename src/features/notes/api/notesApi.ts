import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type { NoteValues } from '../schemas/note.schema';
import type {
  AdminNotesList,
  Note,
  NotesFiltersState,
  NotesList,
} from '../types';

export const notesApi = {
  getNotes: async (params: NotesFiltersState) =>
    (await axios.get<Result<NotesList>>('/notes', { params })).data.data,

  getAllNotes: async (params: NotesFiltersState) =>
    (await axios.get<Result<AdminNotesList>>('/notes/all', { params })).data
      .data,

  createNote: async (values: NoteValues) =>
    (await axios.post<Result<Note>>('/notes', values)).data,

  updateNote: async ({ id, values }: { id: string; values: NoteValues }) =>
    (await axios.patch<Result<Note>>(`/notes/${id}`, values)).data,

  deleteNote: async (id: string) =>
    (await axios.delete<Result>(`/notes/${id}`)).data,
};
