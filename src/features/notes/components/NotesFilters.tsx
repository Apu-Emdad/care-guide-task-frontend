import { ActionIcon, Group, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconRefresh, IconSearch } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useState, type Dispatch, type SetStateAction } from 'react';
import type { NotesFiltersState } from '../types';

interface Props {
  filters: NotesFiltersState;
  setFilters: Dispatch<SetStateAction<NotesFiltersState>>;
  queryKey: string;
}

export const EMPTY_FILTERS: NotesFiltersState = {
  search: '',
  page: 1,
  pageSize: 10,
};

export const NotesFilters = ({ filters, setFilters, queryKey }: Props) => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState(filters.search);

  const applySearch = useDebouncedCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, 400);

  const handleSearch = (value: string) => {
    setSearchText(value);
    applySearch(value);
  };

  const handleRefresh = () => {
    setSearchText('');
    setFilters(EMPTY_FILTERS);
    queryClient.refetchQueries({
      queryKey: [queryKey, EMPTY_FILTERS],
      exact: true,
    });
  };

  return (
    <Group gap="sm" grow={false}>
      <TextInput
        style={{ flex: 1, minWidth: 220 }}
        placeholder="Search by title or content"
        leftSection={<IconSearch size={16} />}
        value={searchText}
        onChange={(event) => handleSearch(event.currentTarget.value)}
      />
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
