import { Alert, Button, Group, Modal, Stack, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { getErrorMessage } from '@/shared/api/interceptor';
import { FormTextarea, FormTextInput } from '@/shared/components/ui/FormFields';
import { postsApi } from '../api/postsApi';
import { postSchema, type PostValues } from '../schemas/post.schema';
import type { Post } from '../types';

interface Props {
  /** The post to edit. Left out, the form creates a new post. */
  post?: Post;
  onClose: () => void;
  onSaved: () => void;
}

/** Create or edit a post. The page renders it only while it is open. */
export const PostFormModal = ({ post, onClose, onSaved }: Props) => {
  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: post?.title ?? '', content: post?.content ?? '' },
  });

  const savePost = useMutation({
    mutationFn: (values: PostValues) =>
      post
        ? postsApi.updatePost({ id: post._id, values })
        : postsApi.createPost(values),
    onSuccess: (result) => {
      notifications.show({ color: 'green', message: result.message });
      onSaved();
      onClose();
    },
  });

  // Every save asks first, the same as delete.
  const handleSubmit = (values: PostValues) =>
    modals.openConfirmModal({
      title: post ? 'Save changes?' : 'Create this post?',
      children: (
        <Text size="sm" c="dimmed">
          {post
            ? `This updates "${post.title}".`
            : `This creates "${values.title}".`}
        </Text>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => savePost.mutate(values),
    });

  return (
    <Modal opened onClose={onClose} title={post ? 'Edit post' : 'New post'}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <Stack gap="sm">
            {savePost.isError && (
              <Alert color="red" variant="light">
                {getErrorMessage(savePost.error)}
              </Alert>
            )}
            <FormTextInput
              name="title"
              label="Title"
              placeholder="Weekend trip"
              data-autofocus
            />
            <FormTextarea
              name="content"
              label="Content"
              placeholder="Write your post"
              autosize
              minRows={5}
              maxRows={12}
              classNames={{ input: 'thin-scrollbar' }}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={savePost.isPending}>
                {post ? 'Save changes' : 'Create post'}
              </Button>
            </Group>
          </Stack>
        </form>
      </FormProvider>
    </Modal>
  );
};
