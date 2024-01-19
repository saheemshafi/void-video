import { IFile } from './file';
import { User } from './user';

export interface Video {
  _id: string;
  title: string;
  description: string;
  owner: User;
  source: IFile;
  thumbnail: IFile;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
