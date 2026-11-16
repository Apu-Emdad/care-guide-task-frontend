import {
  ActionIcon,
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
  truncate,
} from '@/shared/utils/format';
import { notesApi } from '../api/notesApi';
import { NoteViewModal } from '../components/NoteViewModal';
import { EMPTY_FILTERS, NotesFilters } from '../components/NotesFilters';
import type { AdminNote, NotesFiltersState } from '../types';

export const AllNotesPage = () => {
  const [filters, setFilters] = useState<NotesFiltersState>(EMPTY_FILTERS);
  const [viewNote, setViewNote] = useState<AdminNote | null>(null);

  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['all-notes', filters],
    queryFn: () => notesApi.getAllNotes(filters),
    placeholderData: keepPreviousData,
  });

  const { notes = [], total = 0 } = data ?? {};

  return (
    <Stack gap="md">
      <PageTop
        title="All notes"
        description={`Every user's notes, view only. ${total} in total.`}
      />

      <NotesFilters
        filters={filters}
        setFilters={setFilters}
        queryKey="all-notes"
      />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({ onView: setViewNote })}
          rows={notes}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle={filters.search ? 'No notes found' : 'No notes yet'}
          emptyDescription={
            filters.search
              ? 'Try a different search.'
              : 'Notes appear here once users write them.'
          }
          pagination={{
            page: filters.page,
            pageSize: filters.pageSize,
            total,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      </Card>

      <NoteViewModal note={viewNote} onClose={() => setViewNote(null)} />
    </Stack>
  );
};

const CONTENT_PREVIEW_LENGTH = 80;

interface TableHeadersDeps {
  onView: (note: AdminNote) => void;
}

const getTableHeaders = ({
  onView,
}: TableHeadersDeps): TableHeader<AdminNote>[] => {
  return [
    {
      label: 'Owner',
      render: (note) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            size={32}
            color="white"
            style={{ background: getAvatarGradient(note.author.fullName) }}
          >
            {getInitials(note.author.fullName)}
          </Avatar>
          <div>
            <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
              {note.author.fullName}
            </Text>
            <Text size="xs" c="dimmed">
              {note.author.email}
            </Text>
          </div>
        </Group>
      ),
    },
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
        </Group>
      ),
    },
  ];
};
