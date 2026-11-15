import { Stack } from '@mantine/core';
import { PageTop } from '@/shared/components/layout/PageTop';
import { EmptyState } from '@/shared/components/ui/EmptyState';

/** Placeholder until #4 builds this page. */
export const NotesPage = () => {
  return (
    <Stack gap="lg">
      <PageTop title="My notes" description="Your private notes." />
      <EmptyState title="Coming soon" />
    </Stack>
  );
};
