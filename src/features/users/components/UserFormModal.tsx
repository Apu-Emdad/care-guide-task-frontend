import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconId, IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { getErrorMessage } from '@/shared/api/interceptor';
import {
  FormMultiSelect,
  FormPasswordInput,
  FormSelect,
  FormTextInput,
} from '@/shared/components/ui/FormFields';
import { INTEREST } from '@/shared/constants/interests';
import { ROLE } from '@/shared/constants/roles';
import { usersApi } from '../api/usersApi';
import {
  createUserSchema,
  editUserFormSchema,
  type CreateUserValues,
} from '../schemas/user.schema';
import type { User } from '../types';

interface Props {
  user?: User;
  isSelf: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const ROLE_OPTIONS = Object.values(ROLE);
const INTEREST_OPTIONS = Object.values(INTEREST);

export const UserFormModal = ({ user, isSelf, onClose, onSaved }: Props) => {
  const form = useForm<CreateUserValues>({
    resolver: zodResolver(user ? editUserFormSchema : createUserSchema),
    defaultValues: {
      userName: user?.userName ?? '',
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      password: '',
      role: user?.role ?? ROLE.USER,
      interests: user?.interests ?? [],
    },
  });

  const saveUser = useMutation({
    mutationFn: ({ password, ...values }: CreateUserValues) =>
      user
        ? usersApi.updateUser({ id: user.id, values })
        : usersApi.createUser({ ...values, password }),
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      onSaved();
      onClose();
    },
  });

  const handleSubmit = (values: CreateUserValues) =>
    modals.openConfirmModal({
      title: user ? 'Save changes?' : 'Add this user?',
      children: (
        <Text size="sm" c="dimmed">
          {user
            ? `This updates ${user.fullName}'s account.`
            : `This creates ${values.fullName} and their login.`}
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => saveUser.mutate(values),
    });

  return (
    <Modal opened onClose={onClose} title={user ? 'Edit user' : 'New user'}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <Stack gap="sm">
            {saveUser.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(saveUser.error)}
              </Alert>
            )}
            <FormTextInput
              name="userName"
              label="User name"
              placeholder="john_doe"
              leftSection={<IconUser size={16} />}
              data-autofocus
            />
            <FormTextInput
              name="fullName"
              label="Full name"
              placeholder="John Doe"
              leftSection={<IconId size={16} />}
            />
            <FormTextInput
              name="email"
              label="Email"
              placeholder="name@company.com"
              leftSection={<IconMail size={16} />}
            />
            {!user && (
              <FormPasswordInput
                name="password"
                label="Password"
                placeholder="At least 8 characters"
                leftSection={<IconLock size={16} />}
                autoComplete="new-password"
              />
            )}
            <FormSelect
              name="role"
              label="Role"
              data={ROLE_OPTIONS}
              allowDeselect={false}
              disabled={isSelf}
              description={
                isSelf ? 'You cannot change your own role.' : undefined
              }
            />
            <FormMultiSelect
              name="interests"
              label="Interests"
              placeholder="Pick interests"
              data={INTEREST_OPTIONS}
              clearable
              searchable
              selectFirstOptionOnChange
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.preventDefault();
              }}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={saveUser.isPending}>
                {user ? 'Save changes' : 'Create user'}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};
