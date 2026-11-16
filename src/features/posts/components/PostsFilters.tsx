import { ActionIcon, Button, Group, Text, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconArrowLeft, IconRefresh, IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { PostsFiltersState, UserPostsFiltersState } from '../types';

interface Props {
  filters: PostsFiltersState;
  setFilters: Dispatch<SetStateAction<PostsFiltersState>>;
  authorId: string;
  setAuthorId: Dispatch<SetStateAction<string>>;
  setUserPostsFilters: Dispatch<SetStateAction<UserPostsFiltersState>>;
  authorName?: string;
  authorTotal: number;
}

export const EMPTY_FILTERS: PostsFiltersState = {
  search: '',
  page: 1,
  pageSize: 10,
};

export const EMPTY_USER_POSTS_FILTERS: UserPostsFiltersState = {
  page: 1,
  pageSize: 10,
};

export const PostsFilters = ({
  filters,
  setFilters,
  authorId,
  setAuthorId,
  setUserPostsFilters,
  authorName,
  authorTotal,
}: Props) => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState(filters.search);

  const applySearch = useDebouncedCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, 400);

  const handleSearch = (value: string) => {
    setSearchText(value);
    applySearch(value);
  };

  const handleClearAuthor = () => {
    setAuthorId('');
    setUserPostsFilters(EMPTY_USER_POSTS_FILTERS);
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilters(EMPTY_FILTERS);
    handleClearAuthor();
    queryClient.refetchQueries({
      queryKey: ['posts', EMPTY_FILTERS],
      exact: true,
    });
  };

  return (
    <Group gap="sm" grow={false}>
      {authorId ? (
        <Group style={{ flex: 1, minWidth: 220 }} h={36} gap="sm">
          <Button
            variant="default"
            size="sm"
            leftSection={<IconArrowLeft size={16} />}
            onClick={handleClearAuthor}
          >
            Show all posts
          </Button>
          <Text fw={500}>
            Posts by {authorName ?? '...'}{' '}
            <Text span c="dimmed" fw={400}>
              ({authorTotal})
            </Text>
          </Text>
        </Group>
      ) : (
        <TextInput
          style={{ flex: 1, minWidth: 220 }}
          placeholder="Search by title or content"
          leftSection={<IconSearch size={16} />}
          value={searchText}
          onChange={(event) => handleSearch(event.currentTarget.value)}
        />
      )}
      <ActionIcon
        variant="default"
        size={36}
        aria-label="Refresh"
        onClick={handleRefresh}
      >
        <IconRefresh size={18} />
      </ActionIcon>
    </Group>
  );
};
