import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconEdit, IconNews, IconPlus, IconTrash } from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, type NavigateFunction } from 'react-router';
import { useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import { ROLE } from '@/shared/constants/roles';
import { ROUTES } from '@/shared/constants/routes';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
} from '@/shared/utils/format';
import { usersApi } from '../api/usersApi';
import { UserFormModal } from '../components/UserFormModal';
import { EMPTY_FILTERS, UsersFilters } from '../components/UsersFilters';
import type { User, UsersFiltersState } from '../types';

/** The user being edited, or `{}` for a new user. `null` while the form is closed. */
type UserFormTarget = { user?: User } | null;

/** Admin only: add, list, edit and delete users. */
export const UsersPage = () => {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<UsersFiltersState>(EMPTY_FILTERS);
  const [formTarget, setFormTarget] = useState<UserFormTarget>(null);

  const { data, refetch, isPending, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getUsers(filters),
    placeholderData: keepPreviousData,
  });

  const deleteUser = useMutation({
    mutationFn: usersApi.deleteUser,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      refetch();
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const { users = [], total = 0 } = data ?? {};

  const handleDelete = (user: User) =>
    modals.openConfirmModal({
      title: `Delete ${user.fullName}?`,
      children: (
        <Text size="sm" c="dimmed">
          This removes the user with their notes and posts, and ends their
          sessions. You can't undo this.
        </Text>
      ),
      labels: { confirm: 'Delete user', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser.mutate(user.id),
    });

  return (
    <Stack gap="md">
      <PageTop
        title="Users"
        description={`${total} ${total === 1 ? 'user' : 'users'}`}
        rightSection={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setFormTarget({})}
          >
            New user
          </Button>
        }
      />

      <UsersFilters filters={filters} setFilters={setFilters} />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({
            currentUserId,
            navigate,
            onEdit: (user) => setFormTarget({ user }),
            onDelete: handleDelete,
          })}
          rows={users}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle="No users found"
          emptyDescription="Try a different search or clear the filters."
          pagination={{
            page: filters.page,
            pageSize: filters.pageSize,
            total,
            onChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
        />
      </Card>

      {formTarget && (
        <UserFormModal
          user={formTarget.user}
          isSelf={formTarget.user?.id === currentUserId}
          onClose={() => setFormTarget(null)}
          onSaved={refetch}
        />
      )}
    </Stack>
  );
};

interface TableHeadersDeps {
  currentUserId: string | undefined;
  navigate: NavigateFunction;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const getTableHeaders = ({
  currentUserId,
  navigate,
  onEdit,
  onDelete,
}: TableHeadersDeps): TableHeader<User>[] => {
  return [
    {
      label: 'User',
      render: (user) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            size={32}
            color="white"
            style={{ background: getAvatarGradient(user.fullName) }}
          >
            {getInitials(user.fullName)}
          </Avatar>
          <div>
            <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
              {user.fullName}
            </Text>
            <Text size="xs" c="dimmed">
              @{user.userName} · {user.email}
            </Text>
            <Button
              variant="light"
              size="compact-xs"
              mt={6}
              leftSection={<IconNews size={14} />}
              onClick={() =>
                navigate(ROUTES.posts, { state: { authorId: user.id } })
              }
            >
              See posts of {user.fullName}
            </Button>
          </div>
        </Group>
      ),
    },
    {
      label: 'Role',
      render: (user) => (
        <Badge
          variant={user.role === ROLE.ADMIN ? 'light' : 'outline'}
          color={user.role === ROLE.ADMIN ? 'brand' : 'gray'}
          // The interests column is wide, so keep the role from being cut to "U…".
          styles={{
            root: { overflow: 'visible' },
            label: { overflow: 'visible' },
          }}
        >
          {user.role}
        </Badge>
      ),
    },
    {
      label: 'Interests',
      render: (user) =>
        user.interests.length ? (
          <Group gap={4}>
            {user.interests.map((interest) => (
              <Badge key={interest} size="sm" variant="light" color="gray">
                {interest}
              </Badge>
            ))}
          </Group>
        ) : (
          <Text size="sm" c="dimmed">
            None
          </Text>
        ),
    },
    {
      label: 'Created',
      render: (user) => (
        <Text size="sm" c="dimmed">
          {formatDate(user.createdAt)}
        </Text>
      ),
    },
    {
      label: '',
      // An admin can't delete themselves, so their own row has no actions.
      render: (user) =>
        user.id === currentUserId ? null : (
          <Group gap={4} justify="flex-end" wrap="nowrap">
            <Tooltip label="Edit">
              <ActionIcon
                variant="subtle"
                color="gray"
                aria-label={`Edit ${user.fullName}`}
                onClick={() => onEdit(user)}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                variant="subtle"
                color="red"
                aria-label={`Delete ${user.fullName}`}
                onClick={() => onDelete(user)}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
    },
  ];
};
