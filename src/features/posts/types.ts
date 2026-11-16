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

export interface UserPostsList {
  user: PostAuthor;
  total: number;
  posts: Omit<Post, 'author'>[];
}

export interface PostsFiltersState {
  search: string;
  page: number;
  pageSize: number;
}

export interface UserPostsFiltersState {
  page: number;
  pageSize: number;
}
