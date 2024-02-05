import { IFile } from '~/app/shared/interfaces/file.interface';
import { User } from '~/app/shared/interfaces/user.interface';

export interface Video {
  _id: string;
  title: string;
  description: string;
  likes: number;
  owner: User;
  source: IFile;
  thumbnail: IFile;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}