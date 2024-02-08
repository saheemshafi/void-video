import { User } from './user.interface';

export interface Comment {
  _id: string;
  owner: User;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}
