import { SimpleGrid, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getErrorMessage, isForbidden } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { ErrorState } from '@/shared/components/ui/ErrorState';
import { PageLoader } from '@/shared/components/ui/PageLoader';
import { interestsApi } from '../api/interestsApi';
import { InterestCard } from '../components/InterestCard';

const PAGE_SIZE = 10;

export const InterestsPage = () => {
  const {
    data: groups = [],
    refetch,
    isPending,
    error,
  } = useQuery({
    queryKey: ['interests', { page: 1, pageSize: PAGE_SIZE }],
    queryFn: () =>
      interestsApi.getUsersByInterest({ page: 1, pageSize: PAGE_SIZE }),
  });

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
          <InterestCard
            key={group.interest}
            group={group}
            pageSize={PAGE_SIZE}
          />
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
    </Stack>
  );
};
