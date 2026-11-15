import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconNews } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getErrorMessage, isForbidden } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { ROUTES } from '@/shared/constants/routes';
import { getAvatarGradient, getInitials } from '@/shared/utils/format';
import { interestsApi } from '../api/interestsApi';
import type { InterestsFiltersState } from '../types';

const EMPTY_FILTERS: InterestsFiltersState = { page: 1, pageSize: 10 };

/**
 * Admin only: users grouped by interest, most popular first.
 *
 * The page number pages the users inside every group at once, so the pager goes up to the
 * biggest group's last page.
 */
export const InterestsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<InterestsFiltersState>(EMPTY_FILTERS);

  const {
    data: groups = [],
    refetch,
    isPending,
    error,
  } = useQuery({
    queryKey: ['interests', filters],
    queryFn: () => interestsApi.getUsersByInterest(filters),
    placeholderData: keepPreviousData,
  });

  const biggest = Math.max(0, ...groups.map((group) => group.count));
  const totalPages = Math.ceil(biggest / filters.pageSize);

  const renderContent = () => {
    if (isPending) return <PageLoader />;
    if (error) {
      return (
        <ErrorState
          message={getErrorMessage(error)}
          onRetry={refetch}
          forbidden={isForbidden(error)}
        />
      );
    }
    if (groups.length === 0) {
      return (
        <EmptyState
          title="No interests yet"
          description="Users appear here once they pick interests."
        />
      );
    }

    return (
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {groups.map((group) => (
          <Card key={group.interest} withBorder padding="lg">
            <Group justify="space-between" mb="sm">
              <Title order={3} fz={16}>
                {group.interest}
              </Title>
              <Badge variant="light">
                {group.count} {group.count === 1 ? 'user' : 'users'}
              </Badge>
            </Group>
            {group.users.length === 0 ? (
              <Text size="sm" c="dimmed">
                No more users on this page.
              </Text>
            ) : (
              <Stack gap="xs">
                {group.users.map((user) => (
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
                        navigate(ROUTES.posts, {
                          state: { authorId: user._id },
                        })
                      }
                    >
                      See posts
                    </Button>
                  </Group>
                ))}
              </Stack>
            )}
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <Stack gap="md">
      <PageTop
        title="Interests"
        description="Users grouped by interest, most popular first."
      />

      {renderContent()}

      {totalPages > 1 && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Page {filters.page} of {totalPages}
          </Text>
          <Pagination
            value={filters.page}
            total={totalPages}
            onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </Group>
      )}
    </Stack>
  );
};
