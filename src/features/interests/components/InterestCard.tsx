import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconNews } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getErrorMessage } from '@/shared/api/interceptor';
import { ROUTES } from '@/shared/constants/routes';
import { getAvatarGradient, getInitials } from '@/shared/utils/format';
import { interestsApi } from '../api/interestsApi';
import type { InterestGroup } from '../types';

interface InterestCardProps {
  group: InterestGroup;
  pageSize: number;
}

export const InterestCard = ({ group, pageSize }: InterestCardProps) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data, error } = useQuery({
    queryKey: ['interests', { interest: group.interest, page, pageSize }],
    queryFn: () =>
      interestsApi.getUsersByInterest({
        interest: group.interest,
        page,
        pageSize,
      }),
    enabled: page > 1,
    placeholderData: keepPreviousData,
  });

  const users = page === 1 ? group.users : (data?.[0]?.users ?? group.users);
  const totalPages = Math.ceil(group.count / pageSize);

  return (
    <Card withBorder padding="lg">
      <Group justify="space-between" mb="sm">
        <Title order={3} fz={16}>
          {group.interest}
        </Title>
        <Badge variant="light">
          {group.count} {group.count === 1 ? 'user' : 'users'}
        </Badge>
      </Group>

      {error ? (
        <Text size="sm" c="red">
          {getErrorMessage(error)}
        </Text>
      ) : (
        <Stack gap="xs">
          {users.map((user) => (
            <Group key={user._id} justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  size={30}
                  color="white"
                  style={{ background: getAvatarGradient(user.fullName) }}
                >
                  {getInitials(user.fullName)}
                </Avatar>
                <div>
                  <Text size="sm" fw={500}>
                    {user.fullName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user.email}
                  </Text>
                </div>
              </Group>
              <Button
                variant="subtle"
                size="compact-xs"
                leftSection={<IconNews size={14} />}
                onClick={() =>
                  navigate(ROUTES.posts, { state: { authorId: user._id } })
                }
              >
                See posts
              </Button>
            </Group>
          ))}
        </Stack>
      )}

      {totalPages > 1 && (
        <Group justify="flex-end" mt="auto" pt="md">
          <Pagination
            size="sm"
            value={page}
            total={totalPages}
            onChange={setPage}
          />
        </Group>
      )}
    </Card>
  );
};
``;
