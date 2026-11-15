import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';
import { IconCalendar, IconMail } from '@tabler/icons-react';
import type { AuthUser } from '@/shared/api/types';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';

export const ProfileSummaryCard = ({ user }: { user: AuthUser }) => {
  return (
    <Card withBorder padding="lg">
      <Stack align="center" gap="xs" ta="center">
        <Avatar
          size={72}
          color="white"
          style={{ background: getAvatarGradient(user.userName) }}
        >
          {getInitials(user.userName)}
        </Avatar>
        <Text fz={18} fw={500}>
          {user.userName}
        </Text>
        <Group gap={6} justify="center">
          <Badge variant="light">{user.role}</Badge>
        </Group>
      </Stack>

      <Stack gap={8} mt="lg">
        <Group gap={8} wrap="nowrap">
          <IconMail size={16} color="var(--mantine-color-dimmed)" />
          <Text size="sm" truncate>
            {user.email}
          </Text>
        </Group>
        {user.createdAt && (
          <Group gap={8} wrap="nowrap">
            <IconCalendar size={16} color="var(--mantine-color-dimmed)" />
            <Text size="sm">Joined {formatDate(user.createdAt)}</Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
};
