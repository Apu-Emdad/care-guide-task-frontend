import {
  Avatar,
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
import { IconEdit } from '@tabler/icons-react';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';
import type { Post } from '../types';

interface Props {
  post: Post | null;
  /** Only the author can edit, so the page passes this only for their own posts. */
  canEdit: boolean;
  onClose: () => void;
  onEdit: (post: Post) => void;
}

/** Shows the whole post. The table shows only the start of the content. */
export const PostViewModal = ({ post, canEdit, onClose, onEdit }: Props) => {
  return (
    <Modal
      opened={!!post}
      onClose={onClose}
      size="lg"
      centered
      padding="lg"
      withCloseButton={false}
    >
      {post && (
        <Stack gap="md">
          <div>
            <Title order={3} fz={20}>
              {post.title}
            </Title>
            <Group gap="xs" mt={8}>
              <Avatar
                size={24}
                color="white"
                style={{ background: getAvatarGradient(post.author.fullName) }}
              >
                {getInitials(post.author.fullName)}
              </Avatar>
              <Text size="sm">{post.author.fullName}</Text>
              <Text size="xs" c="dimmed">
                · {formatDate(post.createdAt)}
              </Text>
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
                {post.content}
              </Text>
            </ScrollArea.Autosize>
          </Paper>

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose} data-autofocus>
              Close
            </Button>
            {canEdit && (
              <Button
                leftSection={<IconEdit size={16} />}
                onClick={() => {
                  onClose();
                  onEdit(post);
                }}
              >
                Edit
              </Button>
            )}
          </Group>
        </Stack>
      )}
    </Modal>
  );
};
