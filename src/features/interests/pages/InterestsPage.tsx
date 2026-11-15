import { Stack } from '@mantine/core';
import { PageTop } from '@/shared/components/layout/PageTop';
import { EmptyState } from '@/shared/components/ui/EmptyState';

/** Placeholder until #8 builds this page. */
export const InterestsPage = () => {
  return (
    <Stack gap="lg">
      <PageTop title="Interests" description="Users grouped by interest." />
      <EmptyState title="Coming soon" />
    </Stack>
  );
};
