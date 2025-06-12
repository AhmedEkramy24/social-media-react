export interface Root {
  message: string;
  paginationInfo: PaginationInfo;
  posts: IPost[];
}

export interface PaginationInfo {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage: number;
  total: number;
}

export interface IPost {
  _id: string;
  body?: string | undefined;
  image?: string;
  user: User;
  createdAt: string;
  comments: Comment[];
  id: string;
}

export interface User {
  _id: string;
  name: string;
  photo: string;
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  createdAt: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  photo: string;
}

export interface RootUser {
  message: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  createdAt: string;
  passwordChangedAt: string;
}
