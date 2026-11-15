import { Button, Card, Group, Stack, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconId, IconMail, IconUser } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch } from '@/app/store/hooks';
import { setUser } from '@/features/auth/store/authSlice';
import { getErrorMessage } from '@/shared/api/interceptor';
import type { AuthUser } from '@/shared/api/types';
import { FormTextInput } from '@/shared/components/ui/FormFields';
import { profileApi } from '../api/profileApi';
import {
  profileDetailsSchema,
  type ProfileDetailsValues,
} from '../schemas/profile.schema';

export const ProfileDetailsForm = ({ user }: { user: AuthUser }) => {
  const dispatch = useAppDispatch();

  // `values` keeps the form in sync with the saved user after a save.
  const form = useForm<ProfileDetailsValues>({
    resolver: zodResolver(profileDetailsSchema),
    values: {
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
    },
  });

  const updateProfile = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (result) => {
      dispatch(setUser(result.data));
      notifications.show({ color: 'green', message: result.message });
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  return (
    <Card withBorder padding="lg">
      <Title order={3} fz={16}>
        Profile details
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Your name, and the user name and email you log in with.
      </Text>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))}
          noValidate
        >
          <Stack gap="sm">
            <FormTextInput
              name="userName"
              label="User name"
              leftSection={<IconUser size={16} />}
              autoComplete="username"
            />
            <FormTextInput
              name="fullName"
              label="Full name"
              leftSection={<IconId size={16} />}
              autoComplete="name"
            />
            <FormTextInput
              name="email"
              label="Email"
              leftSection={<IconMail size={16} />}
              autoComplete="email"
            />
            <Group justify="flex-end">
              <Button
                type="submit"
                loading={updateProfile.isPending}
                disabled={!form.formState.isDirty}
              >
                Save changes
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Card>
  );
};
