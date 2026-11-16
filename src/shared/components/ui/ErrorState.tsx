import { Button, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle, IconLock } from '@tabler/icons-react';

interface Props {
  message: string;
  onRetry?: () => void;
  forbidden?: boolean;
}

export const ErrorState = ({ message, onRetry, forbidden = false }: Props) => {
  if (forbidden) {
    return (
      <Stack align="center" gap="xs" py="xl">
        <ThemeIcon variant="light" color="yellow" size={48} radius="xl">
          <IconLock size={24} />
        </ThemeIcon>
        <Text fw={500}>No access</Text>
        <Text c="dimmed" size="sm" ta="center">
          {message}
        </Text>
      </Stack>
    );
  }

  return (
    <Stack align="center" gap="xs" py="xl">
      <ThemeIcon variant="light" color="red" size={48} radius="xl">
        <IconAlertTriangle size={24} />
      </ThemeIcon>
      <Text fw={500}>Something went wrong</Text>
      <Text c="dimmed" size="sm" ta="center">
        {message}
      </Text>
      {onRetry && (
        <Button variant="default" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Stack>
  );
};
