import {
  Button,
  Divider,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCalendar, IconEdit, IconRefresh } from '@tabler/icons-react';
import { formatDate } from '@/shared/utils/format';
import type { Note } from '../types';

interface Props {
  note: Note | null;
  onClose: () => void;
  onEdit: (note: Note) => void;
}

/** Shows the whole note. The table shows only the start of the content. */
export const NoteViewModal = ({ note, onClose, onEdit }: Props) => {
  return (
    <Modal
      opened={!!note}
      onClose={onClose}
      size="lg"
      centered
      padding="lg"
      withCloseButton={false}
    >
      {note && (
        <Stack gap="md">
          <div>
            <Title order={3} fz={20}>
              {note.title}
            </Title>
            <Group gap="md" mt={6}>
              <Group gap={6}>
                <IconCalendar size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed">
                  Created {formatDate(note.createdAt)}
                </Text>
              </Group>
              <Group gap={6}>
                <IconRefresh size={14} color="var(--mantine-color-dimmed)" />
                <Text size="xs" c="dimmed">
                  Updated {formatDate(note.updatedAt)}
                </Text>
              </Group>
            </Group>
          </div>

          <Divider />

          <Paper withBorder radius="md" p="md" bg="var(--mantine-color-body)">
            <ScrollArea.Autosize
              mah="55vh"
              type="hover"
              scrollbarSize={6}
              offsetScrollbars
            >
              <Text
                size="sm"
                lh={1.7}
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {note.content}
              </Text>
            </ScrollArea.Autosize>
          </Paper>

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
            <Button
              data-autofocus
              leftSection={<IconEdit size={16} />}
              onClick={() => {
                onClose();
                onEdit(note);
              }}
            >
              Edit
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
