export interface PostAuthor {
  _id: string;
  userName: string;
  fullName: string;
}

export interface Post {
  _id: string;
  author: PostAuthor;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostsList {
  total: number;
  posts: Post[];
}

/** One author's posts: the API sends the author once, next to the posts. */
export interface UserPostsList {
  user: PostAuthor;
  total: number;
  posts: Omit<Post, 'author'>[];
}

/** Filters of all posts. Same fields as the API's PostsQueryDto. */
export interface PostsFiltersState {
  search: string;
  page: number;
  pageSize: number;
}

/** Filters of one author's posts. Same fields as the API's UserPostsQueryDto. */
export interface UserPostsFiltersState {
  page: number;
  pageSize: number;
}
