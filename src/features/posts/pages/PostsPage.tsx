import {
  ActionIcon,
  Anchor,
  Avatar,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconEdit,
  IconEye,
  IconFilter,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/shared/api/interceptor';
import { PageTop } from '@/shared/components/layout/PageTop';
import {
  CustomTable,
  type TableHeader,
} from '@/shared/components/ui/CustomTable';
import {
  formatDate,
  getAvatarGradient,
  getInitials,
  truncate,
} from '@/shared/utils/format';
import { postsApi } from '../api/postsApi';
import { PostFormModal } from '../components/PostFormModal';
import {
  EMPTY_FILTERS,
  EMPTY_USER_POSTS_FILTERS,
  PostsFilters,
} from '../components/PostsFilters';
import { PostViewModal } from '../components/PostViewModal';
import type {
  Post,
  PostAuthor,
  PostsFiltersState,
  UserPostsFiltersState,
} from '../types';

/** The post being edited, or `{}` for a new post. `null` while the form is closed. */
type PostFormTarget = { post?: Post } | null;

export const PostsPage = () => {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [filters, setFilters] = useState<PostsFiltersState>(EMPTY_FILTERS);
  const [authorId, setAuthorId] = useState('');
  const [userPostsFilters, setUserPostsFilters] =
    useState<UserPostsFiltersState>(EMPTY_USER_POSTS_FILTERS);
  const [formTarget, setFormTarget] = useState<PostFormTarget>(null);
  const [viewPost, setViewPost] = useState<Post | null>(null);

  // Picking an author switches to that author's posts, from the $lookup aggregation.
  const { data, refetch, isPending, error } = useQuery({
    queryKey: authorId
      ? ['posts', 'user', authorId, userPostsFilters]
      : ['posts', filters],
    queryFn: async () =>
      authorId
        ? postsApi.getUserPosts(authorId, userPostsFilters)
        : { author: undefined, ...(await postsApi.getPosts(filters)) },
    placeholderData: keepPreviousData,
  });

  // The pagination of whichever list is showing.
  const pageFilters = authorId ? userPostsFilters : filters;
  const handlePageChange = (page: number) =>
    authorId
      ? setUserPostsFilters((prev) => ({ ...prev, page }))
      : setFilters((prev) => ({ ...prev, page }));

  const deletePost = useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      refetch();
    },
    onError: (error) =>
      notifications.show({ color: 'red', message: getErrorMessage(error) }),
  });

  const { posts = [], total = 0, author } = data ?? {};
  const isOwn = (post: Post) => post.author._id === currentUserId;

  const handleDelete = (post: Post) =>
    modals.openConfirmModal({
      title: `Delete "${post.title}"?`,
      children: (
        <Text size="sm" c="dimmed">
          This removes the post for everyone. You can't undo this.
        </Text>
      ),
      labels: { confirm: 'Delete post', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deletePost.mutate(post._id),
    });

  return (
    <Stack gap="md">
      <PageTop
        title="Posts"
        description="Posts from everyone. Click an author's name to see only their posts."
        rightSection={
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setFormTarget({})}
          >
            New post
          </Button>
        }
      />

      <PostsFilters
        filters={filters}
        setFilters={setFilters}
        authorId={authorId}
        setAuthorId={setAuthorId}
        setUserPostsFilters={setUserPostsFilters}
        authorName={author?.fullName}
        authorTotal={total}
      />

      <Card withBorder padding={0}>
        <CustomTable
          headers={getTableHeaders({
            isOwn,
            onAuthor: (postAuthor) => {
              setAuthorId(postAuthor._id);
              setUserPostsFilters(EMPTY_USER_POSTS_FILTERS);
            },
            onView: setViewPost,
            onEdit: (post) => setFormTarget({ post }),
            onDelete: handleDelete,
          })}
          rows={posts}
          isPending={isPending}
          error={error}
          onRetry={refetch}
          emptyTitle={
            filters.search || authorId ? 'No posts found' : 'No posts yet'
          }
          emptyDescription={
            filters.search
              ? 'Try a different search.'
              : 'Share the first post with the "New post" button.'
          }
          pagination={{
            page: pageFilters.page,
            pageSize: pageFilters.pageSize,
            total,
            onChange: handlePageChange,
          }}
        />
      </Card>

      <PostViewModal
        post={viewPost}
        canEdit={!!viewPost && isOwn(viewPost)}
        onClose={() => setViewPost(null)}
        onEdit={(post) => setFormTarget({ post })}
      />

      {formTarget && (
        <PostFormModal
          post={formTarget.post}
          onClose={() => setFormTarget(null)}
          onSaved={refetch}
        />
      )}
    </Stack>
  );
};

/** Characters of content shown in the table. View shows the whole post. */
const CONTENT_PREVIEW_LENGTH = 80;

interface TableHeadersDeps {
  isOwn: (post: Post) => boolean;
  onAuthor: (author: PostAuthor) => void;
  onView: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const getTableHeaders = ({
  isOwn,
  onAuthor,
  onView,
  onEdit,
  onDelete,
}: TableHeadersDeps): TableHeader<Post>[] => {
  return [
    {
      label: 'Author',
      render: (post) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar
            size={28}
            color="white"
            style={{ background: getAvatarGradient(post.author.fullName) }}
          >
            {getInitials(post.author.fullName)}
          </Avatar>
          <Tooltip label="Show only this author's posts">
            <Anchor
              component="button"
              type="button"
              size="sm"
              fw={500}
              underline="always"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => onAuthor(post.author)}
            >
              <Group gap={4} wrap="nowrap">
                {post.author.fullName}
                <IconFilter size={14} />
              </Group>
            </Anchor>
          </Tooltip>
        </Group>
      ),
    },
    {
      label: 'Title',
      render: (post) => (
        <Text size="sm" fw={500}>
          {post.title}
        </Text>
      ),
    },
    {
      label: 'Content',
      render: (post) => (
        <Text size="sm" c="dimmed">
          {truncate(post.content, CONTENT_PREVIEW_LENGTH)}
        </Text>
      ),
    },
    {
      label: 'Posted',
      render: (post) => (
        <Text size="sm" c="dimmed">
          {formatDate(post.createdAt)}
        </Text>
      ),
    },
    {
      label: '',
      render: (post) => (
        <Group gap={4} justify="flex-end" wrap="nowrap">
          <Tooltip label="View">
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label={`View ${post.title}`}
              onClick={() => onView(post)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          {isOwn(post) && (
            <>
              <Tooltip label="Edit">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label={`Edit ${post.title}`}
                  onClick={() => onEdit(post)}
                >
                  <IconEdit size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Delete">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  aria-label={`Delete ${post.title}`}
                  onClick={() => onDelete(post)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </>
          )}
        </Group>
      ),
    },
  ];
};
