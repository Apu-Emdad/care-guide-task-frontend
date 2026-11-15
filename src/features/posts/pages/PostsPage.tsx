import { Stack } from '@mantine/core';
import { PageTop } from '@/shared/components/layout/PageTop';
import { EmptyState } from '@/shared/components/ui/EmptyState';

/** Placeholder until #5 builds this page. */
export const PostsPage = () => {
  return (
    <Stack gap="lg">
      <PageTop title="Posts" description="Posts from everyone." />
      <EmptyState title="Coming soon" />
    </Stack>
  );
};
