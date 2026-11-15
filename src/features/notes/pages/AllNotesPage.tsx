import { Stack } from '@mantine/core';
import { PageTop } from '@/shared/components/layout/PageTop';
import { EmptyState } from '@/shared/components/ui/EmptyState';

/** Placeholder until #6 builds this page. */
export const AllNotesPage = () => {
  return (
    <Stack gap="lg">
      <PageTop title="All notes" description="Every user's notes, view only." />
      <EmptyState title="Coming soon" />
    </Stack>
  );
};
