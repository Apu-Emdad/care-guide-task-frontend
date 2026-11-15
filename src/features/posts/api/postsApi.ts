import { axios } from '@/shared/api/interceptor';
import type { Result } from '@/shared/api/types';
import type { PostValues } from '../schemas/post.schema';
import type {
  Post,
  PostsFiltersState,
  PostsList,
  UserPostsFiltersState,
  UserPostsList,
} from '../types';

export const postsApi = {
  getPosts: async (params: PostsFiltersState) =>
    (await axios.get<Result<PostsList>>('/posts', { params })).data.data,

  /**
   * One author's posts, from the single $lookup aggregation.
   * Each post gets the author back, so the page renders both lists the same way.
   */
  getUserPosts: async (authorId: string, params: UserPostsFiltersState) => {
    const { user, total, posts } = (
      await axios.get<Result<UserPostsList>>(`/posts/user/${authorId}`, {
        params,
      })
    ).data.data;
    return {
      author: user,
      total,
      posts: posts.map((post) => ({ ...post, author: user })),
    };
  },

  createPost: async (values: PostValues) =>
    (await axios.post<Result<Post>>('/posts', values)).data,

  updatePost: async ({ id, values }: { id: string; values: PostValues }) =>
    (await axios.patch<Result<Post>>(`/posts/${id}`, values)).data,

  deletePost: async (id: string) =>
    (await axios.delete<Result>(`/posts/${id}`)).data,
};
