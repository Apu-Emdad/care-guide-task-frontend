import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormTextarea, FormTextInput } from '@/shared/components/ui/FormFields';
import { notesApi } from '../api/notesApi';
import { noteSchema, type NoteValues } from '../schemas/note.schema';
import type { Note } from '../types';

interface Props {
  /** The note to edit. Left out, the form creates a new note. */
  note?: Note;
  onClose: () => void;
  onSaved: () => void;
}

/** Create or edit a note. The page renders it only while it is open. */
export const NoteFormModal = ({ note, onClose, onSaved }: Props) => {
  const form = useForm<NoteValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: { title: note?.title ?? '', content: note?.content ?? '' },
  });

  const saveNote = useMutation({
    mutationFn: (values: NoteValues) =>
      note
        ? notesApi.updateNote({ id: note._id, values })
        : notesApi.createNote(values),
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      onSaved();
      onClose();
    },
  });

  // Every save asks first, the same as delete.
  const handleSubmit = (values: NoteValues) =>
    modals.openConfirmModal({
      title: note ? 'Save changes?' : 'Create this note?',
      children: (
        <Text size="sm" c="dimmed">
          {note
            ? `This updates "${note.title}".`
            : `This creates "${values.title}".`}
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => saveNote.mutate(values),
    });

  return (
    <Modal opened onClose={onClose} title={note ? 'Edit note' : 'New note'}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <Stack gap="sm">
            {saveNote.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(saveNote.error)}
              </Alert>
            )}
            <FormTextInput
              name="title"
              label="Title"
              placeholder="Shopping list"
              data-autofocus
            />
            <FormTextarea
              name="content"
              label="Content"
              placeholder="Write your note"
              autosize
              minRows={5}
              maxRows={12}
              classNames={{ input: 'thin-scrollbar' }}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={saveNote.isPending}>
                {note ? 'Save changes' : 'Create note'}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};
