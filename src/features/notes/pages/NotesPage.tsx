import {
  ActionIcon,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import { formatDate, truncate } from '@/shared/utils/format';
import { notesApi } from '../api/notesApi';
import { NoteFormModal } from '../components/NoteFormModal';
import { NoteViewModal } from '../components/NoteViewModal';
import { EMPTY_FILTERS, NotesFilters } from '../components/NotesFilters';
import type { Note, NotesFiltersState } from '../types';

type NoteFormTarget = { note?: Note } | null;

export const NotesPage = () => {
  const [filters, setFilters] = useState<NotesFiltersState>(EMPTY_FILTERS);
  const [formTarget, setFormTarget] = useState<NoteFormTarget>(null);
  const [viewNote, setViewNote] = useState<Note | null>(null);

  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['notes', filters],
    queryFn: () => notesApi.getNotes(filters),
    placeholderData: keepPreviousData,
  });

  const deleteNote = useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      refetch();
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const { notes = [], total = 0 } = data ?? {};

  const handleDelete = (note: Note) =>
    modals.openConfirmModal({
      title: `Delete "${note.title}"?`,
      children: (
        <Text size="sm" c="dimmed">
          This removes the note. You can't undo this.
        </Text>
      ),
      labels: { confirm: 'Delete note', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteNote.mutate(note._id),
    });

  return (
    <Stack gap="md">
      <PageTop
        title="My notes"
        description="Your private notes. Only you can see them."
        rightSection={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setFormTarget({})}
          >
            New note
          </Button>
        }
      />

      <NotesFilters
        filters={filters}
        setFilters={setFilters}
        queryKey="notes"
      />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({
            onView: setViewNote,
            onEdit: (note) => setFormTarget({ note }),
            onDelete: handleDelete,
          })}
          rows={notes}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle={filters.search ? 'No notes found' : 'No notes yet'}
          emptyDescription={
            filters.search
              ? 'Try a different search.'
              : 'Create your first note with the "New note" button.'
          }
          pagination={{
            page: filters.page,
            pageSize: filters.pageSize,
            total,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      </Card>

      <NoteViewModal
        note={viewNote}
        onClose={() => setViewNote(null)}
        onEdit={(note) => setFormTarget({ note })}
      />

      {formTarget && (
        <NoteFormModal
          note={formTarget.note}
          onClose={() => setFormTarget(null)}
          onSaved={refetch}
        />
      )}
    </Stack>
  );
};

const CONTENT_PREVIEW_LENGTH = 80;

interface TableHeadersDeps {
  onView: (note: Note) => void;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

const getTableHeaders = ({
  onView,
  onEdit,
  onDelete,
}: TableHeadersDeps): TableHeader<Note>[] => {
  return [
    {
      label: 'Title',
      render: (note) => (
        <Text size="sm" fw={500}>
          {note.title}
        </Text>
      ),
    },
    {
      label: 'Content',
      render: (note) => (
        <Text size="sm" c="dimmed">
          {truncate(note.content, CONTENT_PREVIEW_LENGTH)}
        </Text>
      ),
    },
    {
      label: 'Updated',
      render: (note) => (
        <Text size="sm" c="dimmed">
          {formatDate(note.updatedAt)}
        </Text>
      ),
    },
    {
      label: '',
      render: (note) => (
        <Group gap={4} justify="flex-end" wrap="nowrap">
          <Tooltip label="View">
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`View ${note.title}`}
              onClick={() => onView(note)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Edit">
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`Edit ${note.title}`}
              onClick={() => onEdit(note)}
            >
              <IconEdit size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              variant="subtle"
              color="red"
              aria-label={`Delete ${note.title}`}
              onClick={() => onDelete(note)}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
};
